import React from 'react';
import { DollarSign, Coins, Globe2, ShieldCheck } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { MetricCard } from '../common/MetricCard';
import { UseCustodyPortfolioReturn } from '../../hooks/useCustodyPortfolio';
import { formatUsdCompact } from './formatters';

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#06b6d4', '#ec4899'];

interface RollupCardProps {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  rows: { key: string; label: string; value: number; percentage: number }[];
  chartType: 'pie' | 'bar';
}

const RollupCard: React.FC<RollupCardProps> = ({ title, subtitle, icon: Icon, rows, chartType }) => {
  const chartData = rows.map((r) => ({ name: r.label, value: r.value }));

  return (
    <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-5 shadow-xs flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Icon className="w-4 h-4 text-purple-600" />
            <span>{title}</span>
          </h3>
          <p className="text-xs text-slate-600">{subtitle}</p>
        </div>
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={40} outerRadius={62} paddingAngle={3} dataKey="value">
                {chartData.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any) => [formatUsdCompact(Number(value ?? 0)), 'Market Value']}
              />
            </PieChart>
          ) : (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={(v) => formatUsdCompact(Number(v ?? 0))} />
              <Tooltip
                contentStyle={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0', borderRadius: '8px', color: '#fff' }}
                formatter={(value: any) => [formatUsdCompact(Number(value ?? 0)), 'Market Value']}
              />
              <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-2 pt-2 border-t border-[#e2e8f0] space-y-1.5 text-xs">
        {rows.map((r, idx) => (
          <div key={r.key} className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
              <span className="font-medium text-slate-700 truncate">{r.label}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="font-mono text-slate-900 font-semibold">{formatUsdCompact(r.value)}</span>
              <span className="text-slate-600 font-mono w-12 text-right">{r.percentage.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface PortfolioOverviewProps {
  data: UseCustodyPortfolioReturn;
}

export const PortfolioOverview: React.FC<PortfolioOverviewProps> = ({ data }) => {
  const { summary, loading } = data;

  if (loading && !summary) {
    return <div className="text-sm text-slate-600 py-12 text-center">Loading portfolio…</div>;
  }

  if (!summary) {
    return <div className="text-sm text-slate-600 py-12 text-center">No holdings yet.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          title="Total Portfolio Value (Consolidated)"
          value={formatUsdCompact(summary.totalValue)}
          secondary={`${summary.holdingCount} holdings, all wallets & chains combined`}
          icon={DollarSign}
          badgeText="Mock Data"
          badgeVariant="blue"
        />
        <MetricCard
          title="Assets Tracked"
          value={`${summary.byAsset.length}`}
          secondary={summary.byAsset.map((a) => a.label.split(' — ')[0]).join(', ')}
          icon={Coins}
          badgeText="Multi-Chain"
          badgeVariant="emerald"
        />
        <MetricCard
          title="Chain Concentration"
          value={summary.byChain[0]?.label || '—'}
          secondary={`${summary.byChain[0]?.percentage.toFixed(1) ?? '0.0'}% of portfolio value`}
          icon={Globe2}
          badgeText={`${summary.byChain.length} chains`}
          badgeVariant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <RollupCard
          title="By Asset"
          subtitle="Each bar = one asset's value summed across every wallet/chain it's held on"
          icon={Coins}
          rows={summary.byAsset}
          chartType="pie"
        />
        <RollupCard
          title="By Chain"
          subtitle="Chain concentration risk, across all assets and wallets on that chain"
          icon={Globe2}
          rows={summary.byChain}
          chartType="bar"
        />
        <RollupCard
          title="By Custodian"
          subtitle="Custodial counterparty concentration, across all assets held with that custodian"
          icon={ShieldCheck}
          rows={summary.byCustodian}
          chartType="bar"
        />
      </div>
    </div>
  );
};
