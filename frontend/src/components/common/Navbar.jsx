import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSimulation } from '../../context/SimulationContext';
import { GlowingBadge } from './GlowingBadge';
import { Command, Play, ShieldAlert, User, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = ({ onOpenCommandPalette }) => {
  const { user, logout } = useAuth();
  const { isRunning, startSimulation } = useSimulation();
  const [userDropdown, setUserDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 px-6 py-3 flex items-center justify-between">
      {/* Brand logo & tagline */}
      <div className="flex items-center gap-4">
        <div className="relative group flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-0.5 shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-wider text-gradient-primary">
                SHADOWBOARD
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI OS
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-wider">
              AUTONOMOUS EXECUTIVE BOARD
            </p>
          </div>
        </div>
      </div>

      {/* Middle Action Bar */}
      <div className="hidden md:flex items-center gap-4">
        {/* Live Demo Store Link */}
        <a
          href="#/demo-store"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 border border-amber-500/40 text-xs font-mono font-bold text-amber-300 hover:opacity-90 transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <span className="text-sm">🛍️</span>
          <span>Live Demo Store</span>
        </a>

        {/* Status Indicator */}
        <GlowingBadge color={isRunning ? 'amber' : 'emerald'}>
          {isRunning ? 'BOARD IN SESSION' : 'BOARD READY'}
        </GlowingBadge>

        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-400 hover:text-white hover:border-indigo-500/50 transition-all shadow-inner"
        >
          <Command className="w-3.5 h-3.5 text-indigo-400" />
          <span>Quick Actions...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 rounded text-slate-300 border border-slate-700">
            ⌘K
          </kbd>
        </button>

        {/* Instant Simulation Trigger */}
        <button
          disabled={isRunning}
          onClick={() => startSimulation()}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-lg transition-all ${
            isRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 hover:opacity-90 shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95'
          }`}
        >
          <Play className={`w-3.5 h-3.5 fill-current ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Simulating Board...' : 'Run Simulation'}
        </button>
      </div>

      {/* User Profile */}
      <div className="relative">
        <button
          onClick={() => setUserDropdown(!userDropdown)}
          className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'E'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-medium text-slate-200 line-clamp-1">{user?.name || 'Executive User'}</div>
            <div className="text-[10px] font-mono text-slate-400">{user?.role || 'Director'}</div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <AnimatePresence>
          {userDropdown && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute right-0 mt-2 w-56 rounded-xl glass-panel border border-slate-800 p-2 shadow-2xl z-50"
            >
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">{user?.name}</p>
                <p className="text-[10px] font-mono text-slate-400">{user?.email}</p>
                <p className="text-[10px] text-cyan-400 font-mono mt-0.5">{user?.organization}</p>
              </div>

              <button
                onClick={() => {
                  setUserDropdown(false);
                  logout();
                }}
                className="w-full mt-2 flex items-center gap-2 px-3 py-2 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
