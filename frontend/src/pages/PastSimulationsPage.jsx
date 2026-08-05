import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { useNavigate } from 'react-router-dom';
import { DeltaComparisonView } from '../components/simulations/DeltaComparisonView';
import { History, Play, FileText, ArrowLeftRight, Trash2, Calendar, MapPin, DollarSign, Search } from 'lucide-react';

export const PastSimulationsPage = () => {
  const { simulationsHistory, loadSimulation, compareWith, comparedSimulations, setComparedSimulations, fetchHistory } = useSimulation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  const filtered = simulationsHistory.filter(
    (s) => s.title.toLowerCase().includes(search.toLowerCase()) || s.goal.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id) => {
    if (selectedForCompare.includes(id)) {
      setSelectedForCompare(selectedForCompare.filter((i) => i !== id));
    } else {
      if (selectedForCompare.length >= 2) {
        setSelectedForCompare([selectedForCompare[1], id]);
      } else {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  const handleRunCompare = () => {
    if (selectedForCompare.length === 2) {
      compareWith(selectedForCompare[0], selectedForCompare[1]);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-3xl border border-white/10">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-3">
            <History className="w-6 h-6 text-indigo-400" />
            Simulation Vault & Comparative Analysis
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Browse past boardroom runs or select 2 scenarios for comparative delta evaluation
          </p>
        </div>

        {selectedForCompare.length === 2 && (
          <button
            onClick={handleRunCompare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-bold text-xs text-white shadow-xl hover:opacity-90 transition-all animate-bounce"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Compare Selected Scenarios (2)
          </button>
        )}
      </div>

      {/* Delta Comparison Container if Active */}
      {comparedSimulations && (
        <DeltaComparisonView data={comparedSimulations} onClose={() => setComparedSimulations(null)} />
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter past simulations by title, region, or capital..."
          className="w-full bg-slate-950/80 border border-slate-800 rounded-2xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
        />
      </div>

      {/* Simulations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 glass-panel p-12 text-center text-slate-500 font-mono">
            No past simulations recorded in vault.
          </div>
        ) : (
          filtered.map((sim) => {
            const isSelected = selectedForCompare.includes(sim.id);

            return (
              <div
                key={sim.id}
                className={`glass-panel p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : 'border-white/10 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-widest">
                      ID: {sim.id.substring(0, 12)}
                    </span>
                    <h3 className="text-sm font-bold text-white line-clamp-1 mt-0.5">{sim.title}</h3>
                  </div>

                  <button
                    onClick={() => toggleSelect(sim.id)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                      isSelected
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {isSelected ? 'Selected' : '+ Select for Delta'}
                  </button>
                </div>

                {/* Details */}
                <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-slate-300 bg-slate-950/60 p-3 rounded-xl mb-4">
                  <div className="flex items-center gap-1.5 truncate">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>{sim.budget || '₹2 Cr'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span>{sim.location || 'Bangalore'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{sim.timeline || '6 Mo'}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      loadSimulation(sim.id);
                      navigate('/');
                    }}
                    className="flex-1 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/40 text-xs font-mono font-semibold text-indigo-300 hover:bg-indigo-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5" />
                    Load in Boardroom
                  </button>

                  <button
                    onClick={() => {
                      loadSimulation(sim.id);
                      navigate('/reports');
                    }}
                    className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-cyan-400" />
                    Report
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
