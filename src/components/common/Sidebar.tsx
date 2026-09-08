import React from 'react';
import {
  LayoutDashboard,
  ArrowLeftRight,
  Scale,
  BookOpen,
  FileBarChart,
  Sliders,
  ListTree,
  Coins,
  CalendarCheck,
  History,
  Database,
  Settings,
  Sparkles,
  Layers,
  ChevronRight,
  Globe2,
  FileText,
} from 'lucide-react';
import { useLedger, NavigationModule } from '../../context/LedgerContext';

interface NavItem {
  id: NavigationModule;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeVariant?: 'amber' | 'blue' | 'emerald';
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const {
    activeModule,
    setActiveModule,
    unclassifiedCount,
    openBreaksCount,
    pendingJournalsCount,
    closeReadinessScore,
  } = useLedger();

  const navSections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: 'DIGITAL ASSET ACCOUNTING',
      items: [
        {
          id: 'transactions',
          label: 'Transactions',
          icon: ArrowLeftRight,
          badge: unclassifiedCount > 0 ? unclassifiedCount : undefined,
          badgeVariant: 'amber',
        },
        {
          id: 'reconciliation',
          label: 'Reconciliation',
          icon: Scale,
          badge: openBreaksCount > 0 ? `${openBreaksCount} Breaks` : undefined,
          badgeVariant: 'amber',
        },
        {
          id: 'subledger',
          label: 'Subledger & Journals',
          icon: BookOpen,
          badge: pendingJournalsCount > 0 ? `${pendingJournalsCount} Review` : undefined,
          badgeVariant: 'blue',
        },
        {
          id: 'reports',
          label: 'Reports & Packages',
          icon: FileBarChart,
        },
      ],
    },
    {
      title: 'ACCOUNTING SETUP',
      items: [
        {
          id: 'accounting',
          label: 'Accounting Rules',
          icon: Sliders,
        },
        {
          id: 'accounting',
          label: 'Chart of Accounts',
          icon: ListTree,
        },
        {
          id: 'assets',
          label: 'Assets Register',
          icon: Coins,
        },
      ],
    },
    {
      title: 'MULTI-CHAIN CUSTODY',
      items: [
        {
          id: 'custody',
          label: 'Custody Portfolio',
          icon: Globe2,
        },
      ],
    },
    {
      title: 'CONTROLS & CLOSE',
      items: [
        {
          id: 'close',
          label: 'Month-End Close',
          icon: CalendarCheck,
          badge: `${closeReadinessScore}%`,
          badgeVariant: closeReadinessScore > 90 ? 'emerald' : 'blue',
        },
        {
          id: 'audit',
          label: 'Audit Trail & Lineage',
          icon: History,
        },
      ],
    },
    {
      title: 'ADMINISTRATION',
      items: [
        {
          id: 'sources',
          label: 'Data Sources',
          icon: Database,
          badge: 'Solana #1',
          badgeVariant: 'emerald',
        },
        {
          id: 'settings',
          label: 'Policies & Entities',
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#ffffff] text-slate-700 flex flex-col shrink-0 select-none border-r border-[#e2e8f0]">
      {/* Brand Top Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-[#e2e8f0] bg-[#ffffff]">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shadow-sm ring-2"
          style={{ backgroundColor: '#132043', color: '#C9A227', ['--tw-ring-color' as any]: '#C9A22766' }}
        >
          <FileText className="w-4 h-4" strokeWidth={2} />
        </div>
        <div>
          <div className="font-bold text-slate-900 text-sm tracking-wide">TOKEN LEDGER</div>
          <div className="text-[10px] text-slate-600 uppercase tracking-wider font-mono">
            Subledger Core V1.2
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              {section.title}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item, iIdx) => {
                const isActive = activeModule === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={iIdx}
                    id={`nav-${item.id}`}
                    onClick={() => setActiveModule(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-[#f1f5f9] text-slate-900 font-semibold border border-[#cbd5e1] shadow-xs'
                        : 'text-slate-600 hover:bg-[#f8fafc] hover:text-slate-900 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-purple-600' : 'text-slate-600 group-hover:text-slate-900'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          item.badgeVariant === 'amber'
                            ? 'bg-amber-500/20 text-amber-700 border border-amber-500/30'
                            : item.badgeVariant === 'emerald'
                            ? 'bg-purple-500/20 text-purple-700 border border-purple-500/40'
                            : 'bg-[#f1f5f9] text-slate-700 border border-[#cbd5e1]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Close Readiness Footer Card */}
      <div className="p-4 border-t border-[#e2e8f0] bg-[#ffffff]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-700">August 2026 Close</span>
          <span className="text-emerald-600 font-bold">{closeReadinessScore}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${closeReadinessScore}%` }}
          />
        </div>
        <button
          onClick={() => setActiveModule('close')}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#f1f5f9] hover:bg-[#e2e8f0] text-slate-800 border border-[#cbd5e1] text-xs font-medium transition-colors"
        >
          <span>Continue Close</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
        </button>
      </div>
    </aside>
  );
};
