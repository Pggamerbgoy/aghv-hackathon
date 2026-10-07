import React from 'react';
import { CheckCircle2, Clock, Loader2, GitBranch, FileSearch, ShieldCheck, FileSpreadsheet, Map } from 'lucide-react';

interface ProgressTrackerProps {
  stage: string;
  progress: number;
  status: string;
}

const STAGES = [
  { id: 'repository_analysis', label: 'Repository Intelligence', icon: GitBranch, desc: 'Static Trees API inspection, AST route & dependency mapping' },
  { id: 'document_analysis', label: 'Document Intelligence', icon: FileSearch, desc: 'Extracting discrete verifiable assertions from docs & README' },
  { id: 'claim_verification', label: 'Cross-Verification & Ledger', icon: ShieldCheck, desc: 'Matching assertions to repository evidence; generating citations' },
  { id: 'report_generation', label: '19-Section Report Assembly', icon: FileSpreadsheet, desc: 'Fact vs AI separation, health scoring, and risk classification' },
  { id: 'roadmap_generation', label: 'Phased Execution Roadmap', icon: Map, desc: 'Generating 5-phase dependency-aware roadmap for missing modules' },
];

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ stage, progress, status }) => {
  const getStageIndex = (currentStage: string) => {
    if (currentStage === 'completed') return STAGES.length;
    const idx = STAGES.findIndex(s => s.id === currentStage);
    return idx === -1 ? 0 : idx;
  };

  const currentIndex = getStageIndex(stage);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="bg-surface border border-border/80 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping"></span>
              <h2 className="text-xl font-bold text-white">Validation Pipeline In Progress</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-step deterministic inspection &amp; targeted AI reasoning running asynchronously.
            </p>
          </div>

          <div className="text-right">
            <span className="text-2xl font-mono font-extrabold text-indigo-400">{progress}%</span>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Stage Progress</p>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-background rounded-full h-2.5 mb-8 overflow-hidden p-0.5 border border-border/60">
          <div
            className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm shadow-indigo-500/50"
            style={{ width: `${Math.max(5, progress)}%` }}
          ></div>
        </div>

        {/* Stage Steps List */}
        <div className="space-y-4">
          {STAGES.map((s, index) => {
            const isCompleted = index < currentIndex || stage === 'completed';
            const isCurrent = index === currentIndex && stage !== 'completed';
            const Icon = s.icon;

            return (
              <div
                key={s.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-md shadow-indigo-500/5'
                    : isCompleted
                    ? 'bg-surface-elevated/40 border-emerald-500/20'
                    : 'bg-background/40 border-border/40 opacity-50'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center border border-slate-700">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isCurrent ? 'text-indigo-400' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`} />
                    <span className={`text-sm font-semibold ${isCurrent ? 'text-white' : isCompleted ? 'text-slate-200' : 'text-slate-400'}`}>
                      {s.label}
                    </span>
                    {isCurrent && (
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Active Stage
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
