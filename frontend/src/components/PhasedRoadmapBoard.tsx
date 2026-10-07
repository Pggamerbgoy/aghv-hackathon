import React, { useState } from 'react';
import { RoadmapPhase, RoadmapTask } from '../types';
import { Map, ArrowRight, User, CheckSquare, Layers } from 'lucide-react';

interface PhasedRoadmapBoardProps {
  phases: RoadmapPhase[];
}

export const PhasedRoadmapBoard: React.FC<PhasedRoadmapBoardProps> = ({ phases }) => {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);

  if (!phases || phases.length === 0) {
    return (
      <div className="p-8 text-center bg-surface rounded-xl border border-border text-slate-400">
        No roadmap generated yet.
      </div>
    );
  }

  const activePhase = phases.find(p => p.order === selectedPhase) || phases[0];

  const getOwnerBadge = (owner: string) => {
    const o = owner.toLowerCase();
    if (o.includes('frontend')) return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
    if (o.includes('backend')) return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    if (o.includes('devops')) return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    if (o.includes('product')) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Map className="w-5 h-5 text-indigo-400" />
          <span>Recommended Phased Execution Roadmap</span>
        </h3>
        <p className="text-xs text-slate-400">
          Concrete, dependency-aware implementation plan directly derived from missing codebase components.
        </p>
      </div>

      {/* Phase Selection Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {phases.map((phase) => {
          const isSelected = phase.order === selectedPhase;
          return (
            <button
              key={phase.order}
              onClick={() => setSelectedPhase(phase.order)}
              className={`p-3 rounded-xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-surface hover:bg-slate-800/60 border-border/70 text-slate-400'
              }`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                Phase {phase.order}
              </div>
              <div className="text-xs font-semibold mt-0.5 truncate text-slate-200">
                {phase.name.replace(/^Phase \d+:\s*/, '')}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                {phase.tasks.length} Task{phase.tasks.length !== 1 ? 's' : ''}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Tasks Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            <span>{activePhase.name}</span>
          </h4>
          <span className="text-xs text-slate-400">
            {activePhase.tasks.length} actionable work items
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activePhase.tasks.map((task: RoadmapTask, idx: number) => (
            <div
              key={task.id || idx}
              className="bg-surface rounded-xl border border-border/80 p-5 space-y-3 hover:border-slate-600 transition-all shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <h5 className="text-sm font-bold text-white leading-snug">
                  {task.task}
                </h5>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${getOwnerBadge(task.owner)}`}>
                  {task.owner}
                </span>
              </div>

              {/* Justification tied to analysis findings */}
              <div className="text-xs bg-background/80 p-2.5 rounded-lg border border-border/40 text-slate-300">
                <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                  Why It Matters (Analysis Finding):
                </span>
                {task.why}
              </div>

              {/* Dependencies */}
              {task.dependency && task.dependency.length > 0 && (
                <div className="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500 font-semibold">Prerequisites:</span>
                  {task.dependency.map((dep, dIdx) => (
                    <span key={dIdx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] border border-slate-700">
                      {dep}
                    </span>
                  ))}
                </div>
              )}

              {/* Expected Output & Verification Criteria */}
              <div className="grid grid-cols-1 gap-2 pt-1 border-t border-border/40 text-[11px]">
                <div>
                  <span className="text-slate-500 font-semibold flex items-center gap-1">
                    <Layers className="w-3 h-3 text-indigo-400" />
                    <span>Expected Artifact:</span>
                  </span>
                  <span className="font-mono text-slate-300 text-[10px] block mt-0.5">{task.expectedOutput}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold flex items-center gap-1">
                    <CheckSquare className="w-3 h-3 text-emerald-400" />
                    <span>Verification Criteria:</span>
                  </span>
                  <span className="text-slate-300 text-[10px] block mt-0.5">{task.verificationCriteria}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
