import React, { useMemo, useState } from 'react';
import {
  Landmark,
  Scale,
  Building2,
  TrendingUp,
  Coins,
  Banknote,
  History,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { AssetValuation, OrganizationSettings } from '../../types';

const usd = (v: number) =>
  `$${(v ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

interface BusinessLine {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  assetType: AssetValuation['assetType'];
  topics: string[];
}

const BUSINESS_LINES: BusinessLine[] = [
  {
    id: 'MMF',
    label: 'Tokenized Money Market Funds',
    description: 'BUIDL-style tokenized fund shares, NAV pass-through, and redemption mechanics.',
    icon: Landmark,
    assetType: 'TOKENIZED_FUND',
    topics: ['Nature of holdings', 'NAV pass-through mechanics', 'Redemption terms', 'Fair value hierarchy', 'Custodian oversight', 'Yield distribution income'],
  },
  {
    id: 'FIXED_INCOME',
    label: 'Tokenized Fixed Income (Sukuk & Bonds)',
    description: 'Shariah-compliant and conventional tokenized debt instruments and profit distributions.',
    icon: Scale,
    assetType: 'TOKENIZED_SECURITY',
    topics: ['Nature of holdings', 'Profit distribution mechanics', 'Amortized cost measurement', 'Issuer credit risk', 'Custodian oversight', 'Maturity profile'],
  },
  {
    id: 'DEPOSITS',
    label: 'Tokenized Bank Deposits',
    description: 'Bank-issued tokenized deposit instruments and settlement-leg accounting.',
    icon: Building2,
    assetType: 'TOKENIZED_DEPOSIT',
    topics: ['Nature of holdings', 'Settlement-leg accounting', 'Deposit insurance status', 'Custodian oversight', 'Currency / FX exposure'],
  },
  {
    id: 'EQUITIES',
    label: 'Tokenized Equities',
    description: 'Tokenized equity securities, corporate actions, and transfer mechanics across custodians.',
    icon: TrendingUp,
    assetType: 'TOKENIZED_EQUITY',
    topics: ['Nature of holdings', 'Corporate actions pass-through', 'Transfer agent mechanics', 'Custodian oversight', 'Cross-venue reconciliation', 'Fair value hierarchy'],
  },
  {
    id: 'TREASURY',
    label: 'Digital Asset Treasury & Staking',
    description: 'Native treasury holdings, validator/staking economics, and custody risk.',
    icon: Coins,
    assetType: 'CRYPTOCURRENCY',
    topics: ['Nature of holdings', 'Validator / staking economics', 'Protocol & slashing risk', 'Custody & key management', 'Network fee accounting', 'Rent-exemption reclaims', 'Fair value hierarchy'],
  },
  {
    id: 'STABLECOIN',
    label: 'Stablecoin Reserves',
    description: 'Reserve-backed stablecoin issuance and redemption operations.',
    icon: Banknote,
    assetType: 'STABLECOIN',
    topics: ['Nature of holdings', 'Peg & redemption mechanics', 'Reserve attestation', 'Issuer counterparty risk', 'Custodian oversight', 'Fair value hierarchy'],
  },
];

interface StatementRun {
  id: string;
  timestamp: string;
  entityName: string;
  customContext: string;
  lineIds: string[];
}

interface StatementBuilderProps {
  organization: OrganizationSettings;
  closeDate: string;
  currency: string;
  totalAssets: number;
  totalLiabilities: number;
  totalEquity: number;
  netIncome: number;
  assetValuations: AssetValuation[];
}

export const StatementBuilder: React.FC<StatementBuilderProps> = ({
  organization,
  closeDate,
  currency,
  totalAssets,
  totalLiabilities,
  totalEquity,
  netIncome,
  assetValuations,
}) => {
  const [entityName, setEntityName] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [selectedLines, setSelectedLines] = useState<Set<string>>(new Set());
  const [runs, setRuns] = useState<StatementRun[]>([]);
  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);

  const activeRun = useMemo(() => runs.find((r) => r.id === activeRunId) || null, [runs, activeRunId]);

  const toggleLine = (id: string) => {
    setSelectedLines((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const generate = () => {
    const run: StatementRun = {
      id: `run_${Date.now()}`,
      timestamp: new Date().toISOString(),
      entityName: entityName.trim(),
      customContext: customContext.trim(),
      lineIds: Array.from(selectedLines),
    };
    setRuns((prev) => [run, ...prev]);
    setActiveRunId(run.id);
    setShowHistory(false);
  };

  const newRun = () => {
    setActiveRunId(null);
    setEntityName('');
    setCustomContext('');
    setSelectedLines(new Set());
    setShowHistory(false);
  };

  const balanceSheetBalanced = Math.abs(totalAssets - (totalLiabilities + totalEquity + netIncome)) < 0.01;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={newRun}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              !activeRun ? 'bg-[#f1f5f9] text-slate-900' : 'text-slate-600 hover:bg-[#f8fafc]'
            }`}
          >
            New Run
          </button>
          {activeRun && (
            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs">
              Generated Draft
            </span>
          )}
        </div>
        <div className="relative">
          <button
            onClick={() => setShowHistory((v) => !v)}
            disabled={runs.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] hover:bg-[#f1f5f9] text-slate-700 text-xs font-semibold shadow-2xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <History className="w-3.5 h-3.5" />
            Previous Runs {runs.length > 0 && `(${runs.length})`}
          </button>
          {showHistory && runs.length > 0 && (
            <div className="absolute right-0 top-full mt-1 w-72 rounded-xl border border-[#e2e8f0] bg-white shadow-lg py-2 z-10">
              {runs.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setActiveRunId(r.id);
                    setShowHistory(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-[#f8fafc] flex items-center justify-between gap-2 cursor-pointer"
                >
                  <span>
                    <span className="block text-xs font-semibold text-slate-900">
                      {r.entityName || 'Untitled entity'}
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      {new Date(r.timestamp).toLocaleString()} · {r.lineIds.length} business line
                      {r.lineIds.length === 1 ? '' : 's'}
                    </span>
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {!activeRun && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs p-6 space-y-6">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Configuration</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Business line selection determines which disclosure packs are included. Other fields are saved for
              reference only.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Entity Name (optional)</label>
            <p className="text-[11px] text-slate-500 mb-2">Saved for reference only. This does not change the generated draft.</p>
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder={`e.g. ${organization.name}`}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Additional business lines (optional)</label>
            <p className="text-[11px] text-slate-500 mb-3">
              Core Financial Reporting is always included. Select additional packs to extend disclosure coverage.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUSINESS_LINES.map((line) => {
                const checked = selectedLines.has(line.id);
                const hasData = assetValuations.some((a) => a.assetType === line.assetType);
                return (
                  <button
                    key={line.id}
                    type="button"
                    onClick={() => toggleLine(line.id)}
                    disabled={!hasData}
                    className={`text-left flex items-start gap-3 p-3.5 rounded-xl border transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      checked ? 'border-purple-400 bg-purple-500/5' : 'border-[#e2e8f0] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <div
                      className={`mt-0.5 w-4 h-4 rounded shrink-0 border flex items-center justify-center ${
                        checked ? 'bg-purple-600 border-purple-600' : 'border-[#cbd5e1] bg-white'
                      }`}
                    >
                      {checked && <div className="w-1.5 h-1.5 rounded-sm bg-white" />}
                    </div>
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#f1f5f9' }}
                    >
                      <line.icon className="w-4 h-4 text-purple-700" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">{line.label}</span>
                        <span className="text-[10px] text-slate-400 shrink-0">{line.topics.length} topics</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{line.description}</p>
                      {!hasData && <p className="text-[10px] text-amber-600 mt-1">No matching holdings this period</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Custom context (optional)</label>
            <p className="text-[11px] text-slate-500 mb-2">Saved for reference only. Requests here are not used when creating the draft.</p>
            <textarea
              value={customContext}
              onChange={(e) => setCustomContext(e.target.value)}
              placeholder="e.g. Emphasize custody controls for the auditor review"
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-purple-400 resize-none"
            />
          </div>

          <div className="flex justify-end">
            <button
              onClick={generate}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Disclosures
            </button>
          </div>
        </div>
      )}

      {activeRun && (
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-xs p-6 max-w-3xl space-y-6 text-xs text-slate-900">
          <div className="border-b border-[#e2e8f0] pb-4">
            <h3 className="font-bold text-base text-slate-900">{activeRun.entityName || organization.name}</h3>
            <p className="text-purple-600 font-semibold">Digital Asset Financial Statement Disclosures — Draft</p>
            <p className="text-slate-600 text-[11px]">
              For the period ended {closeDate} · Reporting Currency: {currency}
            </p>
            {activeRun.customContext && (
              <p className="text-slate-500 text-[11px] mt-2 italic">Reviewer note: "{activeRun.customContext}"</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              1. Core Financial Reporting
            </div>
            <p className="text-slate-600 leading-relaxed">
              Total assets of {usd(totalAssets)} are matched by total liabilities and equity (including
              current-period net income) of {usd(totalLiabilities + totalEquity + netIncome)}
              {balanceSheetBalanced ? ', confirming the statement of financial position is in balance.' : ' — the position is currently out of balance; see the Trial Balance tab.'}{' '}
              Full detail is available in the Trial Balance, Balance Sheet, and Profit &amp; Loss tabs of this
              module.
            </p>
          </div>

          {activeRun.lineIds.length === 0 && (
            <p className="text-slate-500 italic">No additional business line packs selected — showing Core Financial Reporting only.</p>
          )}

          {BUSINESS_LINES.filter((l) => activeRun.lineIds.includes(l.id)).map((line, idx) => {
            const asset = assetValuations.find((a) => a.assetType === line.assetType);
            return (
              <div key={line.id} className="space-y-2.5 pt-2 border-t border-[#f1f5f9]">
                <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                  {idx + 2}. {line.label}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {line.topics.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-slate-600 text-[10px] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                {asset ? (
                  <>
                    <p className="text-slate-600 leading-relaxed">
                      {activeRun.entityName || organization.name} holds {(asset.quantity ?? asset.totalQuantity).toLocaleString()}{' '}
                      units of {asset.name} ({asset.assetSymbol}){asset.issuer ? `, issued by ${asset.issuer}` : ''}
                      {asset.custodian ? `, custodied by ${asset.custodian}` : ''}
                      {asset.chains && asset.chains.length > 0 ? ` across ${asset.chains.join(', ')}` : ''}. The
                      position is carried at a fair value of {usd(asset.marketValueUsd)} against a cost basis of{' '}
                      {usd(asset.costBasisUsd)}, an unrealized {asset.unrealizedGainLossUsd >= 0 ? 'gain' : 'loss'} of{' '}
                      {usd(Math.abs(asset.unrealizedGainLossUsd))}
                      {asset.valuationLevel ? `, measured under ${asset.valuationLevel}` : ''}.
                    </p>
                    <div className="grid grid-cols-3 gap-3 pt-1">
                      <div className="bg-[#f8fafc] rounded-lg p-2.5">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Fair Value</div>
                        <div className="font-mono font-bold text-slate-900">{usd(asset.marketValueUsd)}</div>
                      </div>
                      <div className="bg-[#f8fafc] rounded-lg p-2.5">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Cost Basis</div>
                        <div className="font-mono font-bold text-slate-900">{usd(asset.costBasisUsd)}</div>
                      </div>
                      <div className="bg-[#f8fafc] rounded-lg p-2.5">
                        <div className="text-[10px] text-slate-500 uppercase tracking-wide">Unrealized G/L</div>
                        <div className={`font-mono font-bold ${asset.unrealizedGainLossUsd >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {asset.unrealizedGainLossUsd >= 0 ? '+' : ''}
                          {usd(asset.unrealizedGainLossUsd)}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-500 italic">No matching holdings this period for this business line.</p>
                )}
              </div>
            );
          })}

          <div className="pt-4 border-t border-[#e2e8f0] text-[10px] text-slate-400 leading-relaxed">
            Draft assembled from live Token Ledger subledger data as of {closeDate}. Entity name and reviewer notes
            are reference-only and do not alter the figures shown. All data shown is seeded/mock data for
            illustration only — this draft is not audited financial statement disclosure language and should be
            reviewed by qualified accounting staff before use.
          </div>
        </div>
      )}
    </div>
  );
};
