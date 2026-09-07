import React, { useEffect, useState } from 'react';
import { X, Globe2, ShieldCheck, Wallet as WalletIcon } from 'lucide-react';
import { Asset, Holding } from '../../hooks/useCustodyPortfolio';
import { ASSET_TYPE_LABELS, formatDate, formatUsd } from './formatters';

interface AssetDetailDrawerProps {
  asset: Asset | null;
  onClose: () => void;
}

export const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({ asset, onClose }) => {
  // Always loads every holding for this asset, independent of any filters
  // active on the Holdings Table, so multi-chain assets are never shown
  // partially just because a chain/custodian filter was applied elsewhere.
  const [assetHoldings, setAssetHoldings] = useState<Holding[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!asset) return;
    setLoading(true);
    fetch(`/api/custody/holdings?assetId=${asset.id}`)
      .then((res) => res.json())
      .then((rows: Holding[]) => setAssetHoldings(rows))
      .catch(() => setAssetHoldings([]))
      .finally(() => setLoading(false));
  }, [asset]);

  if (!asset) return null;

  const totalValue = assetHoldings.reduce((sum, h) => sum + h.marketValue, 0);
  const chainCount = new Set(assetHoldings.map((h) => h.chain?.id)).size;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[520px] bg-[#0e0e12] border-l border-[#222226] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200 overflow-hidden text-white">
      <div className="px-6 py-4 bg-[#141419] border-b border-[#222226] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-xs">
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono">{asset.symbol}</div>
            <h3 className="text-sm font-bold text-white truncate max-w-sm">{asset.name}</h3>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1c1c21] cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
        <div className="bg-[#111114] rounded-xl p-4 border border-[#222226] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Issuer:</span>
            <span className="font-semibold text-white">{asset.issuer?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Asset Type:</span>
            <span className="font-semibold text-white">{ASSET_TYPE_LABELS[asset.assetType] || asset.assetType}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#222226]">
            <span className="text-slate-400">Total Fair Value:</span>
            <span className="font-mono font-bold text-base text-white">{formatUsd(totalValue)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Held Across:</span>
            <span className="font-mono font-semibold text-purple-300">
              {chainCount} chain{chainCount !== 1 ? 's' : ''} • {assetHoldings.length} holding{assetHoldings.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-2">
            Holdings by Chain / Wallet / Custodian
          </div>
          <div className="space-y-2.5">
            {loading && <div className="text-slate-500 text-center py-4">Loading holdings…</div>}
            {assetHoldings.map((h) => (
              <div key={h.id} className="bg-[#111114] rounded-xl p-3.5 border border-[#222226] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-white">
                    <Globe2 className="w-3.5 h-3.5 text-purple-400" />
                    {h.chain?.name}
                  </span>
                  <span className="font-mono font-bold text-emerald-400">{formatUsd(h.marketValue)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <WalletIcon className="w-3 h-3 text-slate-500" />
                    {h.wallet?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-slate-500" />
                    Custodian: <span className="text-slate-200 font-medium">{h.custodian?.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-500">As of {formatDate(h.asOfDate)}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-[#1e1e24] text-slate-400">
                  <span>Balance (units):</span>
                  <span className="font-mono text-slate-200">{h.balance.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
