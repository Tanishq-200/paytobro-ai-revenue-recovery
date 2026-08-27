import React, { useState } from 'react';
import { RecoveryProvider } from './context/RecoveryContext.js';
import { Sidebar, ActiveTab } from './components/Sidebar.js';
import { Header } from './components/Header.js';
import { OverviewPage } from './pages/OverviewPage.js';
import { RecoveryCasesPage } from './pages/RecoveryCasesPage.js';
import { RecoveryAgentPage } from './pages/RecoveryAgentPage.js';
import { CopilotPage } from './pages/CopilotPage.js';
import { SimulationLabPage } from './pages/SimulationLabPage.js';
import { AnalyticsPage } from './pages/AnalyticsPage.js';
import { AuditLogsPage } from './pages/AuditLogsPage.js';
import { SettingsPage } from './pages/SettingsPage.js';
import { WebsitePage } from './pages/WebsitePage.js';
import { CaseDetailModal } from './components/CaseDetailModal.js';

const AppContent: React.FC = () => {
  // Master Dashboard Screen 22 is the default active view
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [sidebarSearch, setSidebarSearch] = useState<string>('');

  // Selected Case Modal State (Screen 24)
  const [selectedCaseTxId, setSelectedCaseTxId] = useState<string | null>(null);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState<boolean>(false);

  const handleOpenCase = (txId: string) => {
    setSelectedCaseTxId(txId);
    setIsCaseModalOpen(true);
  };

  // If viewing the Public Website (Screens 1 to 15)
  if (activeTab === 'website') {
    return <WebsitePage onGoToDashboard={() => setActiveTab('overview')} />;
  }

  return (
    <div className="app-layout">
      {/* Screen 22 Master Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        searchTerm={sidebarSearch}
        onSearchChange={setSidebarSearch}
      />

      {/* Main Content Area */}
      <div className="main-content">
        {/* Screen 22 Header */}
        <Header
          title={
            activeTab === 'overview'
              ? 'Welcome back, Tanishq'
              : activeTab === 'cases'
              ? 'Recovery Cases'
              : activeTab === 'failed-payments'
              ? 'Failed Payments'
              : activeTab === 'recovery-queue'
              ? 'Recovery Queue'
              : activeTab === 'payment-history'
              ? 'Payment History'
              : activeTab === 'agent'
              ? 'Recovery Agent'
              : activeTab === 'copilot'
              ? 'PayToBro Copilot'
              : activeTab === 'simulation'
              ? 'Simulation Lab'
              : activeTab === 'analytics'
              ? 'Revenue Analytics'
              : activeTab === 'audit'
              ? 'Audit Logs'
              : 'Account Settings'
          }
          subtitle={
            activeTab === 'overview'
              ? 'Measure and recover revenue lost from failed payments'
              : 'Autonomous AI revenue recovery platform'
          }
        />

        {/* 1. MASTER VIEW: Screen 22 Dashboard */}
        {activeTab === 'overview' && (
          <OverviewPage
            onSelectCase={handleOpenCase}
            onViewAllCases={() => setActiveTab('cases')}
            onViewReport={() => setActiveTab('analytics')}
          />
        )}

        {/* 2. Screen 23: Recovery Cases */}
        {activeTab === 'cases' && (
          <RecoveryCasesPage
            onSelectCase={handleOpenCase}
            title="Recovery Cases"
          />
        )}

        {/* 3. Screen 25: Failed Payments */}
        {activeTab === 'failed-payments' && (
          <RecoveryCasesPage
            onSelectCase={handleOpenCase}
            title="Failed Payments"
            initialStatus="recovery_pending"
          />
        )}

        {/* 4. Screen 26: Recovery Queue */}
        {activeTab === 'recovery-queue' && (
          <RecoveryCasesPage
            onSelectCase={handleOpenCase}
            title="Recovery Queue"
            initialPriority="critical"
          />
        )}

        {/* 5. Screen 27: Payment History */}
        {activeTab === 'payment-history' && (
          <RecoveryCasesPage
            onSelectCase={handleOpenCase}
            title="Payment History"
            initialStatus="recovered"
          />
        )}

        {/* 6. Screen 28-31: Recovery Agent (Interactive Workflow) */}
        {activeTab === 'agent' && (
          <RecoveryAgentPage />
        )}

        {/* 7. Screen 32-33: PayToBro Copilot */}
        {activeTab === 'copilot' && (
          <CopilotPage
            onSelectTransaction={handleOpenCase}
          />
        )}

        {/* 8. Screen 40-46: Simulation Lab */}
        {activeTab === 'simulation' && (
          <SimulationLabPage />
        )}

        {/* 9. Screen 47-53: Revenue Analytics */}
        {activeTab === 'analytics' && (
          <AnalyticsPage />
        )}

        {/* 10. Screen 63: Audit Logs */}
        {activeTab === 'audit' && (
          <AuditLogsPage
            onSelectCase={handleOpenCase}
          />
        )}

        {/* 11. Screen 64-69: Account Settings */}
        {activeTab === 'settings' && (
          <SettingsPage />
        )}
      </div>

      {/* Screen 24 Case Detail Modal with Screen 58 & 59 Confirmation/Success */}
      <CaseDetailModal
        caseOrTxId={selectedCaseTxId}
        isOpen={isCaseModalOpen}
        onClose={() => setIsCaseModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RecoveryProvider>
      <AppContent />
    </RecoveryProvider>
  );
};

export default App;
