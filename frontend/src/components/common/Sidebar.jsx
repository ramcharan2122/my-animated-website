import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, History, FileSpreadsheet, Settings, Bot, Sparkles, Activity } from 'lucide-react';
import { useSimulation } from '../../context/SimulationContext';

export const Sidebar = () => {
  const { isRunning } = useSimulation();

  const navItems = [
    { path: '/', label: 'Boardroom Hub', icon: LayoutDashboard },
    { path: '/simulations', label: 'Past Simulations', icon: History },
    { path: '/reports', label: 'Executive Reports', icon: FileSpreadsheet },
    { path: '/settings', label: 'AI Configuration', icon: Settings },
    { path: '/demo-store', label: '🛍️ Live Demo Store', icon: Sparkles }
  ];

  return (
    <aside className="w-64 glass-panel border-r border-white/10 hidden lg:flex flex-col justify-between p-4 min-h-[calc(100vh-61px)] select-none">
      {/* Upper Navigation Links */}
      <div className="space-y-6">
        <div className="px-3 pt-2">
          <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold mb-3">
            Autonomous Board Core
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/30 text-white border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-indigo-400" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Live System Diagnostics Box */}
        <div className="px-3">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 relative overflow-hidden">
            <div className="scanline" />
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-3 h-3 animate-pulse" />
                NEURAL MONITOR
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <p className="text-[11px] text-slate-300 font-medium mb-1">9 Autonomous Agents</p>
            <p className="text-[10px] text-slate-500 leading-relaxed font-mono">
              Parallel execution pool active. Conflict debate engine online.
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding Info */}
      <div className="px-3 py-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-500 flex items-center justify-between">
        <span>SHADOWBOARD AI v3.4</span>
        <span className="text-indigo-400">GEMINI 2.0</span>
      </div>
    </aside>
  );
};
