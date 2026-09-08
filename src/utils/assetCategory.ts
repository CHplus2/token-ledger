import { AssetValuation } from '../types';
import type { AssetType as CustodyAssetType } from '../hooks/useCustodyPortfolio';

export type AssetCategory = 'Tokenized Asset' | 'Stablecoin' | 'Crypto' | 'Other';

export const CATEGORY_ORDER: AssetCategory[] = ['Tokenized Asset', 'Stablecoin', 'Crypto', 'Other'];

const CATEGORY_STYLES: Record<AssetCategory, { bg: string; text: string; border: string }> = {
  'Tokenized Asset': { bg: 'bg-purple-500/10', text: 'text-purple-700', border: 'border-purple-500/30' },
  Stablecoin: { bg: 'bg-emerald-500/10', text: 'text-emerald-700', border: 'border-emerald-500/30' },
  Crypto: { bg: 'bg-amber-500/10', text: 'text-amber-700', border: 'border-amber-500/30' },
  Other: { bg: 'bg-[#f1f5f9]', text: 'text-slate-600', border: 'border-[#cbd5e1]' },
};

export function categoryBadgeClasses(category: AssetCategory): string {
  const s = CATEGORY_STYLES[category];
  return `${s.bg} ${s.text} ${s.border}`;
}

export function getLedgerAssetCategory(assetType: AssetValuation['assetType']): AssetCategory {
  switch (assetType) {
    case 'TOKENIZED_FUND':
    case 'TOKENIZED_SECURITY':
    case 'TOKENIZED_DEPOSIT':
    case 'TOKENIZED_EQUITY':
      return 'Tokenized Asset';
    case 'STABLECOIN':
      return 'Stablecoin';
    case 'CRYPTOCURRENCY':
      return 'Crypto';
    default:
      return 'Other';
  }
}

export function getCustodyAssetCategory(assetType: CustodyAssetType): AssetCategory {
  switch (assetType) {
    case 'MONEY_MARKET_FUND':
    case 'SUKUK':
    case 'EQUITY':
      return 'Tokenized Asset';
    case 'STABLECOIN':
      return 'Stablecoin';
    default:
      return 'Other';
  }
}
