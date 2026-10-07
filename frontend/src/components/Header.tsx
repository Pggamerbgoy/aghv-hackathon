import React from 'react';
import { ShieldCheck, Cpu, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  isAnalyzing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, isAnalyzing }) => {
  return (
    <header className="border-b border-border/80 bg-surface/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">BUILDVERSE</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                PS-02 Industry Track
              </span>
            </div>
            <p className="text-xs text-slate-400">Autonomous Build &amp; Validation Agent Layer</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-background px-3 py-1.5 rounded-lg border border-border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>API Gateway: Port 4000 Active</span>
          </div>

          <button
            onClick={onReset}
            disabled={isAnalyzing}
            className="flex items-center gap-1.5 text-xs font-medium px-3.5 py-1.5 rounded-lg bg-surface-elevated hover:bg-slate-700 text-slate-200 border border-slate-600/50 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>New Analysis</span>
          </button>
        </div>
      </div>
    </header>
  );
};
