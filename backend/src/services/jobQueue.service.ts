import { db } from '../config/firebase';
import { analyzeRepository } from './github.service';
import { parseDocumentFromUrl, extractClaimsFromDocument } from './document.service';
import { verifyClaim } from './validation.service';
import { generateValidationReport } from './report.service';
import { generateRoadmap } from './roadmap.service';
import { Evidence } from '../types';

export const updateJobState = async (
  jobId: string,
  update: { stage?: string; progress?: number; status?: 'queued' | 'running' | 'completed' | 'failed'; error?: string }
) => {
  try {
    await db.collection('jobs').doc(jobId).update({
      ...update,
      updatedAt: new Date(),
    });
  } catch (err) {
    console.warn(`Failed to update job ${jobId}:`, err);
  }
};

/**
 * Runs the complete 6-stage Build & Validation Agent pipeline asynchronously.
 */
export const executeAnalysisPipeline = async (projectId: string, payload: {
  githubUrl: string;
  demoUrl?: string;
  documentUrls?: string[];
  ideaFields?: any;
}) => {
  const { githubUrl, documentUrls = [], ideaFields = {} } = payload;
  const jobId = projectId;

  try {
    console.log(`\n🚀 [Pipeline Start] Starting analysis for project: ${projectId}`);
    await updateJobState(jobId, { stage: 'repository_analysis', progress: 15, status: 'running' });

    // Stage 1: Repository Intelligence (Deterministic static analysis)
    console.log(`🔍 [Stage 1] Inspecting GitHub repository: ${githubUrl}`);
    const repoAnalysis = await analyzeRepository(githubUrl);
    console.log(`✅ [Stage 1] Found ${repoAnalysis.files.length} relevant files, ${repoAnalysis.routes.length} routes, ${repoAnalysis.tests.length} test files.`);

    // Stage 2: Document Intelligence (Extract verifiable assertions)
    await updateJobState(jobId, { stage: 'document_analysis', progress: 40 });
    console.log(`📄 [Stage 2] Processing ${documentUrls.length} attached documents...`);
    let allExtractedClaims: any[] = [];

    if (documentUrls.length > 0) {
      for (const docUrl of documentUrls) {
        const text = await parseDocumentFromUrl(docUrl);
        const claims = await extractClaimsFromDocument(text, docUrl);
        allExtractedClaims.push(...claims);
      }
    }

    // If no external documents provided, derive claims directly from repo README & metadata
    if (allExtractedClaims.length === 0) {
      const readmeContent = repoAnalysis.fileContents['README.md'] || '';
      if (readmeContent) {
        console.log(`ℹ️ [Stage 2] Extracting claims from repository README.md...`);
        const readmeClaims = await extractClaimsFromDocument(readmeContent, 'README.md');
        allExtractedClaims.push(...readmeClaims);
      }
    }

    // Always ensure at least baseline feature claims are assessed
    if (allExtractedClaims.length === 0) {
      allExtractedClaims = [
        { claim: 'Core API routing and service endpoints are implemented', category: 'feature', expectedEvidence: 'routes or controller files' },
        { claim: 'Automated test suite configured for quality assurance', category: 'technology', expectedEvidence: 'test files or vitest/jest config' },
        { claim: 'Dependencies and packaging managed via package configuration', category: 'technology', expectedEvidence: 'package.json or requirements.txt' },
      ];
    }

    // Stage 3: Cross-Verification & Evidence Ledger Creation
    await updateJobState(jobId, { stage: 'claim_verification', progress: 65 });
    console.log(`⚖️ [Stage 3] Cross-verifying ${allExtractedClaims.length} claims against codebase...`);
    const evidenceLedger: Evidence[] = [];

    for (const claim of allExtractedClaims.slice(0, 15)) {
      const evidence = await verifyClaim(claim, repoAnalysis, projectId, repoAnalysis.commitSha);
      evidenceLedger.push(evidence);
      await db.collection('evidence').add(evidence);
    }
    console.log(`✅ [Stage 3] Evidence Ledger created: ${evidenceLedger.filter(e => e.status === 'Verified').length} Verified, ${evidenceLedger.filter(e => e.status === 'Partially Verified').length} Partial, ${evidenceLedger.filter(e => e.status === 'Not Verified').length} Not Verified.`);

    // Stage 4: 19-Section Report Assembly
    await updateJobState(jobId, { stage: 'report_generation', progress: 85 });
    console.log(`📊 [Stage 4] Assembling 19-Section Validation Report...`);
    const report = await generateValidationReport(projectId, repoAnalysis, evidenceLedger, ideaFields);

    // Stage 5: Execution Engine & Phased Roadmap
    await updateJobState(jobId, { stage: 'roadmap_generation', progress: 95 });
    console.log(`🗺️ [Stage 5] Generating 5-Phase Dependency-Aware Execution Roadmap...`);
    await generateRoadmap(projectId, repoAnalysis, evidenceLedger);

    // Stage 6: Completion
    await db.collection('projects').doc(projectId).update({
      status: 'completed',
      updatedAt: new Date(),
    });

    await updateJobState(jobId, {
      stage: 'completed',
      progress: 100,
      status: 'completed',
    });

    console.log(`🎉 [Pipeline Success] Analysis complete for project ${projectId}!\n`);
    return report;
  } catch (error: any) {
    console.error(`❌ [Pipeline Failure] Project ${projectId} failed:`, error);
    await db.collection('projects').doc(projectId).update({
      status: 'failed',
      updatedAt: new Date(),
    });
    await updateJobState(jobId, {
      stage: 'failed',
      status: 'failed',
      error: error.message || 'Unknown pipeline failure',
    });
    throw error;
  }
};

/**
 * Enqueues an analysis job.
 * Non-blocking: Returns instantly and processes via background event loop.
 */
export const queueAnalysis = async (projectId: string, data: any) => {
  // Fire and forget into background event loop
  setImmediate(() => {
    executeAnalysisPipeline(projectId, data).catch(err => {
      console.error(`Unhandled error in background job ${projectId}:`, err);
    });
  });
};

export const queueValidation = async (projectId: string, fields: any) => {
  // Updates idea validation fields on existing project
  setImmediate(async () => {
    try {
      await db.collection('projects').doc(projectId).update({
        ...fields,
        updatedAt: new Date(),
      });
      console.log(`✅ Idea validation fields updated for project ${projectId}`);
    } catch (err) {
      console.error(`Error updating validation for ${projectId}:`, err);
    }
  });
};

export const queueRoadmap = async (projectId: string) => {
  setImmediate(async () => {
    try {
      const [analysisDoc, evidenceDocs] = await Promise.all([
        db.collection('analyses').doc(projectId).get(),
        db.collection('evidence').get(),
      ]);
      const analysis = analysisDoc.exists ? analysisDoc.data() : {};
      const evidence = evidenceDocs.docs.map((d: any) => d.data() as Evidence);
      await generateRoadmap(projectId, analysis, evidence);
      console.log(`✅ Standalone roadmap generated for project ${projectId}`);
    } catch (err) {
      console.error(`Error generating roadmap for ${projectId}:`, err);
    }
  });
};
