import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ExecutiveReportView } from '../components/reports/ExecutiveReportView';
import { FileSpreadsheet, Sparkles } from 'lucide-react';

export const ExecutiveReportsPage = () => {
  const { currentSimulation } = useSimulation();

  return (
    <div className="w-full space-y-6">
      {currentSimulation ? (
        <ExecutiveReportView simulationData={currentSimulation} />
      ) : (
        <div className="glass-panel-glow p-12 rounded-3xl text-center border border-indigo-500/30">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-cyan-400 mx-auto mb-4">
            <FileSpreadsheet className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-lg font-bold text-white mb-2">No Active Strategy Report Selected</h2>
          <p className="text-xs font-mono text-slate-400 max-w-md mx-auto mb-6">
            Run a new boardroom simulation on the main console or load a past scenario from the vault to generate and view executive strategy reports.
          </p>
        </div>
      )}
    </div>
  );
};
