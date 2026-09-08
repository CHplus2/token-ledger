import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  HelpCircle,
  ArrowRightLeft,
  ArrowUpRight,
  ArrowDownToLine,
  ArrowUpFromLine,
  Percent,
  Banknote,
  Gift,
  Flame,
  Sparkles,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  Coins,
} from 'lucide-react';
import { ReconciliationStatus, AccountingStatus, ApprovalStatus, TransactionClassification } from '../../types';

interface StatusBadgeProps {
  status:
    | ReconciliationStatus
    | AccountingStatus
    | ApprovalStatus
    | TransactionClassification
    | 'CONNECTED'
    | 'SYNCING'
    | 'ERROR'
    | 'IDLE'
    | 'COMPLETED'
    | 'WARNING'
    | 'PENDING'
    | 'BLOCKED'
    | 'OPEN'
    | 'INVESTIGATING'
    | 'RESOLVED'
    | 'APPROVED'
    | 'POSTED'
    | 'READY_FOR_REVIEW'
    | 'DRAFT';
  size?: 'sm' | 'md';
  customLabel?: string;
}

const titleCase = (val: string) =>
  val
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', customLabel }) => {
  const isSmall = size === 'sm';
  const sizeClasses = isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';
  const base = `inline-flex items-center gap-1 rounded-full font-medium whitespace-nowrap ${sizeClasses}`;

  if (!status) {
    return (
      <span className={`${base} bg-[#f1f5f9] text-slate-700 border border-[#cbd5e1]`}>
        <span>{customLabel || '—'}</span>
      </span>
    );
  }

  const safeFormat = (val?: string) => (val ? titleCase(String(val)) : '');

  // Semantic styles mapping
  switch (status) {
    case 'RECONCILED':
    case 'RESOLVED':
    case 'APPROVED':
    case 'POSTED':
    case 'COMPLETED':
    case 'CONNECTED':
      return (
        <span className={`${base} bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{customLabel || (status === 'RECONCILED' ? 'Reconciled' : safeFormat(status))}</span>
        </span>
      );

    case 'BREAK':
    case 'WARNING':
    case 'OPEN':
    case 'INVESTIGATING':
    case 'ERROR':
      return (
        <span className={`${base} bg-amber-500/10 text-amber-700 border border-amber-500/30`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{customLabel || (status === 'BREAK' ? 'Break' : safeFormat(status))}</span>
        </span>
      );

    case 'PENDING':
    case 'PENDING_APPROVAL':
    case 'READY_FOR_REVIEW':
    case 'SYNCING':
      return (
        <span className={`${base} bg-blue-500/10 text-blue-700 border border-blue-500/30`}>
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{customLabel || (status === 'READY_FOR_REVIEW' ? 'Review Needed' : safeFormat(status))}</span>
        </span>
      );

    case 'BLOCKED':
    case 'REJECTED':
      return (
        <span className={`${base} bg-rose-500/10 text-rose-700 border border-rose-500/30`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{customLabel || safeFormat(status)}</span>
        </span>
      );

    case 'UNKNOWN':
    case 'UNMATCHED':
    case 'UNPOSTED':
    case 'DRAFT':
      return (
        <span className={`${base} bg-[#f1f5f9] text-slate-700 border border-[#cbd5e1]`}>
          <HelpCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>{customLabel || (status === 'UNKNOWN' ? 'Needs Review' : safeFormat(status))}</span>
        </span>
      );

    // Transaction classifications
    case 'STAKING_REWARD':
      return (
        <span className={`${base} bg-purple-500/15 text-purple-700 border border-purple-500/30`}>
          <Coins className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Staking Yield</span>
        </span>
      );

    case 'PURCHASE':
      return (
        <span className={`${base} bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`}>
          <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Asset Purchase</span>
        </span>
      );

    case 'SALE':
      return (
        <span className={`${base} bg-indigo-500/10 text-indigo-700 border border-indigo-500/30`}>
          <ArrowUpFromLine className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span>Asset Disposal</span>
        </span>
      );

    case 'INTERNAL_TRANSFER':
      return (
        <span className={`${base} bg-[#f8fafc] text-slate-700 border border-[#e2e8f0]`}>
          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Internal Transfer</span>
        </span>
      );

    case 'EXTERNAL_TRANSFER':
      return (
        <span className={`${base} bg-[#f8fafc] text-slate-700 border border-[#e2e8f0]`}>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>External Transfer</span>
        </span>
      );

    case 'DEPOSIT':
      return (
        <span className={`${base} bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`}>
          <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Deposit</span>
        </span>
      );

    case 'WITHDRAWAL':
      return (
        <span className={`${base} bg-rose-500/10 text-rose-700 border border-rose-500/30`}>
          <ArrowUpFromLine className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Withdrawal</span>
        </span>
      );

    case 'CUSTODY_FEE':
    case 'NETWORK_FEE':
    case 'TRADING_FEE':
      return (
        <span className={`${base} bg-orange-500/10 text-orange-700 border border-orange-500/30`}>
          <Percent className="w-3.5 h-3.5 text-orange-600 shrink-0" />
          <span>{status === 'NETWORK_FEE' ? 'Network Fee' : status === 'TRADING_FEE' ? 'Trading Fee' : 'Custody Fee'}</span>
        </span>
      );

    case 'DISTRIBUTION':
      return (
        <span className={`${base} bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`}>
          <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Distribution</span>
        </span>
      );

    case 'AIRDROP':
      return (
        <span className={`${base} bg-purple-500/15 text-purple-700 border border-purple-500/30`}>
          <Gift className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Airdrop</span>
        </span>
      );

    case 'TOKEN_MINT':
      return (
        <span className={`${base} bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`}>
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Token Mint</span>
        </span>
      );

    case 'TOKEN_BURN':
      return (
        <span className={`${base} bg-rose-500/10 text-rose-700 border border-rose-500/30`}>
          <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Token Burn</span>
        </span>
      );

    case 'INCOME':
      return (
        <span className={`${base} bg-emerald-500/10 text-emerald-600 border border-emerald-500/20`}>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Income</span>
        </span>
      );

    case 'EXPENSE':
      return (
        <span className={`${base} bg-rose-500/10 text-rose-700 border border-rose-500/30`}>
          <TrendingDown className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>Expense</span>
        </span>
      );

    case 'RENT_EXEMPTION':
      return (
        <span className={`${base} bg-[#f8fafc] text-slate-700 border border-[#e2e8f0]`}>
          <RefreshCcw className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Rent Exemption</span>
        </span>
      );

    default:
      return (
        <span className={`${base} bg-[#f8fafc] text-slate-700 border border-[#e2e8f0]`}>
          <span>{customLabel || titleCase(String(status))}</span>
        </span>
      );
  }
};
