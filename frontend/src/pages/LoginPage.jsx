import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, Cpu, KeyRound, CheckCircle2, Github, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginPage = () => {
  const { initiateLogin, verifyOtp, demoLogin, loginWithGithub } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // GitHub Modal state
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [githubInput, setGithubInput] = useState('ramcharan2122');
  const [githubError, setGithubError] = useState('');

  const handleInitiate = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await initiateLogin(email, password);
      if (res.requiresOtp) {
        setOtpStep(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await verifyOtp(email, otpCode);
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGithubSubmit = async (e) => {
    e.preventDefault();
    setGithubError('');
    setLoading(true);
    try {
      await loginWithGithub(githubInput);
      setShowGithubModal(false);
      navigate('/');
    } catch (err) {
      setGithubError(err.message);
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

          <h2 className="text-lg font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <span>{otpStep ? '2FA Email OTP Verification' : 'Executive Authentication'}</span>
          </h2>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono text-center">
              {error}
            </div>
          )}

          {/* Real Email OTP Notification Banner - NO ON-SCREEN OTP CODE */}
          {otpStep && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-cyan-500/20 border border-cyan-500/40 text-center space-y-2 shadow-lg">
              <div className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider flex items-center justify-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 animate-bounce" />
                <span>OTP CODE SENT TO YOUR EMAIL</span>
              </div>
              <p className="text-xs text-slate-300 font-mono leading-relaxed">
                A 6-digit verification code has been dispatched to <span className="text-white font-bold">{email}</span>. Please check your email inbox and enter the code below.
              </p>
            </div>
          )}

          <AnimatePresence mode="wait">
            {!otpStep ? (
              /* Step 1: Work Email & Password */
              <motion.form
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onSubmit={handleInitiate}
                className="space-y-4"
              >
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
                  <span>Send OTP to Email Inbox</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Real GitHub Account Sign In Trigger */}
                <button
                  type="button"
                  onClick={() => setShowGithubModal(true)}
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <Github className="w-4 h-4 text-cyan-400" />
                  <span>Sign In with GitHub Account</span>
                </button>
              </motion.form>
            ) : (
              /* Step 2: Enter 6-digit OTP received in email */
              <motion.form
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleVerifyOtp}
                className="space-y-4"
              >
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5">Enter 6-Digit Email OTP Code</label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-amber-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="Enter code from email inbox"
                      className="w-full bg-slate-950/80 border border-amber-500/50 rounded-xl py-3 pl-10 pr-4 text-base font-bold text-cyan-300 tracking-widest focus:outline-none focus:border-cyan-400 font-mono text-center"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 font-bold text-xs text-white shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Submit Email OTP & Authenticate Session</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setOtpStep(false);
                    setOtpCode('');
                    setError('');
                  }}
                  className="w-full py-2 text-xs font-mono text-slate-400 hover:text-white transition-colors"
                >
                  ← Back to Email & Password
                </button>
              </motion.form>
            )}
          </AnimatePresence>

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

      {/* GitHub Account Connect Modal */}
      <AnimatePresence>
        {showGithubModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-2xl relative"
            >
              <button
                onClick={() => setShowGithubModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400">
                  <Github className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-white">Sign In with GitHub</h3>
                  <p className="text-xs text-slate-400 font-mono">Authenticate using your real GitHub account profile</p>
                </div>
              </div>

              {githubError && (
                <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                  {githubError}
                </div>
              )}

              <form onSubmit={handleGithubSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono text-slate-300 block mb-1.5">
                    GitHub Username or Personal Access Token (PAT)
                  </label>
                  <input
                    type="text"
                    required
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="ramcharan2122 or ghp_..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    Fetches your real GitHub profile avatar, username, and repository list (`ramcharan2122/my-animated-website`).
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-xs font-bold text-white shadow-xl hover:opacity-90 transition-all flex items-center justify-center gap-2"
                >
                  <Github className="w-4 h-4" />
                  <span>Authenticate & Link GitHub Account</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
