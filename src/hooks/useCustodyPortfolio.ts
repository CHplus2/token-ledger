/**
 * Data hook for the Multi-Chain Custody Portfolio module.
 *
 * Talks to the /api/custody/* endpoints (Postgres via Prisma on the server).
 * This is a static/seeded relational data model — no live on-chain balance
 * reading, no auth, no real-time pricing, no reconciliation logic.
 */
import { useCallback, useEffect, useState } from 'react';

export type AssetType = 'MONEY_MARKET_FUND' | 'STABLECOIN' | 'SUKUK' | 'EQUITY' | 'OTHER';

export interface Issuer {
  id: string;
  name: string;
}

export interface Chain {
  id: string;
  name: string;
}

export interface Custodian {
  id: string;
  name: string;
}

export interface Wallet {
  id: string;
  name: string;
  address: string | null;
  chainId: string;
  chain?: Chain;
}

export interface Asset {
  id: string;
  name: string;
  symbol: string;
  assetType: AssetType;
  issuerId: string;
  issuer?: Issuer;
  holdingCount?: number;
}

export interface AssetManager {
  id: string;
  name: string;
}

export interface Holding {
  id: string;
  balance: number;
  marketValue: number;
  asOfDate: string;
  asset?: { id: string; name: string; symbol: string; assetType: AssetType };
  issuer?: { id: string; name: string };
  chain?: { id: string; name: string };
  wallet?: { id: string; name: string; address: string | null };
  custodian?: { id: string; name: string };
  assetManager?: { id: string; name: string };
}

export interface PortfolioSummaryRow {
  key: string;
  label: string;
  value: number;
  percentage: number;
}

export interface PortfolioSummary {
  totalValue: number;
  holdingCount: number;
  byAsset: PortfolioSummaryRow[];
  byChain: PortfolioSummaryRow[];
  byCustodian: PortfolioSummaryRow[];
}

export interface HoldingFilters {
  assetId?: string;
  chainId?: string;
  custodianId?: string;
  issuerId?: string;
}

const API_BASE = '/api/custody';

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return undefined as unknown as T;
  return res.json();
}

