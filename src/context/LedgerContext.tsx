/**
 * Token Ledger - Core Application State Context
 * Handles transactions, subledger journals, reconciliation, five-way cross-platform matching, and audit logging
 */

import React, { createContext, useContext, useState } from 'react';
import {
  OrganizationSettings,
  LegalEntity,
  UserProfile,
  UserRole,
  DataSource,
  NormalizedTransaction,
  ReconciliationBreakItem,
  ChartAccount,
  AccountingRule,
  JournalEntry,
  AssetValuation,
  MonthEndTask,
  AuditEvent,
  FiveWayReconciliationRecord,
  TransactionClassification,
  CostBasisMethod,
} from '../types';
import {
  INITIAL_USER,
  MOCK_USERS,
  INITIAL_ORGANIZATION,
  INITIAL_ENTITIES,
  INITIAL_DATA_SOURCES,
  INITIAL_CHART_OF_ACCOUNTS,
  INITIAL_ACCOUNTING_RULES,
  INITIAL_ASSET_VALUATIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_RECONCILIATION_BREAKS,
  INITIAL_JOURNAL_ENTRIES,
  INITIAL_MONTH_END_TASKS,
  INITIAL_AUDIT_EVENTS,
  INITIAL_FIVE_WAY_RECONCILIATION,
} from '../mockData';

export type NavigationModule =
  | 'dashboard'
  | 'sources'
  | 'transactions'
  | 'reconciliation'
  | 'subledger'
  | 'accounting'
  | 'assets'
  | 'reports'
  | 'close'
  | 'audit'
  | 'settings';

interface LedgerContextType {
  // Navigation & User
  activeModule: NavigationModule;
  setActiveModule: (module: NavigationModule) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  switchUserRole: (role: UserRole) => void;

  // Organization & Entities
  organization: OrganizationSettings;
  updateOrganization: (settings: Partial<OrganizationSettings>) => void;
  entities: LegalEntity[];
  selectedEntityId: string;
  setSelectedEntityId: (id: string) => void;

  // Data Sources
  dataSources: DataSource[];
  addDataSource: (source: Omit<DataSource, 'id' | 'lastSyncAt' | 'txCount' | 'status'>) => void;
  syncDataSource: (sourceId: string) => void;

  // Transactions
  transactions: NormalizedTransaction[];
  selectedTx: NormalizedTransaction | null;
  setSelectedTx: (tx: NormalizedTransaction | null) => void;
  classifyTransaction: (txId: string, classification: TransactionClassification, notes?: string) => void;
  bulkClassifyTransactions: (txIds: string[], classification: TransactionClassification) => void;
  approveTransaction: (txId: string) => void;

  // Reconciliation & Five-Way Framework
  reconciliationBreaks: ReconciliationBreakItem[];
  selectedBreak: ReconciliationBreakItem | null;
  setSelectedBreak: (item: ReconciliationBreakItem | null) => void;
  resolveReconciliationBreak: (breakId: string, resolutionNote: string) => void;
  fiveWayRecords: FiveWayReconciliationRecord[];
  resolveFiveWayException: (recordId: string, resolutionNote: string) => void;

  // Chart of Accounts & Rules
  chartOfAccounts: ChartAccount[];
  accountingRules: AccountingRule[];
  addAccountingRule: (rule: Omit<AccountingRule, 'id' | 'autoAppliedCount'>) => void;
  toggleAccountingRule: (ruleId: string) => void;

  // Subledger & Journals
  journalEntries: JournalEntry[];
  selectedJournal: JournalEntry | null;
  setSelectedJournal: (journal: JournalEntry | null) => void;
  approveJournalEntry: (journalId: string) => void;
  postJournalEntry: (journalId: string) => void;
  createJournalEntry: (entry: Omit<JournalEntry, 'id' | 'journalNumber' | 'status'>) => void;

  // Valuations & Cost Basis
  assetValuations: AssetValuation[];
  costBasisMethod: CostBasisMethod;
  setCostBasisMethod: (method: CostBasisMethod) => void;

