import React, { useMemo, useState } from 'react';
import {
  Download,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';
import { ChartAccount } from '../../types';

type ReportType = 'TRIAL_BALANCE' | 'BALANCE_SHEET' | 'INCOME_STATEMENT' | 'ROLL_FORWARD';

const usd = (v: number) =>
  `$${(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// The "digital asset control" account (e.g. 1200) is a rollup of the
// individual asset sub-accounts (1210, 1220, ...) for display in the Chart
// of Accounts tab. It carries `isDigitalAssetAccount` but no
// `supportedAssetSymbol` (unlike the real postable sub-accounts), so it's
// excluded here to avoid double-counting its children in report totals.
const isControlAccount = (a: ChartAccount) => !!a.isDigitalAssetAccount && !a.supportedAssetSymbol;

const postable = (accounts: ChartAccount[]) => accounts.filter((a) => a.active && !isControlAccount(a));

function debitOf(a: ChartAccount) {
  return a.normalBalance === 'DEBIT' ? a.balance : 0;
}
function creditOf(a: ChartAccount) {
  return a.normalBalance === 'CREDIT' ? a.balance : 0;
}
function sum(accounts: ChartAccount[]) {
  return accounts.reduce((s, a) => s + a.balance, 0);
}

export const FinancialReports: React.FC = () => {
  const { organization, assetValuations, chartOfAccounts } = useLedger();

  const [activeReport, setActiveReport] = useState<ReportType>('TRIAL_BALANCE');

  const accounts = useMemo(() => postable(chartOfAccounts), [chartOfAccounts]);

  const assets = useMemo(() => accounts.filter((a) => a.category === 'ASSET'), [accounts]);
  const liabilities = useMemo(() => accounts.filter((a) => a.category === 'LIABILITY'), [accounts]);
  const equity = useMemo(() => accounts.filter((a) => a.category === 'EQUITY'), [accounts]);
  const income = useMemo(() => accounts.filter((a) => a.category === 'INCOME'), [accounts]);
  const expenses = useMemo(() => accounts.filter((a) => a.category === 'EXPENSE'), [accounts]);

  const totalAssets = sum(assets);
  const totalLiabilities = sum(liabilities);
  const totalEquity = sum(equity);
  const totalIncome = sum(income);
  const totalExpenses = sum(expenses);
  const netIncome = totalIncome - totalExpenses;

  const totalDebits = accounts.reduce((s, a) => s + debitOf(a), 0);
  const totalCredits = accounts.reduce((s, a) => s + creditOf(a), 0);
  const trialBalanced = Math.abs(totalDebits - totalCredits) < 0.01;

  // Before period-close, current-period Net Income sits in the temporary
  // Income/Expense accounts rather than Retained Earnings yet, so it's
  // included in Equity here for presentation purposes only.
  const totalLiabEquityAndNetIncome = totalLiabilities + totalEquity + netIncome;
  const balanceSheetBalanced = Math.abs(totalAssets - totalLiabEquityAndNetIncome) < 0.01;

  const closeDate = organization.periodCloseDate || new Date().toISOString().slice(0, 10);
  const currency = organization.reportingCurrency || 'USD';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Statements & Roll-Forward Reports"
        subtitle="Balance Sheet, Profit & Loss, and Trial Balance generated live from the Chart of Accounts — not static text."
        actions={
          <button
            onClick={() => window.print()}
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
          { id: 'BALANCE_SHEET' as ReportType, label: 'Balance Sheet' },
          { id: 'INCOME_STATEMENT' as ReportType, label: 'Profit & Loss' },
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
              <span className="text-slate-400 ml-2">Period ending {closeDate}</span>
            </div>
            <div className={`flex items-center gap-1.5 font-bold ${trialBalanced ? 'text-emerald-400' : 'text-rose-400'}`}>
              {trialBalanced ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              <span>{trialBalanced ? 'Debits Equal Credits (Balanced)' : 'Out of Balance — review Chart of Accounts'}</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
                  <th className="py-3 px-4">Account Code</th>
                  <th className="py-3 px-4">Account Name</th>
                  <th className="py-3 px-4 text-right font-mono">Debit ({currency})</th>
                  <th className="py-3 px-4 text-right font-mono">Credit ({currency})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {accounts.map((row) => (
                  <tr key={row.code} className="hover:bg-[#16161c]/60">
                    <td className="py-2.5 px-4 font-mono font-bold text-purple-300">{row.code}</td>
                    <td className="py-2.5 px-4 font-medium text-white">{row.name}</td>
                    <td className="py-2.5 px-4 text-right font-mono text-white">
                      {debitOf(row) > 0 ? usd(debitOf(row)) : '—'}
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-white">
                      {creditOf(row) > 0 ? usd(creditOf(row)) : '—'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-[#16161c] font-bold border-t-2 border-[#2d2d35] text-white">
                  <td colSpan={2} className="py-3 px-4 uppercase text-[11px] tracking-wider text-slate-300">
                    Total Trial Balance
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-emerald-400">{usd(totalDebits)}</td>
                  <td className="py-3 px-4 text-right font-mono text-sm text-emerald-400">{usd(totalCredits)}</td>
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
            <h3 className="font-bold text-base text-white">{organization.name}</h3>
            <p className="text-purple-400 font-semibold">Statement of Financial Position (Balance Sheet)</p>
            <p className="text-slate-400 text-[11px]">As of {closeDate} • Reporting Currency: {currency}</p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] border-b border-[#222226] pb-1">
              Assets
            </div>
            {assets.map((a) => (
              <div key={a.code} className="flex justify-between py-1 text-slate-300">
                <span>
                  <span className="font-mono text-purple-300 mr-2">{a.code}</span>
                  {a.name}
                </span>
                <span className="font-mono font-medium text-white">{usd(a.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t border-[#222226] font-bold text-white">
              <span>Total Assets</span>
              <span className="font-mono text-emerald-400">{usd(totalAssets)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] border-b border-[#222226] pb-1">
              Liabilities
            </div>
            {liabilities.map((a) => (
              <div key={a.code} className="flex justify-between py-1 text-slate-300">
                <span>
                  <span className="font-mono text-purple-300 mr-2">{a.code}</span>
                  {a.name}
                </span>
                <span className="font-mono font-medium text-white">{usd(a.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-2 border-t border-[#222226] font-bold text-white">
              <span>Total Liabilities</span>
              <span className="font-mono">{usd(totalLiabilities)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] border-b border-[#222226] pb-1">
              Equity
            </div>
            {equity.map((a) => (
              <div key={a.code} className="flex justify-between py-1 text-slate-300">
                <span>
                  <span className="font-mono text-purple-300 mr-2">{a.code}</span>
                  {a.name}
                </span>
                <span className="font-mono font-medium text-white">{usd(a.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1 text-slate-300">
              <span>Current-Period Net Income (unclosed — see Profit &amp; Loss)</span>
              <span className={`font-mono font-medium ${netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {usd(netIncome)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-[#222226] font-bold text-white">
              <span>Total Equity</span>
              <span className="font-mono">{usd(totalEquity + netIncome)}</span>
            </div>
          </div>

          <div
            className={`flex items-center justify-between py-3 px-4 rounded-lg border font-bold text-sm ${
              balanceSheetBalanced
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            <span className="flex items-center gap-1.5">
              {balanceSheetBalanced ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
              Assets = Liabilities + Equity
            </span>
            <span className="font-mono">
              {usd(totalAssets)} {balanceSheetBalanced ? '=' : '≠'} {usd(totalLiabEquityAndNetIncome)}
            </span>
          </div>
        </div>
      )}

      {/* REPORT 3: INCOME STATEMENT (P&L) */}
      {activeReport === 'INCOME_STATEMENT' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] shadow-xs p-6 max-w-3xl space-y-4 text-xs text-white">
          <div className="border-b border-[#222226] pb-4">
            <h3 className="font-bold text-base text-white">{organization.name}</h3>
            <p className="text-purple-400 font-semibold">Statement of Profit & Loss</p>
            <p className="text-slate-400 text-[11px]">For the period ended {closeDate} • Currency: {currency}</p>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] border-b border-[#222226] pb-1">
              Income
            </div>
            {income.map((a) => (
              <div key={a.code} className="flex justify-between py-1.5 border-b border-[#1a1a20] text-slate-300">
                <span>
                  <span className="font-mono text-purple-300 mr-2">{a.code}</span>
                  {a.name}
                </span>
                <span className="font-mono font-bold text-emerald-400">+{usd(a.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 font-bold text-white">
              <span>Total Income</span>
              <span className="font-mono text-emerald-400">+{usd(totalIncome)}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-300 uppercase tracking-wider text-[11px] border-b border-[#222226] pb-1">
              Expenses
            </div>
            {expenses.map((a) => (
              <div key={a.code} className="flex justify-between py-1.5 border-b border-[#1a1a20] text-rose-400">
                <span className="text-slate-300">
                  <span className="font-mono text-purple-300 mr-2">{a.code}</span>
                  {a.name}
                </span>
                <span className="font-mono">-{usd(a.balance)}</span>
              </div>
            ))}
            <div className="flex justify-between py-1.5 font-bold text-white">
              <span>Total Expenses</span>
              <span className="font-mono text-rose-400">-{usd(totalExpenses)}</span>
            </div>
          </div>

          <div className="flex justify-between py-3 border-t-2 border-[#2d2d35] font-bold text-sm text-white">
            <span>Net Income</span>
            <span className={`font-mono ${netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {netIncome >= 0 ? '+' : ''}
              {usd(netIncome)}
            </span>
          </div>
        </div>
      )}

      {/* REPORT 4: ROLL-FORWARD SCHEDULE */}
      {activeReport === 'ROLL_FORWARD' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#16161c] border-b border-[#222226] text-xs">
            <span className="font-bold text-white">Digital Asset Tax-Lot & Fair Value Roll-Forward</span>
            <span className="text-slate-400 ml-2">Closing quantity, cost basis, and fair value per asset</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4 text-right font-mono">Closing Qty</th>
                  <th className="py-3 px-4 text-right font-mono">Cost Basis ($)</th>
                  <th className="py-3 px-4 text-right font-mono">Fair Value ($)</th>
                  <th className="py-3 px-4 text-right font-mono">Unrealized Gain / (Loss) ($)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {assetValuations.map((a) => (
                  <tr key={a.id || a.assetSymbol} className="hover:bg-[#16161c]/60">
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-1.5">
                      <span>{a.name}</span>
                      <span className="font-mono text-purple-300">({a.assetSymbol})</span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">{(a.quantity ?? 0).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-300">{usd(a.costBasisUsd ?? 0)}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-white">{usd(a.marketValueUsd ?? 0)}</td>
                    <td className={`py-3 px-4 text-right font-mono font-bold ${(a.unrealizedGainLossUsd ?? 0) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {(a.unrealizedGainLossUsd ?? 0) >= 0 ? '+' : ''}
                      {usd(a.unrealizedGainLossUsd ?? 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
