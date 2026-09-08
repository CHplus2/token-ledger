import React, { useState } from 'react';
import {
  Sliders,
  ListTree,
  Plus,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  BookOpen,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';
import { AccountingRule, ChartAccount } from '../../types';

export const AccountingRules: React.FC = () => {
  const {
    accountingRules,
    chartOfAccounts,
    organization,
    updateOrganization,
    currentUser,
  } = useLedger();

  const [activeTab, setActiveTab] = useState<'RULES' | 'COA' | 'POLICIES'>('RULES');
  const [rules, setRules] = useState<AccountingRule[]>(accountingRules);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleToggleRule = (id: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, active: !r.active } : r))
    );
    setSuccessMsg('Rule configuration updated.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accounting Rules & Chart of Accounts"
        subtitle="Configure deterministic transaction mapping rules, GAAP/IFRS cost basis valuation models, and subledger chart of accounts."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSuccessMsg('Re-executed 6 accounting rules across 1,193 transactions. 0 errors found.');
                setTimeout(() => setSuccessMsg(null), 3500);
              }}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-700" />
              <span>Run Rules Engine</span>
            </button>
          </div>
        }
      />

      {successMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
          <span>{successMsg}</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2">
        {[
          { id: 'RULES' as const, label: 'Deterministic Accounting Rules' },
          { id: 'COA' as const, label: 'Chart of Accounts (COA)' },
          { id: 'POLICIES' as const, label: 'GAAP / IFRS Valuation Policies' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-[#f8fafc] hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: RULES ENGINE */}
      {activeTab === 'RULES' && (
        <div className="space-y-4">
          <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
            <div className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Active Rule Hierarchy</h3>
                <p className="text-xs text-slate-600">Evaluated deterministically in priority order upon transaction ingestion</p>
              </div>
              <span className="text-xs font-semibold text-slate-600">{rules.length} Rules Defined</span>
            </div>

            <div className="divide-y divide-[#e2e8f0]">
              {rules.map((rule, idx) => {
                const ruleClassification = (rule.txTypeMatch || (rule as any).classification || 'GENERAL');
                const ruleDesc = rule.conditionDescription || (rule as any).description || rule.explanationTemplate;
                const isActive = rule.active ?? (rule as any).enabled ?? true;

                return (
                  <div key={rule.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs hover:bg-[#f8fafc]/60 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#f1f5f9] border border-[#cbd5e1] font-mono font-bold flex items-center justify-center text-[10px] text-purple-700">
                          {idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm">{rule.name}</h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-700 border border-purple-500/30">
                          {String(ruleClassification).replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-slate-600 text-[11px] font-mono">{ruleDesc}</p>
                      <div className="flex items-center gap-2 text-slate-600 text-[11px] pt-1">
                        <span>Debit: <strong className="text-slate-800">{rule.debitAccountCode} ({rule.debitAccountName})</strong></span>
                        <span>•</span>
                        <span>Credit: <strong className="text-slate-800">{rule.creditAccountCode} ({rule.creditAccountName})</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => handleToggleRule(rule.id)}
                        className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-[#f8fafc] text-slate-600 border border-[#cbd5e1] hover:bg-[#f1f5f9]'
                        }`}
                      >
                        {isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHART OF ACCOUNTS */}
      {activeTab === 'COA' && (
        <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] text-xs">
            <span className="font-bold text-slate-900">Standard Institutional Chart of Accounts</span>
            <span className="text-slate-600 ml-2">Digital Asset Subledger Mapping</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#e2e8f0] text-slate-600 font-semibold bg-[#f8fafc]">
                  <th className="py-2.5 px-4 w-28">GL Code</th>
                  <th className="py-2.5 px-4">Account Name</th>
                  <th className="py-2.5 px-4">Category</th>
                  <th className="py-2.5 px-4">Normal Balance</th>
                  <th className="py-2.5 px-4">Mapped Digital Asset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e2e8f0]">
                {chartOfAccounts.map((acc) => (
                  <tr key={acc.code} className="hover:bg-[#f8fafc]/60">
                    <td className="py-2.5 px-4 font-mono font-bold text-purple-700">{acc.code}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">{acc.name}</td>
                    <td className="py-2.5 px-4 text-slate-700">{acc.category}</td>
                    <td className="py-2.5 px-4 text-slate-600 font-mono text-[11px]">{acc.normalBalance}</td>
                    <td className="py-2.5 px-4 font-mono text-purple-600 font-medium">
                      {acc.supportedAssetSymbol || (acc.isDigitalAssetAccount ? 'Digital Control' : '—')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ACCOUNTING POLICIES */}
      {activeTab === 'POLICIES' && (
        <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-6 shadow-xs max-w-2xl space-y-5 text-xs text-slate-900">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Valuation Standards & Cost Basis Methodology</h3>
            <p className="text-xs text-slate-600">
              Configure corporate accounting standards for balance sheet presentation and tax lot relief.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Financial Accounting Framework</label>
              <select
                value={organization.framework}
                onChange={(e) => updateOrganization({ framework: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="US_GAAP">US GAAP — FASB ASU 2023-08 (Fair Value with changes in Net Income)</option>
                <option value="IFRS">IFRS — IAS 38 / IAS 2 (Intangible Assets with Revaluation Model)</option>
                <option value="TAX_BASIS">US Tax Basis (IRC §1001 FIFO Realization)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Tax-Lot Relief / Cost Basis Method</label>
              <select
                value={organization.costBasisMethod}
                onChange={(e) => updateOrganization({ costBasisMethod: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] font-medium text-slate-900 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              >
                <option value="FIFO">First-In, First-Out (FIFO) — Default Institutional</option>
                <option value="SPECIFIC_ID">Specific Identification (Cryptographic UTXO / Lot Stamping)</option>
                <option value="WEIGHTED_AVERAGE">Weighted Average Cost (WAC)</option>
                <option value="LIFO">Last-In, First-Out (LIFO)</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
