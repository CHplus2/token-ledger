/**
 * Data hook for the Multi-Chain Custody Portfolio module.
 *
 * Talks to the /api/custody/* endpoints (Postgres via Prisma on the server)
 * in a normal deployment. When rendered inside a Claude Artifact preview
 * with no backend reachable — detected via the presence of the Artifact
 * `window.claude` runtime — it transparently falls back to the Artifact's
 * own live database capability instead, so the demo works standalone.
 * `window.claude` never exists in a real deployment, so this fallback path
 * is dead code there; it exists purely so the hosted demo link can show a
 * fully working Custody Portfolio without a real database behind it.
 *
 * This is a static/seeded relational data model — no live on-chain balance
 * reading, no auth, no real-time pricing, no reconciliation logic.
 */
import { useCallback, useEffect, useMemo, useState } from 'react';

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

interface AllData {
  assetManagers: AssetManager[];
  issuers: Issuer[];
  chains: Chain[];
  custodians: Custodian[];
  wallets: Wallet[];
  assets: Asset[];
  holdings: Holding[];
}

type AssetInput = { name: string; symbol: string; assetType: AssetType; issuerId: string };
type WalletInput = { name: string; address?: string; chainId: string };
type CustodianInput = { name: string };
type HoldingInput = {
  assetId: string;
  chainId: string;
  walletId: string;
  custodianId: string;
  assetManagerId: string;
  balance: number;
  marketValue: number;
  asOfDate?: string;
};

// ---------------------------------------------------------------------
// Transport: real backend (Postgres via /api/custody/*)
// ---------------------------------------------------------------------

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

async function restLoadAll(): Promise<AllData> {
  const [assetManagers, issuers, chains, custodians, wallets, assets, holdings] = await Promise.all([
    apiFetch<AssetManager[]>('/asset-managers'),
    apiFetch<Issuer[]>('/issuers'),
    apiFetch<Chain[]>('/chains'),
    apiFetch<Custodian[]>('/custodians'),
    apiFetch<Wallet[]>('/wallets'),
    apiFetch<Asset[]>('/assets'),
    apiFetch<Holding[]>('/holdings'),
  ]);
  return { assetManagers, issuers, chains, custodians, wallets, assets, holdings };
}

