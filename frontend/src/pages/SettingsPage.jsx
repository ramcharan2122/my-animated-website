import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Settings, Key, Cpu, Sliders, ShieldCheck, Check, RefreshCw } from 'lucide-react';

export const SettingsPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [geminiModel, setGeminiModel] = useState('gemini-1.5-flash');
  const [riskSensitivity, setRiskSensitivity] = useState('balanced');
  const [hasCustomKey, setHasCustomKey] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    api.getSettings()
      .then((res) => {
        if (res.settings) {
          setGeminiModel(res.settings.geminiModel || 'gemini-1.5-flash');
          setRiskSensitivity(res.settings.riskSensitivity || 'balanced');
          setHasCustomKey(res.settings.hasCustomKey);
        }
      })
      .catch((err) => console.warn('Error fetching settings:', err));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await api.updateSettings({
        apiKey: apiKey.trim() || undefined,
        geminiModel,
        riskSensitivity
      });
      setHasCustomKey(res.settings.hasCustomKey);
      setSavedMessage('Settings updated successfully.');
      setTimeout(() => setSavedMessage(''), 3000);
    } catch (err) {
      alert(`Failed to save settings: ${err.message}`);
    }
  };

  return (
    <div className="w-full max-w-3xl space-y-6">
      {/* Header */}
      <div className="glass-panel p-6 rounded-3xl border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-cyan-400">
            <Settings className="w-5 h-5 animate-spin" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-white">System Configuration & AI Settings</h1>
            <p className="text-xs text-slate-400 font-mono">
              Manage Google Gemini API keys, LLM model choice, and risk sensitivity parameters
            </p>
          </div>
        </div>
      </div>

      {savedMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4" />
          {savedMessage}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="glass-panel-glow p-8 rounded-3xl border border-indigo-500/30 space-y-6">
        {/* Gemini API Key */}
        <div>
          <label className="text-xs font-mono text-slate-200 block mb-2 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Key className="w-4 h-4 text-cyan-400" />
              Google Gemini API Key
            </span>
            <span className={`text-[10px] ${hasCustomKey ? 'text-emerald-400 font-bold' : 'text-slate-500'}`}>
              {hasCustomKey ? 'CONNECTED' : 'USING SYNTHETIC ENGINE FALLBACK'}
            </span>
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={hasCustomKey ? '••••••••••••••••••••••••' : 'Enter AIzaSy... key to connect live Gemini API'}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
          <p className="text-[10px] text-slate-400 font-mono mt-1.5">
            Key is held securely in server memory environment. Leave blank to retain existing key.
          </p>
        </div>

        {/* Model Selection */}
        <div>
          <label className="text-xs font-mono text-slate-200 block mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            Gemini Core Model Architecture
          </label>
          <select
            value={geminiModel}
            onChange={(e) => setGeminiModel(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
          >
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra High Speed)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Strategic Reasoning)</option>
            <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash Experimental</option>
          </select>
        </div>

        {/* Risk Sensitivity */}
        <div>
          <label className="text-xs font-mono text-slate-200 block mb-2 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            Boardroom Risk Tolerance Threshold
          </label>
          <div className="grid grid-cols-3 gap-3">
            {['aggressive', 'balanced', 'conservative'].map((mode) => (
              <button
                type="button"
                key={mode}
                onClick={() => setRiskSensitivity(mode)}
                className={`p-3 rounded-xl border text-xs font-mono capitalize transition-all ${
                  riskSensitivity === mode
                    ? 'bg-indigo-600/30 border-indigo-500 text-white font-bold shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-xl hover:opacity-90 transition-all flex items-center gap-2"
        >
          <Check className="w-4 h-4" />
          Save System Configuration
        </button>
      </form>
    </div>
  );
};
