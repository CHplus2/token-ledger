import React from 'react';
import { X, Globe2, ShieldCheck, Wallet as WalletIcon } from 'lucide-react';
import { Asset, UseCustodyPortfolioReturn } from '../../hooks/useCustodyPortfolio';
import { ASSET_TYPE_LABELS, formatDate, formatUsd } from './formatters';

interface AssetDetailDrawerProps {
  asset: Asset | null;
  data: UseCustodyPortfolioReturn;
  onClose: () => void;
}

export const AssetDetailDrawer: React.FC<AssetDetailDrawerProps> = ({ asset, data, onClose }) => {
  if (!asset) return null;

  // Always the full set of holdings for this asset, independent of any
  // filters active on the Holdings Table, so multi-chain assets are never
  // shown partially just because a chain/custodian filter was applied
  // elsewhere.
  const assetHoldings = data.getHoldingsForAsset(asset.id);

  const totalValue = assetHoldings.reduce((sum, h) => sum + h.marketValue, 0);
  const chainCount = new Set(assetHoldings.map((h) => h.chain?.id)).size;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[520px] bg-[#ffffff] border-l border-[#e2e8f0] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200 overflow-hidden text-slate-900">
      <div className="px-6 py-4 bg-[#ffffff] border-b border-[#e2e8f0] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-xs">
            {asset.symbol.slice(0, 2)}
          </div>
          <div>
            <div className="text-xs text-slate-600 font-mono">{asset.symbol}</div>
            <h3 className="text-sm font-bold text-slate-900 truncate max-w-sm">{asset.name}</h3>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-[#f1f5f9] cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
        <div className="bg-[#ffffff] rounded-xl p-4 border border-[#e2e8f0] space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Issuer:</span>
            <span className="font-semibold text-slate-900">{asset.issuer?.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Asset Type:</span>
            <span className="font-semibold text-slate-900">{ASSET_TYPE_LABELS[asset.assetType] || asset.assetType}</span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0]">
            <span className="text-slate-600">Total Fair Value (consolidated):</span>
            <span className="font-mono font-bold text-base text-slate-900">{formatUsd(totalValue)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-600">Sum of:</span>
            <span className="font-mono font-semibold text-purple-700">
              {chainCount} chain{chainCount !== 1 ? 's' : ''} • {assetHoldings.length} holding{assetHoldings.length !== 1 ? 's' : ''} below
            </span>
          </div>
        </div>

        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-600 mb-2">
            Holdings by Chain / Wallet / Custodian
          </div>
          <div className="space-y-2.5">
            {assetHoldings.map((h) => (
              <div key={h.id} className="bg-[#ffffff] rounded-xl p-3.5 border border-[#e2e8f0] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Globe2 className="w-3.5 h-3.5 text-purple-600" />
                    {h.chain?.name}
                  </span>
                  <span className="font-mono font-bold text-emerald-600">{formatUsd(h.marketValue)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <WalletIcon className="w-3 h-3 text-slate-600" />
                    {h.wallet?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-slate-600" />
                    Custodian: <span className="text-slate-800 font-medium">{h.custodian?.name}</span>
                  </span>
                  <span className="text-[10px] text-slate-600">As of {formatDate(h.asOfDate)}</span>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-[#e2e8f0] text-slate-600">
                  <span>Balance (units):</span>
                  <span className="font-mono text-slate-800">{h.balance.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
