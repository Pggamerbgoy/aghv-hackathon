import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import { db } from '../config/firebase';
import { queueAnalysis, queueValidation, queueRoadmap } from '../services/jobQueue.service';

export const analyzeProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      name,
      description,
      githubUrl,
      demoUrl,
      documentUrls,
      problem,
      solution,
      targetUser,
      targetMarket,
      businessModel,
      technology,
      currentStage
    } = req.body;

    const userId = req.user?.uid || 'anonymous-user';

    // 1. Create project context in Firestore
    const projectRef = await db.collection('projects').add({
      ownerId: userId,
      name,
      description: description || '',
      githubUrl,
      demoUrl: demoUrl || null,
      documentUrls: documentUrls || [],
      problem: problem || '',
      solution: solution || '',
      targetUser: targetUser || '',
      targetMarket: targetMarket || '',
      businessModel: businessModel || '',
      technology: technology || '',
      currentStage: currentStage || 'Prototype',
      status: 'queued',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const projectId = projectRef.id;

    // 2. Initialize tracking job
    await db.collection('jobs').doc(projectId).set({
      id: projectId,
      projectId,
      ownerId: userId,
      type: 'full_analysis',
      stage: 'queued',
      progress: 0,
      status: 'queued',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 3. Dispatch to async orchestration layer
    await queueAnalysis(projectId, {
      githubUrl,
      demoUrl,
      documentUrls,
      ideaFields: {
        problem,
        solution,
        targetUser,
        targetMarket,
        businessModel,
        technology,
        currentStage,
      },
    });

    // 4. Return non-blocking immediate response (<50ms)
    res.status(202).json({
      projectId,
      jobId: projectId,
      status: 'queued',
      message: 'Project analysis successfully queued. Poll /projects/:id/status for stage progression.',
    });
  } catch (error: any) {
    console.error('Error queuing project analysis:', error);
    res.status(500).json({
      error: 'Failed to initiate project analysis',
      message: error.message || 'Unknown error',
    });
  }
};

export const validateProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId, ...fields } = req.body;

    await queueValidation(projectId, fields);

    res.status(202).json({
      projectId,
      jobId: `validation-${projectId}`,
      status: 'queued',
      message: 'Idea validation enqueued for processing.',
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to validate project', message: error.message });
  }
};

export const generateRoadmapController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { projectId } = req.body;
    await queueRoadmap(projectId);

    res.status(202).json({
      projectId,
      jobId: `roadmap-${projectId}`,
      status: 'queued',
      message: 'Execution roadmap generation queued.',
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to trigger roadmap generation', message: error.message });
  }
};

export const getProjectStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const [projectDoc, jobDoc] = await Promise.all([
      db.collection('projects').doc(id).get(),
      db.collection('jobs').doc(id).get(),
    ]);

    if (!projectDoc.exists && !jobDoc.exists) {
      return res.status(404).json({
        error: 'Project not found',
        message: `No active project or job found with ID: ${id}`,
      });
    }

    const jobData = jobDoc.exists ? jobDoc.data() : null;
    const projectData = projectDoc.exists ? projectDoc.data() : null;

    res.json({
      projectId: id,
      stage: jobData?.stage || projectData?.status || 'queued',
      progress: jobData?.progress ?? (projectData?.status === 'completed' ? 100 : 0),
      status: jobData?.status || projectData?.status || 'queued',
      error: jobData?.error || null,
      project: projectData,
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve project status', message: error.message });
  }
};

export const getProjectReport = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const reportDoc = await db.collection('reports').doc(id).get();

    if (!reportDoc.exists) {
      return res.status(404).json({
        error: 'Report not ready',
        message: `Validation report for project ${id} is still analyzing or does not exist. Check /projects/${id}/status`,
      });
    }

    res.json(reportDoc.data());
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch report', message: error.message });
  }
};
