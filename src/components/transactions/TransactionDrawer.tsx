import React, { useState } from 'react';
import {
  X,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  FileText,
  Shield,
  Layers,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Coins,
  Check,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { NormalizedTransaction, TransactionClassification } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

interface TransactionDrawerProps {
  tx: NormalizedTransaction | null;
  onClose: () => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({ tx, onClose }) => {
  const {
    classifyTransaction,
    approveTransaction,
    openAIWithContext,
    currentUser,
  } = useLedger();

  const [selectedClassification, setSelectedClassification] = useState<TransactionClassification>(
    tx?.classification || 'UNKNOWN'
  );
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  const [noteText, setNoteText] = useState(tx?.notes || '');

  if (!tx) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(tx.txHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleApplyClassification = (cls: TransactionClassification) => {
    setSelectedClassification(cls);
    classifyTransaction(tx.id, cls, noteText);
  };

  const isSolana = tx.network.includes('Solana') || tx.sourceName.includes('Solana');

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[540px] bg-[#0e0e12] border-l border-[#222226] shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200 overflow-hidden text-white">
      {/* Drawer Header */}
      <div className="px-6 py-4 bg-[#141419] border-b border-[#222226] text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-xs shadow-xs">
            TX
          </div>
          <div>
            <div className="text-xs text-slate-400 font-mono flex items-center gap-2">
              <span>{tx.externalTxId}</span>
              {isSolana && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  SOLANA TREASURY
                </span>
              )}
            </div>
            <h3 className="text-sm font-bold text-white truncate max-w-sm">
              {tx.businessDescription}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#1c1c21] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
        {/* SECTION 1: BUSINESS OVERVIEW */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span>1. Business & Economic Overview</span>
          </div>

          <div className="bg-[#111114] rounded-xl p-4 border border-[#222226] space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Execution Date:</span>
              <span className="font-semibold text-slate-200 font-mono">{tx.timestamp}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Legal Entity:</span>
              <span className="font-semibold text-white">{tx.entityName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Custody Location:</span>
              <span className="font-semibold text-white flex items-center gap-1">
                <MapPin className="w-3 h-3 text-purple-400" />
                {tx.location || tx.sourceName}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Connected Source:</span>
              <span className="font-semibold text-slate-300">{tx.sourceName}</span>
            </div>
            {tx.walletName && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Digital Wallet:</span>
                <span className="font-semibold text-slate-300">{tx.walletName}</span>
              </div>
            )}
            {tx.custodian && (
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Custodian:</span>
                <span className="font-semibold text-purple-300">{tx.custodian}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Tokenized Asset Movement:</span>
              <span className="font-mono font-bold text-white">
                {tx.quantityReceived && `+${tx.quantityReceived.toLocaleString()} ${tx.assetReceived}`}
                {tx.quantitySent && ` -${tx.quantitySent.toLocaleString()} ${tx.assetSent}`}
              </span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#222226]">
              <span className="text-slate-400">Recognized Fair Value (USD):</span>
              <span className="font-mono font-bold text-base text-white">
                ${(tx.fiatValue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            {tx.feeQuantity && (
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Network Fee:</span>
                <span className="font-mono text-slate-300">
                  {tx.feeQuantity} {tx.feeAsset} (${(tx.feeFiatValue ?? 0).toFixed(4)})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 2: ACCOUNTING CLASSIFICATION & GL MAPPING */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>2. Institutional Accounting Treatment & Subledger Mapping</span>
          </div>

          {/* AI Suggestion Box if unclassified */}
          {tx.classification === 'UNKNOWN' && (
            <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-purple-200 font-bold">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Ledger AI Recommended Classification</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {tx.classificationConfidence}% Confidence
                </span>
              </div>

              <p className="text-purple-200/90 leading-relaxed text-[11px]">
                {tx.classificationRuleReason ||
                  'Identified incoming tokenized fund dividend distribution based on Securitize monthly yield cycle.'}
              </p>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleApplyClassification(tx.suggestedClassification || 'DIVIDEND_DISTRIBUTION')}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-2xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept Classification</span>
                </button>

                <button
                  onClick={() => openAIWithContext('TRANSACTION_EXPLAIN', tx)}
                  className="px-2.5 py-1.5 rounded-lg bg-[#16161c] border border-purple-500/30 text-purple-300 font-medium text-xs hover:bg-[#1c1c21] cursor-pointer"
                >
                  Explain Reason
                </button>
              </div>
            </div>
          )}

          <div className="bg-[#111114] rounded-xl p-4 border border-[#222226] space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Transaction Classification:
              </label>
              <select
                value={selectedClassification}
                onChange={(e) => handleApplyClassification(e.target.value as TransactionClassification)}
                className="w-full px-3 py-2 rounded-lg border border-[#2d2d35] bg-[#16161c] font-medium text-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
              >
                <option value="PURCHASE">Asset Subscription / Purchase</option>
                <option value="SALE">Asset Redemption / Sale</option>
                <option value="INTERNAL_TRANSFER">Internal Cross-Venue Transfer</option>
                <option value="DIVIDEND_DISTRIBUTION">Fund Yield & Dividend Distribution</option>
                <option value="COUPON_PAYMENT">Sukuk Coupon Payment</option>
                <option value="CUSTODY_FEE">Custodial & Safe-keeping Fee</option>
                <option value="NETWORK_FEE">Protocol Gas / Network Fee</option>
                <option value="UNKNOWN">Needs Review / Unclassified</option>
              </select>
            </div>

            {/* Debit & Credit Accounts */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-2.5 bg-[#16161c] rounded-lg border border-[#222226]">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Debit Account</span>
                <span className="font-bold text-white">{tx.debitAccountCode}</span>
                <span className="block text-[11px] text-slate-400 truncate">{tx.debitAccountName}</span>
              </div>

              <div className="p-2.5 bg-[#16161c] rounded-lg border border-[#222226]">
                <span className="block text-[10px] uppercase font-bold text-slate-400">Credit Account</span>
                <span className="font-bold text-white">{tx.creditAccountCode}</span>
                <span className="block text-[11px] text-slate-400 truncate">{tx.creditAccountName}</span>
              </div>
            </div>

            {/* Cost Basis & Realized P&L if Disposal */}
            {tx.realizedGainLoss !== undefined && tx.realizedGainLoss !== null && (
              <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/30 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-emerald-400">
                    Recognized Realized Gain
                  </span>
                  <span className="text-[11px] text-emerald-300">FIFO Acquisition Cost: ${(tx.costBasis ?? 0).toLocaleString()}</span>
                </div>
                <span className="font-mono font-bold text-sm text-emerald-300">
                  +${(tx.realizedGainLoss ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: RECONCILIATION STATUS */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>3. Five-Way Verification & Valuation</span>
          </div>

          <div className="bg-[#111114] rounded-xl p-4 border border-[#222226] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Reconciliation Match:</span>
              <StatusBadge status={tx.reconciliationStatus} size="sm" />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Matching Method:</span>
              <span className="font-medium text-slate-200 font-mono">
                {tx.reconciliationMatchMethod || 'EXACT_HASH'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pricing Oracle / Valuation Feed:</span>
              <span className="font-medium text-slate-200">{tx.priceSource}</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: AUDIT EVIDENCE & CRYPTOGRAPHIC PROOF */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>4. Cryptographic DLT Transaction Reference & Audit Evidence</span>
          </div>

          <div className="bg-[#111114] rounded-xl p-4 border border-[#222226] space-y-2.5">
            <div>
              <span className="block text-slate-400 mb-1">DLT Transaction Reference:</span>
              <div className="flex items-center justify-between p-2 bg-[#16161c] rounded-lg border border-[#222226] font-mono text-[11px] text-slate-200">
                <span className="truncate max-w-[360px]">{tx.txHash}</span>
                <button
                  onClick={handleCopyHash}
                  className="p-1 text-slate-400 hover:text-white ml-2 cursor-pointer"
                  title="Copy Reference"
                >
                  {copiedHash ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-slate-400">Infrastructure / Platform:</span>
              <span className="font-semibold text-white">{tx.network}</span>
            </div>

            {/* Toggle Raw JSON */}
            <div className="pt-1">
              <button
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="text-[11px] font-semibold text-purple-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{showTechnicalDetails ? 'Hide Raw Audit Payload' : 'View Raw Audit Payload'}</span>
                {showTechnicalDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showTechnicalDetails && (
                <pre className="mt-2 p-3 bg-black/90 text-purple-300 rounded-lg text-[10px] font-mono overflow-x-auto max-h-40 border border-[#222226]">
                  {JSON.stringify(
                    {
                      txId: tx.id,
                      externalId: tx.externalTxId,
                      dltRef: tx.txHash,
                      location: tx.location,
                      network: tx.network,
                      walletName: tx.walletName,
                      custodian: tx.custodian,
                      movements: tx.movements,
                      valuation: { spotUsd: tx.fiatValue, source: tx.priceSource },
                    },
                    null,
                    2
                  )}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer Footer Actions */}
      <div className="p-4 bg-[#141419] border-t border-[#222226] flex items-center justify-between shrink-0">
        <div className="text-[11px] text-slate-400">
          Status: <strong className="text-white">{tx.accountingStatus}</strong>
        </div>

        <div className="flex items-center gap-2">
          {tx.approvalStatus !== 'APPROVED' && (
            <button
              onClick={() => {
                approveTransaction(tx.id);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Post Subledger</span>
            </button>
          )}

          <button
            onClick={onClose}
            className="px-3 py-2 rounded-lg border border-[#2d2d35] hover:bg-[#1c1c21] text-slate-300 font-medium text-xs cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
