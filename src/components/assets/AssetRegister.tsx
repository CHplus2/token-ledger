import React, { useState } from 'react';
import {
  Coins,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  Calendar,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';
import { MetricCard } from '../common/MetricCard';

export const AssetRegister: React.FC = () => {
  const {
    assetValuations,
    totalMarketValueUsd,
    totalCostBasisUsd,
    totalUnrealizedPnlUsd,
    organization,
  } = useLedger();

  const [refreshing, setRefreshing] = useState(false);
  const [selectedAssetSymbol, setSelectedAssetSymbol] = useState<string | null>(null);

  const handleRefreshPrices = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Assets Register & Fair Valuation"
        subtitle="Audited digital asset inventory, fair market valuations, and tax lot unrealized gain/loss schedules."
        actions={
          <button
            onClick={handleRefreshPrices}
            disabled={refreshing}
            className="px-3.5 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] hover:bg-[#f1f5f9] text-slate-700 text-xs font-bold shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-purple-600' : ''}`} />
            <span>{refreshing ? 'Refreshing Feeds...' : 'Refresh Market Prices'}</span>
          </button>
        }
      />

      {/* Top Value Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Fair Market Value"
          value={`$${(totalMarketValueUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          secondary="Level 1 & 2 Quoted Market Prices"
          icon={DollarSign}
          badgeText="Fair Value"
          badgeVariant="blue"
        />

        <MetricCard
          title="Total Cost Basis (FIFO)"
          value={`$${(totalCostBasisUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          secondary="Historical Acquisition Cost"
          icon={Coins}
          badgeText={organization.costBasisMethod}
          badgeVariant="default"
        />

        <MetricCard
          title="Total Unrealized P&L"
          value={`+$${(totalUnrealizedPnlUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
          secondary={`${totalCostBasisUsd > 0 ? ((totalUnrealizedPnlUsd / totalCostBasisUsd) * 100).toFixed(1) : '0.0'}% Return on Capital`}
          icon={TrendingUp}
          badgeText="Unrealized Gain"
          badgeVariant="emerald"
        />
      </div>

      {/* Asset Valuation Table */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="p-4 bg-[#f8fafc] border-b border-[#e2e8f0] flex items-center justify-between text-xs">
          <div>
            <span className="font-bold text-slate-900">Held Digital Asset Inventory</span>
            <span className="text-slate-600 ml-2">5 Active Assets Under Custody</span>
          </div>
          <span className="text-[11px] text-slate-600">Benchmark Index: <strong className="text-slate-800">Pyth & Coinbase Composite</strong></span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e8f0] text-slate-600 font-semibold bg-[#f8fafc]">
                <th className="py-3 px-4">Asset</th>
                <th className="py-3 px-4">Custody Wallet & Custodian</th>
                <th className="py-3 px-4 text-right font-mono">Holding Quantity</th>
                <th className="py-3 px-4 text-right font-mono">Spot Unit Price (USD)</th>
                <th className="py-3 px-4 text-right font-mono">Total Market Value</th>
                <th className="py-3 px-4 text-right font-mono">Total Cost Basis</th>
                <th className="py-3 px-4 text-right font-mono">Unrealized Gain / Loss</th>
                <th className="py-3 px-4">Valuation Tier</th>
                <th className="py-3 px-4 text-right">Price Feed Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {assetValuations.map((a, idx) => {
                const isSolana = a.assetSymbol === 'SOL';
                const rowKey = a.id || a.assetSymbol || `asset_${idx}`;
                const quantity = a.totalQuantity ?? a.quantity ?? 0;
                const spotPrice = a.spotPriceUsd ?? a.currentPriceUsd ?? 0;

                return (
                  <tr
                    key={rowKey}
                    className={`hover:bg-[#f8fafc]/60 transition-colors ${
                      isSolana ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                            isSolana
                              ? 'bg-emerald-500/20 text-emerald-700 border border-emerald-500/30'
                              : 'bg-[#f1f5f9] text-slate-700 border border-[#cbd5e1]'
                          }`}
                        >
                          {a.assetSymbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900">{a.name}</span>
                            {isSolana && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-500/20 text-emerald-700 border border-emerald-500/30">
                                #1 TOP
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-purple-700 font-mono">{a.assetSymbol}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {a.walletName ? (
                        <div>
                          <div className="font-semibold text-slate-800">{a.walletName}</div>
                          <div className="text-[11px] text-slate-600">
                            Custodian: <span className="text-purple-700 font-medium">{a.custodian}</span>
                          </div>
                          <div className="text-[10px] text-slate-600 font-mono mt-0.5">
                            {a.chains?.join(' • ')}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-600">{a.network}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {quantity.toLocaleString()} {a.assetSymbol}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-800">
                      ${spotPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      ${(a.marketValueUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono text-slate-600">
                      ${(a.costBasisUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600">
                      {(a.unrealizedGainLossUsd ?? 0) > 0 ? `+$${(a.unrealizedGainLossUsd ?? 0).toLocaleString()}` : '$0.00'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f1f5f9] text-slate-700 border border-[#cbd5e1]">
                        {a.valuationLevel || 'Level 1 Quoted'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-600 font-medium">
                      {a.priceSource}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
