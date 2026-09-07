/**
 * Seed script for the Multi-Chain Custody Portfolio module.
 *
 * All balance/marketValue figures below are PLACEHOLDER / MOCK VALUES,
 * randomized between $1,000,000 and $50,000,000 purely for demo purposes.
 * They do not reflect any real holdings.
 */

import 'dotenv/config';
import { prisma } from '../server/prisma.ts';

function randomAmount(min = 1_000_000, max = 50_000_000): number {
  return Math.round((min + Math.random() * (max - min)) * 100) / 100;
}

async function main() {
  console.log('[seed] Loading Multi-Chain Custody Portfolio demo data (placeholder values)...');

  const assetManager = await prisma.assetManager.upsert({
    where: { id: 'demo-asset-manager' },
    update: {},
    create: { id: 'demo-asset-manager', name: 'Demo Asset Manager' },
  });

  const [blackrock, circle, khazanah] = await Promise.all([
    prisma.issuer.upsert({ where: { name: 'BlackRock' }, update: {}, create: { name: 'BlackRock' } }),
    prisma.issuer.upsert({ where: { name: 'Circle' }, update: {}, create: { name: 'Circle' } }),
    prisma.issuer.upsert({ where: { name: 'Khazanah' }, update: {}, create: { name: 'Khazanah' } }),
  ]);

  const [solana, ethereum, vsystems] = await Promise.all([
    prisma.chain.upsert({ where: { name: 'Solana' }, update: {}, create: { name: 'Solana' } }),
    prisma.chain.upsert({ where: { name: 'Ethereum' }, update: {}, create: { name: 'Ethereum' } }),
    prisma.chain.upsert({ where: { name: 'VSystems' }, update: {}, create: { name: 'VSystems' } }),
  ]);

  const [bny, cokeeps] = await Promise.all([
    prisma.custodian.upsert({ where: { name: 'BNY' }, update: {}, create: { name: 'BNY' } }),
    prisma.custodian.upsert({ where: { name: 'Cokeeps' }, update: {}, create: { name: 'Cokeeps' } }),
  ]);

  const buidl = await prisma.asset.upsert({
    where: { symbol: 'BUIDL' },
    update: {},
    create: {
      symbol: 'BUIDL',
      name: 'BlackRock USD Institutional Digital Liquidity Fund',
      assetType: 'MONEY_MARKET_FUND',
      issuerId: blackrock.id,
    },
  });

  const usdc = await prisma.asset.upsert({
    where: { symbol: 'USDC' },
    update: {},
    create: {
      symbol: 'USDC',
      name: 'USD Coin',
      assetType: 'STABLECOIN',
      issuerId: circle.id,
    },
  });

  const sukuk = await prisma.asset.upsert({
    where: { symbol: 'SUKUK' },
    update: {},
    create: {
      symbol: 'SUKUK',
      name: 'Tokenized Sukuk',
      assetType: 'SUKUK',
      issuerId: khazanah.id,
    },
  });

  async function upsertWallet(name: string, chainId: string) {
    return prisma.wallet.upsert({
      where: { name_chainId: { name, chainId } },
      update: {},
      create: { name, chainId },
    });
  }

  const [
    blackrockWalletSol,
    blackrockWalletEth,
    circleWalletSol,
    circleWalletEth,
    khazanahWalletSol,
    khazanahWalletEth,
    khazanahWalletVsys,
  ] = await Promise.all([
    upsertWallet('BlackRock Digital Wallet (Solana)', solana.id),
    upsertWallet('BlackRock Digital Wallet (Ethereum)', ethereum.id),
    upsertWallet('Circle Wallet (Solana)', solana.id),
    upsertWallet('Circle Wallet (Ethereum)', ethereum.id),
    upsertWallet('Khazanah Digital Wallet (Solana)', solana.id),
    upsertWallet('Khazanah Digital Wallet (Ethereum)', ethereum.id),
    upsertWallet('Khazanah Digital Wallet (VSystems)', vsystems.id),
  ]);

  const asOfDate = new Date();
  asOfDate.setUTCHours(0, 0, 0, 0);

  const holdings: Array<{
    assetId: string;
    chainId: string;
    walletId: string;
    custodianId: string;
  }> = [
    { assetId: buidl.id, chainId: solana.id, walletId: blackrockWalletSol.id, custodianId: bny.id },
    { assetId: buidl.id, chainId: ethereum.id, walletId: blackrockWalletEth.id, custodianId: bny.id },
    { assetId: usdc.id, chainId: solana.id, walletId: circleWalletSol.id, custodianId: bny.id },
    { assetId: usdc.id, chainId: ethereum.id, walletId: circleWalletEth.id, custodianId: bny.id },
    { assetId: sukuk.id, chainId: solana.id, walletId: khazanahWalletSol.id, custodianId: cokeeps.id },
    { assetId: sukuk.id, chainId: ethereum.id, walletId: khazanahWalletEth.id, custodianId: cokeeps.id },
    { assetId: sukuk.id, chainId: vsystems.id, walletId: khazanahWalletVsys.id, custodianId: cokeeps.id },
  ];

  for (const h of holdings) {
    const balance = randomAmount();
    const marketValue = randomAmount();

    await prisma.holding.upsert({
      where: {
        assetId_chainId_walletId_custodianId_assetManagerId: {
          assetId: h.assetId,
          chainId: h.chainId,
          walletId: h.walletId,
          custodianId: h.custodianId,
          assetManagerId: assetManager.id,
        },
      },
      update: { balance, marketValue, asOfDate },
      create: {
        ...h,
        assetManagerId: assetManager.id,
        balance,
        marketValue,
        asOfDate,
      },
    });
  }

  console.log(`[seed] Done. Seeded ${holdings.length} holdings across ${holdings.length} chain/wallet/custodian combinations (mock balances).`);
}

main()
  .catch((err) => {
    console.error('[seed] Failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
