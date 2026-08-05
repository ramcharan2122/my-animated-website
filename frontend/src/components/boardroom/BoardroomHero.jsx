import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { Play, Sparkles, Sliders, RefreshCw, Compass } from 'lucide-react';
import { ScenarioModifierModal } from './ScenarioModifierModal';

export const BoardroomHero = () => {
  const { scenarioConfig, setScenarioConfig, startSimulation, isRunning } = useSimulation();
  const [goalInput, setGoalInput] = useState(scenarioConfig.goal);
  const [showModifier, setShowModifier] = useState(false);

  const presets = [
    "Launch a Dussehra Sale",
    "Run a Christmas Sale",
    "Launch a Black Friday Sale with 50% discount",
    "Expand our restaurant chain to Bangalore with ₹2 Crore"
  ];

  const handleRun = () => {
    const updated = { ...scenarioConfig, goal: goalInput };
    setScenarioConfig(updated);
    startSimulation(updated);
  };

  return (
    <div className="w-full mb-8">
      {/* Main Glassmorphic Input Console */}
      <div className="relative p-6 rounded-2xl glass-panel-glow border border-indigo-500/30 overflow-hidden shadow-2xl">
        <div className="scanline" />
        
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Compass className="w-4 h-4 text-white animate-spin" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
                Executive Objective Console
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  AUTONOMOUS DISPATCH
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Input your high-level business goal. 9 AI board members will debate & reason in real time.
              </p>
            </div>
          </div>

          {/* Parameters Modifier Button */}
          <button
            onClick={() => setShowModifier(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:border-cyan-500/50 transition-all shadow-md"
          >
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>Tweak Parameters</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {scenarioConfig.budget}
            </span>
          </button>
        </div>

        {/* Textarea Input */}
        <div className="relative mb-4">
          <textarea
            rows={3}
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="Type your executive objective (e.g. 'Expand restaurant chain to Bangalore with ₹2 Crore')..."
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500/80 transition-all font-mono leading-relaxed placeholder-slate-600 shadow-inner"
          />
        </div>

        {/* Action Controls & Presets */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mr-1">Presets:</span>
            {presets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setGoalInput(preset)}
                className="text-[11px] font-mono px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-indigo-300 transition-all text-left truncate max-w-[220px]"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Run Button */}
          <button
            disabled={isRunning || !goalInput.trim()}
            onClick={handleRun}
            className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-xs text-white shadow-xl flex items-center justify-center gap-2 transition-all ${
              isRunning || !goalInput.trim()
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 shadow-[0_0_25px_rgba(99,102,241,0.5)] active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Executive Board Convened...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-cyan-300" />
                <span>Run Autonomous Board</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Scenario Modifier Modal */}
      {showModifier && <ScenarioModifierModal onClose={() => setShowModifier(false)} />}
    </div>
  );
};
