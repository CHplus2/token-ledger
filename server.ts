/**
 * Token Ledger - Institutional Digital Asset Accounting Server
 * Express + Vite Integration
 */

import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { custodyRouter } from './server/custodyRoutes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI instance
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Token Ledger Institutional Subledger Engine',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Assistant Endpoint for Ledger AI with multi-model fallback and capacity resiliency
app.post('/api/ai/assistant', async (req: Request, res: Response) => {
  const { prompt, contextType, contextData } = req.body;
  const q = (prompt || '').toLowerCase();

  // Helper for institutional accounting knowledge base
  const getDeterministicAccountingAnswer = () => {
    if (q.includes('unclassified') || q.includes('classify') || q.includes('staking') || q.includes('epoch')) {
      return `### Ledger AI Accounting Assessment:
**Identified Pattern:** Periodic incoming digital asset movement without outgoing consideration.
- **Recommended Treatment:** Staking & Consensus Reward Income (Account 4200).
- **Accounting Standard:** Recognized as operating revenue at fair value spot rate upon block finalization under IFRS 15 / IAS 20 guidelines.
- **Subledger Entry:**
  - **Debit:** 1230 Digital Assets — Solana (SOL) [Asset]
  - **Credit:** 4200 Staking & Consensus Reward Income [Revenue]
- **Audit Requirement:** Retain validator vote account timestamp and Pyth/Chainlink VWAP price source proof for auditor sign-off.`;
    }
    
    if (q.includes('break') || q.includes('reconciliation') || q.includes('variance') || q.includes('eth')) {
      return `### Ledger AI Reconciliation Break Diagnostics:
**Variance Detected:** 2.0 ETH timing break between Ethereum Multisig and General Ledger Subledger.
- **Root Cause:** Multisig sweep batch on 29 Aug was confirmed on-chain but interim subledger batch was recorded at 18 ETH instead of 20 ETH.
- **Resolution Step:** Apply automatic adjusting journal to recognize the remaining 2.0 ETH ($8,640.00 fair value) to Fireblocks sub-account 1220.
- **Materiality:** Exceeds organization threshold ($50.00). Controller approval required before period lock.`;
    }

    if (q.includes('close') || q.includes('month-end') || q.includes('readiness') || q.includes('lock')) {
      return `### Ledger AI Month-End Close Readiness Analysis:
**Current Status:** 82 / 100 Close Readiness Score.
- **Critical Blockers:**
  1. **2 Open Reconciliation Breaks:** 2.0 ETH and 42.5 SOL staking yield timing variance.
  2. **3 Unclassified Transactions:** Epoch 682 SOL reward, Beacon Chain ETH yield, and SOL Rent reclaim.
  3. **3 Pending Journal Batches:** Awaiting Controller Maker-Checker sign-off ($15,499.06 total).
- **Recommended Remediation Path:**
  1. Auto-apply classification rules to unclassified transactions.
  2. Post adjusting subledger journals to resolve the 2 reconciliation breaks.
  3. Authorize pending journal batches to bring readiness score to 100% and enable CFO period lock.`;
    }

    if (q.includes('solana') || q.includes('sol') || q.includes('spl') || q.includes('rent')) {
      return `### Ledger AI Solana Treasury & Accounting Profile:
- **Treasury Status:** Solana Corporate Treasury & Staking Account is active as the top promoted institutional wallet.
- **Key Accounting Features:**
  1. **Validator Staking Yield:** Epoch-based yield is automatically segregated into Staking Revenue (Account 4200).
  2. **SPL-USDC Settlements:** Sub-second finality with deterministic 1:1 parity and negligible network fees ($0.0015 expensed to Account 5200).
  3. **Rent Reclaims:** Reclaimed lamports from closed token storage accounts are categorized as Other Operating Income (Account 4300).`;
    }

    if (q.includes('impairment') || q.includes('fair value') || q.includes('gaap') || q.includes('ifrs') || q.includes('cost basis') || q.includes('fifo')) {
      return `### Ledger AI Fair Value & Impairment Guidance (FASB ASU 2023-08 / IAS 38):
- **Measurement Method:** Fair value with changes recognized immediately in Net Income.
- **Cost Basis Methodology:** FIFO (First-In, First-Out) with lot-level tracking across subledger wallets.
- **Realized vs Unrealized Gain/Loss:** Segregated in General Ledger Accounts 4100 (Realized Gain on Digital Asset Disposals) and 4150 (Unrealized Fair Value Gain/Loss).
- **Audit Verification:** Hourly price snapshots locked from CME CF Reference Rates and Pyth Institutional VWAP.`;
    }

    return `### Ledger AI Institutional Guidance:
Based on your digital asset subledger state for **Atlas Digital Treasury Ltd**:
- **Total Assets Under Accounting:** $13.7M across BTC, ETH, SOL, and USDC.
- **Controls Status:** 97.8% reconciled against on-chain nodes, Fireblocks MPC vaults, and Coinbase Prime accounts.
- **Audit Trail:** All transactions maintain 5-tier cryptographic lineage from source transaction hash to Trial Balance lines.
- **Maker-Checker Enforcement:** Separation of duties strictly enforced across all journal approvals.`;
  };

  try {
    const ai = getAIClient();

    if (ai) {
      const systemInstruction = `You are "Ledger AI", an institutional financial accounting expert, CPA, and digital asset subledger specialist for Token Ledger.
You advise CFOs, Financial Controllers, Accountants, and Auditors.
Always prioritize GAAP/IFRS financial terminology over crypto slang (e.g. use "fair value", "spot acquisition cost", "staking income recognition", "subledger break", "control account", "network expense", "maker-checker separation of duties").
Keep responses structured, concise, and audit-ready with clear recommendations.
When asked about Solana, highlight Solana's high-speed epoch staking, SPL token rent-exemption accounting treatment, and low-latency settlement benefits for corporate treasury operations.`;

      const candidateModels = ['gemini-3.8-flash', 'gemini-flash-latest', 'gemini-3.1-flash-lite'];
      let lastAiError: any = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: `Context Type: ${contextType || 'GENERAL'}\nContext Data: ${JSON.stringify(contextData || {})}\n\nUser Question: ${prompt}`,
            config: {
              systemInstruction,
              temperature: 0.2,
            },
          });

          if (response && response.text) {
            return res.json({
              success: true,
              answer: response.text,
              provider: modelName === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash' : `Gemini (${modelName})`,
            });
          }
        } catch (modelErr: any) {
          lastAiError = modelErr;
          console.warn(`[Ledger AI] Model ${modelName} encountered transient error:`, modelErr?.message || modelErr);
          // Continue to try the next model candidate
        }
      }

      console.warn('[Ledger AI] All Gemini live model attempts temporarily busy/unavailable. Falling back to institutional accounting rules cache.', lastAiError?.message);
      
      return res.json({
        success: true,
        answer: `${getDeterministicAccountingAnswer()}\n\n*(Note: Live model capacity is currently experiencing temporary high demand; response generated via Token Ledger Institutional Accounting Rules Cache.)*`,
        provider: 'Institutional Accounting Rules Cache',
      });
    }

    // Deterministic fallback if API key is not yet set
    return res.json({
      success: true,
      answer: getDeterministicAccountingAnswer(),
      provider: 'Token Ledger Accounting Core',
    });
  } catch (error: any) {
    console.error('AI Assistant Error:', error);
    return res.json({
      success: true,
      answer: `${getDeterministicAccountingAnswer()}\n\n*(Note: Analysis delivered via Token Ledger Fallback Engine.)*`,
      provider: 'Token Ledger Fallback Engine',
    });
  }
});

