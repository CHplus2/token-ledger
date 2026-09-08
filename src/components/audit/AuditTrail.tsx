import React, { useState } from 'react';
import {
  History,
  Shield,
  Download,
  Search,
  CheckCircle2,
  FileText,
  Layers,
  ArrowRight,
  Database,
  Lock,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';

export const AuditTrail: React.FC = () => {
  const { auditLogs, auditTrail, currentUser } = useLedger();
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'LOGS' | 'LINEAGE'>('LOGS');

  const logsList = auditLogs ?? auditTrail ?? [];
  const searchLower = (search ?? '').toLowerCase();

  const filteredLogs = logsList.filter(
    (l) =>
      (l.action ?? '').toLowerCase().includes(searchLower) ||
      (l.details ?? l.notes ?? '').toLowerCase().includes(searchLower) ||
      (l.userName ?? '').toLowerCase().includes(searchLower) ||
      (l.targetType ?? l.objectType ?? '').toLowerCase().includes(searchLower)
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Trail & Cryptographic Data Lineage"
        subtitle="Immutable SOC-1 Type II compliant audit logs recording every classification change, break resolution, and Maker-Checker approval."
        actions={
          <button
            onClick={() => {
              const text = JSON.stringify(auditLogs, null, 2);
              const blob = new Blob([text], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `TokenLedger_SOC1_AuditLogs_${Date.now()}.json`;
              a.click();
            }}
            className="px-3.5 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] hover:bg-[#f1f5f9] text-slate-700 text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Auditor Package (JSON)</span>
          </button>
        }
      />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#e2e8f0] pb-2">
        <button
          onClick={() => setActiveTab('LOGS')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'LOGS'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#f8fafc] hover:text-slate-900'
          }`}
        >
          Immutable Event Logs ({logsList.length})
        </button>
        <button
          onClick={() => setActiveTab('LINEAGE')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
            activeTab === 'LINEAGE'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-[#f8fafc] hover:text-slate-900'
          }`}
        >
          End-to-End Cryptographic Data Lineage
        </button>
      </div>

      {activeTab === 'LOGS' && (
        <div className="space-y-4">
          <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-4 shadow-xs flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search audit trail by actor, action description, target record..."
              className="w-full text-xs text-slate-900 placeholder:text-slate-600 focus:outline-none bg-transparent"
            />
          </div>

          <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#e2e8f0] text-slate-600 font-semibold bg-[#f8fafc]">
                    <th className="py-3 px-4">Timestamp</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Action Taken</th>
                    <th className="py-3 px-4">Target Entity / Record</th>
                    <th className="py-3 px-4">Details & Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e2e8f0]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#f8fafc]/60">
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {log.timestamp}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {log.userName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-700">
                        <span className="px-1.5 py-0.5 rounded bg-[#f1f5f9] border border-[#cbd5e1] text-purple-700 text-[10px] font-bold">
                          {log.userRole}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-purple-600 font-mono text-[11px]">
                        {log.action}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="font-mono text-slate-900 font-medium">{log.targetType || log.objectType}</span>
                        {(log.targetId || log.objectId) && <span className="block text-[10px] text-slate-600 font-mono">{log.targetId || log.objectId}</span>}
                      </td>
                      <td className="py-3 px-4 text-slate-600 max-w-md">
                        {log.details || log.notes}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'LINEAGE' && (
        <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-6 shadow-xs space-y-6 text-slate-900">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Five-Stage Cryptographic Accounting Lineage</h3>
            <p className="text-xs text-slate-600">How on-chain raw bytes transform into verified general ledger balance sheet entries</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {[
              { step: '1', title: 'On-Chain Ingestion', desc: 'Solana/EVM node blocks & Fireblocks APIs read cryptographically' },
              { step: '2', title: 'Data Normalization', desc: 'Standardized into normalized multi-asset movements with VWAP prices' },
              { step: '3', title: 'Rules Engine', desc: 'Evaluates staking yield, transfer, & disposal classification logic' },
              { step: '4', title: 'Maker-Checker Journal', desc: 'Subledger prepares balanced double-entry batches with dual approval' },
              { step: '5', title: 'ERP Posting', desc: 'Exported as immutable SAP / NetSuite journals to Corporate GL' },
            ].map((s) => (
              <div key={s.step} className="p-4 rounded-xl border border-[#e2e8f0] bg-[#f8fafc] flex flex-col justify-between space-y-2">
                <div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center mb-2">
                    {s.step}
                  </div>
                  <div className="font-bold text-slate-900 text-xs">{s.title}</div>
                  <p className="text-[11px] text-slate-600 mt-1 leading-tight">{s.desc}</p>
                </div>
                <div className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Immutable Proof</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
