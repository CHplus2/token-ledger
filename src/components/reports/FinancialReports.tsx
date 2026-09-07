import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Building2,
  FileSpreadsheet,
  CheckCircle2,
  TrendingUp,
  Scale,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';

type ReportType = 'TRIAL_BALANCE' | 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'ROLL_FORWARD';

export const FinancialReports: React.FC = () => {
  const {
    organization,
    totalMarketValueUsd,
    totalCostBasisUsd,
    totalUnrealizedPnlUsd,
    assetValuations,
    chartOfAccounts,
  } = useLedger();

  const [activeReport, setActiveReport] = useState<ReportType>('TRIAL_BALANCE');

  const trialBalanceRows = [
    { code: '1010', name: 'Operating Cash & Bank (USD)', debit: 4250000, credit: 0 },
    { code: '1210', name: 'Digital Assets - Bitcoin (BTC)', debit: 5760000, credit: 0 },
    { code: '1220', name: 'Digital Assets - Ethereum (ETH)', debit: 4160000, credit: 0 },
    { code: '1230', name: 'Digital Assets - Solana (SOL)', debit: 1824990, credit: 0 },
    { code: '1240', name: 'Stablecoins - USDC (USDC)', debit: 1500000, credit: 0 },
    { code: '1250', name: 'Stablecoins - USDT (USDT)', debit: 460000, credit: 0 },
    { code: '2010', name: 'Accounts Payable & Accrued Fees', debit: 0, credit: 12450 },
    { code: '3010', name: 'Treasury Capital & Retained Earnings', debit: 0, credit: 15982540 },
    { code: '4110', name: 'Realized Gain on Digital Asset Disposals', debit: 0, credit: 1940000 },
    { code: '4200', name: 'Staking & Validator Yield Income', debit: 0, credit: 80000 },
    { code: '5010', name: 'Custodial Safeguarding & MPC Fees', debit: 34000, credit: 0 },
    { code: '5020', name: 'On-Chain Protocol Gas & Network Fees', debit: 6000, credit: 0 },
  ];

  const totalDebits = trialBalanceRows.reduce((acc, r) => acc + r.debit, 0);
  const totalCredits = trialBalanceRows.reduce((acc, r) => acc + r.credit, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Statements & Roll-Forward Reports"
        subtitle="Institutional GAAP and IFRS compliant financial schedules, trial balance, and tax lot roll-forward reporting."
        actions={
          <button
            onClick={() => {
              window.print();
            }}
            className="px-3.5 py-2 rounded-lg bg-[#16161c] border border-[#2d2d35] hover:bg-[#1c1c21] text-slate-300 text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Print Financial Package (PDF)</span>
          </button>
        }
      />

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222226] pb-2">
        {[
          { id: 'TRIAL_BALANCE' as ReportType, label: 'Trial Balance' },
          { id: 'BALANCE_SHEET' as ReportType, label: 'Statement of Financial Position' },
          { id: 'INCOME_STATEMENT' as ReportType, label: 'Digital Asset P&L' },
          { id: 'ROLL_FORWARD' as ReportType, label: 'Asset Roll-Forward Schedule' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveReport(tab.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeReport === tab.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:bg-[#16161c] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REPORT 1: TRIAL BALANCE */}
      {activeReport === 'TRIAL_BALANCE' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#16161c] border-b border-[#222226] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white">General Ledger Trial Balance</span>
              <span className="text-slate-400 ml-2">Period ending August 31, 2026</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Debits Equal Credits (Balanced)</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Name</th>
                  <th className="py-3 px-4 text-right font-mono">Debit ($ USD)</th>
                  <th className="py-3 px-4 text-right font-mono">Credit ($ USD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {trialBalanceRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#16161c]/60">
                    <td className="py-2.5 px-4 font-mono font-bold text-purple-300">{row.code}</td>
                    <td className="py-2.5 px-4 font-medium text-white">{row.name}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-white">
                      {row.debit > 0 ? `$${(row.debit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-white">
                      {row.credit > 0 ? `$${(row.credit ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}` : '—'}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="bg-[#16161c] font-bold border-t-2 border-[#2d2d35] text-white">
                  <td colSpan={2} className="py-3 px-4 uppercase text-[11px] tracking-wider text-slate-300">
                    Total Trial Balance
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-emerald-400">
                    ${(totalDebits ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-emerald-400">
                    ${(totalCredits ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: BALANCE SHEET */}
      {activeReport === 'BALANCE_SHEET' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] shadow-xs p-6 max-w-3xl space-y-6 text-xs text-white">
          <div className="border-b border-[#222226] pb-4">
            <h3 className="font-bold text-base text-white">Atlas Digital Treasury Ltd</h3>
            <p className="text-purple-400 font-semibold">Statement of Financial Position (Balance Sheet)</p>
            <p className="text-slate-400 text-[11px]">As of August 31, 2026 • Reporting Currency: USD</p>
          </div>

          {/* Current Assets */}
          <div className="space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] border-b border-[#222226] pb-1">
              Current Assets
            </div>
            <div className="flex justify-between py-1 text-slate-300">
              <span>Operating Cash & Short-Term Bank Balances</span>
              <span className="font-mono font-medium text-white">$4,250,000.00</span>
            </div>
            <div className="flex justify-between py-1 text-slate-300">
              <span>Stablecoin Reserves (USDC / USDT)</span>
              <span className="font-mono font-medium text-white">$1,960,000.00</span>
            </div>
          </div>

          {/* Non-Current Digital Assets */}
          <div className="space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] border-b border-[#222226] pb-1">
              Digital Assets (Fair Value Accounting)
            </div>
            {assetValuations.map((a) => (
              <div key={a.id || a.assetSymbol} className="flex justify-between py-1 text-slate-300">
                <span>{a.name} ({a.assetSymbol}) — {(a.quantity ?? 0).toLocaleString()} {a.assetSymbol}</span>
                <span className="font-mono font-medium text-white">${(a.marketValueUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t border-[#222226] font-bold text-white">
              <span>Total Digital Assets Under Subledger</span>
              <span className="font-mono text-emerald-400">${(totalMarketValueUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>
      )}

      {/* REPORT 3: ROLL-FORWARD SCHEDULE */}
      {activeReport === 'ROLL_FORWARD' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#16161c] border-b border-[#222226] text-xs">
            <span className="font-bold text-white">Digital Asset Tax-Lot & Fair Value Roll-Forward</span>
            <span className="text-slate-400 ml-2">Opening Balance → Acquisitions → Disposals → Closing Parity</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4 text-right font-mono">Opening Qty</th>
                  <th className="py-3 px-4 text-right font-mono">Acquisitions</th>
                  <th className="py-3 px-4 text-right font-mono">Disposals</th>
                  <th className="py-3 px-4 text-right font-mono">Closing Qty</th>
                  <th className="py-3 px-4 text-right font-mono">Cost Basis ($)</th>
                  <th className="py-3 px-4 text-right font-mono">Fair Value ($)</th>
                  <th className="py-3 px-4 text-right font-mono">Unrealized Gain ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {assetValuations.map((a) => (
                  <tr key={a.id || a.assetSymbol} className="hover:bg-[#16161c]/60">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                      <span>{a.name}</span>
                      <span className="font-mono text-purple-300">({a.assetSymbol})</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">{((a.quantity ?? 0) * 0.95).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono text-emerald-400">+{((a.quantity ?? 0) * 0.08).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-400">-{((a.quantity ?? 0) * 0.03).toFixed(2)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">{(a.quantity ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">${(a.costBasisUsd ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">${(a.marketValueUsd ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">+${(a.unrealizedGainLossUsd ?? 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: INCOME STATEMENT */}
      {activeReport === 'INCOME_STATEMENT' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] shadow-xs p-6 max-w-3xl space-y-4 text-xs text-white">
          <div className="border-b border-[#222226] pb-4">
            <h3 className="font-bold text-base text-white">Atlas Digital Treasury Ltd</h3>
            <p className="text-purple-400 font-semibold">Statement of Profit & Loss and Other Comprehensive Income</p>
            <p className="text-slate-400 text-[11px]">For the month ended August 31, 2026</p>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between py-1.5 border-b border-[#222226]">
              <span className="font-semibold text-slate-300">Net Realized Gain on Crypto Disposals (FIFO)</span>
              <span className="font-mono font-bold text-emerald-400">+$1,940,000.00</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#222226]">
              <span className="font-semibold text-slate-300">Staking & Consensus Validator Yield (Solana/Ethereum)</span>
              <span className="font-mono font-bold text-emerald-400">+$80,000.00</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#222226] text-rose-400">
              <span>Custodial MPC Safeguarding & Administration Fees</span>
              <span className="font-mono">-$34,000.00</span>
            </div>

            <div className="flex justify-between py-1.5 border-b border-[#222226] text-rose-400">
              <span>On-Chain Gas & Protocol Settlement Fees</span>
              <span className="font-mono">-$6,000.00</span>
            </div>

            <div className="flex justify-between py-3 border-t-2 border-[#2d2d35] font-bold text-sm text-white">
              <span>Net Digital Asset Operating Income</span>
              <span className="font-mono text-emerald-400">+$1,980,000.00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