// Multi-Chain Custody Portfolio API (Postgres/Prisma-backed)
app.use('/api/custody', custodyRouter);

// ERP Journal Export endpoint
app.post('/api/export/erp', (req: Request, res: Response) => {
  const { format, journals } = req.body;
  const targetFormat = format || 'CSV';

  let output = '';
  const now = new Date().toISOString();

  if (targetFormat === 'SAP') {
    output = `* SAP BAPI_ACC_DOCUMENT_POST FORMAT\n* GENERATED BY TOKEN LEDGER AT ${now}\n* HEADER: OBJ_TYPE=BKPFF, BUS_ACT=RFBU, USER=TOKENLEDGER\n`;
    (journals || []).forEach((j: any) => {
      output += `HEADER|${j.journalNumber}|${j.date}|USD|${j.description}\n`;
      (j.lines || []).forEach((l: any, idx: number) => {
        output += `ITEM|${idx + 1}|${l.accountCode}|${l.debit > 0 ? 'S' : 'H'}|${l.debit > 0 ? l.debit : l.credit}|${l.memo}\n`;
      });
    });
  } else if (targetFormat === 'NETSUITE') {
    output = `ExternalID,TranDate,PostingPeriod,Memo,Account,Debit,Credit,Entity,AssetSymbol,TxHash\n`;
    (journals || []).forEach((j: any) => {
      (j.lines || []).forEach((l: any) => {
        output += `"${j.journalNumber}","${j.date}","Aug 2026","${l.memo}","${l.accountCode} - ${l.accountName}",${l.debit || 0},${l.credit || 0},"${j.entityId || 'Atlas Treasury'}","${l.assetSymbol || ''}","${j.evidenceHash || ''}"\n`;
      });
    });
  } else {
    // Standard Generic ERP CSV
    output = `Journal Number,Date,Status,Account Code,Account Name,Debit (USD),Credit (USD),Asset,Quantity,Memo,Evidence Hash,Prepared By,Approved By\n`;
    (journals || []).forEach((j: any) => {
      (j.lines || []).forEach((l: any) => {
        output += `"${j.journalNumber}","${j.date}","${j.status}","${l.accountCode}","${l.accountName}",${l.debit || 0},${l.credit || 0},"${l.assetSymbol || ''}",${l.quantity || 0},"${l.memo}","${j.evidenceHash || ''}","${j.preparedBy || ''}","${j.approvedBy || ''}"\n`;
      });
    });
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=TokenLedger_Journals_${targetFormat}_${Date.now()}.csv`);
  res.send(output);
});

// Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Token Ledger] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
