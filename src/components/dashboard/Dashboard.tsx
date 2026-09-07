import React from 'react';
import {
  DollarSign,
  Coins,
  ArrowLeftRight,
  Scale,
  AlertTriangle,
  CalendarCheck,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
  Layers,
  Building2,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useLedger } from '../../context/LedgerContext';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

export const Dashboard: React.FC = () => {
  const {
    currentUser,
    organization,
    totalMarketValueUsd,
    totalCostBasisUsd,
    totalUnrealizedPnlUsd,
    reconciliationRatePercent,
    exceptionsCount,
    unclassifiedCount,
    openBreaksCount,
    pendingJournalsCount,
    closeReadinessScore,
    assetValuations,
    dataSources,
    transactions,
    reconciliationBreaks,
    fiveWayRecords,
    setActiveModule,
    setSelectedTx,
    setSelectedBreak,
    openAIWithContext,
  } = useLedger();

  // Color palette for institutional tokenized assets
  const ASSET_COLORS = ['#3b82f6', '#10b981', '#06b6d4', '#8b5cf6', '#f59e0b'];

  const assetDistributionData = assetValuations.map((a) => ({
    name: a.assetSymbol,
    fullName: a.name,
    value: a.marketValueUsd,
    percentage: ((a.marketValueUsd / (totalMarketValueUsd || 1)) * 100).toFixed(1),
  }));

  const sourceDistributionData = dataSources.map((s) => ({
    name: s.name.split(' ')[0] + ' ' + (s.name.split(' ')[1] || ''),
    fullName: s.name,
    value: s.balanceEstimateUsd || 1000000,
  }));

  return (
    <div className="space-y-6">
      {/* Institutional Top Close Readiness Banner */}
      <div className="rounded-xl bg-gradient-to-r from-[#141419] via-[#1a1a24] to-[#121222] text-white p-6 shadow-md border border-[#2d2d38] relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 uppercase tracking-wider mb-1">
              <Building2 className="w-3.5 h-3.5 text-purple-400" />
              <span>{organization.name}</span>
              <span>•</span>
              <span>August 2026 Accounting Close</span>
              <span>•</span>
              <span>{organization.framework} Reporting</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-1">
              Good morning, {currentUser.name.split(',')[0]}
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Your tokenized asset books are <strong className="text-emerald-400 font-bold">{closeReadinessScore}% ready to close</strong>.
              {' '}Reconciliation across <span className="text-indigo-300 font-medium">issuer-custodied wallets (BlackRock, Khazanah, CIMB) and Coinbase/Kraken venues</span> stands at <strong className="text-emerald-300 font-bold">{reconciliationRatePercent}%</strong>.
              {openBreaksCount > 0 && (
                <> <strong className="text-amber-300">1 open exception</strong> on Backed NVDA (50-unit transfer variance) requires investigation.</>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="btn-ask-ai-close"
              onClick={() => openAIWithContext('CLOSE_READINESS', { score: closeReadinessScore })}
              className="px-3.5 py-2 rounded-lg bg-[#22222b] hover:bg-[#2b2b36] border border-[#383845] text-xs font-semibold text-white transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span>Diagnose Blockers</span>
            </button>

            <button
              id="btn-continue-close"
              onClick={() => setActiveModule('close')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-xs font-bold text-white shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Continue August Close</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Top 6 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard
          id="kpi-total-balance"
          title="Tokenized Assets"
          value={`$${(totalMarketValueUsd / 1_000_000).toFixed(2)}M`}
          secondary={`Cost Basis: $${(totalCostBasisUsd / 1_000_000).toFixed(2)}M`}
          trend={{ value: '+3.1% vs Jul', isPositive: true }}
          icon={DollarSign}
          badgeText="Fair Value"
          badgeVariant="blue"
          onClick={() => setActiveModule('assets')}
        />

        <MetricCard
          id="kpi-unrealized-pnl"
          title="Unrealized P&L"
          value={`+$${(totalUnrealizedPnlUsd / 1_000_000).toFixed(2)}M`}
          secondary={`${((totalUnrealizedPnlUsd / (totalCostBasisUsd || 1)) * 100).toFixed(1)}% unrealized gain`}
          trend={{ value: 'IFRS 9 / IAS 38', isPositive: true }}
          icon={TrendingUp}
          badgeText={organization.costBasisMethod}
          badgeVariant="emerald"
          onClick={() => setActiveModule('assets')}
        />

        <MetricCard
          id="kpi-assets-count"
          title="Holdings in Subledger"
          value={`${assetValuations.length} Tranches`}
          secondary="BUIDL, Sukuk, CIMB, bNVDA, SOL"
          icon={Coins}
          badgeText="Multi-Venue"
          badgeVariant="emerald"
          onClick={() => setActiveModule('assets')}
        />

        <MetricCard
          id="kpi-tx-count"
          title="Period Transactions"
          value="233 Txs"
          secondary="Solana • Coinbase • Kraken"
          icon={ArrowLeftRight}
          badgeText="6 Feeds"
          badgeVariant="default"
          onClick={() => setActiveModule('transactions')}
        />

        <MetricCard
          id="kpi-reconciliation-rate"
          title="5-Way Rec Rate"
          value={`${reconciliationRatePercent}%`}
          secondary={`${openBreaksCount} open transfer break`}
          icon={Scale}
          badgeText={reconciliationRatePercent > 99 ? 'Fully Reconciled' : '1 Exception'}
          badgeVariant={reconciliationRatePercent > 99 ? 'emerald' : 'amber'}
          onClick={() => setActiveModule('reconciliation')}
        />

        <MetricCard
          id="kpi-exceptions-count"
          title="Exceptions to Review"
          value={`${exceptionsCount} Items`}
          secondary={`${unclassifiedCount} unclassified • ${pendingJournalsCount} draft`}
          icon={AlertTriangle}
          badgeText={exceptionsCount > 0 ? 'Action Required' : 'Clean'}
          badgeVariant={exceptionsCount > 0 ? 'amber' : 'emerald'}
          onClick={() => setActiveModule('transactions')}
        />
      </div>

      {/* Five-Way Reconciliation Summary Ribbon */}
      <div className="bg-[#111114] rounded-xl border border-[#222226] p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Five-Way Cross-Platform Reconciliation Health</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous validation across issuer digital wallets (BlackRock, Khazanah, CIMB), Solana Treasury, Coinbase, Kraken, Securitize / Backed Reg, Subledger & SAP GL
            </p>
          </div>
          <button
            onClick={() => setActiveModule('reconciliation')}
            className="text-xs text-purple-400 font-semibold hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Open 5-Way Matrix</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {fiveWayRecords.map((rec) => (
            <div
              key={rec.id}
              onClick={() => setActiveModule('reconciliation')}
              className={`p-3.5 rounded-lg border transition-all cursor-pointer ${
                rec.status === 'RECONCILED'
                  ? 'bg-[#16161c] border-[#222226] hover:border-[#383845]'
                  : 'bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/15'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span className="font-mono bg-[#22222a] px-1.5 py-0.5 rounded text-[11px] text-purple-300 border border-[#333340]">
                    {rec.assetSymbol}
                  </span>
                  <span className="truncate max-w-[130px]">{rec.assetName.split(' ')[0]}</span>
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    rec.status === 'RECONCILED'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {rec.status === 'RECONCILED' ? 'Reconciled' : '50-Unit Variance'}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>DLT / CEX Units:</span>
                  <span className="font-mono font-medium text-slate-200">
                    {rec.totalCalculatedUnits.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Subledger / GL:</span>
                  <span className="font-mono font-medium text-slate-200">
                    {rec.subledgerUnits.toLocaleString()}
                  </span>
                </div>
              </div>

              {rec.varianceUnits !== 0 && (
                <div className="mt-2 pt-2 border-t border-amber-500/20 text-[10px] text-amber-300 font-medium flex items-center justify-between">
                  <span>Variance: {rec.varianceUnits} units</span>
                  <span>(${Math.abs(rec.varianceUsd).toLocaleString()})</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Center Grid: Charts & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio by Asset */}
        <div className="bg-[#111114] rounded-xl border border-[#222226] p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Portfolio by Tokenized Instrument</h3>
              <p className="text-xs text-slate-400">Institutional fair value allocation</p>
            </div>
            <button
              onClick={() => setActiveModule('assets')}
              className="text-xs text-purple-400 font-semibold hover:underline"
            >
              Asset Register
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={assetDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {assetDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={ASSET_COLORS[index % ASSET_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#16161c', borderColor: '#222226', borderRadius: '8px', color: '#fff' }}
                  formatter={(value: any) => [`$${Number(value ?? 0).toLocaleString()}`, 'Market Value']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Asset Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#222226] text-xs">
            {assetDistributionData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: ASSET_COLORS[idx % ASSET_COLORS.length] }}
                  />
                  <span className="font-medium text-slate-300 truncate">{item.name}</span>
                </div>
                <span className="text-slate-400 font-mono shrink-0">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio by Connected Source */}
        <div className="bg-[#111114] rounded-xl border border-[#222226] p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Position by Custody Venue</h3>
              <p className="text-xs text-slate-400">Issuer digital wallets, Solana Treasury, Coinbase & Kraken</p>
            </div>
            <button
              onClick={() => setActiveModule('sources')}
              className="text-xs text-purple-400 font-semibold hover:underline"
            >
              Data Sources
            </button>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceDistributionData.slice(0, 5)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222226" />
                <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#8b8b98' }} />
                <YAxis
                  tick={{ fontSize: 10, fill: '#8b8b98' }}
                  tickFormatter={(val) => `$${((val ?? 0) / 1000000).toFixed(1)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: '#16161c', borderColor: '#222226', borderRadius: '8px', color: '#fff' }}
                  formatter={(val: any) => [`$${Number(val ?? 0).toLocaleString()}`, 'Balance']}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-[#222226] text-xs text-slate-400 flex items-center justify-between">
            <span>Primary Active Ingestion: <strong className="text-white">Solana Treasury (126 txs)</strong></span>
            <span className="text-emerald-400 font-semibold">100% Synced</span>
          </div>
        </div>

        {/* Accounting Exceptions & Action Center */}
        <div className="bg-[#111114] rounded-xl border border-[#222226] p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Accounting Exceptions</span>
              </h3>
              <p className="text-xs text-slate-400">Action items for Controller review</p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
              {exceptionsCount} Actionable
            </span>
          </div>

          <div className="flex-1 space-y-2.5 overflow-y-auto max-h-60 pr-1">
            {/* Break Item */}
            {openBreaksCount > 0 && (
              <div
                onClick={() => setActiveModule('reconciliation')}
                className="p-3 rounded-lg border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-rose-200">50-Unit NVIDIA Equity Break</span>
                  <span className="font-semibold text-rose-300">$6,425 Variance</span>
                </div>
                <p className="text-[11px] text-rose-300/80 leading-tight">
                  Kraken recorded 1,000 bNVDA transferred; Solana treasury received 950 units.
                </p>
              </div>
            )}

            {/* Unclassified Transaction Item */}
            {unclassifiedCount > 0 && (
              <div
                onClick={() => setActiveModule('transactions')}
                className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-amber-200">Unclassified Inflow</span>
                  <span className="font-semibold text-amber-300">{unclassifiedCount} Items</span>
                </div>
                <p className="text-[11px] text-amber-300/80 leading-tight">
                  Epoch 682 Solana Staking (42.5 SOL / $6,553.50) needs account mapping.
                </p>
              </div>
            )}

            {/* Pending Journals Item */}
            {pendingJournalsCount > 0 && (
              <div
                onClick={() => setActiveModule('subledger')}
                className="p-3 rounded-lg border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/15 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-purple-200">Journals Awaiting Approval</span>
                  <span className="font-semibold text-purple-300">{pendingJournalsCount} Batches</span>
                </div>
                <p className="text-[11px] text-purple-300/80 leading-tight">
                  Maker-Checker review required for Securitize BUIDL Dividend ($18,450.00).
                </p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-[#222226] mt-2">
            <button
              onClick={() => setActiveModule('reconciliation')}
              className="w-full py-1.5 rounded-lg bg-[#16161c] hover:bg-[#1c1c21] border border-[#222226] text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Investigate & Resolve Exceptions</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent Subledger Activity Table */}
      <div className="bg-[#111114] rounded-xl border border-[#222226] p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Recent Multi-Venue Subledger Activity</h3>
            <p className="text-xs text-slate-400">Institutional transactions across issuer digital wallets, Solana, Coinbase & Kraken</p>
          </div>
          <button
            onClick={() => setActiveModule('transactions')}
            className="text-xs font-semibold text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All Transactions</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
                <th className="py-2.5 px-3">Date / Timestamp</th>
                <th className="py-2.5 px-3">Business Description</th>
                <th className="py-2.5 px-3">Venues (From → To)</th>
                <th className="py-2.5 px-3">Asset Movement</th>
                <th className="py-2.5 px-3 text-right">Fair Value (USD)</th>
                <th className="py-2.5 px-3">Accounting Treatment</th>
                <th className="py-2.5 px-3">Rec Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {transactions.slice(0, 5).map((tx) => (
                <tr
                  key={tx.id}
                  onClick={() => {
                    setSelectedTx(tx);
                    setActiveModule('transactions');
                  }}
                  className="hover:bg-[#16161c]/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono text-slate-400">
                    {tx.timestamp.split(' ')[0]}
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    {tx.businessDescription}
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {tx.fromSource && tx.toSource ? (
                      <span className="font-medium text-slate-200">
                        {tx.fromSource} → {tx.toSource}
                      </span>
                    ) : (
                      <span className="font-medium text-slate-200">{tx.sourceName}</span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-mono">
                    {tx.quantityReceived && (
                      <span className="text-emerald-400 font-medium">
                        +{tx.quantityReceived} {tx.assetReceived}
                      </span>
                    )}
                    {tx.quantitySent && (
                      <span className="text-slate-300 font-medium ml-1">
                        -{tx.quantitySent} {tx.assetSent}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-white">
                    ${(tx.fiatValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={tx.classification} size="sm" />
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={tx.reconciliationStatus} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
