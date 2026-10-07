'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { IntakeForm } from '@/components/IntakeForm';
import { ProgressTracker } from '@/components/ProgressTracker';
import { ReportView } from '@/components/ReportView';
import { ValidationReport } from '@/types';
import { AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:4000';

export default function Home() {
  const [view, setView] = useState<'intake' | 'progress' | 'report'>('intake');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [progressState, setProgressState] = useState<{ stage: string; progress: number; status: string }>({
    stage: 'queued',
    progress: 0,
    status: 'queued',
  });
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startAnalysis = async (formData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Submit to API gateway
      const res = await fetch(`${API_BASE}/projects/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `API error: ${res.status}`);
      }

      const data = await res.json();
      const pId = data.projectId;
      setProjectId(pId);
      setView('progress');
      setIsLoading(false);

      // 2. Poll status every 1.5s
      const interval = setInterval(async () => {
        try {
          const statusRes = await fetch(`${API_BASE}/projects/${pId}/status`);
          if (!statusRes.ok) return;

          const statusData = await statusRes.json();
          setProgressState({
            stage: statusData.stage,
            progress: statusData.progress,
            status: statusData.status,
          });

          if (statusData.status === 'completed') {
            clearInterval(interval);
            // Fetch completed report
            const reportRes = await fetch(`${API_BASE}/projects/${pId}/report`);
            if (reportRes.ok) {
              const rep = await reportRes.json();
              setReport(rep);
              setView('report');
            }
          } else if (statusData.status === 'failed') {
            clearInterval(interval);
            setError(statusData.error || 'Analysis pipeline encountered a failure.');
            setView('intake');
          }
        } catch (err: any) {
          console.warn('Polling error:', err);
        }
      }, 1500);

    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message || 'Failed to connect to BuildVerse backend on port 4000.');
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setView('intake');
    setProjectId(null);
    setReport(null);
    setError(null);
    setProgressState({ stage: 'queued', progress: 0, status: 'queued' });
  };

  return (
    <div className="min-h-screen bg-background text-slate-100 flex flex-col">
      <Header onReset={handleReset} isAnalyzing={view === 'progress'} />

      <main className="flex-1">
        {error && (
          <div className="max-w-4xl mx-auto mt-6 px-4">
            <div className="bg-rose-950/40 border border-rose-500/30 rounded-xl p-4 text-xs text-rose-300 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <strong>Error: </strong> {error}
              </div>
            </div>
          </div>
        )}

        {view === 'intake' && (
          <IntakeForm onSubmit={startAnalysis} isLoading={isLoading} />
        )}

        {view === 'progress' && (
          <ProgressTracker
            stage={progressState.stage}
            progress={progressState.progress}
            status={progressState.status}
          />
        )}

        {view === 'report' && report && (
          <ReportView report={report} />
        )}
      </main>

      <footer className="border-t border-border/60 py-6 text-center text-xs text-slate-500 bg-surface/50">
        <p>AHGV BUILDVERSE 2026 · Problem Statement PS-02 (Industry Track) · Build &amp; Validation Agent Engine</p>
      </footer>
    </div>
  );
}
