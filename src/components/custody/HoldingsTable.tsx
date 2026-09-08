import React, { useMemo, useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import { Holding, UseCustodyPortfolioReturn } from '../../hooks/useCustodyPortfolio';
import { ASSET_TYPE_LABELS, formatDate, formatUsd } from './formatters';
import { categoryBadgeClasses, getCustodyAssetCategory } from '../../utils/assetCategory';

type SortKey = 'asset' | 'issuer' | 'chain' | 'wallet' | 'custodian' | 'balance' | 'marketValue' | 'asOfDate';

interface HoldingsTableProps {
  data: UseCustodyPortfolioReturn;
  onSelectAsset: (assetId: string) => void;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = ({ data, onSelectAsset }) => {
  const { holdings, assets, issuers, chains, custodians, filters, applyFilters, loading } = data;

  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('marketValue');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  const sortValue = (h: Holding, key: SortKey): string | number => {
    switch (key) {
      case 'asset':
        return h.asset?.symbol || '';
      case 'issuer':
        return h.issuer?.name || '';
      case 'chain':
        return h.chain?.name || '';
      case 'wallet':
        return h.wallet?.name || '';
      case 'custodian':
        return h.custodian?.name || '';
      case 'balance':
        return h.balance;
      case 'marketValue':
        return h.marketValue;
      case 'asOfDate':
        return h.asOfDate;
    }
  };

  const filteredSorted = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? holdings.filter((h) =>
          [h.asset?.name, h.asset?.symbol, h.issuer?.name, h.chain?.name, h.wallet?.name, h.custodian?.name]
            .filter(Boolean)
            .some((v) => v!.toLowerCase().includes(q))
        )
      : holdings;

    return [...filtered].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [holdings, search, sortKey, sortDir]);

  const SortHeader: React.FC<{ label: string; k: SortKey; align?: 'left' | 'right' }> = ({ label, k, align = 'left' }) => (
    <th
      className={`py-3 px-3 cursor-pointer select-none hover:text-slate-900 transition-colors ${align === 'right' ? 'text-right' : ''}`}
      onClick={() => handleSort(k)}
    >
      <span className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        {label}
        {sortKey === k && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
      </span>
    </th>
  );

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-4 shadow-xs flex flex-col md:flex-row md:items-center gap-3 text-xs">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-slate-600 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search asset, issuer, chain, wallet, custodian..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] text-slate-900 placeholder:text-slate-600 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <select
          value={filters.assetId || 'ALL'}
          onChange={(e) => applyFilters({ ...filters, assetId: e.target.value === 'ALL' ? undefined : e.target.value })}
          className="px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] font-medium text-slate-800 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Assets</option>
          {assets.map((a) => (
            <option key={a.id} value={a.id}>
              {a.symbol}
            </option>
          ))}
        </select>

        <select
          value={filters.issuerId || 'ALL'}
          onChange={(e) => applyFilters({ ...filters, issuerId: e.target.value === 'ALL' ? undefined : e.target.value })}
          className="px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] font-medium text-slate-800 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Issuers</option>
          {issuers.map((i) => (
            <option key={i.id} value={i.id}>
              {i.name}
            </option>
          ))}
        </select>

        <select
          value={filters.chainId || 'ALL'}
          onChange={(e) => applyFilters({ ...filters, chainId: e.target.value === 'ALL' ? undefined : e.target.value })}
          className="px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] font-medium text-slate-800 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Chains</option>
          {chains.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          value={filters.custodianId || 'ALL'}
          onChange={(e) => applyFilters({ ...filters, custodianId: e.target.value === 'ALL' ? undefined : e.target.value })}
          className="px-3 py-2 rounded-lg border border-[#cbd5e1] bg-[#f8fafc] font-medium text-slate-800 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Custodians</option>
          {custodians.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {(filters.assetId || filters.issuerId || filters.chainId || filters.custodianId) && (
          <button
            onClick={() => applyFilters({})}
            className="px-3 py-2 rounded-lg bg-[#f8fafc] border border-[#cbd5e1] text-slate-700 font-semibold hover:bg-[#f1f5f9] cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#ffffff] rounded-xl border border-[#e2e8f0] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e2e8f0] text-slate-600 font-semibold bg-[#f8fafc]">
                <SortHeader label="Asset" k="asset" />
                <SortHeader label="Issuer" k="issuer" />
                <SortHeader label="Chain" k="chain" />
                <SortHeader label="Wallet" k="wallet" />
                <SortHeader label="Custodian" k="custodian" />
                <SortHeader label="Balance" k="balance" align="right" />
                <SortHeader label="Market Value" k="marketValue" align="right" />
                <SortHeader label="As-of Date" k="asOfDate" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {filteredSorted.map((h) => (
                <tr
                  key={h.id}
                  onClick={() => h.asset && onSelectAsset(h.asset.id)}
                  className="hover:bg-[#f8fafc]/80 transition-colors cursor-pointer"
                >
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{h.asset?.symbol}</div>
                    <div className="text-[10px] text-slate-600">{ASSET_TYPE_LABELS[h.asset?.assetType || ''] || h.asset?.assetType}</div>
                    {h.asset?.assetType && (
                      <span className={`inline-block mt-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold border ${categoryBadgeClasses(getCustodyAssetCategory(h.asset.assetType))}`}>
                        {getCustodyAssetCategory(h.asset.assetType)}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-slate-700">{h.issuer?.name}</td>
                  <td className="py-3 px-3">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/10 text-purple-700 border border-purple-500/20">
                      {h.chain?.name}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">{h.wallet?.name}</td>
                  <td className="py-3 px-3 text-slate-700">{h.custodian?.name}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800">{h.balance.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">{formatUsd(h.marketValue)}</td>
                  <td className="py-3 px-3 font-mono text-slate-600 whitespace-nowrap">{formatDate(h.asOfDate)}</td>
                </tr>
              ))}

              {!loading && filteredSorted.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-600">
                    No holdings match the selected filters or search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
