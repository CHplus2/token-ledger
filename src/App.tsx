import React from 'react';
import { LedgerProvider, useLedger } from './context/LedgerContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { LedgerAIPanel } from './components/common/LedgerAIPanel';
import { CommandPalette } from './components/common/CommandPalette';

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

const MainLayout: React.FC = () => {
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
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0a0c] font-sans text-slate-100 antialiased">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main App Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Global Institutional Header */}
        <Header />

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

export function App() {
  return (
    <LedgerProvider>
      <MainLayout />
    </LedgerProvider>
  );
}

export default App;
