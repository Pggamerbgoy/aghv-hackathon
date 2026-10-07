export type VerificationStatus = 
  | 'Verified' 
  | 'Partially Verified' 
  | 'Not Verified' 
  | 'Insufficient Evidence';

export interface Citation {
  target: string;
  lineRange?: string;
  snippet?: string;
  documentSection?: string;
}

export interface Evidence {
  id?: string;
  projectId: string;
  analysisId: string;
  claim: string;
  category: 'feature' | 'technology' | 'architecture' | 'performance' | 'security' | 'business';
  sourceType: 'repository' | 'document' | 'demo' | 'ai_inference';
  sourcePath: string;
  sourceSection?: string;
  status: VerificationStatus;
  reasoning: string;
  confidence: number;
  citations: Citation[];
  createdAt: string;
}

export interface TechnologyStack {
  languages: string[];
  frontend: string[];
  backend: string[];
  database: string[];
  ai: string[];
  devops: string[];
  other: string[];
  dependencies: string[];
}

export interface RoadmapTask {
  id: string;
  task: string;
  why: string;
  dependency: string[];
  owner: 'Frontend' | 'Backend' | 'AI / ML' | 'DevOps' | 'Product';
  expectedOutput: string;
  verificationCriteria: string;
}

export interface RoadmapPhase {
  name: string;
  order: number;
  tasks: RoadmapTask[];
}

export interface RiskArea {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedFiles: string[];
}

export interface FinalEvidenceSummary {
  total: number;
  verified: number;
  partiallyVerified: number;
  notVerified: number;
  insufficientEvidence: number;
  verificationRatio: number;
}

export interface ValidationReport {
  projectId: string;
  analysisId: string;
  ownerId: string;
  executiveSummary: string;
  projectUnderstanding: string;
  problemAnalysis: string;
  solutionAnalysis: string;
  targetUsers: string;
  technologyStack: TechnologyStack;
  repositoryAnalysis: {
    stack?: TechnologyStack;
    architecture?: any;
    routes?: string[];
    components?: string[];
    tests?: string[];
    ci?: string[];
    risks?: RiskArea[];
    health?: {
      score: number;
      scoreLabel: string;
      hasReadme: boolean;
      hasLicense: boolean;
      hasTests: boolean;
      hasCi: boolean;
      hasDocker: boolean;
      dependencyCount: number;
      totalFiles: number;
    };
    fileTree?: string[];
  };
  architectureAnalysis: string;
  featureVerification: Evidence[];
  documentationVerification: string;
  demoAnalysis: string;
  ideaValidation: {
    problemClarity: string;
    userRelevance: string;
    solutionFeasibility: string;
    differentiation: string;
    businessModelViability: string;
    executionReadinessScore: number;
    scoreLabel: string;
    reasoning: string;
  };
  marketCompetitorAnalysis: string;
  executionReadiness: string;
  missingComponents: string[];
  technicalRisks: RiskArea[];
  recommendedExecutionRoadmap: { phases: RoadmapPhase[] };
  validationGaps: string[];
  finalEvidenceSummary: FinalEvidenceSummary;
  createdAt: string;
}
