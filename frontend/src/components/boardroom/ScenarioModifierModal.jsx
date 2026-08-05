import React, { useState } from 'react';
import { useSimulation } from '../../context/SimulationContext';
import { motion } from 'framer-motion';
import { Sliders, X, DollarSign, Calendar, MapPin, Users, Megaphone, Check } from 'lucide-react';

export const ScenarioModifierModal = ({ onClose }) => {
  const { scenarioConfig, setScenarioConfig, startSimulation, isRunning } = useSimulation();

  const [form, setForm] = useState({ ...scenarioConfig });

  const handleSaveAndRun = () => {
    setScenarioConfig(form);
    onClose();
    startSimulation(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg glass-panel-glow border border-indigo-500/40 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Scenario Parameter Matrix</h3>
              <p className="text-[10px] font-mono text-slate-400">Modify operational variables to re-simulate boardroom decisions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Inputs */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Budget */}
          <div>
            <label className="text-xs font-mono text-slate-300 flex items-center gap-2 mb-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              Capital Budget
            </label>
            <input
              type="text"
              value={form.budget}
              onChange={(e) => setForm({ ...form, budget: e.target.value })}
              placeholder="e.g. ₹2 Crore or $500,000"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Timeline */}
          <div>
            <label className="text-xs font-mono text-slate-300 flex items-center gap-2 mb-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Execution Horizon (Timeline)
            </label>
            <input
              type="text"
              value={form.timeline}
              onChange={(e) => setForm({ ...form, timeline: e.target.value })}
              placeholder="e.g. 6 Months"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-xs font-mono text-slate-300 flex items-center gap-2 mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              Target Geography / Region
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="e.g. Bangalore, India"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {/* Employees */}
          <div>
            <label className="text-xs font-mono text-slate-300 flex items-center justify-between mb-1.5">
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                Headcount Allocation
              </span>
              <span className="text-cyan-400 font-bold">{form.employees} Staff</span>
            </label>
            <input
              type="range"
              min={5}
              max={200}
              value={form.employees}
              onChange={(e) => setForm({ ...form, employees: parseInt(e.target.value) })}
              className="w-full accent-indigo-500 bg-slate-900"
            />
          </div>

          {/* Marketing Spend */}
          <div>
            <label className="text-xs font-mono text-slate-300 flex items-center gap-2 mb-1.5">
              <Megaphone className="w-3.5 h-3.5 text-pink-400" />
              Marketing Allocation
            </label>
            <input
              type="text"
              value={form.marketingSpend}
              onChange={(e) => setForm({ ...form, marketingSpend: e.target.value })}
              placeholder="e.g. ₹50 Lakhs"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-xs text-slate-400 hover:text-white font-mono">
            Cancel
          </button>
          <button
            onClick={handleSaveAndRun}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-lg flex items-center gap-2 hover:opacity-90 transition-all"
          >
            <Check className="w-4 h-4" />
            Apply & Re-Run Boardroom
          </button>
        </div>
      </motion.div>
    </div>
  );
};
