import React from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { motion } from 'framer-motion';
import { Brain, CheckCircle2, MessageSquare, Flame, AlertCircle } from 'lucide-react';

export const AgentCard = ({ agent, isSelected, onClick, isDebating }) => {
  const { agentStatuses } = useSimulation();

  const state = agentStatuses[agent.key] || { status: 'idle', confidence: 0, reasoning: '', decision: '' };
  const isThinking = state.status === 'thinking';
  const isReasoned = state.status === 'reasoned';
  const isCompleted = state.status === 'completed';

  const statusColors = {
    idle: 'border-slate-800 text-slate-500',
    thinking: 'border-amber-500/50 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]',
    debating: 'border-rose-500/80 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.5)] animate-pulse',
    reasoned: 'border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
    completed: 'border-indigo-500/40 text-indigo-300'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      onClick={onClick}
      className={`relative cursor-pointer rounded-2xl p-3.5 backdrop-blur-xl transition-all duration-300 ${
        isSelected
          ? 'glass-panel-glow border-2 border-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.4)]'
          : `glass-panel border ${statusColors[state.status] || 'border-slate-800'}`
      }`}
    >
      {/* Top Bar: Avatar & Role */}
      <div className="flex items-center gap-3 mb-2.5">
        <div className="relative">
          <img
            src={agent.avatar}
            alt={agent.name}
            className="w-10 h-10 rounded-xl object-cover border border-white/10 shadow-md"
          />
          {isThinking && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping border border-slate-900" />
          )}
          {isDebating && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 animate-bounce border border-slate-900" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <h4 className="text-xs font-bold text-white truncate">{agent.name}</h4>
            <span className="text-[10px] font-mono font-bold text-indigo-400">
              {state.confidence ? `${state.confidence}%` : '--'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono truncate">{agent.title}</p>
        </div>
      </div>

      {/* Status Pill */}
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
        <span
          className={`text-[9px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${
            isDebating
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              : isThinking
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
          }`}
        >
          {isDebating ? (
            <>
              <Flame className="w-3 h-3 text-rose-400 animate-bounce" /> DEBATING
            </>
          ) : isThinking ? (
            <>
              <Brain className="w-3 h-3 text-amber-400 animate-spin" /> THINKING
            </>
          ) : (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" /> DECIDED
            </>
          )}
        </span>

        {/* Confidence Ring Bar */}
        <div className="w-12 bg-slate-900 rounded-full h-1.5 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 rounded-full transition-all duration-500"
            style={{ width: `${state.confidence || 0}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
};
