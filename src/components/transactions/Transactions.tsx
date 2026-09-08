import React, { useState } from 'react';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertTriangle,
  Coins,
  ArrowRightLeft,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Layers,
  MapPin,
  Building2,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { TransactionDrawer } from './TransactionDrawer';
import { NormalizedTransaction, TransactionClassification } from '../../types';

type SavedView = 'ALL' | 'SOLANA' | 'EXCHANGES' | 'UNCLASSIFIED' | 'EXCEPTIONS' | 'AWAITING_APPROVAL';

export const Transactions: React.FC = () => {
  const {
    transactions,
    selectedTx,
    setSelectedTx,
    bulkClassifyTransactions,
    openAIWithContext,
  } = useLedger();

  const [activeView, setActiveView] = useState<SavedView>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [assetFilter, setAssetFilter] = useState<string>('ALL');
  const [locationFilter, setLocationFilter] = useState<string>('ALL');
  const [classificationFilter, setClassificationFilter] = useState<string>('ALL');
  const [selectedTxIds, setSelectedTxIds] = useState<string[]>([]);
  const [bulkClsModal, setBulkClsModal] = useState(false);

  // Filter transactions based on view and parameters
  const filteredTransactions = transactions.filter((tx) => {
    // Saved view filter
    if (activeView === 'UNCLASSIFIED' && tx.classification !== 'UNKNOWN') return false;
    if (activeView === 'SOLANA' && !tx.network.includes('Solana') && !tx.sourceName.includes('Solana')) return false;
    if (activeView === 'EXCHANGES' && !tx.sourceName.includes('Coinbase') && !tx.sourceName.includes('Kraken')) return false;
    if (activeView === 'EXCEPTIONS' && tx.reconciliationStatus !== 'BREAK' && tx.classification !== 'UNKNOWN') return false;
    if (activeView === 'AWAITING_APPROVAL' && tx.approvalStatus !== 'PENDING_APPROVAL') return false;

    // Location filter
    if (locationFilter !== 'ALL') {
      const loc = tx.location || tx.sourceName;
      if (!loc.toLowerCase().includes(locationFilter.toLowerCase())) return false;
    }

    // Asset filter
    if (assetFilter !== 'ALL') {
      if (tx.assetReceived !== assetFilter && tx.assetSent !== assetFilter) return false;
    }

    // Classification filter
    if (classificationFilter !== 'ALL' && tx.classification !== classificationFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDesc = tx.businessDescription.toLowerCase().includes(q);
      const matchId = tx.externalTxId.toLowerCase().includes(q);
      const matchHash = tx.txHash.toLowerCase().includes(q);
      const matchSource = tx.sourceName.toLowerCase().includes(q);
      const matchLocation = (tx.location || '').toLowerCase().includes(q);
      if (!matchDesc && !matchId && !matchHash && !matchSource && !matchLocation) return false;
    }

    return true;
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedTxIds(filteredTransactions.map((t) => t.id));
    } else {
      setSelectedTxIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedTxIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBulkApply = (cls: TransactionClassification) => {
    bulkClassifyTransactions(selectedTxIds, cls);
    setSelectedTxIds([]);
    setBulkClsModal(false);
  };

  const unclassifiedCount = transactions.filter((t) => t.classification === 'UNKNOWN').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transaction Records & Subledger"
        subtitle="Standardized institutional transaction records aggregated across Solana Treasury, Coinbase, Kraken, Securitize, Backed Finance, and CIMB Bank Settlement."
        actions={
          <div className="flex items-center gap-2">
            {unclassifiedCount > 0 && (
              <button
                id="btn-ai-classify-all"
                onClick={() => openAIWithContext('TRANSACTIONS_BATCH', { unclassifiedCount })}
                className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-purple-700" />
                <span>AI Auto-Classify ({unclassifiedCount})</span>
              </button>
            )}

            <button
              onClick={() => {
                const csv =
                  'Date,ExternalID,DLTReference,Description,Location,Source,Asset,Quantity,FiatValue,Classification,Reconciliation\n' +
                  filteredTransactions
                    .map(
                      (t) =>
                        `"${t.timestamp}","${t.externalTxId}","${t.txHash}","${t.businessDescription}","${t.location || t.sourceName}","${t.sourceName}","${
                          t.assetReceived || t.assetSent
                        }",${t.quantityReceived || t.quantitySent},${t.fiatValue},"${t.classification}","${
                          t.reconciliationStatus
                        }"`
                    )
                    .join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Meridian_Capital_Transactions_${Date.now()}.csv`;
                a.click();
              }}
              className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] hover:bg-[#f1f5f9] text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-purple-600" />
              <span>Export CSV</span>
            </button>
          </div>
        }
      />

      {/* Saved Views Tabs */}
      <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2">
        <div className="flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'ALL' as SavedView, label: 'All Transactions', count: transactions.length },
            { id: 'SOLANA' as SavedView, label: 'Solana Treasury', count: transactions.filter((t) => t.network.includes('Solana') || t.sourceName.includes('Solana')).length, isPurple: true },
            { id: 'EXCHANGES' as SavedView, label: 'Coinbase & Kraken', count: transactions.filter((t) => t.sourceName.includes('Coinbase') || t.sourceName.includes('Kraken')).length },
            { id: 'UNCLASSIFIED' as SavedView, label: 'Needs Review', count: unclassifiedCount, isAmber: true },
            { id: 'EXCEPTIONS' as SavedView, label: '5-Way Breaks', count: transactions.filter((t) => t.reconciliationStatus === 'BREAK').length },
            { id: 'AWAITING_APPROVAL' as SavedView, label: 'Awaiting Sign-Off', count: transactions.filter((t) => t.approvalStatus === 'PENDING_APPROVAL').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeView === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-[#f8fafc] hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  activeView === tab.id
                    ? 'bg-black/40 text-white'
                    : tab.isAmber && tab.count > 0
                    ? 'bg-amber-500/20 text-amber-700 font-bold'
                    : tab.isPurple
                    ? 'bg-purple-500/20 text-purple-700 font-bold'
                    : 'bg-[#f1f5f9] text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex-1 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search description, DLT ref, external ID, source..."
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] text-slate-900 placeholder:text-slate-600 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] font-medium text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Custody Locations</option>
            <option value="Solana">Solana Treasury</option>
            <option value="BlackRock">BlackRock Digital Wallet</option>
            <option value="Khazanah">Khazanah Digital Wallet</option>
            <option value="CIMB Digital">CIMB Digital Wallet</option>
            <option value="Coinbase">Coinbase Institutional</option>
            <option value="Kraken">Kraken Pro OTC</option>
            <option value="Securitize">Securitize Registry</option>
            <option value="Backed">Backed Swiss Custody</option>
          </select>

          <select
            value={assetFilter}
            onChange={(e) => setAssetFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] font-medium text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Tokenized Assets</option>
            <option value="BUIDL">BUIDL (BlackRock USD Fund)</option>
            <option value="MY-SUKUK-01">MY-SUKUK-01 (Sovereign Sukuk)</option>
            <option value="CIMB-DEP">CIMB-DEP (Tokenized Deposit)</option>
            <option value="bNVDA">bNVDA (Backed NVIDIA Equity)</option>
            <option value="USDC">USDC (USD Coin)</option>
            <option value="SOL">SOL (Solana Fee Asset)</option>
          </select>

          <select
            value={classificationFilter}
            onChange={(e) => setClassificationFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] font-medium text-slate-800 focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Subledger Classifications</option>
            <option value="PURCHASE">Asset Subscription / Purchase</option>
            <option value="SALE">Asset Redemption / Sale</option>
            <option value="INTERNAL_TRANSFER">Cross-Venue Transfer</option>
            <option value="DIVIDEND_DISTRIBUTION">Yield / Dividend Distribution</option>
            <option value="COUPON_PAYMENT">Sukuk Coupon Payment</option>
            <option value="CUSTODY_FEE">Custodial & Safe-keeping Fee</option>
            <option value="NETWORK_FEE">Network Gas / Network Fee</option>
            <option value="UNKNOWN">Needs Review</option>
          </select>
        </div>

        {/* Bulk Action Trigger */}
        {selectedTxIds.length > 0 && (
          <div className="flex items-center gap-2 bg-purple-500/15 px-3 py-1.5 rounded-lg border border-purple-500/30">
            <span className="font-bold text-purple-700">{selectedTxIds.length} Selected</span>
            <button
              onClick={() => setBulkClsModal(true)}
              className="px-2.5 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs cursor-pointer"
            >
              Bulk Classify
            </button>
          </div>
        )}
      </div>

      {/* Main Transactions Financial Table */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e8f0] text-slate-600 font-semibold bg-[#f8fafc]">
                <th className="py-3 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedTxIds.length === filteredTransactions.length &&
                      filteredTransactions.length > 0
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded bg-[#f8fafc] border-[#cbd5e1] text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Transaction Description & DLT Ref</th>
                <th className="py-3 px-3">Custody Location & Source</th>
                <th className="py-3 px-3">Tokenized Movement</th>
                <th className="py-3 px-3 text-right">Fair Value (USD)</th>
                <th className="py-3 px-3">Subledger Classification</th>
                <th className="py-3 px-3">Reconciliation</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredTransactions.map((tx) => {
                const isSelected = selectedTxIds.includes(tx.id);
                const isSolana = tx.network.includes('Solana') || tx.sourceName.includes('Solana');

                return (
                  <tr
                    key={tx.id}
                    className={`hover:bg-[#f8fafc]/80 transition-colors ${
                      isSelected ? 'bg-purple-950/20' : ''
                    }`}
                  >
                    <td className="py-3 px-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(tx.id)}
                        className="rounded bg-[#f8fafc] border-[#cbd5e1] text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                    </td>

                    <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">
                      {tx.timestamp.split(' ')[0]}
                    </td>

                    <td
                      className="py-3 px-3 font-medium text-slate-900 cursor-pointer hover:text-purple-600"
                      onClick={() => setSelectedTx(tx)}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-slate-900">{tx.businessDescription}</span>
                        {isSolana && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-700 border border-purple-500/30">
                            SOLANA
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] text-slate-600 font-mono truncate max-w-[240px]" title={tx.txHash}>
                        {tx.txHash ? `DLT Ref: ${tx.txHash}` : `Ext ID: ${tx.externalTxId}`}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      <div className="flex items-center gap-1 font-medium text-slate-800">
                        <MapPin className="w-3 h-3 text-slate-600 shrink-0" />
                        <span>{tx.location || tx.sourceName}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-mono block ml-4">{tx.sourceName}</span>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium whitespace-nowrap">
                      {tx.quantityReceived && (
                        <span className="text-emerald-600 block">
                          +{tx.quantityReceived.toLocaleString()} {tx.assetReceived}
                        </span>
                      )}
                      {tx.quantitySent && (
                        <span className="text-slate-700 block">
                          -{tx.quantitySent.toLocaleString()} {tx.assetSent}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                      ${(tx.fiatValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={tx.classification} size="sm" />
                    </td>

                    <td className="py-3 px-3">
                      <StatusBadge status={tx.reconciliationStatus} size="sm" />
                    </td>

                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => setSelectedTx(tx)}
                        className="px-2.5 py-1 rounded-lg bg-[#f8fafc] hover:bg-[#f1f5f9] text-slate-800 border border-[#e2e8f0] font-semibold text-[11px] transition-colors cursor-pointer"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-600">
                    No transactions match the selected filters or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Detail Slide-Out Drawer */}
      <TransactionDrawer tx={selectedTx} onClose={() => setSelectedTx(null)} />

      {/* Bulk Classification Modal */}
      {bulkClsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-md p-6 animate-in zoom-in-95 text-slate-900">
            <h3 className="font-bold text-slate-900 text-base mb-1">
              Bulk Classify {selectedTxIds.length} Transactions
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Apply a uniform institutional accounting classification and update journal entries.
            </p>

            <div className="space-y-2">
              {[
                { cls: 'DIVIDEND_DISTRIBUTION' as TransactionClassification, label: 'Fund Yield & Dividend Distribution' },
                { cls: 'INTERNAL_TRANSFER' as TransactionClassification, label: 'Internal Cross-Venue Transfer' },
                { cls: 'CUSTODY_FEE' as TransactionClassification, label: 'Custodial Safeguarding Fee' },
                { cls: 'NETWORK_FEE' as TransactionClassification, label: 'Protocol Gas / Network Fee' },
                { cls: 'PURCHASE' as TransactionClassification, label: 'Asset Subscription / Purchase' },
              ].map((item) => (
                <button
                  key={item.cls}
                  onClick={() => handleBulkApply(item.cls)}
                  className="w-full text-left p-3 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:border-purple-500/50 hover:bg-[#f1f5f9] text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-[#e2e8f0] flex justify-end">
              <button
                onClick={() => setBulkClsModal(false)}
                className="px-3 py-1.5 rounded-lg border border-[#cbd5e1] hover:bg-[#f1f5f9] text-xs font-medium text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