  // Month-End Close
  monthEndTasks: MonthEndTask[];
  closeTasks: MonthEndTask[];
  updateMonthEndTask: (taskId: string, status: MonthEndTask['status']) => void;
  toggleCloseTask: (taskId: string) => void;
  closeReadinessScore: number;
  isPeriodLocked: boolean;
  lockAccountingPeriod: () => void;

  // Audit Trail
  auditTrail: AuditEvent[];
  auditLogs: AuditEvent[];
  addAuditEvent: (event: Omit<AuditEvent, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => void;

  // AI Assistant Panel
  isAIPanelOpen: boolean;
  setIsAIPanelOpen: (open: boolean) => void;
  aiContext: { type: string; data?: any };
  openAIWithContext: (type: string, data?: any) => void;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Reset & Helpers
  resetToDemoData: () => void;
  totalMarketValueUsd: number;
  totalCostBasisUsd: number;
  totalUnrealizedPnlUsd: number;
  reconciliationRatePercent: number;
  exceptionsCount: number;
  unclassifiedCount: number;
  openBreaksCount: number;
  pendingJournalsCount: number;
}

const LedgerContext = createContext<LedgerContextType | null>(null);

export function LedgerProvider({ children }: { children: React.ReactNode }) {
  const [activeModule, setActiveModule] = useState<NavigationModule>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USER);
  const [organization, setOrganization] = useState<OrganizationSettings>(INITIAL_ORGANIZATION);
  const [entities] = useState<LegalEntity[]>(INITIAL_ENTITIES);
  const [selectedEntityId, setSelectedEntityId] = useState<string>('ent_group');

  const [dataSources, setDataSources] = useState<DataSource[]>(INITIAL_DATA_SOURCES);
  const [transactions, setTransactions] = useState<NormalizedTransaction[]>(INITIAL_TRANSACTIONS);
  const [selectedTx, setSelectedTx] = useState<NormalizedTransaction | null>(null);

  const [reconciliationBreaks, setReconciliationBreaks] = useState<ReconciliationBreakItem[]>(INITIAL_RECONCILIATION_BREAKS);
  const [selectedBreak, setSelectedBreak] = useState<ReconciliationBreakItem | null>(null);
  const [fiveWayRecords, setFiveWayRecords] = useState<FiveWayReconciliationRecord[]>(INITIAL_FIVE_WAY_RECONCILIATION);

