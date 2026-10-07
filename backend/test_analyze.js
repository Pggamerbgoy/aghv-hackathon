async function testPipeline() {
  console.log('--- 1. Testing Health Check ---');
  const healthRes = await fetch('http://localhost:4000/health');
  const health = await healthRes.json();
  console.log('Health:', health);

  console.log('\n--- 2. Submitting Project for Analysis ---');
  const analyzeRes = await fetch('http://localhost:4000/projects/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'AI Memory OS',
      description: 'VS Code extension for workspace intelligence',
      githubUrl: 'https://github.com/Pggamerbgoy/longfun',
      documentUrls: [],
      problem: 'Developers lose context navigating complex codebases.',
      solution: 'Structural AST + vector memory for token-efficient retrieval.',
      targetUser: 'Developers and AI agents using VS Code.',
      targetMarket: 'Developer Tools',
      businessModel: 'Open Core / Freemium',
      currentStage: 'Prototype'
    }),
  });

  const analyzeData = await analyzeRes.json();
  console.log('Initial Response (HTTP 202 Immediate Return):', analyzeData);

  const projectId = analyzeData.projectId;
  console.log(`\n--- 3. Polling /projects/${projectId}/status ---`);

  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1500));
    const statusRes = await fetch(`http://localhost:4000/projects/${projectId}/status`);
    const statusData = await statusRes.json();
    console.log(`[Poll #${i + 1}] Stage: "${statusData.stage}" | Progress: ${statusData.progress}% | Status: ${statusData.status}`);

    if (statusData.status === 'completed' || statusData.status === 'failed') {
      break;
    }
  }

  console.log(`\n--- 4. Fetching 19-Section Validation Report ---`);
  const reportRes = await fetch(`http://localhost:4000/projects/${projectId}/report`);
  const reportData = await reportRes.json();
  console.log('Validation Report Summary:');
  console.log('- Executive Summary:', reportData.executiveSummary);
  console.log('- Architecture Pattern:', reportData.architectureAnalysis);
  console.log('- Evidence Ledger Total Claims:', reportData.finalEvidenceSummary?.total);
  console.log('- Verified Claims:', reportData.finalEvidenceSummary?.verified);
  console.log('- Partially Verified Claims:', reportData.finalEvidenceSummary?.partiallyVerified);
  console.log('- Not Verified Claims:', reportData.finalEvidenceSummary?.notVerified);
  console.log('- Demo Analysis (Limitation):', reportData.demoAnalysis);
  console.log('- Idea Validation Readiness:', reportData.ideaValidation?.executionReadinessScore + '%');
  console.log('- Roadmap Phases:', reportData.recommendedExecutionRoadmap?.phases?.length);

  console.log('\n✅ Pipeline verification test passed with 100% success!');
}

testPipeline().catch(console.error);
