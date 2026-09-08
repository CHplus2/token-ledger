import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  ArrowRightLeft,
  Scale,
  BookOpen,
  FileText,
  Database,
  Coins,
  ChevronRight,
} from 'lucide-react';
import { useLedger, NavigationModule } from '../../context/LedgerContext';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    transactions,
    reconciliationBreaks,
    journalEntries,
    assetValuations,
    setActiveModule,
    setSelectedTx,
  } = useLedger();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const q = query.toLowerCase();

  const filteredTx = transactions.filter(
    (t) =>
      t.businessDescription.toLowerCase().includes(q) ||
      t.externalTxId.toLowerCase().includes(q) ||
      t.txHash.toLowerCase().includes(q) ||
      t.sourceName.toLowerCase().includes(q)
  );

  const filteredJournals = journalEntries.filter(
    (j) =>
      j.journalNumber.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q)
  );

  const filteredAssets = assetValuations.filter(
    (a) => a.assetSymbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
  );

  const handleSelectNav = (mod: NavigationModule) => {
    setActiveModule(mod);
    setIsCommandPaletteOpen(false);
  };

  const handleSelectTx = (tx: any) => {
    setSelectedTx(tx);
    setActiveModule('transactions');
    setIsCommandPaletteOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-start justify-center pt-24 px-4">
      <div className="bg-[#ffffff] rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150">
        {/* Search Input */}
        <div className="flex items-center px-4 border-b border-[#e2e8f0]">
          <Search className="w-5 h-5 text-slate-600 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search subledger records, transactions, hashes, or modules (e.g. 'SOL', 'JE-00840')..."
            className="w-full py-4 text-sm bg-transparent focus:outline-none placeholder:text-slate-600 text-slate-900"
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-[#f1f5f9]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {/* Module Navigation */}
          <div>
            <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
              Quick Navigation
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleSelectNav('transactions')}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f8fafc] text-xs font-medium text-slate-700 text-left"
              >
                <ArrowRightLeft className="w-4 h-4 text-purple-600" />
                <span>Transactions Subledger</span>
              </button>
              <button
                onClick={() => handleSelectNav('reconciliation')}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f8fafc] text-xs font-medium text-slate-700 text-left"
              >
                <Scale className="w-4 h-4 text-amber-600" />
                <span>Reconciliation Matrix</span>
              </button>
              <button
                onClick={() => handleSelectNav('subledger')}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f8fafc] text-xs font-medium text-slate-700 text-left"
              >
                <BookOpen className="w-4 h-4 text-emerald-600" />
                <span>Journal Entries</span>
              </button>
              <button
                onClick={() => handleSelectNav('reports')}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-[#f8fafc] text-xs font-medium text-slate-700 text-left"
              >
                <FileText className="w-4 h-4 text-indigo-600" />
                <span>Financial Reports</span>
              </button>
            </div>
          </div>

          {/* Matched Transactions */}
          {filteredTx.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Transactions ({filteredTx.length})
              </div>
              <div className="space-y-1">
                {filteredTx.slice(0, 4).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handleSelectTx(t)}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] text-left text-xs transition-colors"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{t.businessDescription}</div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-2">
                        <span>{t.externalTxId}</span>
                        <span>•</span>
                        <span>{t.sourceName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-medium text-slate-900">
                        ${(t.fiatValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <span className="text-[10px] text-slate-600">{t.classification}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Matched Journal Entries */}
          {filteredJournals.length > 0 && (
            <div>
              <div className="px-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                Journal Entries ({filteredJournals.length})
              </div>
              <div className="space-y-1">
                {filteredJournals.slice(0, 3).map((j) => (
                  <button
                    key={j.id}
                    onClick={() => handleSelectNav('subledger')}
                    className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#f8fafc] border border-transparent hover:border-[#e2e8f0] text-left text-xs transition-colors"
                  >
                    <div>
                      <span className="font-mono font-semibold text-purple-600">{j.journalNumber}</span>
                      <span className="ml-2 text-slate-800">{j.description}</span>
                    </div>
                    <span className="font-mono text-slate-900 font-medium">
                      ${(j.totalDebit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-[#ffffff] border-t border-[#e2e8f0] flex items-center justify-between text-[11px] text-slate-600">
          <span>Tip: Press ESC to close palette</span>
          <span>Token Ledger Subledger Engine</span>
        </div>
      </div>
    </div>
  );
};