export function useCustodyPortfolio() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [issuers, setIssuers] = useState<Issuer[]>([]);
  const [chains, setChains] = useState<Chain[]>([]);
  const [custodians, setCustodians] = useState<Custodian[]>([]);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [assetManagers, setAssetManagers] = useState<AssetManager[]>([]);
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [filters, setFilters] = useState<HoldingFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReferenceData = useCallback(async () => {
    const [a, i, c, cu, w, am] = await Promise.all([
      apiFetch<Asset[]>('/assets'),
      apiFetch<Issuer[]>('/issuers'),
      apiFetch<Chain[]>('/chains'),
      apiFetch<Custodian[]>('/custodians'),
      apiFetch<Wallet[]>('/wallets'),
      apiFetch<AssetManager[]>('/asset-managers'),
    ]);
    setAssets(a);
    setIssuers(i);
    setChains(c);
    setCustodians(cu);
    setWallets(w);
    setAssetManagers(am);
  }, []);

  const loadHoldings = useCallback(async (activeFilters: HoldingFilters) => {
    const params = new URLSearchParams();
    if (activeFilters.assetId) params.set('assetId', activeFilters.assetId);
    if (activeFilters.chainId) params.set('chainId', activeFilters.chainId);
    if (activeFilters.custodianId) params.set('custodianId', activeFilters.custodianId);
    if (activeFilters.issuerId) params.set('issuerId', activeFilters.issuerId);
    const qs = params.toString();
    const rows = await apiFetch<Holding[]>(`/holdings${qs ? `?${qs}` : ''}`);
    setHoldings(rows);
  }, []);

  const loadSummary = useCallback(async () => {
    const s = await apiFetch<PortfolioSummary>('/holdings/summary');
    setSummary(s);
  }, []);

  const refetchAll = useCallback(
    async (activeFilters: HoldingFilters = filters) => {
      setLoading(true);
      setError(null);
      try {
        await Promise.all([loadReferenceData(), loadHoldings(activeFilters), loadSummary()]);
      } catch (err: any) {
        setError(err?.message || 'Failed to load custody portfolio data.');
      } finally {
        setLoading(false);
      }
    },
    [filters, loadReferenceData, loadHoldings, loadSummary]
  );

  useEffect(() => {
    refetchAll(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = useCallback(
    (next: HoldingFilters) => {
      setFilters(next);
      loadHoldings(next).catch((err) => setError(err?.message || 'Failed to filter holdings.'));
    },
    [loadHoldings]
  );

  // ---- CRUD mutations (each refetches the affected lists) ----

  const createAsset = useCallback(
    async (data: { name: string; symbol: string; assetType: AssetType; issuerId: string }) => {
      await apiFetch('/assets', { method: 'POST', body: JSON.stringify(data) });
      await loadReferenceData();
    },
    [loadReferenceData]
  );

  const updateAsset = useCallback(
    async (id: string, data: Partial<{ name: string; symbol: string; assetType: AssetType; issuerId: string }>) => {
      await apiFetch(`/assets/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
      await loadReferenceData();
    },
    [loadReferenceData]
  );

  const deleteAsset = useCallback(
    async (id: string) => {
      await apiFetch(`/assets/${id}`, { method: 'DELETE' });
      await refetchAll();
    },
    [refetchAll]
  );

  const createWallet = useCallback(
    async (data: { name: string; address?: string; chainId: string }) => {
      await apiFetch('/wallets', { method: 'POST', body: JSON.stringify(data) });
      await loadReferenceData();
    },
    [loadReferenceData]
  );

  const updateWallet = useCallback(
    async (id: string, data: Partial<{ name: string; address: string; chainId: string }>) => {
      await apiFetch(`/wallets/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
      await loadReferenceData();
    },
    [loadReferenceData]
  );

  const deleteWallet = useCallback(
    async (id: string) => {
      await apiFetch(`/wallets/${id}`, { method: 'DELETE' });
      await refetchAll();
    },
    [refetchAll]
  );

  const createCustodian = useCallback(
    async (data: { name: string }) => {
      await apiFetch('/custodians', { method: 'POST', body: JSON.stringify(data) });
      await loadReferenceData();
    },
    [loadReferenceData]
  );

  const updateCustodian = useCallback(
    async (id: string, data: { name: string }) => {
      await apiFetch(`/custodians/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
      await loadReferenceData();
    },
    [loadReferenceData]
  );

  const deleteCustodian = useCallback(
    async (id: string) => {
      await apiFetch(`/custodians/${id}`, { method: 'DELETE' });
      await refetchAll();
    },
    [refetchAll]
  );

  const createHolding = useCallback(
    async (data: {
      assetId: string;
      chainId: string;
      walletId: string;
      custodianId: string;
      assetManagerId: string;
      balance: number;
      marketValue: number;
      asOfDate?: string;
    }) => {
      await apiFetch('/holdings', { method: 'POST', body: JSON.stringify(data) });
      await refetchAll();
    },
    [refetchAll]
  );

  const updateHolding = useCallback(
    async (
      id: string,
      data: Partial<{
        balance: number;
        marketValue: number;
        asOfDate: string;
        chainId: string;
        walletId: string;
        custodianId: string;
      }>
    ) => {
      await apiFetch(`/holdings/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
      await refetchAll();
    },
    [refetchAll]
  );

  const deleteHolding = useCallback(
    async (id: string) => {
      await apiFetch(`/holdings/${id}`, { method: 'DELETE' });
      await refetchAll();
    },
    [refetchAll]
  );

  return {
    // data
    assets,
    issuers,
    chains,
    custodians,
    wallets,
    assetManagers,
    holdings,
    summary,
    filters,
    loading,
    error,
    // actions
    applyFilters,
    refetchAll,
    createAsset,
    updateAsset,
    deleteAsset,
    createWallet,
    updateWallet,
    deleteWallet,
    createCustodian,
    updateCustodian,
    deleteCustodian,
    createHolding,
    updateHolding,
    deleteHolding,
  };
}

export type UseCustodyPortfolioReturn = ReturnType<typeof useCustodyPortfolio>;
