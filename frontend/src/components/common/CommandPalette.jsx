import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, LayoutDashboard, History, FileSpreadsheet, Settings, Play, X, Sparkles } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { startSimulation } = useSimulation();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onClose ? onClose(!isOpen) : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      title: 'Run New Executive Simulation',
      desc: 'Formulate strategy across 9 AI board agents',
      icon: Play,
      action: () => {
        onClose();
        startSimulation();
      }
    },
    {
      title: 'Navigate to Boardroom Hub',
      desc: 'Live Orbiting Agent Core & Debate Feed',
      icon: LayoutDashboard,
      action: () => {
        onClose();
        navigate('/');
      }
    },
    {
      title: 'View Past Boardroom Simulations',
      desc: 'Historical vault & scenario comparisons',
      icon: History,
      action: () => {
        onClose();
        navigate('/simulations');
      }
    },
    {
      title: 'View Executive Strategy Reports',
      desc: 'Detailed KPIs, ROI charts, and PDF download',
      icon: FileSpreadsheet,
      action: () => {
        onClose();
        navigate('/reports');
      }
    },
    {
      title: 'Configure AI Models & Parameters',
      desc: 'Gemini API Settings & Agent Weights',
      icon: Settings,
      action: () => {
        onClose();
        navigate('/settings');
      }
    }
  ];

  const filteredActions = actions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) || a.desc.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full max-w-xl glass-panel-glow border border-indigo-500/40 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Search Header */}
          <div className="p-4 border-b border-slate-800 flex items-center gap-3">
            <Search className="w-5 h-5 text-indigo-400" />
            <input
              type="text"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search boardroom actions..."
              className="w-full bg-transparent text-sm text-white focus:outline-none placeholder-slate-500 font-medium"
            />
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Commands List */}
          <div className="p-2 max-h-80 overflow-y-auto space-y-1">
            {filteredActions.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-mono">No matching commands found.</div>
            ) : (
              filteredActions.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-600/20 border border-transparent hover:border-indigo-500/30 transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 group-hover:text-cyan-400 group-hover:border-indigo-500/50 transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200 group-hover:text-white">{item.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.desc}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 text-slate-400 group-hover:text-indigo-300">
                      Press ↵
                    </span>
                  </button>
                );
              })
            )}
          </div>

          <div className="p-2.5 bg-slate-950/80 border-t border-slate-900 text-[10px] font-mono text-slate-500 flex items-center justify-between px-4">
            <span>SHADOWBOARD ENTERPRISE COMMAND PALETTE</span>
            <span>ESC to close</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
