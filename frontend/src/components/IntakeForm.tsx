import React, { useState } from 'react';
import { GitBranch, FileText, Play, Sparkles, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface IntakeFormProps {
  onSubmit: (formData: any) => void;
  isLoading: boolean;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('AI Memory OS');
  const [githubUrl, setGithubUrl] = useState('https://github.com/Pggamerbgoy/longfun');
  const [description, setDescription] = useState('VS Code extension for workspace intelligence combining AST analysis and vector retrieval.');
  const [demoUrl, setDemoUrl] = useState('');
  const [documentUrls, setDocumentUrls] = useState<string[]>([]);
  const [docInput, setDocInput] = useState('');
  const [showIdeaFields, setShowIdeaFields] = useState(true);

  // Idea validation fields
  const [problem, setProblem] = useState('Developers struggle with context loss and token consumption when using AI coding assistants on large codebases.');
  const [solution] = useState('Hybrid web-tree-sitter AST dependency mapping with local LanceDB vector search for token-efficient retrieval.');
  const [targetUser] = useState('Professional developers and AI coding agents using VS Code.');
  const [targetMarket] = useState('Developer Tooling / AI Agent Infrastructure');
  const [businessModel] = useState('Freemium extension with Pro team cloud sync');

  const handleQuickLoad = () => {
    setName('AI Memory OS');
    setGithubUrl('https://github.com/Pggamerbgoy/longfun');
    setDescription('High-performance workspace intelligence extension for VS Code with continuous AST and vector memory.');
    setDemoUrl('');
  };

  const handleAddDoc = () => {
    if (docInput.trim() && docInput.startsWith('http')) {
      setDocumentUrls([...documentUrls, docInput.trim()]);
      setDocInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      githubUrl,
      description,
      demoUrl: demoUrl || undefined,
      documentUrls,
      problem,
      solution,
      targetUser,
      targetMarket,
      businessModel,
      currentStage: 'Prototype',
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Autonomous Multi-Step Validation Agent</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Verify Project Claims &amp; Generate Roadmap
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto">
          Inspects actual GitHub repositories, extracts discrete assertions from PRDs, cross-verifies code proof, and builds an evidence-backed execution plan.
        </p>

        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={handleQuickLoad}
            className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
          >
            <span>⚡ Quick-load Demo Repo:</span>
            <span className="font-mono font-semibold">Pggamerbgoy/longfun</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl border border-border/80 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Core Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Project Name <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. AI Memory OS"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span>GitHub Repository URL <span className="text-rose-400">*</span></span>
            </label>
            <input
              type="url"
              required
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/owner/repository"
              className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            Project Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief summary of what the project does..."
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Demo Video URL (Optional / Pass-through) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-purple-400" />
              <span>Demo Video URL (Optional)</span>
            </span>
            <span className="text-[11px] text-slate-400">Pass-through inspection</span>
          </label>
          <input
            type="url"
            value={demoUrl}
            onChange={(e) => setDemoUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=... or Loom URL"
            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Attached Documents Input */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>Attached Documents (PRD, Deck URLs)</span>
            </span>
            <span className="text-[11px] text-slate-400">PDF, DOCX, PPTX, MD</span>
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              placeholder="https://example.com/project-prd.pdf"
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddDoc}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-all"
            >
              Add Doc
            </button>
          </div>
          {documentUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {documentUrls.map((url, i) => (
                <span key={i} className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5">
                  <span className="truncate max-w-[200px]">{url}</span>
                  <button
                    type="button"
                    onClick={() => setDocumentUrls(documentUrls.filter((_, idx) => idx !== i))}
                    className="text-slate-400 hover:text-rose-400 font-bold"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Idea Validation Fields */}
        <div className="border border-border/60 rounded-xl overflow-hidden bg-background/50">
          <button
            type="button"
            onClick={() => setShowIdeaFields(!showIdeaFields)}
            className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-slate-300 hover:bg-slate-800/40 transition-colors"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Idea Validation Metadata (Problem, Solution, Target)</span>
            </span>
            {showIdeaFields ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showIdeaFields && (
            <div className="p-4 pt-2 border-t border-border/40 space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 uppercase">Problem Statement</label>
                <textarea
                  rows={2}
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full mt-1 bg-surface border border-border rounded-lg px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Target User (ICP)</label>
                  <input
                    type="text"
                    value={targetUser}
                    className="w-full mt-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-white"
                    readOnly
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 uppercase">Business Model</label>
                  <input
                    type="text"
                    value={businessModel}
                    className="w-full mt-1 bg-surface border border-border rounded-lg px-3 py-1.5 text-xs text-white"
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Security Redaction Pre-Flight Notice */}
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/20 text-xs text-indigo-200">
          <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
          <p>
            <strong>Mandatory Pre-Flight Secret Scrubbing Active:</strong> In-memory Gitleaks regex sweeps run before any code reaches the analysis pipeline. Zero secrets are transmitted or stored.
          </p>
        </div>

        {/* Submit CTA */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg shadow-indigo-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Initializing Autonomous Validation Pipeline...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Launch Build &amp; Validation Agent</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
