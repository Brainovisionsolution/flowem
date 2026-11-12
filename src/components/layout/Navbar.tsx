import React from 'react';
import { Layers, ShieldCheck, Cpu, ArrowUpRight, ChevronRight } from 'lucide-react';

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
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#060913]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-4">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-slate-900 p-0.5 shadow-glow-indigo transition-transform group-hover:scale-105">
                <div className="w-full h-full bg-[#090e1c] rounded-[10px] flex items-center justify-center border border-indigo-400/30">
                  <Layers className="w-5 h-5 text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                  FlowEM
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300">
                    Enterprise
                  </span>
                </span>
                <span className="text-[11px] text-slate-400 tracking-wider">
                  Bulk Email Automation Platform
                </span>
              </div>
            </a>

            <div className="hidden lg:flex items-center ml-8 pl-8 border-l border-white/10 space-x-7 text-sm text-slate-300">
              <a href="#architecture" className="hover:text-indigo-400 transition-colors">
                MTA Architecture
              </a>
              <a href="#deliverability" className="hover:text-indigo-400 transition-colors">
                Deliverability Engine
              </a>
              <a href="#features" className="hover:text-indigo-400 transition-colors">
                Capabilities
              </a>
              <a href="#compliance" className="hover:text-indigo-400 transition-colors">
                Compliance & RFC
              </a>
              <a href="#sla" className="hover:text-indigo-400 transition-colors">
                Global Telemetry
              </a>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-medium text-slate-200 hover:text-white rounded-lg hover:bg-slate-800/60 transition border border-transparent hover:border-slate-700"
            >
              Log In
            </button>
            <button
              onClick={onOpenRegister}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-indigo-500/30 transition shadow-sm"
            >
              <span>Get Started</span>
              <ChevronRight className="w-4 h-4 text-indigo-400" />
            </button>
            <button
              onClick={onEnterDashboard}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition shadow-glow-indigo border border-indigo-400/40"
            >
              <span>Console Dashboard</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
