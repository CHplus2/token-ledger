import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../common/PageHeader';
import { useCustodyPortfolio } from '../../hooks/useCustodyPortfolio';
import { PortfolioOverview } from './PortfolioOverview';
import { HoldingsTable } from './HoldingsTable';
import { AssetDetailDrawer } from './AssetDetailDrawer';
import { ManageEntities } from './ManageEntities';

type CustodyTab = 'OVERVIEW' | 'HOLDINGS' | 'MANAGE';

export const CustodyPortfolio: React.FC = () => {
  const data = useCustodyPortfolio();
  const [activeTab, setActiveTab] = useState<CustodyTab>('OVERVIEW');
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);

  const selectedAsset = data.assets.find((a) => a.id === selectedAssetId) || null;
  const managerName = data.assetManagers[0]?.name || 'your company';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Chain Custody Portfolio"
        subtitle="Track tokenized real-world asset holdings across chains, digital wallets, and custodians — one asset can span multiple chains at once, each with its own wallet and custodian."
      />

      {data.error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">{data.error}</div>
      )}

      <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 text-[11px] text-emerald-200 leading-relaxed flex items-start gap-2">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0 mt-0.5" />
        <span>
          <strong>Yes, this consolidates across wallets.</strong> Every total below is summed live across all of{' '}
          {managerName}&apos;s wallets, chains, and custodians for a given asset — one asset held on 3 different chains
          in 3 different wallets shows as a single combined total. Nothing here is per-wallet in isolation; click into
          any asset (Holdings Table → click a row) to see the individual chain/wallet/custodian breakdown that rolls
          up into that total.
        </span>
      </div>

      <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 p-3 text-[11px] text-indigo-200 leading-relaxed flex items-start gap-2">
        <Sparkles className="w-3.5 h-3.5 text-indigo-300 shrink-0 mt-0.5" />
        <span>
          MVP scope: static/seeded data with basic CRUD only. No live on-chain balance reading, no auth, no real-time
          pricing, no reconciliation/alerting (i.e. no cross-checking these consolidated totals against a second
          independent source), and no historical time-series — planned for a later phase.
        </span>
      </div>

      <div className="flex items-center gap-2 border-b border-[#222226] pb-2">
        {[
          { id: 'OVERVIEW' as CustodyTab, label: 'Portfolio Overview' },
          { id: 'HOLDINGS' as CustodyTab, label: 'Holdings Table' },
          { id: 'MANAGE' as CustodyTab, label: 'Manage Data' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:bg-[#16161c] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'OVERVIEW' && <PortfolioOverview data={data} />}
      {activeTab === 'HOLDINGS' && <HoldingsTable data={data} onSelectAsset={setSelectedAssetId} />}
      {activeTab === 'MANAGE' && <ManageEntities data={data} />}

      <AssetDetailDrawer asset={selectedAsset} data={data} onClose={() => setSelectedAssetId(null)} />
    </div>
  );
};
