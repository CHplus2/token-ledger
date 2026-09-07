import React, { useState } from 'react';
import { Plus, Trash2, Coins, Wallet as WalletIcon, ShieldCheck, Layers } from 'lucide-react';
import { AssetType, UseCustodyPortfolioReturn } from '../../hooks/useCustodyPortfolio';
import { ASSET_TYPE_LABELS, formatUsd } from './formatters';

type ManageTab = 'ASSETS' | 'WALLETS' | 'CUSTODIANS' | 'HOLDINGS';

interface ManageEntitiesProps {
  data: UseCustodyPortfolioReturn;
}

const inputClass =
  'w-full px-3 py-2 rounded-lg bg-[#16161c] border border-[#2d2d35] text-white placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none';

export const ManageEntities: React.FC<ManageEntitiesProps> = ({ data }) => {
  const [tab, setTab] = useState<ManageTab>('ASSETS');
  const [formError, setFormError] = useState<string | null>(null);

  const {
    assets,
    issuers,
    chains,
    custodians,
    wallets,
    assetManagers,
    holdings,
    createAsset,
    deleteAsset,
    createWallet,
    deleteWallet,
    createCustodian,
    deleteCustodian,
    createHolding,
    deleteHolding,
  } = data;

  const withErrorHandling = async (fn: () => Promise<void>) => {
    setFormError(null);
    try {
      await fn();
    } catch (err: any) {
      setFormError(err?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-[11px] text-amber-200 leading-relaxed">
        This is basic CRUD for MVP demo purposes — it edits real rows in Postgres directly, with no validation beyond
        required fields and no approval workflow.
      </div>

      <div className="flex items-center gap-2 border-b border-[#222226] pb-2">
        {[
          { id: 'ASSETS' as ManageTab, label: 'Assets', icon: Coins },
          { id: 'WALLETS' as ManageTab, label: 'Wallets', icon: WalletIcon },
          { id: 'CUSTODIANS' as ManageTab, label: 'Custodians', icon: ShieldCheck },
          { id: 'HOLDINGS' as ManageTab, label: 'Holdings', icon: Layers },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setTab(t.id);
              setFormError(null);
            }}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              tab === t.id ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:bg-[#16161c] hover:text-white'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {formError && (
        <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">{formError}</div>
      )}

      {tab === 'ASSETS' && (
        <AssetsPanel
          assets={assets}
          issuers={issuers}
          onCreate={(d) => withErrorHandling(() => createAsset(d))}
          onDelete={(id) => withErrorHandling(() => deleteAsset(id))}
        />
      )}

      {tab === 'WALLETS' && (
        <WalletsPanel
          wallets={wallets}
          chains={chains}
          onCreate={(d) => withErrorHandling(() => createWallet(d))}
          onDelete={(id) => withErrorHandling(() => deleteWallet(id))}
        />
      )}

      {tab === 'CUSTODIANS' && (
        <CustodiansPanel
          custodians={custodians}
          onCreate={(d) => withErrorHandling(() => createCustodian(d))}
          onDelete={(id) => withErrorHandling(() => deleteCustodian(id))}
        />
      )}

      {tab === 'HOLDINGS' && (
        <HoldingsPanel
          holdings={holdings}
          assets={assets}
          chains={chains}
          wallets={wallets}
          custodians={custodians}
          assetManagers={assetManagers}
          onCreate={(d) => withErrorHandling(() => createHolding(d))}
          onDelete={(id) => withErrorHandling(() => deleteHolding(id))}
        />
      )}
    </div>
  );
};

// ---------------- Assets ----------------

const AssetsPanel: React.FC<{
  assets: UseCustodyPortfolioReturn['assets'];
  issuers: UseCustodyPortfolioReturn['issuers'];
  onCreate: (d: { name: string; symbol: string; assetType: AssetType; issuerId: string }) => void;
  onDelete: (id: string) => void;
}> = ({ assets, issuers, onCreate, onDelete }) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('OTHER');
  const [issuerId, setIssuerId] = useState(issuers[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !symbol || !issuerId) return;
    onCreate({ name, symbol: symbol.toUpperCase(), assetType, issuerId });
    setName('');
    setSymbol('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#111114] rounded-xl border border-[#222226] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
              <th className="py-2.5 px-3">Symbol</th>
              <th className="py-2.5 px-3">Name</th>
              <th className="py-2.5 px-3">Type</th>
              <th className="py-2.5 px-3">Issuer</th>
              <th className="py-2.5 px-3 text-right">Holdings</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e24]">
            {assets.map((a) => (
              <tr key={a.id} className="hover:bg-[#16161c]/60">
                <td className="py-2.5 px-3 font-bold text-white">{a.symbol}</td>
                <td className="py-2.5 px-3 text-slate-300">{a.name}</td>
                <td className="py-2.5 px-3 text-slate-400">{ASSET_TYPE_LABELS[a.assetType] || a.assetType}</td>
                <td className="py-2.5 px-3 text-slate-300">{a.issuer?.name}</td>
                <td className="py-2.5 px-3 text-right font-mono text-slate-400">{a.holdingCount ?? 0}</td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => onDelete(a.id)}
                    className="p-1.5 rounded-md text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                    title="Delete asset"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111114] rounded-xl border border-[#222226] p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. USD Coin" />
        </div>
        <div className="w-28">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Symbol</label>
          <input className={inputClass} value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="USDC" />
        </div>
        <div className="w-48">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Type</label>
          <select className={inputClass} value={assetType} onChange={(e) => setAssetType(e.target.value as AssetType)}>
            {Object.entries(ASSET_TYPE_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div className="w-48">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Issuer</label>
          <select className={inputClass} value={issuerId} onChange={(e) => setIssuerId(e.target.value)}>
            {issuers.map((i) => (
              <option key={i.id} value={i.id}>
                {i.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Asset
        </button>
      </form>
    </div>
  );
};

// ---------------- Wallets ----------------

const WalletsPanel: React.FC<{
  wallets: UseCustodyPortfolioReturn['wallets'];
  chains: UseCustodyPortfolioReturn['chains'];
  onCreate: (d: { name: string; address?: string; chainId: string }) => void;
  onDelete: (id: string) => void;
}> = ({ wallets, chains, onCreate, onDelete }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [chainId, setChainId] = useState(chains[0]?.id || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !chainId) return;
    onCreate({ name, address: address || undefined, chainId });
    setName('');
    setAddress('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#111114] rounded-xl border border-[#222226] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
              <th className="py-2.5 px-3">Wallet</th>
              <th className="py-2.5 px-3">Chain</th>
              <th className="py-2.5 px-3">Address</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e24]">
            {wallets.map((w) => (
              <tr key={w.id} className="hover:bg-[#16161c]/60">
                <td className="py-2.5 px-3 font-semibold text-white">{w.name}</td>
                <td className="py-2.5 px-3">
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                    {w.chain?.name}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-slate-500 font-mono">{w.address || '—'}</td>
                <td className="py-2.5 px-3 text-right">
                  <button onClick={() => onDelete(w.id)} className="p-1.5 rounded-md text-rose-400 hover:bg-rose-500/10 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111114] rounded-xl border border-[#222226] p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Wallet Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Circle Wallet (Ethereum)" />
        </div>
        <div className="w-40">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Chain</label>
          <select className={inputClass} value={chainId} onChange={(e) => setChainId(e.target.value)}>
            {chains.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[180px]">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Address (optional)</label>
          <input className={inputClass} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="0x... / base58..." />
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Wallet
        </button>
      </form>
    </div>
  );
};

// ---------------- Custodians ----------------

const CustodiansPanel: React.FC<{
  custodians: UseCustodyPortfolioReturn['custodians'];
  onCreate: (d: { name: string }) => void;
  onDelete: (id: string) => void;
}> = ({ custodians, onCreate, onDelete }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onCreate({ name });
    setName('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#111114] rounded-xl border border-[#222226] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
              <th className="py-2.5 px-3">Custodian</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e24]">
            {custodians.map((c) => (
              <tr key={c.id} className="hover:bg-[#16161c]/60">
                <td className="py-2.5 px-3 font-semibold text-white">{c.name}</td>
                <td className="py-2.5 px-3 text-right">
                  <button onClick={() => onDelete(c.id)} className="p-1.5 rounded-md text-rose-400 hover:bg-rose-500/10 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111114] rounded-xl border border-[#222226] p-4 flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Custodian Name</label>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gambit Custody" />
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Custodian
        </button>
      </form>
    </div>
  );
};

// ---------------- Holdings ----------------

const HoldingsPanel: React.FC<{
  holdings: UseCustodyPortfolioReturn['holdings'];
  assets: UseCustodyPortfolioReturn['assets'];
  chains: UseCustodyPortfolioReturn['chains'];
  wallets: UseCustodyPortfolioReturn['wallets'];
  custodians: UseCustodyPortfolioReturn['custodians'];
  assetManagers: UseCustodyPortfolioReturn['assetManagers'];
  onCreate: (d: {
    assetId: string;
    chainId: string;
    walletId: string;
    custodianId: string;
    assetManagerId: string;
    balance: number;
    marketValue: number;
    asOfDate?: string;
  }) => void;
  onDelete: (id: string) => void;
}> = ({ holdings, assets, chains, wallets, custodians, assetManagers, onCreate, onDelete }) => {
  const today = new Date().toISOString().slice(0, 10);

  const [assetId, setAssetId] = useState(assets[0]?.id || '');
  const [chainId, setChainId] = useState(chains[0]?.id || '');
  const [walletId, setWalletId] = useState(wallets[0]?.id || '');
  const [custodianId, setCustodianId] = useState(custodians[0]?.id || '');
  const [assetManagerId, setAssetManagerId] = useState(assetManagers[0]?.id || '');
  const [balance, setBalance] = useState('');
  const [marketValue, setMarketValue] = useState('');
  const [asOfDate, setAsOfDate] = useState(today);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetId || !chainId || !walletId || !custodianId || !assetManagerId || !balance || !marketValue) return;
    onCreate({
      assetId,
      chainId,
      walletId,
      custodianId,
      assetManagerId,
      balance: Number(balance),
      marketValue: Number(marketValue),
      asOfDate,
    });
    setBalance('');
    setMarketValue('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-[#111114] rounded-xl border border-[#222226] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
                <th className="py-2.5 px-3">Asset</th>
                <th className="py-2.5 px-3">Chain</th>
                <th className="py-2.5 px-3">Wallet</th>
                <th className="py-2.5 px-3">Custodian</th>
                <th className="py-2.5 px-3 text-right">Market Value</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1e24]">
              {holdings.map((h) => (
                <tr key={h.id} className="hover:bg-[#16161c]/60">
                  <td className="py-2.5 px-3 font-bold text-white">{h.asset?.symbol}</td>
                  <td className="py-2.5 px-3 text-slate-300">{h.chain?.name}</td>
                  <td className="py-2.5 px-3 text-slate-300">{h.wallet?.name}</td>
                  <td className="py-2.5 px-3 text-slate-300">{h.custodian?.name}</td>
                  <td className="py-2.5 px-3 text-right font-mono text-white font-semibold">{formatUsd(h.marketValue)}</td>
                  <td className="py-2.5 px-3 text-right">
                    <button onClick={() => onDelete(h.id)} className="p-1.5 rounded-md text-rose-400 hover:bg-rose-500/10 cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111114] rounded-xl border border-[#222226] p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Asset</label>
            <select className={inputClass} value={assetId} onChange={(e) => setAssetId(e.target.value)}>
              {assets.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.symbol}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Chain</label>
            <select className={inputClass} value={chainId} onChange={(e) => setChainId(e.target.value)}>
              {chains.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Wallet</label>
            <select className={inputClass} value={walletId} onChange={(e) => setWalletId(e.target.value)}>
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Custodian</label>
            <select className={inputClass} value={custodianId} onChange={(e) => setCustodianId(e.target.value)}>
              {custodians.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Asset Manager</label>
            <select className={inputClass} value={assetManagerId} onChange={(e) => setAssetManagerId(e.target.value)}>
              {assetManagers.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">As-of Date</label>
            <input type="date" className={inputClass} value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Balance (units)</label>
            <input type="number" step="any" className={inputClass} value={balance} onChange={(e) => setBalance(e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Market Value (USD)</label>
            <input type="number" step="any" className={inputClass} value={marketValue} onChange={(e) => setMarketValue(e.target.value)} placeholder="0.00" />
          </div>
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Holding
        </button>
      </form>
    </div>
  );
};
