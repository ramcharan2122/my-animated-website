import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, TrendingUp, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export const DeltaComparisonView = ({ data, onClose }) => {
  if (!data) return null;

  const { simulation1, simulation2 } = data;

  return (
    <div className="w-full glass-panel-glow p-6 rounded-3xl border border-indigo-500/30 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
            <ArrowLeftRight className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Scenario Delta Analysis & Comparison
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                COMPARATIVE EVALUATION
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Analyzing strategic shifts across parameters, risk metrics, and agent decisions
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg bg-slate-900 text-xs text-slate-400 hover:text-white">
            Close Delta
          </button>
        )}
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Run 1 */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-indigo-500/30">
          <div className="text-[10px] font-mono text-indigo-400 uppercase font-bold mb-1">SCENARIO A (BASE)</div>
          <h4 className="text-sm font-bold text-white mb-3">{simulation1.sim.title}</h4>
          
          <div className="space-y-2 text-xs font-mono text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-xl">
            <div>Budget: <span className="text-cyan-300 font-bold">{simulation1.sim.budget}</span></div>
            <div>Timeline: <span className="text-cyan-300 font-bold">{simulation1.sim.timeline}</span></div>
            <div>Location: <span className="text-cyan-300 font-bold">{simulation1.sim.location}</span></div>
            <div>Headcount: <span className="text-cyan-300 font-bold">{simulation1.sim.employees} Staff</span></div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            {simulation1.report?.executive_summary || 'Base executive strategy executed.'}
          </div>
        </div>

        {/* Run 2 */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.15)]">
          <div className="text-[10px] font-mono text-purple-400 uppercase font-bold mb-1">SCENARIO B (MODIFIED)</div>
          <h4 className="text-sm font-bold text-white mb-3">{simulation2.sim.title}</h4>
          
          <div className="space-y-2 text-xs font-mono text-slate-300 mb-4 bg-slate-900/60 p-3 rounded-xl border border-purple-500/20">
            <div>Budget: <span className="text-purple-300 font-bold">{simulation2.sim.budget}</span></div>
            <div>Timeline: <span className="text-purple-300 font-bold">{simulation2.sim.timeline}</span></div>
            <div>Location: <span className="text-purple-300 font-bold">{simulation2.sim.location}</span></div>
            <div>Headcount: <span className="text-purple-300 font-bold">{simulation2.sim.employees} Staff</span></div>
          </div>

          <div className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            {simulation2.report?.executive_summary || 'Modified executive strategy executed.'}
          </div>
        </div>
      </div>
    </div>
  );
};
