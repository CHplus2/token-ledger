/**
 * Multi-Chain Custody Portfolio API routes.
 *
 * Static/seeded relational data model only — no live on-chain balance
 * reading, no auth, no real-time pricing, no reconciliation/alerting logic.
 * See prisma/schema.prisma for the Asset -> Holding(chain, wallet, custodian) model.
 */

import { Router, Request, Response } from 'express';
import { prisma } from './prisma.ts';

export const custodyRouter = Router();

function serializeHolding(h: any) {
  return {
    id: h.id,
    balance: Number(h.balance),
    marketValue: Number(h.marketValue),
    asOfDate: h.asOfDate,
    asset: h.asset ? { id: h.asset.id, name: h.asset.name, symbol: h.asset.symbol, assetType: h.asset.assetType } : undefined,
    issuer: h.asset?.issuer ? { id: h.asset.issuer.id, name: h.asset.issuer.name } : undefined,
    chain: h.chain ? { id: h.chain.id, name: h.chain.name } : undefined,
    wallet: h.wallet ? { id: h.wallet.id, name: h.wallet.name, address: h.wallet.address } : undefined,
    custodian: h.custodian ? { id: h.custodian.id, name: h.custodian.name } : undefined,
    assetManager: h.assetManager ? { id: h.assetManager.id, name: h.assetManager.name } : undefined,
  };
}

const holdingInclude = {
  asset: { include: { issuer: true } },
  chain: true,
  wallet: true,
  custodian: true,
  assetManager: true,
};

// ---------- Reference / lookup lists (for dropdowns & filters) ----------

custodyRouter.get('/asset-managers', async (_req: Request, res: Response) => {
  const rows = await prisma.assetManager.findMany({ orderBy: { name: 'asc' } });
  res.json(rows);
});

custodyRouter.get('/issuers', async (_req: Request, res: Response) => {
  const rows = await prisma.issuer.findMany({ orderBy: { name: 'asc' } });
  res.json(rows);
});

custodyRouter.get('/chains', async (_req: Request, res: Response) => {
  const rows = await prisma.chain.findMany({ orderBy: { name: 'asc' } });
  res.json(rows);
});

// ---------- Assets (CRUD) ----------

custodyRouter.get('/assets', async (_req: Request, res: Response) => {
  const rows = await prisma.asset.findMany({
    include: { issuer: true, _count: { select: { holdings: true } } },
    orderBy: { symbol: 'asc' },
  });
  res.json(rows.map((a) => ({ ...a, holdingCount: a._count.holdings })));
});

custodyRouter.post('/assets', async (req: Request, res: Response) => {
  const { name, symbol, assetType, issuerId } = req.body;
  if (!name || !symbol || !assetType || !issuerId) {
    return res.status(400).json({ error: 'name, symbol, assetType, and issuerId are required' });
  }
  try {
    const asset = await prisma.asset.create({ data: { name, symbol, assetType, issuerId }, include: { issuer: true } });
    res.status(201).json(asset);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to create asset' });
  }
});

custodyRouter.patch('/assets/:id', async (req: Request, res: Response) => {
  const { name, symbol, assetType, issuerId } = req.body;
  try {
    const asset = await prisma.asset.update({
      where: { id: req.params.id },
      data: { name, symbol, assetType, issuerId },
      include: { issuer: true },
    });
    res.json(asset);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to update asset' });
  }
});

custodyRouter.delete('/assets/:id', async (req: Request, res: Response) => {
  try {
    await prisma.asset.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to delete asset (it may still have holdings)' });
  }
});

// ---------- Wallets (CRUD) ----------

custodyRouter.get('/wallets', async (_req: Request, res: Response) => {
  const rows = await prisma.wallet.findMany({ include: { chain: true }, orderBy: { name: 'asc' } });
  res.json(rows);
});

custodyRouter.post('/wallets', async (req: Request, res: Response) => {
  const { name, address, chainId } = req.body;
  if (!name || !chainId) {
    return res.status(400).json({ error: 'name and chainId are required' });
  }
  try {
    const wallet = await prisma.wallet.create({ data: { name, address, chainId }, include: { chain: true } });
    res.status(201).json(wallet);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to create wallet' });
  }
});

custodyRouter.patch('/wallets/:id', async (req: Request, res: Response) => {
  const { name, address, chainId } = req.body;
  try {
    const wallet = await prisma.wallet.update({
      where: { id: req.params.id },
      data: { name, address, chainId },
      include: { chain: true },
    });
    res.json(wallet);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to update wallet' });
  }
});

custodyRouter.delete('/wallets/:id', async (req: Request, res: Response) => {
  try {
    await prisma.wallet.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to delete wallet (it may still have holdings)' });
  }
});

