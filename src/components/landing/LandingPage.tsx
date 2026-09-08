import React from 'react';
import {
  ArrowRight,
  ChevronDown,
  Scale,
  BookOpen,
  FileBarChart,
  Coins,
  History,
  Database,
  ShieldCheck,
  Globe2,
  CheckCircle2,
  Landmark,
} from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

// Pitch-deck brand palette
const NAVY = '#132043';
const CARD_NAVY = '#1D2E56';
const GOLD = '#C9A227';
const LIGHT_BG = '#E7EDF4';
const DARK_TEXT = '#16233A';
const MUTED_TEXT = '#6B7A90';

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

const NAV_DROPDOWN: { label: string; href: string }[] = [
  { label: 'Reconciliation', href: '#trust' },
  { label: 'Subledger & Journals', href: '#features' },
  { label: 'Multi-Chain Custody', href: '#features' },
  { label: 'Financial Reporting', href: '#features' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen w-full overflow-y-auto" style={{ backgroundColor: LIGHT_BG, color: DARK_TEXT }}>
      {/* Announcement bar */}
      <div className="text-center text-xs font-semibold py-2 px-4" style={{ backgroundColor: GOLD, color: NAVY }}>
        Live demo: multi-chain custody, five-way reconciliation & audit-ready reports — all in one place.{' '}
        <button onClick={onLaunch} className="underline underline-offset-2 cursor-pointer">
          See it now →
        </button>
      </div>

      {/* Top nav */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-xs"
              style={{ backgroundColor: NAVY, color: GOLD }}
            >
              TL
            </div>
            <span className="text-xl font-bold tracking-tight" style={{ color: DARK_TEXT }}>
              Token Ledger
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium" style={{ color: DARK_TEXT }}>
            <div className="relative group py-2">
              <button className="flex items-center gap-1 cursor-pointer">
                Solutions <ChevronDown className="w-3.5 h-3.5" style={{ color: MUTED_TEXT }} />
              </button>
              <div className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-black/5 bg-white shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {NAV_DROPDOWN.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-xs font-semibold hover:bg-[#f1f5f9]"
                    style={{ color: DARK_TEXT }}
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            </div>
            <a href="#how-it-works" className="hover:opacity-70 transition-opacity">
              How it works
            </a>
            <a href="#trust" className="hover:opacity-70 transition-opacity">
              Security &amp; Controls
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-sm font-medium" style={{ color: MUTED_TEXT }} title="Demo only — no accounts needed">
              Sign in
            </span>
            <button
              onClick={onLaunch}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              Request a demo
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section
        className="relative overflow-hidden text-center px-6 pt-24 pb-28"
        style={{
          backgroundColor: NAVY,
          backgroundImage: `radial-gradient(${GOLD}33 1px, transparent 1px)`,
          backgroundSize: '26px 26px',
        }}
      >
        <div className="max-w-4xl mx-auto relative z-10">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold uppercase tracking-wider mb-7"
            style={{ borderColor: `${GOLD}66`, backgroundColor: `${GOLD}1a`, color: GOLD }}
          >
            Digital Asset Accounting Infrastructure
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-[1.1] text-white">
            Your <span style={{ color: GOLD }}>CFO</span> for the tokenized finance world
          </h1>
          <p className="mt-6 text-lg sm:text-xl font-medium max-w-2xl mx-auto leading-relaxed" style={{ color: '#c3cbe0' }}>
            Institutional-grade financial data &amp; accounting for digital assets.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={onLaunch}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold shadow-lg transition-opacity hover:opacity-90 cursor-pointer"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              Launch Interactive Demo
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="#how-it-works"
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold border transition-colors hover:bg-white/5"
              style={{ borderColor: '#3a4970', color: 'white' }}
            >
              See how it works
            </a>
          </div>
          <p className="mt-5 text-[11px]" style={{ color: '#6f7ea3' }}>
            Fully interactive demo running on seeded sample data for Meridian Capital Group — no signup required.
          </p>
        </div>
      </section>

      {/* Trust bar */}
      <section id="trust" className="max-w-6xl mx-auto px-6 -mt-10 relative z-10 pb-16">
        <div className="rounded-xl border border-black/5 bg-white shadow-lg p-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-xs" style={{ color: MUTED_TEXT }}>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" style={{ color: GOLD }} /> Double-entry accounting, always in balance
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" style={{ color: GOLD }} /> Full audit trail on every posting
          </span>
          <span className="flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5" style={{ color: GOLD }} /> Multi-chain, multi-custodian consolidation
          </span>
          <span className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" style={{ color: GOLD }} /> Five-way reconciliation across every source
          </span>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: DARK_TEXT }}>
            Everything a controller needs to close the books
          </h2>
          <p className="mt-2 text-sm max-w-xl mx-auto" style={{ color: MUTED_TEXT }}>
            From raw wallet activity to a reconciled financial statement, in one platform.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, idx) => (
            <div
              key={f.title}
              className={`bg-white rounded-xl border border-black/5 p-5 shadow-xs hover:shadow-md transition-shadow ${
                idx === FEATURES.length - 1 ? 'sm:col-span-2 lg:col-span-3' : ''
              }`}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: `${NAVY}14` }}
              >
                <f.icon className="w-4.5 h-4.5" style={{ color: NAVY }} />
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: DARK_TEXT }}>
                {f.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: MUTED_TEXT }}>
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: DARK_TEXT }}>
            How it works
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s) => (
            <div key={s.step} className="relative bg-white rounded-xl border border-black/5 p-5">
              <div
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-br mb-2"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${GOLD}, ${NAVY})` }}
              >
                {s.step}
              </div>
              <h3 className="text-sm font-bold mb-1.5" style={{ color: DARK_TEXT }}>
                {s.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: MUTED_TEXT }}>
                {s.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div
          className="rounded-2xl p-10 text-center relative overflow-hidden"
          style={{
            backgroundColor: CARD_NAVY,
            backgroundImage: `radial-gradient(${GOLD}22 1px, transparent 1px)`,
            backgroundSize: '22px 22px',
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: GOLD }} />
          <h2 className="text-2xl font-bold text-white mb-2">See it running on real seeded data</h2>
          <p className="text-sm max-w-xl mx-auto mb-6" style={{ color: '#a9b4d1' }}>
            The demo ships with a full month of sample activity for Meridian Capital Group — transactions,
            reconciliation breaks, journal entries, and a multi-chain custody portfolio — so every screen shows real
            numbers, not placeholders.
          </p>
          <button
            onClick={onLaunch}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold shadow-lg transition-opacity hover:opacity-90 cursor-pointer"
            style={{ backgroundColor: GOLD, color: NAVY }}
          >
            Launch Interactive Demo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5">
        <div
          className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]"
          style={{ color: MUTED_TEXT }}
        >
          <span>© 2026 Token Ledger. Demo environment — all data shown is seeded/mock data for illustration only.</span>
          <span>Institutional Digital Asset Accounting Infrastructure</span>
        </div>
      </footer>
    </div>
  );
};