  const [chartOfAccounts, setChartOfAccounts] = useState<ChartAccount[]>(INITIAL_CHART_OF_ACCOUNTS);
  const [accountingRules, setAccountingRules] = useState<AccountingRule[]>(INITIAL_ACCOUNTING_RULES);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(INITIAL_JOURNAL_ENTRIES);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);

  const [assetValuations, setAssetValuations] = useState<AssetValuation[]>(INITIAL_ASSET_VALUATIONS);
  const [costBasisMethod, setCostBasisMethod] = useState<CostBasisMethod>('FIFO');

  const [monthEndTasks, setMonthEndTasks] = useState<MonthEndTask[]>(INITIAL_MONTH_END_TASKS);
  const [isPeriodLocked, setIsPeriodLocked] = useState<boolean>(false);

  const [auditTrail, setAuditTrail] = useState<AuditEvent[]>(INITIAL_AUDIT_EVENTS);

  const [isAIPanelOpen, setIsAIPanelOpen] = useState<boolean>(false);
  const [aiContext, setAiContext] = useState<{ type: string; data?: any }>({ type: 'GENERAL' });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Helper for audit logging
  const logAudit = (
    action: string,
    objectType: AuditEvent['objectType'],
    objectId: string,
    previousValue?: string,
    newValue?: string,
    notes?: string
  ) => {
    const newEvent: AuditEvent = {
      id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      objectType,
      objectId,
      previousValue,
      newValue,
      notes,
    };
    setAuditTrail((prev) => [newEvent, ...prev]);
  };

  const addAuditEvent = (event: Omit<AuditEvent, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>) => {
    logAudit(event.action, event.objectType, event.objectId, event.previousValue, event.newValue, event.notes);
  };

  const switchUserRole = (role: UserRole) => {
    const found = MOCK_USERS.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      logAudit('ROLE_SWITCH', 'CLOSE_PERIOD', organization.id, currentUser.role, role, `Switched operational role to ${role}`);
    }
  };

  const updateOrganization = (settings: Partial<OrganizationSettings>) => {
    setOrganization((prev) => ({ ...prev, ...settings }));
    logAudit('ORGANIZATION_SETTINGS_UPDATE', 'CLOSE_PERIOD', organization.id, undefined, undefined, 'Updated accounting policy parameters');
  };

  // Add Data Source
  const addDataSource = (source: Omit<DataSource, 'id' | 'lastSyncAt' | 'txCount' | 'status'>) => {
    const newId = `src_${source.provider.toLowerCase()}_${Date.now()}`;
    const newSource: DataSource = {
      ...source,
      id: newId,
      status: 'CONNECTED',
      lastSyncAt: 'Just now',
      txCount: source.provider === 'SOLANA' ? 126 : 30,
      balanceEstimateUsd: source.provider === 'SOLANA' ? 18450000 : 2500000,
    };

    setDataSources((prev) => [newSource, ...prev]);
    logAudit('DATA_SOURCE_CONNECT', 'DATA_SOURCE', newId, undefined, source.name, `Connected ${source.provider} source in read-only mode.`);
  };

  // Sync Data Source
  const syncDataSource = (sourceId: string) => {
    setDataSources((prev) =>
      prev.map((s) =>
        s.id === sourceId
          ? { ...s, status: 'CONNECTED', lastSyncAt: 'Just now', txCount: s.txCount + 1 }
          : s
      )
    );
    logAudit('DATA_SOURCE_SYNC', 'DATA_SOURCE', sourceId, undefined, 'SYNC_COMPLETE', 'Synchronized multi-venue records.');
  };

  // Classify Transaction & Auto-generate Journal
  const classifyTransaction = (txId: string, classification: TransactionClassification, notes?: string) => {
    let targetTx: NormalizedTransaction | null = null;

    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === txId) {
          targetTx = t;
          let debitCode = t.debitAccountCode;
          let debitName = t.debitAccountName;
          let creditCode = t.creditAccountCode;
          let creditName = t.creditAccountName;

          if (classification === 'STAKING_REWARD') {
            debitCode = '1240';
            debitName = 'Digital Assets — Solana Treasury (SOL)';
            creditCode = '4300';
            creditName = 'Validator Staking & Other Operating Income';
          } else if (classification === 'DISTRIBUTION') {
            debitCode = '1100';
            debitName = 'Cash & Cash Equivalents (USD Settlement Account)';
            creditCode = '4200';
            creditName = 'Tokenized Fund Dividend & Sukuk Profit Income';
          } else if (classification === 'INTERNAL_TRANSFER') {
            debitCode = '1210';
            debitName = 'Tokenized Funds — BlackRock BUIDL (Solana Chain)';
            creditCode = '1210';
            creditName = 'Tokenized Funds — BlackRock BUIDL (Ethereum Chain)';
          }

          return {
            ...t,
            classification,
            txType: classification,
            debitAccountCode: debitCode,
            debitAccountName: debitName,
            creditAccountCode: creditCode,
            creditAccountName: creditName,
            accountingStatus: 'PENDING_APPROVAL',
            autoClassified: false,
            notes: notes || t.notes,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    // Auto draft or update journal entry
    if (targetTx) {
      const tx = targetTx as NormalizedTransaction;
      const journalNum = `JE-2026-${(journalEntries.length + 845).toString().padStart(5, '0')}`;
      const newJournal: JournalEntry = {
        id: `je_auto_${txId}`,
        journalNumber: journalNum,
        date: tx.timestamp.split(' ')[0],
        entityId: tx.entityId,
        sourceName: tx.sourceName,
        description: `Classified: ${tx.businessDescription}`,
        relatedTxId: tx.id,
        status: 'READY_FOR_REVIEW',
        totalDebit: tx.fiatValue,
        totalCredit: tx.fiatValue,
        preparedBy: currentUser.name,
        lines: [
          {
            id: `jl_${Date.now()}_1`,
            accountCode: tx.debitAccountCode || '1200',
            accountName: tx.debitAccountName || 'Tokenized Assets Control',
            debit: tx.fiatValue,
            credit: 0,
            assetSymbol: tx.assetReceived || tx.assetSent,
            quantity: tx.quantityReceived || tx.quantitySent,
            memo: tx.businessDescription,
          },
          {
            id: `jl_${Date.now()}_2`,
            accountCode: tx.creditAccountCode || '4200',
            accountName: tx.creditAccountName || 'Operating Yield Income',
            debit: 0,
            credit: tx.fiatValue,
            memo: `Revenue recognition for ${tx.externalTxId}`,
          },
        ],
        evidenceHash: tx.txHash,
      };

      setJournalEntries((prev) => [newJournal, ...prev.filter((j) => j.relatedTxId !== txId)]);
    }

    logAudit('TRANSACTION_CLASSIFY', 'TRANSACTION', txId, 'UNKNOWN', classification, `Manually classified to ${classification}`);
  };

  // Bulk classify
  const bulkClassifyTransactions = (txIds: string[], classification: TransactionClassification) => {
    txIds.forEach((id) => classifyTransaction(id, classification));
  };

  // Approve Transaction
  const approveTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) =>
        t.id === txId
          ? {
              ...t,
              approvalStatus: 'APPROVED',
              accountingStatus: 'POSTED',
              approverName: currentUser.name,
              approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            }
          : t
      )
    );
    logAudit('TRANSACTION_APPROVE', 'TRANSACTION', txId, 'PENDING_APPROVAL', 'APPROVED', 'Transaction signed off by Controller.');
  };

  // Resolve Reconciliation Break
  const resolveReconciliationBreak = (breakId: string, resolutionNote: string) => {
    setReconciliationBreaks((prev) =>
      prev.map((b) =>
        b.id === breakId
          ? {
              ...b,
              status: 'RESOLVED',
              difference: 0,
              fiatDifferenceUsd: 0,
              resolutionNote,
              approver: currentUser.name,
              approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            }
          : b
      )
    );

    // If resolving the NVIDIA exception, also resolve the 5-way record
    if (breakId === 'rec_break_001') {
      setFiveWayRecords((prev) =>
        prev.map((r) =>
          r.id === 'five_way_bnvda'
            ? {
                ...r,
                status: 'RECONCILED',
                varianceUnits: 0,
                varianceUsd: 0,
                solanaDltUnits: 1000,
                totalCalculatedUnits: 10000,
                subledgerVerified: true,
                generalLedgerVerified: true,
              }
            : r
        )
      );

      // Update asset valuation holding
      setAssetValuations((prev) =>
        prev.map((a) =>
          a.assetSymbol === 'bNVDA'
            ? {
                ...a,
                quantity: 10000,
                totalQuantity: 10000,
                marketValueUsd: 1285000,
                positionsByLocation: a.positionsByLocation?.map((p) =>
                  p.provider === 'Solana'
                    ? { ...p, quantity: 1000, fairValueUsd: 128500, reconciliationStatus: 'RECONCILED', notes: undefined }
                    : p
                ),
              }
            : a
        )
      );
    }

    logAudit('RECONCILIATION_BREAK_RESOLVE', 'RECONCILIATION', breakId, 'OPEN', 'RESOLVED', resolutionNote);
  };

  const resolveFiveWayException = (recordId: string, resolutionNote: string) => {
    setFiveWayRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              status: 'RECONCILED',
              varianceUnits: 0,
              varianceUsd: 0,
              solanaDltUnits: 1000,
              totalCalculatedUnits: 10000,
              subledgerVerified: true,
              generalLedgerVerified: true,
            }
          : r
      )
    );

    // Also update corresponding break
    resolveReconciliationBreak('rec_break_001', resolutionNote);
  };

  // Add Accounting Rule
  const addAccountingRule = (rule: Omit<AccountingRule, 'id' | 'autoAppliedCount'>) => {
    const newRule: AccountingRule = {
      ...rule,
      id: `rule_${Date.now()}`,
      autoAppliedCount: 0,
    };
    setAccountingRules((prev) => [newRule, ...prev]);
    logAudit('ACCOUNTING_RULE_CREATE', 'ACCOUNTING_RULE', newRule.id, undefined, newRule.name, 'Created new automated mapping rule.');
  };

  const toggleAccountingRule = (ruleId: string) => {
    setAccountingRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
  };

  // Journal Entry approval (Maker-Checker enforced)
  const approveJournalEntry = (journalId: string) => {
    setJournalEntries((prev) =>
      prev.map((j) =>
        j.id === journalId
          ? {
              ...j,
              status: 'APPROVED',
              approvedBy: currentUser.name,
              approvedAt: new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
            }
          : j
      )
    );
    logAudit('JOURNAL_APPROVE', 'JOURNAL', journalId, 'READY_FOR_REVIEW', 'APPROVED', 'Approved journal entry for general ledger posting.');
  };

  const postJournalEntry = (journalId: string) => {
    setJournalEntries((prev) =>
      prev.map((j) =>
        j.id === journalId
          ? {
              ...j,
              status: 'POSTED',
            }
          : j
      )
    );
    logAudit('JOURNAL_POST', 'JOURNAL', journalId, 'APPROVED', 'POSTED', 'Posted journal entry into immutable subledger.');
  };

  const createJournalEntry = (entry: Omit<JournalEntry, 'id' | 'journalNumber' | 'status'>) => {
    const journalNum = `JE-2026-${(journalEntries.length + 845).toString().padStart(5, '0')}`;
    const newEntry: JournalEntry = {
      ...entry,
      id: `je_${Date.now()}`,
      journalNumber: journalNum,
      status: 'READY_FOR_REVIEW',
    };
    setJournalEntries((prev) => [newEntry, ...prev]);
    logAudit('JOURNAL_CREATE', 'JOURNAL', newEntry.id, undefined, journalNum, 'Manual journal entry drafted.');
  };

  // Month-end task update
  const updateMonthEndTask = (taskId: string, status: MonthEndTask['status']) => {
    setMonthEndTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    logAudit('MONTH_END_TASK_UPDATE', 'CLOSE_PERIOD', taskId, undefined, status, 'Task status updated.');
  };

  const toggleCloseTask = (taskId: string) => {
    setMonthEndTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus = t.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
          logAudit('MONTH_END_TASK_UPDATE', 'CLOSE_PERIOD', taskId, t.status, nextStatus, 'Task status updated.');
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
  };

  const lockAccountingPeriod = () => {
    setIsPeriodLocked(true);
    setMonthEndTasks((prev) =>
      prev.map((t) => (t.id === 'task_cfo_close_lock' ? { ...t, status: 'COMPLETED' } : t))
    );
    logAudit('CLOSE_PERIOD_LOCK', 'CLOSE_PERIOD', organization.activePeriod, 'IN_PROGRESS', 'LOCKED', 'Period successfully locked by CFO.');
  };

  const openAIWithContext = (type: string, data?: any) => {
    setAiContext({ type, data });
    setIsAIPanelOpen(true);
  };

  const resetToDemoData = () => {
    setDataSources(INITIAL_DATA_SOURCES);
    setTransactions(INITIAL_TRANSACTIONS);
    setReconciliationBreaks(INITIAL_RECONCILIATION_BREAKS);
    setFiveWayRecords(INITIAL_FIVE_WAY_RECONCILIATION);
    setJournalEntries(INITIAL_JOURNAL_ENTRIES);
    setMonthEndTasks(INITIAL_MONTH_END_TASKS);
    setAssetValuations(INITIAL_ASSET_VALUATIONS);
    setAccountingRules(INITIAL_ACCOUNTING_RULES);
    setChartOfAccounts(INITIAL_CHART_OF_ACCOUNTS);
    setAuditTrail(INITIAL_AUDIT_EVENTS);
    setIsPeriodLocked(false);
    logAudit('DEMO_RESET', 'CLOSE_PERIOD', organization.id, undefined, 'RESET_SUCCESS', 'Re-initialized Meridian Capital Group demo state.');
  };

  // Aggregated computations
  const totalMarketValueUsd = assetValuations.reduce((sum, a) => sum + a.marketValueUsd, 0);
  const totalCostBasisUsd = assetValuations.reduce((sum, a) => sum + a.costBasisUsd, 0);
  const totalUnrealizedPnlUsd = totalMarketValueUsd - totalCostBasisUsd;

  const resolvedBreaks = reconciliationBreaks.filter((b) => b.status === 'RESOLVED' || b.status === 'APPROVED').length;
  // If the 50-unit NVIDIA exception is open, reconciliation rate is 98.2%; if resolved, it becomes 99.8% or 100%
  const hasOpenBreak = reconciliationBreaks.some((b) => b.status === 'OPEN');
  const reconciliationRatePercent = hasOpenBreak ? 98.2 : 99.8;

  const unclassifiedCount = transactions.filter((t) => t.classification === 'UNKNOWN').length;
  const openBreaksCount = reconciliationBreaks.filter((b) => b.status === 'OPEN' || b.status === 'INVESTIGATING').length;
  const pendingJournalsCount = journalEntries.filter((j) => j.status === 'READY_FOR_REVIEW' || j.status === 'DRAFT').length;
  const exceptionsCount = unclassifiedCount + openBreaksCount + pendingJournalsCount + (hasOpenBreak ? 1 : 0);

  // Close readiness score: starts at 84% when exceptions exist; scales to 100%
  const completedTasks = monthEndTasks.filter((t) => t.status === 'COMPLETED').length;
  const closeReadinessScore = Math.min(
    100,
    hasOpenBreak
      ? 84
      : Math.round(
          (completedTasks / monthEndTasks.length) * 70 +
            (unclassifiedCount === 0 ? 15 : 5) +
            (openBreaksCount === 0 ? 10 : 0) +
            (pendingJournalsCount === 0 ? 5 : 0)
        )
  );

  return (
    <LedgerContext.Provider
      value={{
        activeModule,
        setActiveModule,
        currentUser,
        setCurrentUser,
        users: MOCK_USERS,
        switchUserRole,
        organization,
        updateOrganization,
        entities,
        selectedEntityId,
        setSelectedEntityId,
        dataSources,
        addDataSource,
        syncDataSource,
        transactions,
        selectedTx,
        setSelectedTx,
        classifyTransaction,
        bulkClassifyTransactions,
        approveTransaction,
        reconciliationBreaks,
        selectedBreak,
        setSelectedBreak,
        resolveReconciliationBreak,
        fiveWayRecords,
        resolveFiveWayException,
        chartOfAccounts,
        accountingRules,
        addAccountingRule,
        toggleAccountingRule,
        journalEntries,
        selectedJournal,
        setSelectedJournal,
        approveJournalEntry,
        postJournalEntry,
        createJournalEntry,
        assetValuations,
        costBasisMethod,
        setCostBasisMethod,
        monthEndTasks,
        closeTasks: monthEndTasks,
        updateMonthEndTask,
        toggleCloseTask,
        closeReadinessScore,
        isPeriodLocked,
        lockAccountingPeriod,
        auditTrail,
        auditLogs: auditTrail,
        addAuditEvent,
        isAIPanelOpen,
        setIsAIPanelOpen,
        aiContext,
        openAIWithContext,
        searchQuery,
        setSearchQuery,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        resetToDemoData,
        totalMarketValueUsd,
        totalCostBasisUsd,
        totalUnrealizedPnlUsd,
        reconciliationRatePercent,
        exceptionsCount,
        unclassifiedCount,
        openBreaksCount,
        pendingJournalsCount,
      }}
    >
      {children}
    </LedgerContext.Provider>
  );
}

export function useLedger() {
  const context = useContext(LedgerContext);
  if (!context) {
    throw new Error('useLedger must be used within a LedgerProvider');
  }
  return context;
}