// ---------- Custodians (CRUD) ----------

custodyRouter.get('/custodians', async (_req: Request, res: Response) => {
  const rows = await prisma.custodian.findMany({ orderBy: { name: 'asc' } });
  res.json(rows);
});

custodyRouter.post('/custodians', async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name is required' });
  try {
    const custodian = await prisma.custodian.create({ data: { name } });
    res.status(201).json(custodian);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to create custodian' });
  }
});

custodyRouter.patch('/custodians/:id', async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const custodian = await prisma.custodian.update({ where: { id: req.params.id }, data: { name } });
    res.json(custodian);
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to update custodian' });
  }
});

custodyRouter.delete('/custodians/:id', async (req: Request, res: Response) => {
  try {
    await prisma.custodian.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to delete custodian (it may still have holdings)' });
  }
});

// ---------- Holdings (core CRUD + filtering) ----------

custodyRouter.get('/holdings', async (req: Request, res: Response) => {
  const { assetId, chainId, custodianId, issuerId, assetManagerId } = req.query as Record<string, string | undefined>;

  const rows = await prisma.holding.findMany({
    where: {
      assetId: assetId || undefined,
      chainId: chainId || undefined,
      custodianId: custodianId || undefined,
      assetManagerId: assetManagerId || undefined,
      asset: issuerId ? { issuerId } : undefined,
    },
    include: holdingInclude,
    orderBy: [{ asset: { symbol: 'asc' } }, { chain: { name: 'asc' } }],
  });

  res.json(rows.map(serializeHolding));
});

custodyRouter.get('/holdings/summary', async (req: Request, res: Response) => {
  const { assetManagerId } = req.query as Record<string, string | undefined>;
  const rows = await prisma.holding.findMany({
    where: { assetManagerId: assetManagerId || undefined },
    include: holdingInclude,
  });

  const serialized = rows.map(serializeHolding);
  const totalValue = serialized.reduce((sum, h) => sum + h.marketValue, 0);

  const rollup = (keyFn: (h: ReturnType<typeof serializeHolding>) => { key: string; label: string }) => {
    const map = new Map<string, { key: string; label: string; value: number }>();
    for (const h of serialized) {
      const { key, label } = keyFn(h);
      const existing = map.get(key);
      if (existing) {
        existing.value += h.marketValue;
      } else {
        map.set(key, { key, label, value: h.marketValue });
      }
    }
    return Array.from(map.values())
      .sort((a, b) => b.value - a.value)
      .map((row) => ({ ...row, percentage: totalValue > 0 ? (row.value / totalValue) * 100 : 0 }));
  };

  res.json({
    totalValue,
    holdingCount: serialized.length,
    byAsset: rollup((h) => ({ key: h.asset!.id, label: `${h.asset!.symbol} — ${h.asset!.name}` })),
    byChain: rollup((h) => ({ key: h.chain!.id, label: h.chain!.name })),
    byCustodian: rollup((h) => ({ key: h.custodian!.id, label: h.custodian!.name })),
  });
});

custodyRouter.post('/holdings', async (req: Request, res: Response) => {
  const { assetId, chainId, walletId, custodianId, assetManagerId, balance, marketValue, asOfDate } = req.body;
  if (!assetId || !chainId || !walletId || !custodianId || !assetManagerId || balance == null || marketValue == null) {
    return res.status(400).json({
      error: 'assetId, chainId, walletId, custodianId, assetManagerId, balance, and marketValue are required',
    });
  }
  try {
    const holding = await prisma.holding.create({
      data: {
        assetId,
        chainId,
        walletId,
        custodianId,
        assetManagerId,
        balance,
        marketValue,
        asOfDate: asOfDate ? new Date(asOfDate) : new Date(),
      },
      include: holdingInclude,
    });
    res.status(201).json(serializeHolding(holding));
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to create holding' });
  }
});

custodyRouter.patch('/holdings/:id', async (req: Request, res: Response) => {
  const { balance, marketValue, asOfDate, chainId, walletId, custodianId } = req.body;
  try {
    const holding = await prisma.holding.update({
      where: { id: req.params.id },
      data: {
        balance: balance != null ? balance : undefined,
        marketValue: marketValue != null ? marketValue : undefined,
        asOfDate: asOfDate ? new Date(asOfDate) : undefined,
        chainId: chainId || undefined,
        walletId: walletId || undefined,
        custodianId: custodianId || undefined,
      },
      include: holdingInclude,
    });
    res.json(serializeHolding(holding));
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to update holding' });
  }
});

custodyRouter.delete('/holdings/:id', async (req: Request, res: Response) => {
  try {
    await prisma.holding.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err: any) {
    res.status(400).json({ error: err?.message || 'Failed to delete holding' });
  }
});
