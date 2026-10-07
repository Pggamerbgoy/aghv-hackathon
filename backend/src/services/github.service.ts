import { octokit, parseGithubUrl } from '../config/github';
import { auditAndRedactSecrets } from './secretRedaction.service';
import { RepositoryHealth, RiskArea, TechnologyStack } from '../types';

const RELEVANT_EXTENSIONS = [
  '.js', '.ts', '.tsx', '.jsx', '.py', '.java', '.go', '.rs',
  '.json', '.md', '.yml', '.yaml', '.toml', '.dockerfile', '.env.example', '.sql'
];

const isRelevantFile = (path: string): boolean => {
  const lower = path.toLowerCase();
  // Filter out lockfiles, maps, and node_modules
  if (lower.includes('node_modules/') || lower.includes('.git/') || lower.endsWith('.min.js') || lower.endsWith('.map')) {
    return false;
  }
  return RELEVANT_EXTENSIONS.some(ext => lower.endsWith(ext));
};

export const analyzeRepository = async (githubUrl: string) => {
  const { owner, repo } = parseGithubUrl(githubUrl);

  const { data: repoData } = await octokit.rest.repos.get({ owner, repo });
  const defaultBranch = repoData.default_branch || 'main';

  // Single-call file tree enumeration (0-token, zero local clone)
  const { data: tree } = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: defaultBranch,
    recursive: 'true',
  });

  const allFiles = tree.tree
    .filter((item: any) => item.type === 'blob')
    .map((item: any) => item.path);

  const relevantFiles = allFiles.filter(isRelevantFile);

  // Key architectural files to inspect content
  const candidateKeyFiles = [
    'package.json',
    'requirements.txt',
    'Cargo.toml',
    'go.mod',
    'README.md',
    'Dockerfile',
    'docker-compose.yml',
    'tsconfig.json',
    '.env.example'
  ];

  const filesToFetch = allFiles.filter(f => 
    candidateKeyFiles.some(k => f.toLowerCase() === k.toLowerCase() || f.endsWith('/' + k))
  );

  const fileContents: Record<string, string> = {};
  const redactedSecretsAudit: string[] = [];

  for (const filePath of filesToFetch.slice(0, 10)) {
    try {
      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: filePath,
      });

      if ('content' in data && data.content) {
        const rawContent = Buffer.from(data.content, 'base64').toString('utf-8');
        const audit = auditAndRedactSecrets(rawContent);
        fileContents[filePath] = audit.sanitized;
        if (audit.redactedCount > 0) {
          redactedSecretsAudit.push(`${filePath} contained ${audit.redactedCount} secrets (${audit.detectedTypes.join(', ')})`);
        }
      }
    } catch (error) {
      console.warn(`Could not fetch file ${filePath}:`, error);
    }
  }

  // Deterministic Analysis
  const stack = detectStack(fileContents, allFiles);
  const tests = allFiles.filter(f => /(\.test\.|\.spec\.|test\/|tests\/|__tests__\/)/i.test(f));
  const ci = allFiles.filter(f => f.startsWith('.github/workflows/') || f.includes('gitlab-ci') || f.includes('Jenkinsfile'));
  const hasReadme = allFiles.some(f => f.toLowerCase() === 'readme.md');
  const hasLicense = allFiles.some(f => f.toLowerCase().startsWith('license'));
  const hasDocker = allFiles.some(f => f.toLowerCase().includes('dockerfile'));

  // Route extraction
  const routes = allFiles.filter(f => 
    f.includes('/routes/') || 
    f.includes('/api/') || 
    f.includes('/app/') ||
    f.toLowerCase().includes('route.') ||
    f.toLowerCase().includes('controller.')
  );

  // Component extraction
  const components = allFiles.filter(f => 
    f.includes('/components/') || 
    f.includes('/views/') || 
    f.includes('/pages/') ||
    (f.endsWith('.tsx') && !f.includes('.test.') && !f.includes('.spec.'))
  );

  const health = calculateHealth({
    hasReadme,
    hasLicense,
    tests,
    ci,
    hasDocker,
    totalFiles: allFiles.length,
    dependencyCount: stack.dependencies.length,
  });

  const risks = identifyRisks({
    tests,
    ci,
    hasReadme,
    allFiles,
    redactedSecretsAudit,
  });

  const architecture = {
    pattern: stack.frontend.length > 0 && stack.backend.length > 0 ? 'Full-Stack Separated' : stack.backend.length > 0 ? 'Backend API' : 'Client Application',
    frontendFramework: stack.frontend[0] || 'None detected',
    backendFramework: stack.backend[0] || 'None detected',
    hasApi: routes.length > 0,
    hasDatabase: stack.database.length > 0,
    hasTests: tests.length > 0,
    hasCi: ci.length > 0,
    routes: routes.slice(0, 20),
    components: components.slice(0, 20),
  };

  return {
    owner,
    repo,
    defaultBranch,
    commitSha: repoData.pushed_at || 'sha_head',
    files: relevantFiles,
    allFiles,
    stack,
    tests,
    ci,
    routes,
    components,
    fileContents,
    architecture,
    health,
    risks,
  };
};

