import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, ShieldCheck, Zap, Activity } from 'lucide-react';

export const IntroLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [bootText, setBootText] = useState('INITIALIZING AUTONOMOUS KERNEL...');

  useEffect(() => {
    const logs = [
      'INITIALIZING AUTONOMOUS KERNEL...',
      'LOADING NEURAL NETWORK AGENTS (9 NODES)...',
      'ESTABLISHING SECURE GEMINI 2.0 PIPELINE...',
      'SYNCHRONIZING BOARDROOM DECISION GRAPH...',
      'SHADOWBOARD ENTERPRISE AI ONLINE.'
    ];

    let interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        const next = prev + 5;
        const logIndex = Math.min(Math.floor((next / 100) * logs.length), logs.length - 1);
        setBootText(logs[logIndex]);
        return next;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.6 } }}
      className="fixed inset-0 z-50 bg-[#030712] flex flex-col items-center justify-center p-6 select-none"
    >
      <div className="relative flex flex-col items-center max-w-md w-full text-center">
        {/* Animated glowing AI Core sphere */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 animate-spin opacity-40 blur-xl absolute" />
          <div className="w-20 h-20 rounded-full border border-indigo-500/40 bg-slate-900/90 flex items-center justify-center shadow-[0_0_40px_rgba(99,102,241,0.5)]">
            <Cpu className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
        </div>

        <h1 className="text-2xl font-black tracking-widest text-gradient-primary mb-2">
          SHADOWBOARD AI
        </h1>
        <p className="text-xs font-mono text-slate-400 tracking-wider mb-8">
          AUTONOMOUS EXECUTIVE BOARD SYSTEM v3.4
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-full h-2 overflow-hidden mb-4 p-0.5">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 rounded-full shadow-[0_0_12px_#6366f1]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* HUD Text & Percent */}
        <div className="flex items-center justify-between w-full text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            {bootText}
          </span>
          <span className="text-indigo-400 font-bold">{progress}%</span>
        </div>
      </div>
    </motion.div>
  );
};
