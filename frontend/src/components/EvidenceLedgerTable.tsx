import React, { useState } from 'react';
import { Evidence, VerificationStatus } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, XCircle, HelpCircle, ChevronDown, ChevronUp, FileCode } from 'lucide-react';

interface EvidenceLedgerTableProps {
  evidence: Evidence[];
}

export const EvidenceLedgerTable: React.FC<EvidenceLedgerTableProps> = ({ evidence }) => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getStatusBadge = (status: VerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified</span>
          </span>
        );
      case 'Partially Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Partially Verified</span>
          </span>
        );
      case 'Not Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3.5 h-3.5" />
            <span>Not Verified</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Insufficient Evidence</span>
          </span>
        );
    }
  };

  const filteredEvidence = evidence.filter(item => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || item.category === categoryFilter;
    return matchesStatus && matchesCategory;
  });

  const counts = {
    all: evidence.length,
    verified: evidence.filter(e => e.status === 'Verified').length,
    partial: evidence.filter(e => e.status === 'Partially Verified').length,
    notVerified: evidence.filter(e => e.status === 'Not Verified').length,
    insufficient: evidence.filter(e => e.status === 'Insufficient Evidence').length,
  };

  return (
    <div className="space-y-6">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
            <span>Cross-Verification Evidence Ledger</span>
          </h3>
          <p className="text-xs text-slate-400">
            Discrete assertions extracted from documentation cross-verified against repository code artifacts.
          </p>
        </div>

        {/* Status Filter Chips */}
        <div className="flex flex-wrap gap-1.5 bg-background p-1.5 rounded-xl border border-border/80">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'ALL' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setStatusFilter('Verified')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'Verified' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400/80 hover:text-emerald-300'
            }`}
          >
            Verified ({counts.verified})
          </button>
          <button
            onClick={() => setStatusFilter('Partially Verified')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'Partially Verified' ? 'bg-amber-600 text-white font-bold' : 'text-amber-400/80 hover:text-amber-300'
            }`}
          >
            Partial ({counts.partial})
          </button>
          <button
            onClick={() => setStatusFilter('Not Verified')}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'Not Verified' ? 'bg-rose-600 text-white font-bold' : 'text-rose-400/80 hover:text-rose-300'
            }`}
          >
            Not Verified ({counts.notVerified})
          </button>
        </div>
      </div>

      {/* Ledger Items List */}
      <div className="space-y-3">
        {filteredEvidence.length === 0 ? (
          <div className="p-8 text-center bg-surface-elevated/20 rounded-xl border border-border/40 text-slate-400 text-sm">
            No claims matching the selected filter criteria.
          </div>
        ) : (
          filteredEvidence.map((item, index) => {
            const isExpanded = expandedId === (item.id || String(index));
            const itemId = item.id || String(index);

            return (
              <div
                key={itemId}
                className="bg-surface rounded-xl border border-border/70 hover:border-slate-600 transition-all overflow-hidden"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : itemId)}
                  className="p-4 sm:p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/30"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      {getStatusBadge(item.status)}
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        {item.category}
                      </span>
                      {item.citations.length > 0 && (
                        <span className="text-[10px] text-slate-400 flex items-center gap-1">
                          <FileCode className="w-3 h-3 text-indigo-400" />
                          <span>{item.citations.length} Citation{item.citations.length > 1 ? 's' : ''}</span>
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white leading-snug">
                      "{item.claim}"
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                      {item.reasoning}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right hidden sm:block">
                      <span className="text-xs font-mono font-semibold text-slate-300">
                        {Math.round((item.confidence || 0.85) * 100)}%
                      </span>
                      <p className="text-[10px] text-slate-500 uppercase">Confidence</p>
                    </div>

                    <div className="p-1 rounded bg-slate-800 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Citations & Evidence Proof */}
                {isExpanded && (
                  <div className="p-4 bg-background/80 border-t border-border/60 text-xs space-y-3">
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                        Detailed Verification Reasoning:
                      </span>
                      <p className="text-slate-300 leading-relaxed bg-surface p-3 rounded-lg border border-border/50">
                        {item.reasoning}
                      </p>
                    </div>

                    {item.citations && item.citations.length > 0 ? (
                      <div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Verified Code &amp; Config Citations:
                        </span>
                        <div className="space-y-2">
                          {item.citations.map((c, cIdx) => (
                            <div key={cIdx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px]">
                              <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
                                <FileCode className="w-3.5 h-3.5" />
                                <span>{c.target}</span>
                                {c.lineRange && <span className="text-slate-500">({c.lineRange})</span>}
                              </div>
                              {c.snippet && (
                                <p className="text-slate-400 text-[10px] overflow-x-auto whitespace-pre-wrap">
                                  {c.snippet}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-[11px]">
                        No direct file citations found in repository for this assertion.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
