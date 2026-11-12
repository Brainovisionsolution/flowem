import React, { useState } from 'react';
import { NavigationTab } from './types';
import { Navbar } from './components/layout/Navbar';
import { LandingPage } from './components/home/LandingPage';
import { AuthModal } from './components/auth/AuthModal';
import { DashboardLayout } from './components/layout/DashboardLayout';

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
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isQuickSendOpen, setIsQuickSendOpen] = useState(false);

  const handleOpenLogin = () => {
    setAuthMode('login');
    setIsAuthOpen(true);
  };

  const handleOpenRegister = () => {
    setAuthMode('register');
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = () => {
    setCurrentView('dashboard');
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
            onOpenRegister={handleOpenRegister}
            onEnterDashboard={() => setCurrentView('dashboard')}
          />
          <main>
            <LandingPage
              onOpenLogin={handleOpenLogin}
              onOpenRegister={handleOpenRegister}
              onEnterDashboard={() => setCurrentView('dashboard')}
            />
          </main>
        </>
      ) : (
        /* Dashboard Mode */
        <DashboardLayout
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onExitToHome={() => setCurrentView('landing')}
          onOpenQuickSend={handleQuickSend}
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

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        initialMode={authMode}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

    </div>
  );
}

export default App;
