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
    <aside className="w-64 bg-[#0e0e12] text-slate-300 flex flex-col shrink-0 select-none border-r border-[#222226]">
      {/* Brand Top Header */}
      <div className="h-16 flex items-center gap-3 px-6 border-b border-[#222226] bg-[#0a0a0c]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white tracking-wider shadow-sm">
          TL
        </div>
        <div>
          <div className="font-bold text-white text-sm tracking-wide">TOKEN LEDGER</div>
          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">
            Subledger Core V1.2
          </div>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {navSections.map((section, sIdx) => (
          <div key={sIdx}>
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
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
                        ? 'bg-[#1c1c21] text-white font-semibold border border-[#2d2d35] shadow-xs'
                        : 'text-slate-400 hover:bg-[#16161c] hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-white'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${
                          item.badgeVariant === 'amber'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : item.badgeVariant === 'emerald'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                            : 'bg-[#1c1c21] text-slate-300 border border-[#2d2d35]'
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
      <div className="p-4 border-t border-[#222226] bg-[#0a0a0c]">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="font-semibold text-slate-300">August 2026 Close</span>
          <span className="text-emerald-400 font-bold">{closeReadinessScore}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1c1c21] rounded-full overflow-hidden mb-2.5">
          <div
            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${closeReadinessScore}%` }}
          />
        </div>
        <button
          onClick={() => setActiveModule('close')}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#1c1c21] hover:bg-[#25252b] text-slate-200 border border-[#2d2d35] text-xs font-medium transition-colors"
        >
          <span>Continue Close</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>
    </aside>
  );
};
