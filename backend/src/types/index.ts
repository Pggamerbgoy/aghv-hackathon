export type VerificationStatus = 
  | 'Verified' 
  | 'Partially Verified' 
  | 'Not Verified' 
  | 'Insufficient Evidence';

export type ClaimCategory = 
  | 'feature' 
  | 'technology' 
  | 'architecture' 
  | 'performance' 
  | 'security' 
  | 'business';

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
  category: ClaimCategory;
  sourceType: 'repository' | 'document' | 'demo' | 'ai_inference';
  sourcePath: string;
  sourceSection?: string;
  status: VerificationStatus;
  reasoning: string;
  confidence: number;
  citations: Citation[];
  createdAt: Date | string;
}

export interface ProjectContext {
  id?: string;
  ownerId: string;
  name: string;
  description: string;
  githubUrl: string;
  demoUrl?: string;
  documentUrls: string[];
  status: 'queued' | 'analyzing' | 'completed' | 'failed';
  problem?: string;
  solution?: string;
  targetUser?: string;
  targetMarket?: string;
  businessModel?: string;
  technology?: string;
  currentStage?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
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

export interface ArchitectureSummary {
  pattern: string;
  frontendFramework: string;
  backendFramework: string;
  hasApi: boolean;
  hasDatabase: boolean;
  hasTests: boolean;
  hasCi: boolean;
  routes: string[];
  components: string[];
}

export interface RiskArea {
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedFiles: string[];
}

export interface RepositoryHealth {
  score: number;
  scoreLabel: string; // Mandated: must state "AI-generated assessment" or "Deterministic static metric"
  hasReadme: boolean;
  hasLicense: boolean;
  hasTests: boolean;
  hasCi: boolean;
  hasDocker: boolean;
  dependencyCount: number;
  totalFiles: number;
  sloc?: {
    total: number;
    source: number;
    comment: number;
  };
}

export interface AnalysisResult {
  projectId: string;
  ownerId: string;
  commitSha: string;
  repositoryUrl: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt: Date | string;
  completedAt?: Date | string;
  results: {
    stack: TechnologyStack;
    architecture: ArchitectureSummary;
    routes: string[];
    components: string[];
    tests: string[];
    ci: string[];
    risks: RiskArea[];
    health: RepositoryHealth;
    fileTree: string[];
  };
  error?: string;
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

export interface IdeaValidationAssessment {
  problemClarity: string;
  userRelevance: string;
  solutionFeasibility: string;
  differentiation: string;
  businessModelViability: string;
  executionReadinessScore: number;
  scoreLabel: string; // Mandated "AI-generated assessment"
  reasoning: string;
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
  // Hard Visual Separation 1: AI Analysis & Recommendations
  executiveSummary: string;
  projectUnderstanding: string;
  problemAnalysis: string;
  solutionAnalysis: string;
  targetUsers: string;
  // Hard Visual Separation 2: FACT / VERIFIED EVIDENCE
  technologyStack: TechnologyStack;
  repositoryAnalysis: AnalysisResult['results'];
  architectureAnalysis: string;
  featureVerification: Evidence[];
  documentationVerification: string;
  demoAnalysis: string; // Explicit limitation disclosure if video CV is not enabled
  // AI Evaluations
  ideaValidation: IdeaValidationAssessment;
  marketCompetitorAnalysis: string;
  executionReadiness: string;
  missingComponents: string[];
  technicalRisks: RiskArea[];
  recommendedExecutionRoadmap: { phases: RoadmapPhase[] };
  validationGaps: string[];
  finalEvidenceSummary: FinalEvidenceSummary;
  createdAt: Date | string;
}

export interface JobState {
  id: string;
  projectId: string;
  ownerId: string;
  type: 'full_analysis' | 'repository_analysis' | 'document_analysis' | 'validation' | 'roadmap';
  stage: string;
  progress: number;
  status: 'queued' | 'running' | 'completed' | 'failed';
  error?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
