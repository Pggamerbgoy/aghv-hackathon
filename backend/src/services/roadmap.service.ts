import { db } from '../config/firebase';
import { RoadmapPhase, RoadmapTask, Evidence } from '../types';

export const generateRoadmap = async (
  projectId: string,
  analysis: any,
  evidence: Evidence[]
): Promise<{ phases: RoadmapPhase[] }> => {
  const missing = evidence.filter(e => e.status === 'Not Verified');
  const partial = evidence.filter(e => e.status === 'Partially Verified');

  const phases: RoadmapPhase[] = [
    {
      name: 'Phase 1: Foundation',
      order: 1,
      tasks: buildFoundationTasks(analysis),
    },
    {
      name: 'Phase 2: Core Product',
      order: 2,
      tasks: buildCoreProductTasks(analysis, missing),
    },
    {
      name: 'Phase 3: Integration',
      order: 3,
      tasks: buildIntegrationTasks(analysis, partial),
    },
    {
      name: 'Phase 4: Testing & Hardening',
      order: 4,
      tasks: buildTestingTasks(analysis),
    },
    {
      name: 'Phase 5: Launch Readiness',
      order: 5,
      tasks: buildLaunchTasks(analysis),
    },
  ];

  // Save to Firestore
  await db.collection('roadmaps').doc(projectId).set({
    projectId,
    phases,
    createdAt: new Date(),
  });

  // Also update report with this roadmap
  try {
    const reportDoc = await db.collection('reports').doc(projectId).get();
    if (reportDoc.exists) {
      await db.collection('reports').doc(projectId).update({
        recommendedExecutionRoadmap: { phases },
      });
    }
  } catch {
    // report update optional if not yet created
  }

  return { phases };
};

const buildFoundationTasks = (analysis: any): RoadmapTask[] => {
  const tasks: RoadmapTask[] = [];

  if (!analysis?.health?.hasReadme) {
    tasks.push({
      id: 'task-found-1',
      task: 'Author Project README.md with Setup & Architecture Specs',
      why: 'Analysis identified missing documentation; builders and reviewers cannot initialize the project without onboarding instructions.',
      dependency: [],
      owner: 'Product',
      expectedOutput: 'README.md with installation commands, environment variable definitions, and system diagrams.',
      verificationCriteria: 'File exists in repository root and passes markdown syntax linting.',
    });
  }

  tasks.push({
    id: 'task-found-2',
    task: 'Configure Environment Security and .env.example',
    why: 'Prevents credential leaks by decoupling runtime secrets from version control.',
    dependency: [],
    owner: 'DevOps',
    expectedOutput: '.env.example template containing all necessary configuration keys without live secret values.',
    verificationCriteria: 'git status confirms .env is ignored and .env.example is committed.',
  });

  return tasks;
};

const buildCoreProductTasks = (analysis: any, missing: Evidence[]): RoadmapTask[] => {
  const tasks: RoadmapTask[] = [];

  if (missing.length === 0) {
    tasks.push({
      id: 'task-core-default',
      task: 'Refactor Core Route Handlers for Resilience',
      why: 'Existing core claims are verified; hardening core routes ensures scale.',
      dependency: ['task-found-2'],
      owner: 'Backend',
      expectedOutput: 'Typed request/response handlers with error wrapping.',
      verificationCriteria: 'All API routes return standardized JSON errors upon failure.',
    });
  } else {
    missing.slice(0, 4).forEach((item, idx) => {
      tasks.push({
        id: `task-core-${idx + 1}`,
        task: `Implement Missing Feature: ${item.claim}`,
        why: `Evidence Ledger marked this claim "Not Verified" due to missing repository implementation: ${item.reasoning}`,
        dependency: ['task-found-2'],
        owner: 'Backend',
        expectedOutput: `Dedicated controller, route, or module fulfilling ${item.claim}.`,
        verificationCriteria: `Evidence Ledger can verify this feature in subsequent scans with concrete file citation.`,
      });
    });
  }

  return tasks;
};

const buildIntegrationTasks = (analysis: any, partial: Evidence[]): RoadmapTask[] => {
  const tasks: RoadmapTask[] = [];

  if (partial.length > 0) {
    partial.slice(0, 3).forEach((item, idx) => {
      tasks.push({
        id: `task-integ-${idx + 1}`,
        task: `Complete Partial Integration: ${item.claim}`,
        why: `Evidence Ledger classified this item as "Partially Verified": ${item.reasoning}`,
        dependency: ['task-core-1'],
        owner: 'Backend',
        expectedOutput: `Full end-to-end integration and connection handling for ${item.claim}.`,
        verificationCriteria: `Zero stub or mock dependencies remaining for this feature.`,
      });
    });
  } else {
    tasks.push({
      id: 'task-integ-1',
      task: 'Connect Frontend Client to Backend Orchestration Endpoints',
      why: 'Ensures UI renders dynamic state rather than isolated mocked views.',
      dependency: ['task-core-default'],
      owner: 'Frontend',
      expectedOutput: 'API service integration layer with reactive status polling.',
      verificationCriteria: 'Network tab confirms live data round-trips to backend endpoints.',
    });
  }

  return tasks;
};

const buildTestingTasks = (analysis: any): RoadmapTask[] => {
  const tasks: RoadmapTask[] = [];

  if (!analysis?.health?.hasTests) {
    tasks.push({
      id: 'task-test-1',
      task: 'Establish Automated Unit & Integration Test Suite',
      why: 'Repository analysis found 0 test files. Automated test coverage is critical to prevent regressions.',
      dependency: ['task-integ-1'],
      owner: 'Backend',
      expectedOutput: 'Test runner configuration (Vitest/Jest) and core endpoint unit test specs.',
      verificationCriteria: 'npm test command exits with code 0 and achieves >70% branch coverage on core logic.',
    });
  } else {
    tasks.push({
      id: 'task-test-1',
      task: 'Expand Test Coverage to Edge Cases and Boundary Payloads',
      why: 'Existing tests detected; expanding to stress edge-case inputs guarantees reliability.',
      dependency: ['task-integ-1'],
      owner: 'Backend',
      expectedOutput: 'Comprehensive test suites covering malformed inputs and rate-limit triggers.',
      verificationCriteria: 'Test suite passes all negative assertion tests.',
    });
  }

  return tasks;
};

const buildLaunchTasks = (analysis: any): RoadmapTask[] => {
  const tasks: RoadmapTask[] = [];

  if (!analysis?.health?.hasCi) {
    tasks.push({
      id: 'task-launch-1',
      task: 'Implement GitHub Actions CI/CD Automated Workflow',
      why: 'Analysis identified missing CI pipeline. Automated linting and testing must run on every pull request.',
      dependency: ['task-test-1'],
      owner: 'DevOps',
      expectedOutput: '.github/workflows/ci.yml running lint, build, and test steps.',
      verificationCriteria: 'GitHub commit displays green checkmark on pull request checks.',
    });
  }

  tasks.push({
    id: 'task-launch-2',
    task: 'Deploy Live Working Version with Health Check Endpoint',
    why: 'Mandatory deliverable for AHGV BuildVerse 2026 Grand Finale evaluation.',
    dependency: ['task-launch-1'],
    owner: 'DevOps',
    expectedOutput: 'Live production URL serving both frontend UI and backend API.',
    verificationCriteria: 'GET /health returns HTTP 200 with status: "ok".',
  });

  return tasks;
};
