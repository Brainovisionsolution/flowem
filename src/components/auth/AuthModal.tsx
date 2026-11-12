import React, { useState } from 'react';
import { X, ShieldCheck, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: { id: string; email: string; name: string; role: string }) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [email, setEmail] = useState('admin@brainovision.in');
  const [password, setPassword] = useState('Admin@Flowem2026!');
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const res = await api.login(email, password);
      setSubmitting(false);
      onSuccess(res.user);
      onClose();
    } catch (err: any) {
      setSubmitting(false);
      setErrorMessage(err.message || 'Invalid administrator credentials. Please check your email and password.');
    }
  };

  const fillDefaultCredentials = () => {
    setEmail('admin@brainovision.in');
    setPassword('Admin@Flowem2026!');
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl border border-slate-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition p-1 rounded-lg hover:bg-slate-100"
          title="Close Dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Administrator Login</h2>
            <p className="text-xs text-slate-500">FlowEM Single-Admin Operations Portal</p>
          </div>
        </div>

        {/* Single Admin Mode Banner */}
        <div className="mb-5 p-3 rounded-xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-900 space-y-1">
          <div className="font-semibold flex items-center justify-between">
            <span>Single Admin Authentication</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              Phase 2 Active
            </span>
          </div>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            Employee registration and invitations are disabled. Platform access is restricted to the primary Administrator account.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@brainovision.in"
                className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-sans"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full glass-input rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-slate-900 font-sans"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs transition shadow-xs flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Verifying Credentials...' : 'Sign In as Administrator'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Quick Credentials Button */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Testing locally?</span>
          <button
            type="button"
            onClick={fillDefaultCredentials}
            className="text-indigo-600 hover:text-indigo-700 font-semibold text-xs"
          >
            Insert Default Credentials
          </button>
        </div>

      </div>
    </div>
  );
};
