import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  HelpCircle,
  ShieldCheck,
  ArrowRightLeft,
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

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', customLabel }) => {
  const isSmall = size === 'sm';
  const sizeClasses = isSmall ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  if (!status) {
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] text-slate-700 border border-[#cbd5e1] font-medium ${sizeClasses}`}
      >
        <span>{customLabel || '—'}</span>
      </span>
    );
  }

  const safeFormat = (val?: string) => (val ? String(val).replace(/_/g, ' ') : '');

  // Semantic styles mapping
  switch (status) {
    case 'RECONCILED':
    case 'RESOLVED':
    case 'APPROVED':
    case 'POSTED':
    case 'COMPLETED':
    case 'CONNECTED':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium ${sizeClasses}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>{customLabel || (status === 'RECONCILED' ? '✓ Reconciled' : safeFormat(status))}</span>
        </span>
      );

    case 'BREAK':
    case 'WARNING':
    case 'OPEN':
    case 'INVESTIGATING':
    case 'ERROR':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/30 font-medium ${sizeClasses}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
          <span>{customLabel || (status === 'BREAK' ? '⚠ Break' : safeFormat(status))}</span>
        </span>
      );

    case 'PENDING':
    case 'PENDING_APPROVAL':
    case 'READY_FOR_REVIEW':
    case 'SYNCING':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-blue-500/10 text-blue-700 border border-blue-500/30 font-medium ${sizeClasses}`}
        >
          <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>{customLabel || (status === 'READY_FOR_REVIEW' ? 'Review Needed' : safeFormat(status))}</span>
        </span>
      );

    case 'BLOCKED':
    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-rose-500/10 text-rose-700 border border-rose-500/30 font-medium ${sizeClasses}`}
        >
          <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{customLabel || safeFormat(status)}</span>
        </span>
      );

    case 'UNKNOWN':
    case 'UNMATCHED':
    case 'UNPOSTED':
    case 'DRAFT':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-[#f1f5f9] text-slate-700 border border-[#cbd5e1] font-medium ${sizeClasses}`}
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>{customLabel || (status === 'UNKNOWN' ? 'Needs Review' : safeFormat(status))}</span>
        </span>
      );

    // Classifications
    case 'STAKING_REWARD':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-purple-500/15 text-purple-700 border border-purple-500/30 font-medium ${sizeClasses}`}
        >
          <Coins className="w-3.5 h-3.5 text-purple-600 shrink-0" />
          <span>Staking Yield</span>
        </span>
      );

    case 'PURCHASE':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 font-medium ${sizeClasses}`}
        >
          <span>Asset Purchase</span>
        </span>
      );

    case 'SALE':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-indigo-500/10 text-indigo-700 border border-indigo-500/30 font-medium ${sizeClasses}`}
        >
          <span>Asset Disposal</span>
        </span>
      );

    case 'INTERNAL_TRANSFER':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-[#f8fafc] text-slate-700 border border-[#e2e8f0] font-medium ${sizeClasses}`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-slate-600 shrink-0" />
          <span>Internal Transfer</span>
        </span>
      );

    case 'CUSTODY_FEE':
    case 'NETWORK_FEE':
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/30 font-medium ${sizeClasses}`}
        >
          <span>{status === 'NETWORK_FEE' ? 'Network Fee' : 'Custody Fee'}</span>
        </span>
      );

    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-[#f8fafc] text-slate-700 border border-[#e2e8f0] font-medium ${sizeClasses}`}
        >
          <span>{customLabel || String(status).replace(/_/g, ' ')}</span>
        </span>
      );
  }
};
