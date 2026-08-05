import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';

export const WorkflowTimeline = () => {
  const { currentStep, stepLabel, isRunning } = useSimulation();

  const steps = [
    { num: 1, label: 'Objective Received' },
    { num: 2, label: 'CEO Strategy Plan' },
    { num: 3, label: 'Spawning 8 Agents' },
    { num: 4, label: 'Parallel Reasoning' },
    { num: 5, label: 'Conflict & Debate' },
    { num: 6, label: 'Final Resolution' }
  ];

  return (
    <div className="w-full glass-panel border border-white/10 rounded-2xl p-4 mb-8">
      {/* Step Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-3">
        {steps.map((step) => {
          const isDone = currentStep > step.num;
          const isActive = currentStep === step.num;

          return (
            <div
              key={step.num}
              className={`p-2.5 rounded-xl border flex flex-col items-center text-center transition-all ${
                isDone
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                  : isActive
                  ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.3)] animate-pulse'
                  : 'bg-slate-950/40 border-slate-800 text-slate-500'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : isActive ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-slate-600" />
                )}
                <span className="text-[10px] font-mono font-bold">STEP 0{step.num}</span>
              </div>
              <span className="text-[11px] font-semibold truncate w-full">{step.label}</span>
            </div>
          );
        })}
      </div>

      {/* Dynamic Status Label */}
      {stepLabel && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-cyan-300">
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            {stepLabel}
          </span>
          {isRunning && <span className="text-[10px] text-amber-400 font-bold">PROCESSING...</span>}
        </div>
      )}
    </div>
  );
};
