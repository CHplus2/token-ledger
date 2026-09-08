import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Download,
  ChevronDown,
  ChevronRight,
  Shield,
  Clock,
  ArrowRight,
  UserCheck,
  Building2,
  FileText,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { JournalEntry, JournalLine } from '../../types';

export const SubledgerJournals: React.FC = () => {
  const {
    journalEntries,
    approveJournalEntry,
    postJournalEntry,
    createJournalEntry,
    currentUser,
    entities,
    organization,
    chartOfAccounts,
  } = useLedger();

  const [expandedJournalIds, setExpandedJournalIds] = useState<string[]>(['je_1', 'je_2']);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [erpExportStatus, setErpExportStatus] = useState<string | null>(null);

  // Form State for new journal
  const [description, setDescription] = useState('');
  const [entityId, setEntityId] = useState(entities[0].id);
  const [lines, setLines] = useState<
    Array<{ accountCode: string; accountName: string; debit: number; credit: number; assetQty?: string; assetSymbol?: string }>
  >([
    { accountCode: '1230', accountName: 'Digital Assets - Solana (SOL)', debit: 6205, credit: 0, assetQty: '42.5', assetSymbol: 'SOL' },
    { accountCode: '4200', accountName: 'Staking & Validator Yield Income', debit: 0, credit: 6205 },
  ]);

  const toggleExpand = (id: string) => {
    setExpandedJournalIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExportERP = async (format: 'NETSUITE' | 'SAP' | 'CSV') => {
    setErpExportStatus(`Generating ${format} package...`);
    try {
      const res = await fetch('/api/export/erp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format, period: '2026-08' }),
      });
      const data = await res.json();
      setErpExportStatus(`Exported ${data.format} file (${data.filename}) successfully.`);
      setTimeout(() => setErpExportStatus(null), 3500);

      // Download payload as file
      const blob = new Blob([data.payload], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      a.click();
    } catch (e) {
      setErpExportStatus('Export failed.');
    }
  };

  const totalDebitSum = lines.reduce((acc, l) => acc + (Number(l.debit) || 0), 0);
  const totalCreditSum = lines.reduce((acc, l) => acc + (Number(l.credit) || 0), 0);
  const isBalanced = totalDebitSum > 0 && Math.abs(totalDebitSum - totalCreditSum) < 0.01;

  const handleSaveJournal = () => {
    if (!isBalanced || !description.trim()) return;

    createJournalEntry({
      entityId,
      entityName: entities.find((e) => e.id === entityId)?.name || organization.name,
      period: '2026-08',
      postingDate: '2026-08-31',
      description,
      sourceType: 'MANUAL_ADJUSTMENT',
      lines: lines.map((l, idx) => ({
        id: `line_${Date.now()}_${idx}`,
        journalId: '',
        accountCode: l.accountCode,
        accountName: l.accountName,
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
        assetQuantity: l.assetQty ? Number(l.assetQty) : undefined,
        assetSymbol: l.assetSymbol,
        description: description,
      })),
    });

    setIsCreateModalOpen(false);
    setDescription('');
  };

  const isMaker = currentUser.role === 'ACCOUNTANT';
  const isChecker = currentUser.role === 'CONTROLLER' || currentUser.role === 'CFO' || currentUser.role === 'ADMIN';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subledger & General Ledger Journal Entries"
        subtitle="Cryptographically verified double-entry accounting journals with Maker-Checker dual control separation and ERP integration."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleExportERP('NETSUITE')}
              className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] hover:bg-[#f1f5f9] text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export NetSuite CSV</span>
            </button>

            <button
              onClick={() => handleExportERP('SAP')}
              className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] hover:bg-[#f1f5f9] text-slate-700 text-xs font-semibold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export SAP IDoc</span>
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ New Journal Batch</span>
            </button>
          </div>
        }
      />

      {/* ERP Export Notification */}
      {erpExportStatus && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
          <span>{erpExportStatus}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>
      )}

      {/* Maker-Checker Role Callout */}
      <div className="rounded-xl bg-[#ffffff] border border-[#e2e8f0] text-slate-900 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <UserCheck className="w-5 h-5 text-purple-600 shrink-0" />
          <div>
            <span className="font-bold text-slate-900">Active Dual-Control Workflow: </span>
            <span className="text-slate-600">
              Current user: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.role}).{' '}
              {isChecker ? (
                <span className="text-emerald-600 font-semibold">Authorized to approve & post journals to GL.</span>
              ) : (
                <span className="text-amber-600 font-semibold">Maker mode (can prepare journals, controller must approve).</span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Journal Entries List */}
      <div className="space-y-4">
        {journalEntries.map((journal) => {
          const isExpanded = expandedJournalIds.includes(journal.id);

          return (
            <div
              key={journal.id}
              className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden transition-all"
            >
              {/* Journal Card Header */}
              <div
                onClick={() => toggleExpand(journal.id)}
                className="p-4 bg-[#f8fafc] hover:bg-[#f1f5f9] cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#e2e8f0]"
              >
                <div className="flex items-center gap-3">
                  <button className="text-slate-600 hover:text-slate-900">
                    {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-purple-600 text-xs">
                        {journal.journalNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-900">
                        {journal.description}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#f1f5f9] border border-[#cbd5e1] text-slate-700 rounded">
                        {journal.period}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-2 mt-0.5">
                      <span>{journal.entityName}</span>
                      <span>•</span>
                      <span>Prepared by {journal.createdByName} on {journal.postingDate}</span>
                      {journal.approvedByName && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-600 font-medium">Approved by {journal.approvedByName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-right">
                    <span className="block text-[10px] uppercase font-bold text-slate-600">Total Balanced Value</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      ${(journal.totalDebit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <StatusBadge status={journal.status} size="sm" />

                  {/* Approve / Post Action Buttons */}
                  {journal.status === 'PENDING_APPROVAL' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        approveJournalEntry(journal.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve Batch</span>
                    </button>
                  )}

                  {journal.status === 'APPROVED' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        postJournalEntry(journal.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Post to GL</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Journal Line Items Table (Expanded) */}
              {isExpanded && (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#e2e8f0] text-slate-600 font-semibold bg-[#f8fafc]">
                        <th className="py-2.5 px-4 w-28">GL Account</th>
                        <th className="py-2.5 px-4">Account Description</th>
                        <th className="py-2.5 px-4">Line Memo & Reference</th>
                        <th className="py-2.5 px-4 text-right font-mono">Digital Asset Qty</th>
                        <th className="py-2.5 px-4 text-right font-mono">Debit (USD)</th>
                        <th className="py-2.5 px-4 text-right font-mono">Credit (USD)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#e2e8f0] bg-[#ffffff]">
                      {journal.lines.map((line) => (
                        <tr key={line.id} className="hover:bg-[#f8fafc]/60">
                          <td className="py-2.5 px-4 font-mono font-bold text-purple-700">
                            {line.accountCode}
                          </td>
                          <td className="py-2.5 px-4 font-medium text-slate-900">
                            {line.accountName}
                          </td>
                          <td className="py-2.5 px-4 text-slate-600">
                            {line.description}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono text-slate-700">
                            {line.assetQuantity ? `${line.assetQuantity} ${line.assetSymbol || ''}` : '—'}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                            {line.debit > 0 ? `$${(line.debit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                          </td>
                          <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900">
                            {line.credit > 0 ? `$${(line.credit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                          </td>
                        </tr>
                      ))}

                      {/* Totals Row */}
                      <tr className="bg-[#f8fafc] font-bold border-t border-[#e2e8f0] text-slate-900">
                        <td colSpan={4} className="py-2.5 px-4 text-right uppercase tracking-wider text-[10px] text-slate-600">
                          Total Balanced Journal
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-emerald-600">
                          ${(journal.totalDebit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2.5 px-4 text-right font-mono text-emerald-600">
                          ${(journal.totalCredit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Manual Create Journal Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#ffffff] rounded-xl shadow-2xl border border-[#e2e8f0] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 text-slate-900">
            <div className="px-6 py-4 bg-[#f8fafc] border-b border-[#e2e8f0] text-slate-900 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Create Manual Adjusting Journal Entry</h3>
                <p className="text-xs text-slate-600">August 2026 Accounting Period</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Legal Entity</label>
                  <select
                    value={entityId}
                    onChange={(e) => setEntityId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    {entities.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Posting Date</label>
                  <input
                    type="date"
                    defaultValue="2026-08-31"
                    className="w-full px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Journal Description / Memo</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Month-End Fair Value Mark-to-Market reclassification"
                  className="w-full px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] font-medium text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>

              {/* Journal Lines Table */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold uppercase tracking-wider text-slate-600">Journal Lines (Debit / Credit)</label>
                  <span className={`font-mono font-bold ${isBalanced ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {isBalanced ? '✓ Debits Equal Credits' : `Difference: $${Math.abs(totalDebitSum - totalCreditSum).toFixed(2)}`}
                  </span>
                </div>

                <div className="space-y-2">
                  {lines.map((l, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-[#f8fafc] p-2.5 rounded-lg border border-[#e2e8f0]">
                      <div className="col-span-5">
                        <select
                          value={l.accountCode}
                          onChange={(e) => {
                            const acc = chartOfAccounts.find((a) => a.code === e.target.value);
                            const newLines = [...lines];
                            newLines[idx].accountCode = e.target.value;
                            newLines[idx].accountName = acc?.name || '';
                            setLines(newLines);
                          }}
                          className="w-full px-2 py-1.5 rounded border border-[#cbd5e1] text-xs bg-[#ffffff] text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        >
                          {chartOfAccounts.map((a) => (
                            <option key={a.id} value={a.code}>
                              {a.code} — {a.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          value={l.debit || ''}
                          placeholder="Debit $"
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[idx].debit = Number(e.target.value);
                            setLines(newLines);
                          }}
                          className="w-full px-2 py-1.5 rounded border border-[#cbd5e1] text-xs font-mono bg-[#ffffff] text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <div className="col-span-3">
                        <input
                          type="number"
                          value={l.credit || ''}
                          placeholder="Credit $"
                          onChange={(e) => {
                            const newLines = [...lines];
                            newLines[idx].credit = Number(e.target.value);
                            setLines(newLines);
                          }}
                          className="w-full px-2 py-1.5 rounded border border-[#cbd5e1] text-xs font-mono bg-[#ffffff] text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>

                      <div className="col-span-1 text-center">
                        {lines.length > 2 && (
                          <button
                            onClick={() => setLines(lines.filter((_, i) => i !== idx))}
                            className="text-rose-600 hover:text-rose-700 cursor-pointer"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#f8fafc] border-t border-[#e2e8f0] flex items-center justify-between">
              <button
                onClick={() =>
                  setLines([
                    ...lines,
                    { accountCode: '1010', accountName: 'Operating Cash - USD', debit: 0, credit: 0 },
                  ])
                }
                className="text-xs font-semibold text-purple-600 hover:text-purple-700 cursor-pointer"
              >
                + Add Line
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-2 rounded-lg border border-[#cbd5e1] hover:bg-[#f1f5f9] text-xs font-medium text-slate-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveJournal}
                  disabled={!isBalanced || !description.trim()}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Create Journal Draft
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
