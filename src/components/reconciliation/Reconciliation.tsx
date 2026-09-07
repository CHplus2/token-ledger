import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Search,
  FileCheck,
  Clock,
  Layers,
  Check,
  RotateCcw,
  Sliders,
  ExternalLink,
  Building2,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { FiveWayReconciliationRecord, ReconciliationBreakItem } from '../../types';

export const Reconciliation: React.FC = () => {
  const {
    fiveWayRecords,
    resolveFiveWayException,
    reconciliationBreaks,
    resolveReconciliationBreak,
    selectedBreak,
    setSelectedBreak,
    openAIWithContext,
    organization,
    updateOrganization,
    currentUser,
    assetValuations,
  } = useLedger();

  const [activeTab, setActiveTab] = useState<'FIVE_WAY' | 'BREAKS' | 'POSITIONS_BY_LOCATION' | 'TOLERANCES'>('FIVE_WAY');
  const [investigatingRecord, setInvestigatingRecord] = useState<FiveWayReconciliationRecord | null>(null);
  const [resolutionModalBreak, setResolutionModalBreak] = useState<ReconciliationBreakItem | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const handleOpenFiveWayInvestigation = (rec: FiveWayReconciliationRecord) => {
    setInvestigatingRecord(rec);
    setResolutionNote(
      rec.exceptionReason ||
        'Confirmed in-transit settlement completed on Solana Treasury. 50 units credited to account.'
    );
  };

  const handleConfirmFiveWayResolve = () => {
    if (investigatingRecord) {
      resolveFiveWayException(investigatingRecord.id, resolutionNote);
      setInvestigatingRecord(null);
    }
  };

  const handleOpenBreakResolve = (item: ReconciliationBreakItem) => {
    setResolutionModalBreak(item);
    setResolutionNote(
      item.potentialReason ||
        `Adjusted subledger balance for ${item.asset} variance against verified node balance.`
    );
  };

  const handleConfirmBreakResolve = () => {
    if (resolutionModalBreak) {
      resolveReconciliationBreak(resolutionModalBreak.id, resolutionNote);
      setResolutionModalBreak(null);
    }
  };

  const openBreaks = reconciliationBreaks.filter((b) => b.status === 'OPEN' || b.status === 'INVESTIGATING');
  const resolvedBreaks = reconciliationBreaks.filter((b) => b.status === 'RESOLVED' || b.status === 'APPROVED');
  const hasException = fiveWayRecords.some((r) => r.status === 'EXCEPTION');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Five-Way Cross-Platform Reconciliation"
        subtitle="Automated, continuous matching across Solana Treasury, Coinbase, Kraken, Securitize / Backed Registry, Token Ledger Subledger, and SAP General Ledger."
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => openAIWithContext('RECONCILIATION_DIAGNOSTICS', { fiveWayRecords, openBreaks })}
              className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
              <span>AI Diagnostic Engine</span>
            </button>
          </div>
        }
      />

      {/* Five-Way Health Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-[#111114] rounded-xl border border-[#222226] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase mb-1">
            <span>1. Solana Treasury</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">100% Synced</div>
          <div className="text-[10px] text-purple-300 font-medium mt-1">Slot #28841920 • Mainnet</div>
        </div>

        <div className="bg-[#111114] rounded-xl border border-[#222226] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase mb-1">
            <span>2. Coinbase & Kraken</span>
            <Scale className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">
            {hasException ? '1 Discrepancy' : '100% Matched'}
          </div>
          <div className={`text-[10px] font-medium mt-1 ${hasException ? 'text-amber-400' : 'text-emerald-400'}`}>
            {hasException ? 'Kraken 50-Unit NVDA Break' : '✓ 12,000,000 Units Verified'}
          </div>
        </div>

        <div className="bg-[#111114] rounded-xl border border-[#222226] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase mb-1">
            <span>3. Tokenization Platform</span>
            <FileCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">Verified</div>
          <div className="text-[10px] text-emerald-400 font-medium mt-1">Securitize & Backed AG</div>
        </div>

        <div className="bg-[#111114] rounded-xl border border-[#222226] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase mb-1">
            <span>4. Token Subledger</span>
            <Layers className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">$38.40M</div>
          <div className="text-[10px] text-purple-300 font-medium mt-1">233 Normalized Records</div>
        </div>

        <div className="bg-[#111114] rounded-xl border border-[#222226] p-4 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold uppercase mb-1">
            <span>5. General Ledger</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">Balanced</div>
          <div className="text-[10px] text-emerald-400 font-medium mt-1">SAP S/4HANA Control Accounts</div>
        </div>
      </div>

      {/* Exception Warning Banner if NVDA 50-unit break is present */}
      {hasException && (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-200 uppercase tracking-wide">
                Active Five-Way Reconciliation Exception
              </div>
              <p className="text-xs text-amber-300/90 mt-0.5 max-w-3xl leading-relaxed">
                Kraken records indicate that 1,000 tokenized NVIDIA units were transferred to the Meridian Solana Treasury account, while the current Solana position reflects only 950 units associated with the transfer. Review whether the difference represents settlement timing, an unmatched transaction or an incorrect position record.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              const rec = fiveWayRecords.find((r) => r.assetSymbol === 'bNVDA');
              if (rec) handleOpenFiveWayInvestigation(rec);
            }}
            className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            Investigate & Resolve
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#222226] pb-2">
        {[
          { id: 'FIVE_WAY' as const, label: 'Five-Way Reconciliation Matrix' },
          { id: 'POSITIONS_BY_LOCATION' as const, label: 'Position by Location' },
          { id: 'BREAKS' as const, label: 'Variance Breaks Log' },
          { id: 'TOLERANCES' as const, label: 'Materiality & Policies' },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:bg-[#16161c] hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB 1: FIVE-WAY RECONCILIATION MATRIX */}
      {activeTab === 'FIVE_WAY' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#16161c] border-b border-[#222226] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Five-Way Cross-Platform Asset Master</h3>
              <p className="text-xs text-slate-400">
                Direct parity check across (1) Solana DLT, (2) Secondary Chains / Exchanges, (3) Issuers, (4) Subledger, and (5) General Ledger
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Tolerance: <strong className="text-white">${organization.materialityThresholdUsd} USD</strong></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
                  <th className="py-3 px-3">Tokenized Instrument</th>
                  <th className="py-3 px-3 text-right font-mono">1. Solana / DLT</th>
                  <th className="py-3 px-3 text-right font-mono">2. Secondary Chain / Exchange</th>
                  <th className="py-3 px-3 text-right font-mono">3. Tokenization Platform</th>
                  <th className="py-3 px-3 text-right font-mono">4. Subledger Units</th>
                  <th className="py-3 px-3 text-right font-mono">5. General Ledger (USD)</th>
                  <th className="py-3 px-3 text-right font-mono">Variance</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {fiveWayRecords.map((rec) => {
                  const hasVar = rec.varianceUnits !== 0;

                  return (
                    <tr key={rec.id} className="hover:bg-[#16161c]/80 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span className="font-mono px-1.5 py-0.5 rounded bg-[#22222a] text-[11px] text-purple-300 border border-[#333340]">
                            {rec.assetSymbol}
                          </span>
                          <span className="truncate max-w-[150px]">{rec.assetName}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 block mt-0.5">{rec.assetType}</span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                        <div>{rec.solanaDltUnits.toLocaleString()}</div>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[120px] ml-auto">
                          {rec.solanaDltSource}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                        <div>{rec.exchangeUnits.toLocaleString()}</div>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[140px] ml-auto">
                          {rec.exchangeBreakdown}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                        <div>{rec.issuerPlatformUnits.toLocaleString()}</div>
                        <span className="text-[10px] text-slate-500 block truncate max-w-[120px] ml-auto">
                          {rec.issuerPlatformSource}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono font-medium text-purple-300">
                        <div>{rec.subledgerUnits.toLocaleString()}</div>
                        <span className="text-[10px] text-slate-500 block">{rec.subledgerRef}</span>
                      </td>

                      <td className="py-3.5 px-3 text-right font-mono font-bold text-white">
                        <div>${rec.generalLedgerValueUsd.toLocaleString()}</div>
                        <span className="text-[10px] text-slate-500 block">{rec.generalLedgerAccount.split(' ')[0]}</span>
                      </td>

                      <td className={`py-3.5 px-3 text-right font-mono font-bold ${hasVar ? 'text-amber-400' : 'text-slate-500'}`}>
                        <div>{hasVar ? `${rec.varianceUnits} units` : '0'}</div>
                        {hasVar && <div className="text-[10px] text-amber-400/80">(${Math.abs(rec.varianceUsd).toLocaleString()})</div>}
                      </td>

                      <td className="py-3.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            rec.status === 'RECONCILED'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {rec.status === 'RECONCILED' ? 'Reconciled' : 'Exception'}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        {rec.status === 'EXCEPTION' ? (
                          <button
                            onClick={() => handleOpenFiveWayInvestigation(rec)}
                            className="px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                          >
                            Investigate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleOpenFiveWayInvestigation(rec)}
                            className="px-2.5 py-1 rounded-md bg-[#16161c] hover:bg-[#1c1c21] text-slate-300 border border-[#222226] font-medium text-xs cursor-pointer"
                          >
                            View Evidence
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: POSITION BY LOCATION */}
      {activeTab === 'POSITIONS_BY_LOCATION' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] p-5 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Granular Position Tracking by Custody Location</h3>
            <p className="text-xs text-slate-400">
              Institutional breakdown of tokenized assets across issuer-operated digital wallets (BlackRock, Khazanah, CIMB), Solana Treasury Accounts, Coinbase Institutional, and Kraken
            </p>
          </div>

          <div className="space-y-4">
            {assetValuations.map((asset) => (
              <div key={asset.id} className="p-4 bg-[#16161c] rounded-xl border border-[#222226]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#222226]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-[#22222a] px-2 py-0.5 rounded text-xs font-bold text-purple-300 border border-[#333340]">
                      {asset.assetSymbol}
                    </span>
                    <h4 className="font-bold text-white text-sm">{asset.name}</h4>
                    {asset.isSimulatedDemoNetwork && (
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20">
                        Demo Subledger
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 font-mono">
                    Total: <strong className="text-white">{asset.quantity?.toLocaleString()} units</strong> • Value:{' '}
                    <strong className="text-emerald-400">${asset.marketValueUsd.toLocaleString()} USD</strong>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {asset.positionsByLocation?.map((pos) => (
                    <div
                      key={pos.id}
                      className={`p-3 rounded-lg border text-xs ${
                        pos.reconciliationStatus === 'BREAK'
                          ? 'bg-amber-500/10 border-amber-500/30'
                          : 'bg-[#111114] border-[#222226]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-slate-200">{pos.locationName}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            pos.reconciliationStatus === 'BREAK'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}
                        >
                          {pos.reconciliationStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <div className="flex justify-between">
                          <span>Quantity:</span>
                          <span className="font-mono font-medium text-white">{pos.quantity.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fair Value:</span>
                          <span className="font-mono font-medium text-emerald-400">
                            ${pos.fairValueUsd.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Identifier:</span>
                          <span className="font-mono text-slate-400 truncate max-w-[140px]" title={pos.walletOrAccount}>{pos.walletOrAccount}</span>
                        </div>
                        {pos.custodian && (
                          <div className="flex justify-between">
                            <span>Custodian:</span>
                            <span className="font-medium text-purple-300">{pos.custodian}</span>
                          </div>
                        )}
                      </div>
                      {pos.notes && (
                        <div className="mt-2 pt-1.5 border-t border-amber-500/20 text-[10px] text-amber-300 font-medium leading-tight">
                          {pos.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BREAKS LOG */}
      {activeTab === 'BREAKS' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] shadow-xs overflow-hidden">
          <div className="p-4 bg-[#16161c] border-b border-[#222226] flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Reconciliation Variance Log & Timing Exceptions</h3>
              <p className="text-xs text-slate-400">Audited trail of balance differences and resolution notes</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#222226] text-slate-400 font-semibold bg-[#16161c]">
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Source & Destination</th>
                  <th className="py-3 px-4 text-right">Variance Qty</th>
                  <th className="py-3 px-4 text-right">Fiat Variance (USD)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e1e24]">
                {reconciliationBreaks.map((b) => (
                  <tr key={b.id} className="hover:bg-[#16161c]/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">
                      <span className="font-mono bg-[#22222a] px-1.5 py-0.5 rounded text-[11px] text-purple-300 mr-2 border border-[#333340]">
                        {b.asset}
                      </span>
                      {b.assetName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{b.breakCategory}</td>
                    <td className="py-3.5 px-4 text-slate-300">
                      <div>{b.sourceVenue}</div>
                      <div className="text-[10px] text-slate-500">→ {b.destinationVenue}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-400">
                      {b.difference !== 0 ? `${b.difference} units` : '0.00'}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-white">
                      ${(b.fiatDifferenceUsd ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {b.status === 'OPEN' || b.status === 'INVESTIGATING' ? (
                        <button
                          onClick={() => handleOpenBreakResolve(b)}
                          className="px-3 py-1 rounded-md bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                        >
                          Resolve
                        </button>
                      ) : (
                        <button
                          onClick={() => handleOpenBreakResolve(b)}
                          className="px-2.5 py-1 rounded-md bg-[#16161c] hover:bg-[#1c1c21] text-slate-300 border border-[#222226] font-medium text-xs cursor-pointer"
                        >
                          View Audit Note
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TOLERANCES */}
      {activeTab === 'TOLERANCES' && (
        <div className="bg-[#111114] rounded-xl border border-[#222226] p-6 shadow-xs max-w-2xl space-y-4 text-xs text-white">
          <div>
            <h3 className="text-sm font-bold text-white">Materiality & Tolerance Thresholds</h3>
            <p className="text-xs text-slate-400">
              Set organizational policy thresholds for automated vs manual exception classification.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Fiat Materiality Threshold (USD)
              </label>
              <input
                type="number"
                value={organization.materialityThresholdUsd}
                onChange={(e) => updateOrganization({ materialityThresholdUsd: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-[#16161c] border border-[#2d2d35] text-white font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500">
                Any break exceeding $50.00 triggers a mandatory Controller review task for month-end close.
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                Percentage Tolerance Limit (%)
              </label>
              <input
                type="number"
                step="0.01"
                value={organization.materialityPercent}
                onChange={(e) => updateOrganization({ materialityPercent: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-lg bg-[#16161c] border border-[#2d2d35] text-white font-mono text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* Investigation & Resolution Modal for Five-Way Exception */}
      {investigatingRecord && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#141419] rounded-xl shadow-2xl border border-[#2d2d38] w-full max-w-xl p-6 text-white animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <span>Five-Way Exception Investigation — {investigatingRecord.assetName}</span>
              </h3>
              <button
                onClick={() => setInvestigatingRecord(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs mb-5">
              <div className="p-3.5 bg-[#1a1a22] rounded-lg border border-[#2d2d38] space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">1. Solana Treasury Account:</span>
                  <span className="font-mono font-bold text-white">{investigatingRecord.solanaDltUnits} units (7xKX...82Qp)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">2. Kraken Institutional Custody:</span>
                  <span className="font-mono font-bold text-white">9,000 units (Dispatched 1,000)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">3. Backed Finance Swiss Registry:</span>
                  <span className="font-mono font-bold text-white">10,000 units (Attested 1:1 Collateral)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">4. Token Ledger Subledger:</span>
                  <span className="font-mono font-bold text-white">{investigatingRecord.subledgerUnits} units</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-[#2d2d38]">
                  <span className="text-slate-400 font-semibold">Variance Detected:</span>
                  <span className="font-mono font-bold text-amber-400">
                    {investigatingRecord.varianceUnits} units (${Math.abs(investigatingRecord.varianceUsd).toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Exact Diagnostic Wording from Master Prompt */}
              <div className="p-3.5 bg-amber-500/10 rounded-lg border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                <strong>Diagnostic Finding:</strong> {investigatingRecord.aiExplanation || 'Kraken records indicate that 1,000 tokenized NVIDIA units were transferred to the Meridian Solana Treasury account, while the current Solana position reflects only 950 units associated with the transfer. Review whether the difference represents settlement timing, an unmatched transaction or an incorrect position record.'}
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Controller Audit Resolution Note:
                </label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1a22] border border-[#2d2d38] text-white text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  placeholder="Record justification and confirmation of settlement timing..."
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222226]">
              <button
                onClick={() => setInvestigatingRecord(null)}
                className="px-3 py-2 rounded-lg border border-[#2d2d38] hover:bg-[#252530] text-xs font-medium text-slate-300 cursor-pointer"
              >
                Close
              </button>
              {investigatingRecord.status === 'EXCEPTION' && (
                <button
                  onClick={handleConfirmFiveWayResolve}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Confirm In-Transit Settlement & Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Break Resolution Modal */}
      {resolutionModalBreak && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#141419] rounded-xl shadow-2xl border border-[#2d2d38] w-full max-w-lg p-6 animate-in zoom-in-95 text-white">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-400" />
                <span>Reconciliation Break Note — {resolutionModalBreak.asset}</span>
              </h3>
              <button
                onClick={() => setResolutionModalBreak(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs mb-5">
              <div className="p-3 bg-[#1a1a22] rounded-lg border border-[#2d2d38] space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Blockchain / Source:</span>
                  <span className="font-mono font-bold text-white">{resolutionModalBreak.blockchainBalance} {resolutionModalBreak.asset}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Subledger Balance:</span>
                  <span className="font-mono font-bold text-white">{resolutionModalBreak.ledgerBalance} {resolutionModalBreak.asset}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-[#2d2d38]">
                  <span className="text-slate-400 font-semibold">Variance:</span>
                  <span className="font-mono font-bold text-amber-400">
                    +{resolutionModalBreak.difference} {resolutionModalBreak.asset} (${(resolutionModalBreak.fiatDifferenceUsd ?? 0).toFixed(2)})
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Audit Resolution Note:</label>
                <textarea
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#1a1a22] border border-[#2d2d38] text-white text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#222226]">
              <button
                onClick={() => setResolutionModalBreak(null)}
                className="px-3 py-2 rounded-lg border border-[#2d2d38] hover:bg-[#252530] text-xs font-medium text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
              {resolutionModalBreak.status !== 'RESOLVED' && (
                <button
                  onClick={handleConfirmBreakResolve}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Approve Resolution
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
