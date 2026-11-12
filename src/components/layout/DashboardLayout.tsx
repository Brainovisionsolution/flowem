import React, { useState } from 'react';
import { 
  Layers, 
  Users, 
  FolderKanban, 
  Send, 
  FileText, 
  GitFork, 
  BarChart3, 
  ShieldCheck, 
  AlertOctagon, 
  Settings, 
  UserCog, 
  Home, 
  Search, 
  Bell, 
  Plus, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Activity,
  Terminal,
  Zap
} from 'lucide-react';
import { NavigationTab } from '../../types';

interface DashboardLayoutProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  onExitToHome: () => void;
  onOpenQuickSend: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  onExitToHome,
  onOpenQuickSend,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigationItems: { id: NavigationTab; label: string; number: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Command Center', number: '1', icon: Activity },
    { id: 'contacts', label: 'Contacts', number: '2', icon: Users },
    { id: 'contact-lists', label: 'Contact Lists', number: '3', icon: FolderKanban },
    { id: 'campaigns', label: 'Campaigns', number: '4', icon: Send },
    { id: 'templates', label: 'Templates', number: '5', icon: FileText },
    { id: 'automation', label: 'Automation', number: '6', icon: GitFork },
    { id: 'analytics', label: 'Analytics', number: '7', icon: BarChart3 },
    { id: 'sender-config', label: 'Sender Configuration', number: '8', icon: ShieldCheck },
    { id: 'suppression', label: 'Suppression & Compliance', number: '9', icon: AlertOctagon },
    { id: 'organization', label: 'Organization Settings', number: '10', icon: Settings },
    { id: 'user-management', label: 'User Management', number: '11', icon: UserCog },
  ];

  const notifications = [
    { id: 1, title: 'Autonomous IP Warm-up Stage 4 reached', time: '12m ago', unread: true },
    { id: 2, title: 'DKIM 2048-bit key rotation verified', time: '1h ago', unread: false },
    { id: 3, title: 'Zero spamtrap encounters across 1.94M dispatches', time: '3h ago', unread: false },
  ];

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col">
      
      {/* Top Console Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#070b16]/85 backdrop-blur-xl">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <div 
              onClick={onExitToHome}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-slate-900 p-0.5 shadow-glow-indigo">
                <div className="w-full h-full bg-[#090e1c] rounded-[10px] flex items-center justify-center border border-indigo-400/30">
                  <Layers className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-white tracking-tight leading-none">
                  FlowEM
                </span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">Console v3.2</span>
              </div>
            </div>

            {/* Live Ticker Indicator */}
            <div className="hidden xl:flex items-center gap-4 ml-6 pl-6 border-l border-white/10 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-slate-300">MTA Cluster: 24/24 Online</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="text-slate-400">
                Queue Rate: <strong className="text-indigo-300">142,500/hr</strong>
              </div>
              <span className="text-slate-600">|</span>
              <div className="text-slate-400">
                Inbox Placement: <strong className="text-emerald-400">99.84%</strong>
              </div>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3">
            
            <button
              onClick={onOpenQuickSend}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs transition shadow-glow-indigo border border-indigo-400/40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Dispatch</span>
            </button>

            {/* Return to Home Landing Page */}
            <button
              onClick={onExitToHome}
              className="px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs border border-slate-700/80 transition flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden md:inline">Landing Page</span>
            </button>

            {/* Notifications Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 glass-panel p-4 rounded-xl shadow-2xl border border-white/10 space-y-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
                    <span className="font-semibold text-white">System Notifications</span>
                    <span className="text-[10px] text-indigo-400 font-mono">3 Unread</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2 rounded-lg bg-slate-900/60 border border-slate-800/80">
                        <div className="text-slate-200">{n.title}</div>
                        <div className="text-[10px] text-slate-500 mt-1 font-mono">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Avatar */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300">
                AW
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-white leading-tight">Alexander Wright</span>
                <span className="text-[10px] text-slate-400">Global Admin</span>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Main Layout Area: Sidebar + Dynamic Content */}
      <div className="flex-1 flex overflow-hidden max-w-full">
        
        {/* Glassmorphic Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-[#070b16]/90 backdrop-blur-xl border-r border-white/[0.08] p-4 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1 overflow-y-auto pr-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-500">
              Console Modules
            </div>

            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition text-left group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-glow-indigo font-semibold border border-indigo-400/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span className={`w-5 text-center font-mono text-[11px] ${isActive ? 'text-indigo-200' : 'text-slate-500'}`}>
                    {item.number}.
                  </span>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <span className="truncate flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
                </button>
              );
            })}
          </div>

          {/* Bottom System Status Widget */}
          <div className="pt-4 border-t border-slate-800/80 space-y-2">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] space-y-1">
              <div className="flex justify-between items-center text-slate-300">
                <span>Enterprise Tier</span>
                <span className="text-emerald-400 font-mono">Active</span>
              </div>
              <div className="text-[10px] text-slate-500">
                Quota: 1.94M / 2.50M (77.6%)
              </div>
            </div>

            <button
              onClick={onExitToHome}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs text-slate-400 hover:text-rose-300 hover:bg-slate-800/60 transition"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Console</span>
            </button>
          </div>
        </aside>

        {/* Content View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>

      </div>

    </div>
  );
};
