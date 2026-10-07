import React, { useState } from 'react';
import { ValidationReport } from '../types';
import { EvidenceLedgerTable } from './EvidenceLedgerTable';
import { PhasedRoadmapBoard } from './PhasedRoadmapBoard';
import { 
  ShieldCheck, CheckCircle2, AlertTriangle, Layers, Cpu, 
  Map, FileText, Code2, AlertCircle, Copy, Check 
} from 'lucide-react';

interface ReportViewProps {
  report: ValidationReport;
}

export const ReportView: React.FC<ReportViewProps> = ({ report }) => {
  const [activeTab, setActiveTab] = useState<'evidence' | 'static' | 'ai' | 'roadmap' | 'json'>('evidence');
  const [copied, setCopied] = useState(false);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const health = report.repositoryAnalysis?.health;
  const verifiedCount = report.finalEvidenceSummary?.verified || 0;
  const totalClaims = report.finalEvidenceSummary?.total || 0;
  const verificationRatio = report.finalEvidenceSummary?.verificationRatio || 0;
  const readinessScore = report.ideaValidation?.executionReadinessScore || 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Verification Ratio */}
        <div className="bg-surface rounded-2xl p-5 border border-border/80 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Verified Ratio</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-white">{verificationRatio}%</span>
            <span className="text-xs text-slate-400">({verifiedCount}/{totalClaims} Claims)</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Backed by concrete code citations in repository.
          </p>
        </div>

        {/* Metric 2: Repo Health Score */}
        <div className="bg-surface rounded-2xl p-5 border border-border/80 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Repository Health</span>
            <Code2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-white">{health?.score || 60}/100</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 truncate">
            {health?.scoreLabel || 'Static structure & test metric'}
          </p>
        </div>

        {/* Metric 3: Readiness Assessment */}
        <div className="bg-surface rounded-2xl p-5 border border-border/80 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Execution Readiness</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-white">{readinessScore}%</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              AI-generated
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Weighted composite of verified evidence and health.
          </p>
        </div>

        {/* Metric 4: Technical Risks */}
        <div className="bg-surface rounded-2xl p-5 border border-border/80 shadow-lg">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <span>Identified Risks</span>
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-extrabold text-white">{report.technicalRisks?.length || 0}</span>
            <span className="text-xs text-amber-400 font-medium">Areas Flagged</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Security, test coverage &amp; CI/CD gaps.
          </p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-border/80 overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('evidence')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'evidence'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Evidence Ledger ({totalClaims})</span>
        </button>

        <button
          onClick={() => setActiveTab('static')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'static'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Code2 className="w-4 h-4" />
          <span className="flex items-center gap-1.5">
            <span>Fact / Verified Evidence</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Deterministic
            </span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'ai'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span className="flex items-center gap-1.5">
            <span>AI Analysis &amp; Idea Validation</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              AI-generated
            </span>
          </span>
        </button>

        <button
          onClick={() => setActiveTab('roadmap')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'roadmap'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>Execution Roadmap</span>
        </button>

        <button
          onClick={() => setActiveTab('json')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm border-b-2 transition-all whitespace-nowrap ${
            activeTab === 'json'
              ? 'border-indigo-500 text-indigo-400'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Platform JSON Export</span>
        </button>
      </div>

      {/* Tab 1: Evidence Ledger Table */}
      {activeTab === 'evidence' && (
        <EvidenceLedgerTable evidence={report.featureVerification || []} />
      )}

      {/* Tab 2: FACT / VERIFIED EVIDENCE */}
      {activeTab === 'static' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>
              <strong>Hard Visual Partition — FACT / VERIFIED EVIDENCE:</strong> Extracted deterministically via GitHub Trees API, package manifests, and route AST parsing. Zero hallucination risk.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tech Stack Breakdown */}
            <div className="bg-surface rounded-2xl p-6 border border-border/80 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Verified Technology Stack
              </h4>
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold mb-1">Languages:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.technologyStack?.languages?.map((l, i) => (
                      <span key={i} className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">
                        {l}
                      </span>
                    )) || <span className="text-slate-500">None detected</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold mb-1">Frontend Frameworks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.technologyStack?.frontend?.map((f, i) => (
                      <span key={i} className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">
                        {f}
                      </span>
                    )) || <span className="text-slate-500">None</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold mb-1">Backend Frameworks:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.technologyStack?.backend?.map((b, i) => (
                      <span key={i} className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">
                        {b}
                      </span>
                    )) || <span className="text-slate-500">None</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold mb-1">Database &amp; Storage:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.technologyStack?.database?.map((d, i) => (
                      <span key={i} className="bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700">
                        {d}
                      </span>
                    )) || <span className="text-slate-500">None</span>}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block font-semibold mb-1">AI / ML Integrations:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {report.technologyStack?.ai?.map((a, i) => (
                      <span key={i} className="bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-700">
                        {a}
                      </span>
                    )) || <span className="text-slate-500">None</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Architecture & Routes */}
            <div className="bg-surface rounded-2xl p-6 border border-border/80 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-white">
                Architecture &amp; Route Discovery
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed bg-background/80 p-3 rounded-lg border border-border/50">
                {report.architectureAnalysis}
              </p>

              <div>
                <span className="text-xs text-slate-400 block font-semibold mb-2">
                  Discovered Route Handlers &amp; Endpoints ({report.repositoryAnalysis?.routes?.length || 0}):
                </span>
                <div className="max-h-48 overflow-y-auto space-y-1.5 font-mono text-[11px]">
                  {report.repositoryAnalysis?.routes && report.repositoryAnalysis.routes.length > 0 ? (
                    report.repositoryAnalysis.routes.map((r, i) => (
                      <div key={i} className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-indigo-300 truncate">
                        {r}
                      </div>
                    ))
                  ) : (
                    <div className="text-slate-500 italic text-xs">No explicit route files detected.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Documentation & Demo Verification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-5 border border-border/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Documentation Verification (README)
              </h4>
              <p className="text-xs text-slate-300">
                {report.documentationVerification}
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-border/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center justify-between">
                <span>Demo Video Analysis</span>
                <span className="text-[10px] text-amber-400 font-semibold">PS-02 §7.3 Limitation Disclosure</span>
              </h4>
              <p className="text-xs text-slate-300">
                {report.demoAnalysis}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: AI ANALYSIS & RECOMMENDATIONS */}
      {activeTab === 'ai' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs text-purple-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 shrink-0 text-purple-400" />
            <span>
              <strong>Hard Visual Partition — AI ANALYSIS &amp; RECOMMENDATION:</strong> Evaluated using targeted AI reasoning against normalized project context. All scores explicitly labelled as AI assessments per Section 7.4.
            </span>
          </div>

          {/* Executive Summary */}
          <div className="bg-surface rounded-2xl p-6 border border-border/80 space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              1. Executive Summary
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-background/60 p-4 rounded-xl border border-border/40">
              {report.executiveSummary}
            </p>
          </div>

          {/* Problem, Solution, Target Users */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface rounded-2xl p-5 border border-border/80 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                3. Problem Analysis
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.problemAnalysis}
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-border/80 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                4. Solution Analysis
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.solutionAnalysis}
              </p>
            </div>

            <div className="bg-surface rounded-2xl p-5 border border-border/80 space-y-2">
              <h5 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                5. Target Users (ICP)
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.targetUsers}
              </p>
            </div>
          </div>

          {/* Idea Validation & Market Landscape */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 border border-border/80 space-y-3">
              <div className="flex items-center justify-between">
                <h5 className="text-sm font-bold uppercase tracking-wider text-white">
                  12. Idea Validation Assessment
                </h5>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {report.ideaValidation?.scoreLabel || 'AI-generated assessment'}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.ideaValidation?.reasoning}
              </p>
              <div className="text-xs space-y-1.5 pt-2 border-t border-border/40">
                <div><span className="text-slate-400 font-semibold">Feasibility:</span> <span className="text-slate-300">{report.ideaValidation?.solutionFeasibility}</span></div>
                <div><span className="text-slate-400 font-semibold">Differentiation:</span> <span className="text-slate-300">{report.ideaValidation?.differentiation}</span></div>
              </div>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border/80 space-y-3">
              <h5 className="text-sm font-bold uppercase tracking-wider text-white">
                13. Market / Competitor Analysis
              </h5>
              <p className="text-xs text-slate-300 leading-relaxed">
                {report.marketCompetitorAnalysis}
              </p>
            </div>
          </div>

          {/* Missing Components & Technical Risks */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-2xl p-6 border border-border/80 space-y-3">
              <h5 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>15. Missing Components</span>
              </h5>
              <ul className="space-y-2 text-xs">
                {report.missingComponents?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 bg-rose-950/20 text-rose-300 p-2.5 rounded-lg border border-rose-500/20">
                    <span className="font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-surface rounded-2xl p-6 border border-border/80 space-y-3">
              <h5 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>16. Technical Risks</span>
              </h5>
              <div className="space-y-2.5 text-xs">
                {report.technicalRisks?.map((risk, idx) => (
                  <div key={idx} className="bg-background/80 p-3 rounded-lg border border-border/60">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">{risk.category}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        risk.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {risk.severity}
                      </span>
                    </div>
                    <p className="text-slate-400 text-[11px]">{risk.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Phased Execution Roadmap */}
      {activeTab === 'roadmap' && (
        <PhasedRoadmapBoard phases={report.recommendedExecutionRoadmap?.phases || []} />
      )}

      {/* Tab 5: Raw JSON Platform Export */}
      {activeTab === 'json' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white">Machine-Consumable JSON</h3>
              <p className="text-xs text-slate-400">Direct integration payload for BuildVerse Host Platform Innovation &amp; Execution modules.</p>
            </div>
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md shadow-indigo-600/20"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Raw JSON'}</span>
            </button>
          </div>

          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-4 overflow-x-auto max-h-[600px] font-mono text-xs text-indigo-300">
            <pre>{JSON.stringify(report, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
};
