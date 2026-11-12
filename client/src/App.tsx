import React, { useState, useEffect } from 'react';
import { NavigationTab } from './types';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/home/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { api } from './services/api';

// Dashboard Views
import { OverviewTab } from './components/dashboard/OverviewTab';
import { ContactsTab } from './components/dashboard/ContactsTab';
import { ContactListsTab } from './components/dashboard/ContactListsTab';
import { CampaignsTab } from './components/dashboard/CampaignsTab';
import { TemplatesTab } from './components/dashboard/TemplatesTab';
import { AutomationTab } from './components/dashboard/AutomationTab';
import { AnalyticsTab } from './components/dashboard/AnalyticsTab';
import { SenderConfigTab } from './components/dashboard/SenderConfigTab';
import { SuppressionComplianceTab } from './components/dashboard/SuppressionComplianceTab';
import { OrganizationSettingsTab } from './components/dashboard/OrganizationSettingsTab';
import { UserManagementTab } from './components/dashboard/UserManagementTab';

export function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [currentTab, setCurrentTab] = useState<NavigationTab>('overview');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isQuickSendOpen, setIsQuickSendOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string; role: string } | null>(null);

  // Check existing session on mount
  useEffect(() => {
    api.getMe()
      .then(user => {
        setCurrentUser(user);
      })
      .catch(() => {
        setCurrentUser(null);
      });
  }, []);

  const handleOpenLogin = () => {
    setIsAuthOpen(true);
  };

  const handleEnterDashboard = () => {
    if (currentUser) {
      setCurrentView('dashboard');
    } else {
      setIsAuthOpen(true);
    }
  };

  const handleAuthSuccess = (user: { id: string; email: string; name: string; role: string }) => {
    setCurrentUser(user);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setCurrentView('landing');
  };

  const handleQuickSend = () => {
    setCurrentTab('campaigns');
    setIsQuickSendOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 selection:bg-indigo-600/30 selection:text-indigo-200">
      
      {/* Landing Page Mode */}
      {currentView === 'landing' ? (
        <>
          <Navbar
            onOpenLogin={handleOpenLogin}
            onEnterDashboard={handleEnterDashboard}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <main>
            <LandingPage
              onOpenLogin={handleOpenLogin}
              onOpenRegister={handleOpenLogin}
              onEnterDashboard={handleEnterDashboard}
            />
          </main>
        </>
      ) : (
        /* Protected Single Admin Dashboard Mode */
        <DashboardLayout
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onExitToHome={() => setCurrentView('landing')}
          onOpenQuickSend={handleQuickSend}
          currentUser={currentUser}
          onLogout={handleLogout}
        >
          {currentTab === 'overview' && (
            <OverviewTab
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenNewCampaign={handleQuickSend}
            />
          )}
          {currentTab === 'contacts' && <ContactsTab />}
          {currentTab === 'contact-lists' && <ContactListsTab />}
          {currentTab === 'campaigns' && (
            <CampaignsTab
              isWizardOpen={isQuickSendOpen}
              onCloseWizard={() => setIsQuickSendOpen(false)}
            />
          )}
          {currentTab === 'templates' && <TemplatesTab />}
          {currentTab === 'automation' && <AutomationTab />}
          {currentTab === 'analytics' && <AnalyticsTab />}
          {currentTab === 'sender-config' && <SenderConfigTab />}
          {currentTab === 'suppression' && <SuppressionComplianceTab />}
          {currentTab === 'organization' && <OrganizationSettingsTab />}
          {currentTab === 'user-management' && <UserManagementTab />}
        </DashboardLayout>
      )}

      {/* Single Admin Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}

export default App;
