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
  Bell, 
  Plus, 
  LogOut, 
  ChevronRight,
  Menu,
  X,
  Activity
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
    { id: 'overview', label: 'Overview', number: '1', icon: Activity },
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
    { id: 1, title: 'Your domain warm-up reached Stage 4', time: '12m ago' },
    { id: 2, title: 'DKIM security check passed', time: '1h ago' },
    { id: 3, title: '94,230 emails delivered to Inbox', time: '3h ago' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <div 
              onClick={onExitToHome}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
                <Layers className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  FlowEM
                </span>
                <span className="text-[10px] text-slate-500 font-mono mt-0.5">Bulk Email Dashboard</span>
              </div>
            </div>

            {/* Live Ticker */}
            <div className="hidden xl:flex items-center gap-4 ml-6 pl-6 border-l border-slate-200 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-slate-600">Servers: 24/24 Online</span>
              </div>
              <span className="text-slate-300">|</span>
              <div className="text-slate-600">
                Speed: <strong className="text-indigo-600">142,500/hr</strong>
              </div>
              <span className="text-slate-300">|</span>
              <div className="text-slate-600">
                Inbox Rate: <strong className="text-emerald-600">99.84%</strong>
              </div>
            </div>
          </div>

          {/* Right Header Utilities */}
          <div className="flex items-center gap-3">
            
            <button
              onClick={onOpenQuickSend}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Send Campaign</span>
            </button>

            {/* Back to Home */}
            <button
              onClick={onExitToHome}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition flex items-center gap-1.5"
            >
              <Home className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden md:inline">Home Page</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200 relative"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600"></span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white p-4 rounded-xl shadow-xl border border-slate-200 space-y-3 z-50">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs font-bold text-slate-800">
                    <span>Recent Updates</span>
                    <span className="text-[10px] text-indigo-600 font-mono font-semibold">3 New</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    {notifications.map(n => (
                      <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="text-slate-800 font-medium">{n.title}</div>
                        <div className="text-[10px] text-slate-400 mt-1 font-mono">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700">
                AW
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 leading-tight">Alexander Wright</span>
                <span className="text-[10px] text-slate-500 font-medium">Administrator</span>
              </div>
            </div>

          </div>

        </div>
      </header>

      {/* Main Area: Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden max-w-full">
        
        {/* Left Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 z-30 w-64 h-[calc(100vh-4rem)] bg-white border-r border-slate-200 p-4 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 ${
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="space-y-1 overflow-y-auto pr-1">
            <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Menu
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
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-4 text-center font-mono text-[11px] ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {item.number}.
                  </span>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-700'}`} />
                  <span className="truncate flex-1">{item.label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-200" />}
                </button>
              );
            })}
          </div>

          {/* Bottom Quota Box */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between items-center text-slate-700 font-medium">
                <span>Monthly Plan</span>
                <span className="text-emerald-700 font-bold font-mono">Active</span>
              </div>
              <div className="text-[11px] text-slate-500">
                1.94M / 2.50M emails used
              </div>
            </div>

            <button
              onClick={onExitToHome}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
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