const detectStack = (fileContents: Record<string, string>, allFiles: string[]): TechnologyStack => {
  const stack: TechnologyStack = {
    languages: [],
    frontend: [],
    backend: [],
    database: [],
    ai: [],
    devops: [],
    other: [],
    dependencies: [],
  };

  // Node.js ecosystem
  const pkgContent = Object.entries(fileContents).find(([k]) => k.endsWith('package.json'))?.[1];
  if (pkgContent) {
    try {
      const pkg = JSON.parse(pkgContent);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      stack.dependencies = Object.keys(deps || {});
      stack.languages.push('TypeScript / JavaScript');

      if (deps.react || deps['react-dom']) stack.frontend.push('React');
      if (deps.next) stack.frontend.push('Next.js');
      if (deps.vue) stack.frontend.push('Vue');
      if (deps.tailwindcss) stack.frontend.push('Tailwind CSS');
      if (deps.express) stack.backend.push('Express.js');
      if (deps.fastify) stack.backend.push('Fastify');
      if (deps['@nestjs/core']) stack.backend.push('NestJS');
      if (deps.firebase || deps['firebase-admin']) stack.database.push('Firebase / Firestore');
      if (deps.mongoose || deps.mongodb) stack.database.push('MongoDB');
      if (deps.prisma || deps['@prisma/client']) stack.database.push('Prisma ORM');
      if (deps.pg || deps.mysql2 || deps.sqlite3) stack.database.push('SQL Database');
      if (deps['@google/generative-ai'] || deps.openai || deps['@anthropic-ai/sdk']) stack.ai.push('LLM Integration');
      if (deps['@lancedb/lancedb'] || deps.chromadb) stack.ai.push('Vector Database (RAG)');
    } catch {
      // ignore json parse error
    }
  }

  // Python ecosystem
  if (allFiles.some(f => f.endsWith('.py'))) {
    stack.languages.push('Python');
    const reqContent = Object.entries(fileContents).find(([k]) => k.endsWith('requirements.txt'))?.[1];
    if (reqContent) {
      if (reqContent.includes('fastapi')) stack.backend.push('FastAPI');
      if (reqContent.includes('flask')) stack.backend.push('Flask');
      if (reqContent.includes('django')) stack.backend.push('Django');
      if (reqContent.includes('langchain') || reqContent.includes('langgraph')) stack.ai.push('LangChain / LangGraph');
      if (reqContent.includes('torch') || reqContent.includes('transformers')) stack.ai.push('PyTorch / Transformers');
    }
  }

  if (allFiles.some(f => f.endsWith('.go'))) stack.languages.push('Go');
  if (allFiles.some(f => f.endsWith('.rs'))) stack.languages.push('Rust');
  if (allFiles.some(f => f.endsWith('.java'))) stack.languages.push('Java');

  if (allFiles.some(f => f.toLowerCase().includes('dockerfile'))) stack.devops.push('Docker');
  if (allFiles.some(f => f.startsWith('.github/workflows/'))) stack.devops.push('GitHub Actions');

  // Deduplicate
  stack.languages = Array.from(new Set(stack.languages));
  stack.frontend = Array.from(new Set(stack.frontend));
  stack.backend = Array.from(new Set(stack.backend));
  stack.database = Array.from(new Set(stack.database));
  stack.ai = Array.from(new Set(stack.ai));
  stack.devops = Array.from(new Set(stack.devops));

  return stack;
};

const calculateHealth = (data: {
  hasReadme: boolean;
  hasLicense: boolean;
  tests: string[];
  ci: string[];
  hasDocker: boolean;
  totalFiles: number;
  dependencyCount: number;
}): RepositoryHealth => {
  let score = 20; // baseline for valid repository structure
  if (data.hasReadme) score += 20;
  if (data.hasLicense) score += 10;
  if (data.tests.length > 0) score += 25;
  if (data.ci.length > 0) score += 15;
  if (data.hasDocker) score += 10;

  return {
    score: Math.min(score, 100),
    scoreLabel: 'Deterministic static assessment based on repository structure',
    hasReadme: data.hasReadme,
    hasLicense: data.hasLicense,
    hasTests: data.tests.length > 0,
    hasCi: data.ci.length > 0,
    hasDocker: data.hasDocker,
    dependencyCount: data.dependencyCount,
    totalFiles: data.totalFiles,
  };
};

const identifyRisks = (data: {
  tests: string[];
  ci: string[];
  hasReadme: boolean;
  allFiles: string[];
  redactedSecretsAudit: string[];
}): RiskArea[] => {
  const risks: RiskArea[] = [];

  if (data.redactedSecretsAudit.length > 0) {
    risks.push({
      category: 'Security & Secrets',
      severity: 'critical',
      description: `Potential secrets detected and redacted during inspection: ${data.redactedSecretsAudit.join('; ')}`,
      affectedFiles: [],
    });
  }

  if (data.tests.length === 0) {
    risks.push({
      category: 'Testing & Verification',
      severity: 'high',
      description: 'Zero automated test files detected. Codebase lacks automated test suites or CI verification.',
      affectedFiles: [],
    });
  }

  if (data.ci.length === 0) {
    risks.push({
      category: 'CI / CD Infrastructure',
      severity: 'medium',
      description: 'No CI/CD pipeline workflow configured (.github/workflows). Deployment is manual.',
      affectedFiles: [],
    });
  }

  if (!data.hasReadme) {
    risks.push({
      category: 'Documentation',
      severity: 'medium',
      description: 'Missing README.md. New developers or jurors cannot discover setup or execution instructions.',
      affectedFiles: [],
    });
  }

  return risks;
};
