import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

export const LoginPage = () => {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    try {
      await demoLogin();
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030712] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Mesh */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-cyan-500/20 blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo Branding */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-cyan-400 p-0.5 mx-auto mb-4 shadow-[0_0_30px_rgba(99,102,241,0.5)]">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Cpu className="w-7 h-7 text-cyan-400 animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-black tracking-wider text-gradient-primary">SHADOWBOARD AI</h1>
          <p className="text-xs font-mono text-slate-400 mt-1">AUTONOMOUS EXECUTIVE BOARD OS</p>
        </div>

        {/* Form Panel */}
        <div className="glass-panel-glow border border-indigo-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="scanline" />

          <h2 className="text-lg font-bold text-white mb-6 text-center">Executive Authentication</h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="executive@enterprise.ai"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-slate-300 block mb-1.5">Access Key (Password)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 font-bold text-xs text-white shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Login */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <p className="text-xs text-slate-400 font-mono mb-3">Hackathon Demo Quick Access:</p>
            <button
              onClick={handleDemo}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-xs font-mono font-semibold text-cyan-300 hover:bg-indigo-600/20 transition-all flex items-center justify-center gap-2 shadow-inner"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Instant Executive Demo Login</span>
            </button>
          </div>

          <div className="mt-6 text-center text-xs font-mono text-slate-400">
            Need an executive account?{' '}
            <Link to="/signup" className="text-indigo-400 hover:underline font-bold">
              Register Organization
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
