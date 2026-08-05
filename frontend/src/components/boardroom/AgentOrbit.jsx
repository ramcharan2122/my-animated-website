import React from 'react';
import { useSimulation, AGENT_LIST } from '../../context/SimulationContext';
import { AgentCard } from './AgentCard';
import { Cpu, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export const AgentOrbit = () => {
  const { selectedAgentKey, setSelectedAgentKey, isRunning, currentStep, activeDebateSpeaker } = useSimulation();

  return (
    <div className="relative w-full glass-panel-glow border border-indigo-500/20 rounded-3xl p-6 mb-8 overflow-hidden shadow-2xl">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Orbit Header */}
      <div className="relative z-10 flex items-center justify-between mb-6 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-cyan-400">
            <Cpu className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              Autonomous Executive Board Matrix
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                9 AGENTS ACTIVE
              </span>
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Click any agent card to inspect independent neural reasoning & decision outputs
            </p>
          </div>
        </div>

        {/* Neural Network Status Pill */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-cyan-400">
          <Activity className="w-3.5 h-3.5 animate-spin" />
          <span>NEURAL GRAPH: SYNCHRONIZED</span>
        </div>
      </div>

      {/* Grid of Agent Cards */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4">
        {AGENT_LIST.map((agent) => (
          <AgentCard
            key={agent.key}
            agent={agent}
            isSelected={selectedAgentKey === agent.key}
            isDebating={activeDebateSpeaker === agent.key}
            onClick={() => setSelectedAgentKey(agent.key)}
          />
        ))}
      </div>
    </div>
  );
};
