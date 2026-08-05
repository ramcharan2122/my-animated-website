import React, { useRef, useEffect } from 'react';
import { useSimulation, AGENT_LIST } from '../../context/SimulationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquareCode, ShieldAlert, Sparkles, Flame, CheckCircle2 } from 'lucide-react';

export const LiveDebateFeed = () => {
  const { liveDebateMessages, isRunning, activeDebateSpeaker } = useSimulation();
  const feedEndRef = useRef(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveDebateMessages]);

  return (
    <div className="w-full glass-panel-glow border border-indigo-500/20 rounded-3xl p-6 mb-8 shadow-2xl relative overflow-hidden">
      <div className="scanline" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
            <Flame className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Autonomous Debate & Conflict Resolution Feed
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                LIVE INTER ACTION
              </span>
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Agents challenge each other's parameters to optimize trade-offs before final CEO synthesis
            </p>
          </div>
        </div>

        {isRunning && (
          <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            STREAMING DEBATE
          </span>
        )}
      </div>

      {/* Debate Messages Stream */}
      <div className="space-y-4 max-h-80 overflow-y-auto pr-2 font-mono text-xs">
        {liveDebateMessages.length === 0 ? (
          <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
            <MessageSquareCode className="w-8 h-8 text-slate-700 animate-pulse" />
            <p>Run a simulation to observe real-time agent debates and resolution protocol.</p>
          </div>
        ) : (
          <AnimatePresence>
            {liveDebateMessages.map((msg, idx) => {
              const speakerMeta = AGENT_LIST.find((a) => a.key === msg.speaker_key) || {
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
                color: '#6366f1'
              };

              const isSynthesis = msg.debate_type === 'synthesis' || msg.speaker_key === 'ceo';

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    isSynthesis
                      ? 'bg-indigo-950/60 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={speakerMeta.avatar}
                      alt={msg.speaker_name}
                      className="w-8 h-8 rounded-xl object-cover border border-white/10"
                    />

                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-xs">{msg.speaker_name}</span>
                          <span className="text-[10px] text-slate-400">({msg.speaker_role})</span>
                        </div>
                        <span
                          className={`text-[9px] uppercase px-2 py-0.5 rounded font-semibold ${
                            msg.debate_type === 'challenge'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : msg.debate_type === 'rebuttal'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {msg.debate_type || 'DEBATE'}
                        </span>
                      </div>

                      <p className="text-slate-200 text-xs leading-relaxed font-sans mt-1">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={feedEndRef} />
      </div>
    </div>
  );
};
