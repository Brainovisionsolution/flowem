import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('admin@flowem-enterprise.net');
  const [password, setPassword] = useState('••••••••••••');
  const [company, setCompany] = useState('Acme Global Inc.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      onSuccess();
      onClose();
    }, 600);
  };

  const fillDemoAdmin = () => {
    setEmail('a.wright@flowem-systems.com');
    setPassword('FlowEM_Production_2026!');
    setCompany('FlowEM Global Systems');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
      <div 
        className="relative w-full max-w-md rounded-2xl glass-panel p-8 shadow-2xl border border-white/10"
        style={{
          background: 'linear-gradient(145deg, rgba(17, 24, 39, 0.92) 0%, rgba(10, 16, 31, 0.96) 100%)',
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-glow-indigo">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-wide text-white">FlowEM Console</h2>
            <p className="text-xs text-slate-400">High-Throughput Bulk Dispatch Infrastructure</p>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 mb-6 rounded-lg bg-slate-900/80 border border-slate-800">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Authenticate
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`flex-1 py-2 text-xs font-medium rounded-md transition-all ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Request Enterprise Access
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Organization / Entity Name
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full glass-input rounded-lg pl-10 pr-3 py-2.5 text-sm"
                  placeholder="Acme Global Corporation"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Work Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full glass-input rounded-lg pl-10 pr-3 py-2.5 text-sm"
                placeholder="name@company.com"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Security Passcode
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  className="text-xs text-indigo-400 hover:text-indigo-300"
                >
                  Reset Key?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full glass-input rounded-lg pl-10 pr-3 py-2.5 text-sm"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium text-sm transition-all shadow-glow-indigo border border-indigo-400/30 disabled:opacity-50"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                  Validating Credentials...
                </span>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to Console' : 'Initialize Enterprise Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Fast Track */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400 mb-3">Enterprise Demonstration Access</p>
          <button
            type="button"
            onClick={() => {
              fillDemoAdmin();
              setTimeout(() => {
                onSuccess();
                onClose();
              }, 300);
            }}
            className="w-full py-2 px-3 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-xs text-slate-200 border border-slate-700 transition flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant Demo Session (Admin Workspace)</span>
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-[11px] text-slate-500">
            Protected by SOC-2 Type II TLS 1.3 End-to-End Encryption
          </p>
        </div>
      </div>
    </div>
  );
};
