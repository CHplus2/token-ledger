import React, { useState } from 'react';
import { LedgerProvider, useLedger } from './context/LedgerContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LedgerAIPanel } from './components/common/LedgerAIPanel';
import { CommandPalette } from './components/common/CommandPalette';
import { LandingPage } from './components/landing/LandingPage';
import { SignInPage } from './components/auth/SignInPage';
import { UserProfile } from './types';

// Module Views
import { Dashboard } from './components/dashboard/Dashboard';
import { Transactions } from './components/transactions/Transactions';
import { Reconciliation } from './components/reconciliation/Reconciliation';
import { SubledgerJournals } from './components/subledger/SubledgerJournals';
import { FinancialReports } from './components/reports/FinancialReports';
import { AccountingRules } from './components/accounting/AccountingRules';
import { AssetRegister } from './components/assets/AssetRegister';
import { CustodyPortfolio } from './components/custody/CustodyPortfolio';
import { MonthEndClose } from './components/close/MonthEndClose';
import { AuditTrail } from './components/audit/AuditTrail';
import { DataSources } from './components/sources/DataSources';
import { SettingsView } from './components/settings/SettingsView';

interface MainLayoutProps {
  onBackToLanding: () => void;
  onLogout: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({ onBackToLanding, onLogout }) => {
  const { activeModule } = useLedger();

  const renderActiveModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'reconciliation':
        return <Reconciliation />;
      case 'subledger':
        return <SubledgerJournals />;
      case 'reports':
        return <FinancialReports />;
      case 'accounting':
        return <AccountingRules />;
      case 'assets':
        return <AssetRegister />;
      case 'custody':
        return <CustodyPortfolio />;
      case 'close':
        return <MonthEndClose />;
      case 'audit':
        return <AuditTrail />;
      case 'sources':
        return <DataSources />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#ffffff] font-sans text-slate-900 antialiased">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Global Institutional Header */}
        <Header onLogoClick={onBackToLanding} onLogout={onLogout} />

        {/* Scrollable View Canvas */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="max-w-7xl mx-auto">{renderActiveModule()}</div>
        </main>
      </div>

      {/* Slide-out Ledger AI Assistant Panel */}
      <LedgerAIPanel />

      {/* Universal Quick Search Command Palette */}
      <CommandPalette />
    </div>
  );
};

type View = 'landing' | 'signin' | 'app';

export function App() {
  const [view, setView] = useState<View>('landing');
  const [signedInUser, setSignedInUser] = useState<UserProfile | undefined>(undefined);

  if (view === 'landing') {
    return <LandingPage onLaunch={() => setView('signin')} />;
  }

  if (view === 'signin') {
    return (
      <SignInPage
        onSignIn={(user) => {
          setSignedInUser(user);
          setView('app');
        }}
        onBack={() => setView('landing')}
      />
    );
  }

  return (
    <LedgerProvider initialUser={signedInUser} key={signedInUser?.id}>
      <MainLayout onBackToLanding={() => setView('landing')} onLogout={() => setView('signin')} />
    </LedgerProvider>
  );
}

export default App;