const restTransport = {
  loadAll: restLoadAll,
  createAsset: (data: AssetInput) => apiFetch('/assets', { method: 'POST', body: JSON.stringify(data) }),
  updateAsset: (id: string, data: Partial<AssetInput>) =>
    apiFetch(`/assets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteAsset: (id: string) => apiFetch(`/assets/${id}`, { method: 'DELETE' }),
  createWallet: (data: WalletInput) => apiFetch('/wallets', { method: 'POST', body: JSON.stringify(data) }),
  updateWallet: (id: string, data: Partial<WalletInput>) =>
    apiFetch(`/wallets/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteWallet: (id: string) => apiFetch(`/wallets/${id}`, { method: 'DELETE' }),
  createCustodian: (data: CustodianInput) => apiFetch('/custodians', { method: 'POST', body: JSON.stringify(data) }),
  updateCustodian: (id: string, data: CustodianInput) =>
    apiFetch(`/custodians/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteCustodian: (id: string) => apiFetch(`/custodians/${id}`, { method: 'DELETE' }),
  createHolding: (data: HoldingInput) => apiFetch('/holdings', { method: 'POST', body: JSON.stringify(data) }),
  updateHolding: (id: string, data: Partial<HoldingInput>) =>
    apiFetch(`/holdings/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteHolding: (id: string) => apiFetch(`/holdings/${id}`, { method: 'DELETE' }),
};

// ---------------------------------------------------------------------
// Transport: Artifact live database (demo fallback, no backend needed)
// ---------------------------------------------------------------------

declare global {
  interface Window {
    claude?: { use: (name: string) => Promise<any> };
  }
}

function inArtifactRuntime(): boolean {
  return typeof window !== 'undefined' && !!window.claude && typeof window.claude.use === 'function';
}

let artifactDbPromise: Promise<any> | null = null;
function getArtifactDb(): Promise<any> {
  if (!artifactDbPromise) {
    artifactDbPromise = window.claude!.use('db').then((db) => {
      if (!db) throw new Error('Live data storage is unavailable in this preview.');
      return db;
    });
  }
  return artifactDbPromise;
}

async function collectionDocs(db: any, name: string): Promise<Array<Record<string, any>>> {
  const snap = await db.collection(name).get();
  return snap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
}

function holdingDocToHolding(h: Record<string, any>): Holding {
  return {
    id: h.id,
    balance: Number(h.balance) || 0,
    marketValue: Number(h.marketValue) || 0,
    asOfDate: h.asOfDate,
    asset: { id: h.assetId, name: h.assetName, symbol: h.assetSymbol, assetType: h.assetType },
    issuer: { id: h.issuerId, name: h.issuerName },
    chain: { id: h.chainId, name: h.chainName },
    wallet: { id: h.walletId, name: h.walletName, address: h.walletAddress ?? null },
    custodian: { id: h.custodianId, name: h.custodianName },
    assetManager: { id: h.assetManagerId, name: h.assetManagerName },
  };
}

async function artifactLoadAll(): Promise<AllData> {
  const db = await getArtifactDb();
  const [assetManagerDocs, issuerDocs, chainDocs, custodianDocs, walletDocs, assetDocs, holdingDocs] = await Promise.all([
    collectionDocs(db, 'assetManagers'),
    collectionDocs(db, 'issuers'),
    collectionDocs(db, 'chains'),
    collectionDocs(db, 'custodians'),
    collectionDocs(db, 'wallets'),
    collectionDocs(db, 'assets'),
    collectionDocs(db, 'holdings'),
  ]);

  const assetManagers: AssetManager[] = assetManagerDocs.map((m) => ({ id: m.id, name: m.name }));
  const issuers: Issuer[] = issuerDocs.map((i) => ({ id: i.id, name: i.name }));
  const chains: Chain[] = chainDocs.map((c) => ({ id: c.id, name: c.name }));
  const custodians: Custodian[] = custodianDocs.map((c) => ({ id: c.id, name: c.name }));
  const wallets: Wallet[] = walletDocs.map((w) => ({
    id: w.id,
    name: w.name,
    address: w.address ?? null,
    chainId: w.chainId,
    chain: { id: w.chainId, name: w.chainName },
  }));
  const assets: Asset[] = assetDocs.map((a) => ({
    id: a.id,
    name: a.name,
    symbol: a.symbol,
    assetType: a.assetType,
    issuerId: a.issuerId,
    issuer: { id: a.issuerId, name: a.issuerName },
    holdingCount: holdingDocs.filter((h) => h.assetId === a.id).length,
  }));
  const holdings: Holding[] = holdingDocs.map(holdingDocToHolding);

  return { assetManagers, issuers, chains, custodians, wallets, assets, holdings };
}

function findName<T extends { id: string; name: string }>(list: T[], id: string): string {
  return list.find((x) => x.id === id)?.name || '';
}

function makeArtifactTransport(getState: () => AllData) {
  return {
    loadAll: artifactLoadAll,
    createAsset: async (data: AssetInput) => {
      const db = await getArtifactDb();
      await db.collection('assets').add({
        name: data.name,
        symbol: data.symbol,
        assetType: data.assetType,
        issuerId: data.issuerId,
        issuerName: findName(getState().issuers, data.issuerId),
      });
    },
    updateAsset: async (id: string, data: Partial<AssetInput>) => {
      const db = await getArtifactDb();
      const patch: Record<string, any> = { ...data };
      if (data.issuerId) patch.issuerName = findName(getState().issuers, data.issuerId);
      await db.doc(`assets/${id}`).update(patch);
    },
    deleteAsset: async (id: string) => {
      const db = await getArtifactDb();
      await db.doc(`assets/${id}`).delete();
    },
    createWallet: async (data: WalletInput) => {
      const db = await getArtifactDb();
      await db.collection('wallets').add({
        name: data.name,
        address: data.address || null,
        chainId: data.chainId,
        chainName: findName(getState().chains, data.chainId),
      });
    },
    updateWallet: async (id: string, data: Partial<WalletInput>) => {
      const db = await getArtifactDb();
      const patch: Record<string, any> = { ...data };
      if (data.chainId) patch.chainName = findName(getState().chains, data.chainId);
      await db.doc(`wallets/${id}`).update(patch);
    },
    deleteWallet: async (id: string) => {
      const db = await getArtifactDb();
      await db.doc(`wallets/${id}`).delete();
    },
    createCustodian: async (data: CustodianInput) => {
      const db = await getArtifactDb();
      await db.collection('custodians').add({ name: data.name });
    },
    updateCustodian: async (id: string, data: CustodianInput) => {
      const db = await getArtifactDb();
      await db.doc(`custodians/${id}`).update({ name: data.name });
    },
    deleteCustodian: async (id: string) => {
      const db = await getArtifactDb();
      await db.doc(`custodians/${id}`).delete();
    },
    createHolding: async (data: HoldingInput) => {
      const db = await getArtifactDb();
      const s = getState();
      const asset = s.assets.find((a) => a.id === data.assetId);
      const chain = s.chains.find((c) => c.id === data.chainId);
      const wallet = s.wallets.find((w) => w.id === data.walletId);
      const custodian = s.custodians.find((c) => c.id === data.custodianId);
      const manager = s.assetManagers.find((m) => m.id === data.assetManagerId);
      if (!asset || !chain || !wallet || !custodian || !manager) {
        throw new Error('Missing reference data for this holding.');
      }
      await db.collection('holdings').add({
        assetId: asset.id,
        assetSymbol: asset.symbol,
        assetName: asset.name,
        assetType: asset.assetType,
        issuerId: asset.issuerId,
        issuerName: asset.issuer?.name || '',
        chainId: chain.id,
        chainName: chain.name,
        walletId: wallet.id,
        walletName: wallet.name,
        custodianId: custodian.id,
        custodianName: custodian.name,
        assetManagerId: manager.id,
        assetManagerName: manager.name,
        balance: data.balance,
        marketValue: data.marketValue,
        asOfDate: data.asOfDate ? new Date(data.asOfDate).toISOString() : new Date().toISOString(),
      });
    },
    updateHolding: async (id: string, data: Partial<HoldingInput>) => {
      const db = await getArtifactDb();
      const s = getState();
      const patch: Record<string, any> = { ...data };
      if (data.chainId) {
        const chain = s.chains.find((c) => c.id === data.chainId);
        if (chain) patch.chainName = chain.name;
      }
      if (data.walletId) {
        const wallet = s.wallets.find((w) => w.id === data.walletId);
        if (wallet) patch.walletName = wallet.name;
      }
      if (data.custodianId) {
        const custodian = s.custodians.find((c) => c.id === data.custodianId);
        if (custodian) patch.custodianName = custodian.name;
      }
      if (data.asOfDate) patch.asOfDate = new Date(data.asOfDate).toISOString();
      await db.doc(`holdings/${id}`).update(patch);
    },
    deleteHolding: async (id: string) => {
      const db = await getArtifactDb();
      await db.doc(`holdings/${id}`).delete();
    },
  };
}

// ---------------------------------------------------------------------
// Derived rollups (shared by both transports; computed client-side)
// ---------------------------------------------------------------------

function computeSummary(holdings: Holding[]): PortfolioSummary {
  const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0);

  const rollup = (keyFn: (h: Holding) => { key: string; label: string }): PortfolioSummaryRow[] => {
    const map = new Map<string, PortfolioSummaryRow>();
    holdings.forEach((h) => {
      const { key, label } = keyFn(h);
      const existing = map.get(key);
      if (existing) existing.value += h.marketValue;
      else map.set(key, { key, label, value: h.marketValue, percentage: 0 });
    });
    return Array.from(map.values())
      .sort((a, b) => b.value - a.value)
      .map((r) => ({ ...r, percentage: totalValue > 0 ? (r.value / totalValue) * 100 : 0 }));
  };

  return {
    totalValue,
    holdingCount: holdings.length,
    byAsset: rollup((h) => ({ key: h.asset!.id, label: `${h.asset!.symbol} — ${h.asset!.name}` })),
    byChain: rollup((h) => ({ key: h.chain!.id, label: h.chain!.name })),
    byCustodian: rollup((h) => ({ key: h.custodian!.id, label: h.custodian!.name })),
  };
}

function matchesFilters(h: Holding, f: HoldingFilters): boolean {
  if (f.assetId && h.asset?.id !== f.assetId) return false;
  if (f.issuerId && h.issuer?.id !== f.issuerId) return false;
  if (f.chainId && h.chain?.id !== f.chainId) return false;
  if (f.custodianId && h.custodian?.id !== f.custodianId) return false;
  return true;
}

// ---------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------

const emptyData: AllData = { assetManagers: [], issuers: [], chains: [], custodians: [], wallets: [], assets: [], holdings: [] };

export function useCustodyPortfolio() {
  const [data, setData] = useState<AllData>(emptyData);
  const [filters, setFilters] = useState<HoldingFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stable ref-like getter so the artifact transport can read current
  // reference data (issuers/chains/etc.) without recreating on every render.
  const dataRef = useMemo(() => ({ current: data }), []);
  dataRef.current = data;

  const transport = useMemo(
    () => (inArtifactRuntime() ? makeArtifactTransport(() => dataRef.current) : restTransport),
    [dataRef]
  );

  const refetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const all = await transport.loadAll();
      setData(all);
    } catch (err: any) {
      setError(err?.message || 'Failed to load custody portfolio data.');
    } finally {
      setLoading(false);
    }
  }, [transport]);

  useEffect(() => {
    refetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = useCallback((next: HoldingFilters) => setFilters(next), []);

  const holdings = useMemo(() => data.holdings.filter((h) => matchesFilters(h, filters)), [data.holdings, filters]);
  const summary = useMemo(() => computeSummary(data.holdings), [data.holdings]);

  const getHoldingsForAsset = useCallback(
    (assetId: string) => dataRef.current.holdings.filter((h) => h.asset?.id === assetId),
    [dataRef]
  );

  const runMutation = useCallback(
    async (fn: () => Promise<any>) => {
      await fn();
      await refetchAll();
    },
    [refetchAll]
  );

  const createAsset = useCallback((d: AssetInput) => runMutation(() => transport.createAsset(d)), [transport, runMutation]);
  const updateAsset = useCallback(
    (id: string, d: Partial<AssetInput>) => runMutation(() => transport.updateAsset(id, d)),
    [transport, runMutation]
  );
  const deleteAsset = useCallback((id: string) => runMutation(() => transport.deleteAsset(id)), [transport, runMutation]);

  const createWallet = useCallback((d: WalletInput) => runMutation(() => transport.createWallet(d)), [transport, runMutation]);
  const updateWallet = useCallback(
    (id: string, d: Partial<WalletInput>) => runMutation(() => transport.updateWallet(id, d)),
    [transport, runMutation]
  );
  const deleteWallet = useCallback((id: string) => runMutation(() => transport.deleteWallet(id)), [transport, runMutation]);

  const createCustodian = useCallback(
    (d: CustodianInput) => runMutation(() => transport.createCustodian(d)),
    [transport, runMutation]
  );
  const updateCustodian = useCallback(
    (id: string, d: CustodianInput) => runMutation(() => transport.updateCustodian(id, d)),
    [transport, runMutation]
  );
  const deleteCustodian = useCallback(
    (id: string) => runMutation(() => transport.deleteCustodian(id)),
    [transport, runMutation]
  );

  const createHolding = useCallback(
    (d: HoldingInput) => runMutation(() => transport.createHolding(d)),
    [transport, runMutation]
  );
  const updateHolding = useCallback(
    (id: string, d: Partial<HoldingInput>) => runMutation(() => transport.updateHolding(id, d)),
    [transport, runMutation]
  );
  const deleteHolding = useCallback(
    (id: string) => runMutation(() => transport.deleteHolding(id)),
    [transport, runMutation]
  );

  return {
    // data
    assets: data.assets,
    issuers: data.issuers,
    chains: data.chains,
    custodians: data.custodians,
    wallets: data.wallets,
    assetManagers: data.assetManagers,
    holdings,
    summary,
    filters,
    loading,
    error,
    // actions
    applyFilters,
    refetchAll,
    getHoldingsForAsset,
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
