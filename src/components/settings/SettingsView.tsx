import React, { useState } from 'react';
import {
  Settings,
  Building2,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Lock,
  Globe,
  Database,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';

export const SettingsView: React.FC = () => {
  const {
    organization,
    entities,
    updateOrganization,
  } = useLedger();

  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = () => {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Policies & Entity Configuration"
        subtitle="Manage multi-entity corporate structures, functional currencies, valuation oracle hierarchies, and internal accounting controls."
        actions={
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Configuration</span>
          </button>
        }
      />

      {savedMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-xs rounded-xl flex items-center justify-between animate-in fade-in">
          <span>Organization policies successfully updated and synced across all legal entities.</span>
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        </div>
      )}

      {/* Multi-Entity Table */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900">Configured Legal Entities</span>
            <span className="text-slate-600 ml-2">Multi-Entity Subledger Consolidation</span>
          </div>
          <span className="text-purple-600 font-semibold">{entities.length} Active Entities</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e8f0] text-slate-600 font-semibold bg-[#f8fafc]">
                <th className="py-3 px-4">Entity Code</th>
                <th className="py-3 px-4">Legal Name</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Functional Currency</th>
                <th className="py-3 px-4">Tax ID / Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {entities.map((e) => (
                <tr key={e.id} className="hover:bg-[#f8fafc]/60">
                  <td className="py-3 px-4 font-mono font-bold text-purple-700">{e.code}</td>
                  <td className="py-3 px-4 font-bold text-slate-900">{e.name}</td>
                  <td className="py-3 px-4 text-slate-700">{e.jurisdiction}</td>
                  <td className="py-3 px-4 font-mono font-medium text-slate-900">{e.functionalCurrency}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{e.taxId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Internal Controls & Dual Authorization Policies */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-6 shadow-xs max-w-3xl space-y-4 text-xs text-slate-900">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Internal Accounting Controls & Dual Authorization</h3>
          <p className="text-xs text-slate-600">Maker-Checker dual sign-off mandates and period freeze controls</p>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Enforce Maker-Checker for all Journal Postings</span>
              <span className="text-[11px] text-slate-600">Journals drafted by an accountant cannot be posted without controller sign-off.</span>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded text-purple-600 accent-purple-600 focus:ring-purple-500 cursor-pointer w-4 h-4"
            />
          </div>

          <div className="p-3.5 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 block">Automatic Re-valuation on Price Source Variance &gt; 1.5%</span>
              <span className="text-[11px] text-slate-600">Trigger audit alert if oracle feeds diverge across Pyth and Coinbase.</span>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="rounded text-purple-600 accent-purple-600 focus:ring-purple-500 cursor-pointer w-4 h-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
