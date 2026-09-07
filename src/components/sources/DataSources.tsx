import React, { useState } from 'react';
import {
  Plus,
  RefreshCw,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Lock,
  Layers,
  ArrowRight,
  Sparkles,
  Server,
  ArrowLeftRight,
  FileSpreadsheet,
  Landmark,
  FileCode2,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { PageHeader } from '../common/PageHeader';
import { StatusBadge } from '../common/StatusBadge';
import { SourceCategory, SourceProvider, SourceType } from '../../types';

export const DataSources: React.FC = () => {
  const { dataSources, addDataSource, syncDataSource, entities } = useLedger();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Form State for Add Source
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedCategory, setSelectedCategory] = useState<SourceCategory>('BLOCKCHAIN');
  const [selectedType, setSelectedType] = useState<SourceType>('WALLET');
  const [selectedProvider, setSelectedProvider] = useState<SourceProvider>('SOLANA');
  const [sourceName, setSourceName] = useState('');
  const [accountAddress, setAccountAddress] = useState('');
  const [selectedEntityId, setSelectedEntityId] = useState(entities[0].id);
  const [purpose, setPurpose] = useState('Tokenized Asset Custody & Settlement');
  const [importStats, setImportStats] = useState<{ imported: number; classified: number; review: number } | null>(null);

  const categories = [
    { id: 'ALL', label: 'All Sources', count: dataSources.length },
    { id: 'BLOCKCHAIN', label: 'Blockchain / DLT (Solana)', count: dataSources.filter((s) => s.category === 'BLOCKCHAIN').length },
    { id: 'EXCHANGE', label: 'Exchange / Custody (Coinbase & Kraken)', count: dataSources.filter((s) => s.category === 'EXCHANGE').length },
    { id: 'TOKENIZATION_PLATFORM', label: 'Tokenization Platforms (Securitize & Backed)', count: dataSources.filter((s) => s.category === 'TOKENIZATION_PLATFORM').length },
    { id: 'BANKING', label: 'Banking / Settlement (CIMB)', count: dataSources.filter((s) => s.category === 'BANKING').length },
    { id: 'INTERNAL_SYSTEMS', label: 'Internal Systems (SAP & TMS)', count: dataSources.filter((s) => s.category === 'INTERNAL_SYSTEMS').length },
    { id: 'MANUAL', label: 'Manual Sources (CSV)', count: dataSources.filter((s) => s.category === 'MANUAL').length },
  ];

  const filteredSources = activeCategoryFilter === 'ALL'
    ? dataSources
    : dataSources.filter((s) => s.category === activeCategoryFilter);

  const handleSync = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      syncDataSource(id);
      setSyncingId(null);
    }, 1000);
  };

  const handleOpenAddModal = (defaultProvider: SourceProvider = 'SOLANA') => {
    setSelectedProvider(defaultProvider);
    if (defaultProvider === 'SOLANA') {
      setSelectedCategory('BLOCKCHAIN');
      setSelectedType('WALLET');
      setSourceName('Meridian Solana Secondary Treasury Account');
      setAccountAddress('9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin');
      setPurpose('Tokenized Asset Settlement Vault #2');
    } else if (defaultProvider === 'COINBASE' || defaultProvider === 'KRAKEN') {
      setSelectedCategory('EXCHANGE');
      setSelectedType('EXCHANGE');
      setSourceName(`${defaultProvider === 'COINBASE' ? 'Coinbase' : 'Kraken'} Sub-Account`);
      setAccountAddress(`ACT-${defaultProvider}-SUB-01`);
      setPurpose('Execution and Secondary Custody');
    } else {
      setSelectedCategory('TOKENIZATION_PLATFORM');
      setSelectedType('TOKENIZATION_PLATFORM');
      setSourceName('Securitize Additional Feed');
      setAccountAddress('REG-SEC-FEED-02');
      setPurpose('Cap Table Verification');
    }
    setStep(1);
    setImportStats(null);
    setIsAddModalOpen(true);
  };

  const handleCreateSource = () => {
    setStep(4);
    setTimeout(() => {
      setImportStats({
        imported: selectedProvider === 'SOLANA' ? 126 : 48,
        classified: selectedProvider === 'SOLANA' ? 124 : 46,
        review: 2,
      });
      addDataSource({
        entityId: selectedEntityId,
        name: sourceName || `${selectedProvider} Institutional Account`,
        category: selectedCategory,
        type: selectedType,
        provider: selectedProvider,
        addressOrAccount: accountAddress || 'Configured Read-Only Feed',
        purpose,
        promoted: selectedProvider === 'SOLANA',
        network: selectedProvider === 'SOLANA' ? 'Solana Mainnet-Beta' : 'Institutional API',
        isReadOnly: true,
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Data Sources & Adapters"
        subtitle="Manage read-only connections across Solana Treasury, Coinbase, Kraken, Securitize, Backed Finance, and CIMB Bank Settlement feeds."
        actions={
          <button
            id="btn-add-data-source"
            onClick={() => handleOpenAddModal('SOLANA')}
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Connect Data Source</span>
          </button>
        }
      />

      {/* Promoted Solana Highlight Banner */}
      <div className="rounded-xl border border-purple-500/30 bg-gradient-to-r from-[#141419] via-[#1a1a24] to-[#121222] p-6 text-white shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500 text-white">
                  PRIMARY INFRASTRUCTURE
                </span>
                <span className="text-xs font-semibold text-purple-300">
                  Solana Institutional Treasury Adapter
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                Solana Tokenized Asset Treasury & Settlement
              </h3>
              <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                Seamlessly reconcile SPL tokenized fund shares (BUIDL), tokenized equities (bNVDA), and sovereign bonds against institutional exchange and issuer cap-table ledgers with sub-second finality.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleOpenAddModal('SOLANA')}
              className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Connect Solana Account</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-[#222226]">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryFilter(cat.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
              activeCategoryFilter === cat.id
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-[#16161c]'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeCategoryFilter === cat.id ? 'bg-purple-800 text-white' : 'bg-[#222226] text-slate-400'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Connected Sources List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSources.map((source) => {
          const isSolana = source.provider === 'SOLANA';
          const isException = source.healthStatus === 'EXCEPTION';
          return (
            <div
              key={source.id}
              className={`bg-[#111114] rounded-xl border p-5 shadow-xs flex flex-col justify-between transition-all ${
                isException
                  ? 'border-amber-500/50 ring-1 ring-amber-500/20'
                  : isSolana
                  ? 'border-purple-500/40 ring-1 ring-purple-500/20'
                  : 'border-[#222226] hover:border-[#383845]'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                        isSolana
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : source.category === 'EXCHANGE'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          : source.category === 'TOKENIZATION_PLATFORM'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : source.category === 'BANKING'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}
                    >
                      {source.provider.substring(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {source.name}
                        </h4>
                      </div>
                      <span className="text-[11px] text-slate-400">{source.purpose}</span>
                    </div>
                  </div>

                  <StatusBadge status={source.status} size="sm" />
                </div>

                {/* Details */}
                <div className="space-y-1.5 py-3 border-y border-[#222226] text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Category:</span>
                    <span className="font-semibold text-slate-200">{source.category || source.type}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Network / Platform:</span>
                    <span className="font-mono text-slate-300">{source.network || source.provider}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Account / Address:</span>
                    <span className="font-mono text-slate-200 truncate max-w-[170px]" title={source.addressOrAccount}>
                      {source.addressOrAccount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Normalized Records:</span>
                    <span className="font-semibold text-purple-300 font-mono">{source.txCount} Ingested</span>
                  </div>
                  {source.reconciliationExceptionCount && source.reconciliationExceptionCount > 0 && (
                    <div className="flex items-center justify-between text-amber-300 pt-1">
                      <span>Exceptions:</span>
                      <span className="font-bold">1 Active (50 bNVDA Break)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Sync Info & Actions */}
              <div className="mt-4 pt-3 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 truncate">
                  Synced: {source.lastSyncAt}
                </span>

                <button
                  onClick={() => handleSync(source.id)}
                  disabled={syncingId === source.id}
                  className="px-2.5 py-1.5 rounded-md bg-[#1a1a22] hover:bg-[#252530] text-slate-200 font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer border border-[#2d2d38]"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === source.id ? 'animate-spin text-purple-400' : ''}`} />
                  <span>{syncingId === source.id ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Assurance Footer */}
      <div className="rounded-xl bg-[#111114] border border-[#222226] p-4 flex items-center gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
        <div>
          <strong className="text-white">Institutional Security Guarantee: </strong>
          Token Ledger never requests or stores private keys, seed phrases, or transaction-signing credentials. All Solana, Coinbase, Kraken, Securitize, and CIMB integrations operate in strictly read-only subledger audit mode.
        </div>
      </div>

      {/* Add Data Source Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-[#141419] rounded-xl shadow-2xl border border-[#2d2d38] w-full max-w-xl overflow-hidden text-white animate-in fade-in-0 zoom-in-95">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#222226] bg-[#1a1a22] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">Connect Institutional Data Source</h3>
                <p className="text-xs text-slate-400">Step {step} of 4 — Read-Only Accounting Integration</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold p-1 rounded cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Data Source Category
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { cat: 'BLOCKCHAIN' as SourceCategory, title: 'Blockchain / DLT Account', desc: 'Solana Treasury Account & Settlement' },
                      { cat: 'EXCHANGE' as SourceCategory, title: 'Institutional Exchange / Custody', desc: 'Coinbase & Kraken API Feeds' },
                      { cat: 'TOKENIZATION_PLATFORM' as SourceCategory, title: 'Tokenization Platform', desc: 'Securitize & Backed Finance Registry' },
                      { cat: 'BANKING' as SourceCategory, title: 'Banking / Tokenized Deposits', desc: 'CIMB Institutional Wholesale Settlement' },
                    ].map((item) => (
                      <div
                        key={item.cat}
                        onClick={() => {
                          setSelectedCategory(item.cat);
                          if (item.cat === 'BLOCKCHAIN') {
                            setSelectedProvider('SOLANA');
                            setSelectedType('WALLET');
                          } else if (item.cat === 'EXCHANGE') {
                            setSelectedProvider('COINBASE');
                            setSelectedType('EXCHANGE');
                          } else if (item.cat === 'TOKENIZATION_PLATFORM') {
                            setSelectedProvider('SECURITIZE');
                            setSelectedType('TOKENIZATION_PLATFORM');
                          } else {
                            setSelectedProvider('CIMB');
                            setSelectedType('BANK');
                          }
                          setStep(2);
                        }}
                        className={`p-3.5 rounded-lg border text-left cursor-pointer transition-all ${
                          selectedCategory === item.cat
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-[#222226] bg-[#16161c] hover:border-[#383845]'
                        }`}
                      >
                        <div className="font-bold text-xs text-white mb-0.5">{item.title}</div>
                        <div className="text-[11px] text-slate-400 leading-tight">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                    Select Adapter Provider
                  </label>
                  <div className="space-y-2">
                    {/* Solana Promoted Option */}
                    <div
                      onClick={() => {
                        setSelectedProvider('SOLANA');
                        setSourceName('Solana Treasury Account #2');
                        setAccountAddress('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU');
                        setStep(3);
                      }}
                      className="p-3.5 rounded-lg border-2 border-purple-500 bg-purple-500/10 hover:bg-purple-500/20 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-white">Solana Treasury Account</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-600 text-white">PRIMARY</span>
                        </div>
                        <span className="text-[11px] text-purple-200">Institutional SPL tokenized fund tracking, staking yield separation & DLT reference matching</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-purple-400 shrink-0" />
                    </div>

                    {/* Other providers */}
                    {[
                      { provider: 'COINBASE' as SourceProvider, name: 'Coinbase Institutional Account API' },
                      { provider: 'KRAKEN' as SourceProvider, name: 'Kraken Institutional API (bNVDA & BUIDL Execution)' },
                      { provider: 'SECURITIZE' as SourceProvider, name: 'Securitize BUIDL Cap-Table Feed' },
                      { provider: 'BACKED' as SourceProvider, name: 'Backed Finance Swiss Tokenization Registry Feed' },
                      { provider: 'CIMB' as SourceProvider, name: 'CIMB Tokenized Deposit Cash Settlement Feed' },
                    ].map((p) => (
                      <div
                        key={p.provider}
                        onClick={() => {
                          setSelectedProvider(p.provider);
                          setSourceName(`${p.provider} Feed`);
                          setStep(3);
                        }}
                        className="p-3 rounded-lg border border-[#222226] bg-[#16161c] hover:border-[#383845] cursor-pointer flex items-center justify-between text-xs"
                      >
                        <span className="font-medium text-slate-200">{p.name}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Source Display Name</label>
                    <input
                      type="text"
                      value={sourceName}
                      onChange={(e) => setSourceName(e.target.value)}
                      placeholder="e.g. Meridian Solana Treasury Account #2"
                      className="w-full px-3 py-2 rounded-lg border border-[#2d2d38] bg-[#1a1a22] text-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">
                      {selectedProvider === 'SOLANA' ? 'Solana Treasury Public Address (Base58)' : 'Account Reference / API Identifier'}
                    </label>
                    <input
                      type="text"
                      value={accountAddress}
                      onChange={(e) => setAccountAddress(e.target.value)}
                      placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                      className="w-full px-3 py-2 rounded-lg border border-[#2d2d38] bg-[#1a1a22] text-white font-mono focus:ring-2 focus:ring-purple-600 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Legal Entity</label>
                      <select
                        value={selectedEntityId}
                        onChange={(e) => setSelectedEntityId(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#2d2d38] bg-[#1a1a22] text-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      >
                        {entities.map((ent) => (
                          <option key={ent.id} value={ent.id}>
                            {ent.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-300 mb-1">Business Purpose</label>
                      <input
                        type="text"
                        value={purpose}
                        onChange={(e) => setPurpose(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-[#2d2d38] bg-[#1a1a22] text-white focus:ring-2 focus:ring-purple-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-[#16161c] rounded-lg border border-[#222226] text-[11px] text-slate-400 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Read-only configuration. Token Ledger never requires private keys or signing rights.</span>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="py-6 text-center space-y-3">
                  {!importStats ? (
                    <div className="space-y-3">
                      <RefreshCw className="w-8 h-8 text-purple-400 animate-spin mx-auto" />
                      <h4 className="font-bold text-sm text-white">Normalizing Multi-Venue Records</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Validating DLT transaction signatures, cross-venue matching rules, and price feeds...
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                      <div>
                        <h4 className="font-bold text-base text-white">Data Source Connected & Synced</h4>
                        <p className="text-xs text-slate-400">
                          {importStats.imported} transactions normalized into subledger format.
                        </p>
                      </div>

                      <div className="grid grid-cols-3 gap-2 bg-[#16161c] p-3 rounded-lg border border-[#222226] text-xs">
                        <div>
                          <div className="font-bold text-white font-mono text-sm">{importStats.imported}</div>
                          <div className="text-[10px] text-slate-400 uppercase">Imported</div>
                        </div>
                        <div>
                          <div className="font-bold text-emerald-400 font-mono text-sm">{importStats.classified}</div>
                          <div className="text-[10px] text-slate-400 uppercase">Auto-Classified</div>
                        </div>
                        <div>
                          <div className="font-bold text-amber-400 font-mono text-sm">{importStats.review}</div>
                          <div className="text-[10px] text-slate-400 uppercase">Review Items</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-[#1a1a22] border-t border-[#222226] flex items-center justify-between">
              {step > 1 && step < 4 ? (
                <button
                  onClick={() => setStep((prev) => (prev - 1) as any)}
                  className="px-3 py-1.5 rounded-lg border border-[#2d2d38] text-xs text-slate-300 font-medium hover:bg-[#252530] cursor-pointer"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              {step === 3 && (
                <button
                  onClick={handleCreateSource}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  Import & Normalize Records
                </button>
              )}

              {step === 4 && importStats && (
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer"
                >
                  View in Subledger
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
