import React from 'react';

export const GlowingBadge = ({ status = 'ONLINE', color = 'cyan', children }) => {
  const colorStyles = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
  };

  const dotColors = {
    cyan: 'bg-cyan-400',
    indigo: 'bg-indigo-400',
    purple: 'bg-purple-400',
    emerald: 'bg-emerald-400',
    rose: 'bg-rose-400',
    amber: 'bg-amber-400'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border backdrop-blur-md ${
        colorStyles[color] || colorStyles.indigo
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full animate-ping ${dotColors[color] || 'bg-indigo-400'}`} />
      {children || status}
    </span>
  );
};
