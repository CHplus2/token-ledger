import React from 'react';
import {
  ArrowRight,
  Scale,
  BookOpen,
  FileBarChart,
  Coins,
  History,
  Database,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Sparkles,
  Landmark,
} from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

const FEATURES: { icon: React.ElementType; title: string; description: string }[] = [
  {
    icon: Database,
    title: 'Unified Data Ingestion',
    description:
      'Normalize activity from exchanges, custodians, and on-chain wallets into one consistent transaction feed — no more reconciling spreadsheets by hand.',
  },
  {
    icon: Scale,
    title: 'Five-Way Reconciliation',
    description:
      'Continuously match wallet, custodian, exchange, blockchain, and ledger balances, and surface breaks the moment they appear.',
  },
  {
    icon: BookOpen,
    title: 'Subledger & Journals',
    description:
      'Auto-generate double-entry journal entries from digital asset activity, mapped to your chart of accounts under configurable accounting rules.',
  },
  {
    icon: Coins,
    title: 'Multi-Chain Custody Portfolio',
    description:
      'Track tokenized real-world assets across chains, wallets, and custodians — one asset held in three wallets on three chains rolls up into a single consolidated position.',
  },
  {
    icon: FileBarChart,
    title: 'Financial Reporting',
    description:
      'Generate a live Trial Balance, Balance Sheet, and Profit & Loss straight from the chart of accounts — always in balance, always traceable to source entries.',
  },
  {
    icon: History,
    title: 'Audit Trail & Close Management',
    description:
      'Immutable audit logging and a structured month-end close checklist give auditors and controllers a defensible record of every adjustment.',
  },
  {
    icon: Landmark,
    title: 'Treasury-Ready Financial Operations',
    description:
      'Purpose-built for the way corporate treasuries actually operate — cost-basis tracking, entity-level books, and a ledger structure designed to sit alongside your ERP, not replace your controls.',
  },
];

const STEPS: { step: string; title: string; description: string }[] = [
  {
    step: '01',
    title: 'Connect your sources',
    description: 'Bring in wallets, custodians, and exchange accounts as normalized data sources.',
  },
  {
    step: '02',
    title: 'Reconcile automatically',
    description: 'The five-way engine matches balances across every source and flags exceptions instantly.',
  },
  {
    step: '03',
    title: 'Post to the subledger',
    description: 'Reconciled activity flows into journal entries under your accounting rules and chart of accounts.',
  },
  {
    step: '04',
    title: 'Report with confidence',
    description: 'Close the period and produce audit-ready Balance Sheet, P&L, and Trial Balance reports on demand.',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen w-full overflow-y-auto bg-[#ffffff] text-slate-900">
      {/* Brand masthead accent */}
      <div className="h-1 w-full bg-[#C9A227]" />

      {/* Top nav */}
      <header className="sticky top-1 z-20 border-b border-[#e2e8f0] bg-[#ffffff]/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              TL
            </div>
            <span className="text-sm font-bold text-slate-900 tracking-tight">Token Ledger</span>
          </div>
          <button
            onClick={onLaunch}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
          >
            Launch Demo
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 text-[#6e5915] text-[11px] font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3 h-3 text-[#C9A227]" />
          Digital Asset Accounting Infrastructure
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight leading-tight max-w-3xl mx-auto">
          Your{' '}
          <span className="underline decoration-[#C9A227] decoration-4 underline-offset-4">CFO</span> for the
          tokenized finance world.
        </h1>
        <p className="mt-4 text-lg font-medium text-slate-700 max-w-2xl mx-auto leading-relaxed">
          Institutional-grade financial data &amp; accounting for digital assets.
        </p>
        <p className="mt-4 text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Token Ledger reconciles fragmented blockchain, wallet, exchange, and custodian activity into a single,
          audit-ready set of financial records — built for institutional finance teams holding tokenized real-world
          assets and digital assets side by side.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={onLaunch}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            Launch Interactive Demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <p className="mt-4 text-[11px] text-slate-600">
          Fully interactive demo running on seeded sample data for Meridian Capital Group — no signup required.
        </p>
      </section>

      {/* Trust bar */}
      <section className="max-w-6xl mx-auto px-6 pb-16">
        <div className="rounded-xl border border-[#e2e8f0] bg-[#ffffff] p-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs text-slate-600">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Double-entry accounting, always in balance
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" /> Full audit trail on every posting
          </span>
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-indigo-600" /> Multi-chain, multi-custodian consolidation
          </span>
          <span className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-[#C9A227]" /> Five-way reconciliation across every source
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Everything a controller needs to close the books</h2>
          <p className="mt-2 text-sm text-slate-600 max-w-xl mx-auto">
            From raw wallet activity to a reconciled financial statement, in one platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, idx) => (
            <div
              key={f.title}
              className={`bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-5 shadow-xs hover:border-purple-500/30 transition-colors ${
                idx === FEATURES.length - 1 ? 'sm:col-span-2 lg:col-span-3' : ''
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-600/20 to-indigo-600/20 border border-purple-500/20 flex items-center justify-center mb-3">
                <f.icon className="w-4.5 h-4.5 text-purple-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{f.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900">How it works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div key={s.step} className="relative bg-[#ffffff] rounded-xl border border-[#e2e8f0] p-5">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#C9A227] to-indigo-600 mb-2">
                {s.step}
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1.5">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-2xl border border-[#C9A227]/30 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 p-10 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-[#C9A227]" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">See it running on real seeded data</h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto mb-6">
            The demo ships with a full month of sample activity for Meridian Capital Group — transactions,
            reconciliation breaks, journal entries, and a multi-chain custody portfolio — so every screen shows real
            numbers, not placeholders.
          </p>
          <button
            onClick={onLaunch}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-xs transition-all cursor-pointer"
          >
            Launch Interactive Demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#e2e8f0]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-600">
          <span>© 2026 Token Ledger. Demo environment — all data shown is seeded/mock data for illustration only.</span>
          <span>Institutional Digital Asset Accounting Infrastructure</span>
        </div>
      </footer>
    </div>
  );
};
