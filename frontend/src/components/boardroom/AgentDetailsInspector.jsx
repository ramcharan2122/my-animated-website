import React from 'react';
import { useSimulation, AGENT_LIST } from '../../context/SimulationContext';
import { motion } from 'framer-motion';
import { Brain, ShieldCheck, CheckCircle2, ChevronRight, Activity, MessageSquare } from 'lucide-react';

export const AgentDetailsInspector = () => {
  const { selectedAgentKey, agentStatuses } = useSimulation();

  const agentMeta = AGENT_LIST.find((a) => a.key === selectedAgentKey) || AGENT_LIST[0];
  const state = agentStatuses[selectedAgentKey] || {
    status: 'completed',
    confidence: 94,
    reasoning: 'Autonomous context initialized.',
    decision: 'Formulate localized strategy.'
  };

  return (
    <div className="w-full glass-panel-glow border border-indigo-500/20 rounded-3xl p-6 mb-8 shadow-2xl relative">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-4">
          <img
            src={agentMeta.avatar}
            alt={agentMeta.name}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-xl"
          />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">{agentMeta.name}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {agentMeta.key.toUpperCase()} NODE
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">{agentMeta.title}</p>
            <p className="text-[10px] text-cyan-400 font-mono mt-0.5">Focus: {agentMeta.focus}</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-slate-950/80 border border-slate-800">
          <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
          <div className="text-right">
            <div className="text-[10px] font-mono text-slate-400">CONFIDENCE SCORE</div>
            <div className="text-sm font-extrabold text-cyan-300">{state.confidence ? `${state.confidence}%` : '92%'}</div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Neural Reasoning Box */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <h4 className="text-xs font-mono font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Independent Neural Reasoning
          </h4>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {state.reasoning || 'Agent is evaluating macro variables, financial trade-offs, and risk vectors...'}
          </p>
        </div>

        {/* Action Decision Mandate */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
          <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Executive Decision Mandate
          </h4>
          <p className="text-xs text-white font-semibold leading-relaxed font-sans">
            {state.decision || 'Formulating binding executive directive for implementation roadmap.'}
          </p>
        </div>
      </div>
    </div>
  );
};
