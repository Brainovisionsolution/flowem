import React from 'react';
import { Layers, ShieldCheck, ArrowUpRight, ChevronRight } from 'lucide-react';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onEnterDashboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenLogin,
  onOpenRegister,
  onEnterDashboard,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 p-0.5 shadow-sm transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center border border-indigo-100">
                  <Layers className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5">
                  FlowEM
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 font-semibold">
                    Platform
                  </span>
                </span>
                <span className="text-[11px] text-slate-500 tracking-wider">
                  Bulk Email & Automation Platform
                </span>
              </div>
            </a>

            <div className="hidden lg:flex items-center ml-8 pl-8 border-l border-slate-200 space-x-7 text-sm font-medium text-slate-600">
              <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">
                How It Works
              </a>
              <a href="#features" className="hover:text-indigo-600 transition-colors">
                Key Features
              </a>
              <a href="#inbox-safety" className="hover:text-indigo-600 transition-colors">
                Inbox Delivery
              </a>
              <a href="#domain-setup" className="hover:text-indigo-600 transition-colors">
                Domain Setup
              </a>
              <a href="#pricing" className="hover:text-indigo-600 transition-colors">
                Plans
              </a>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 rounded-lg hover:bg-slate-100 transition"
            >
              Log In
            </button>
            <button
              onClick={onOpenRegister}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
            <button
              onClick={onEnterDashboard}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
            >
              <span>Open Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
