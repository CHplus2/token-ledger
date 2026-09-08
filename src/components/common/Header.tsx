import React from 'react';
import {
  Building2,
  ChevronDown,
  Sparkles,
  Search,
  RotateCcw,
  Shield,
  Activity,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  UserCheck,
} from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';
import { UserRole } from '../../types';
import { Logo } from './Logo';

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const {
    organization,
    entities,
    selectedEntityId,
    setSelectedEntityId,
    currentUser,
    users,
    switchUserRole,
    resetToDemoData,
    setIsAIPanelOpen,
    setIsCommandPaletteOpen,
    exceptionsCount,
    reconciliationRatePercent,
  } = useLedger();

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) || entities[0];

  return (
    <header className="h-16 bg-[#ffffff] border-b border-[#e2e8f0] border-t-[3px] border-t-[#C9A227] px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Organization & Entity Switcher */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onLogoClick}
          title="Back to Token Ledger overview"
          className="flex items-center gap-2.5 cursor-pointer text-left"
        >
          <Logo size={32} className="shadow-xs" />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-600">
              Institutional Subledger
            </div>
            <div className="text-sm font-bold text-slate-900 leading-tight">
              {organization.name}
            </div>
          </div>
        </button>

        <div className="h-6 w-px bg-[#e2e8f0]" />

        {/* Legal Entity Selector */}
        <div className="relative group">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#f1f5f9] text-xs font-medium text-slate-800 cursor-pointer transition-colors">
            <Building2 className="w-3.5 h-3.5 text-purple-600" />
            <span className="max-w-[200px] truncate">{selectedEntity.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <select
            id="entity-selector"
            aria-label="Select Legal Entity"
            value={selectedEntityId}
            onChange={(e) => setSelectedEntityId(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full bg-[#f8fafc] text-slate-800"
          >
            {entities.map((ent) => (
              <option key={ent.id} value={ent.id} className="bg-[#f8fafc] text-slate-800">
                {ent.code} — {ent.name} ({ent.jurisdiction})
              </option>
            ))}
          </select>
        </div>

        {/* Data Health & Controls Indicator */}
        <div className="hidden xl:flex items-center gap-2 pl-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-600" />
            <span>Data Health: 96%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f8fafc] text-slate-700 border border-[#e2e8f0] text-xs font-medium">
            <Shield className="w-3.5 h-3.5 text-purple-600" />
            <span>{organization.framework} Ready ({organization.costBasisMethod})</span>
          </div>
        </div>
      </div>

      {/* Right: Search, Demo, Role Switcher & Ledger AI */}
      <div className="flex items-center gap-3">
        {/* Quick Search Trigger */}
        <button
          id="btn-quick-search"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#f1f5f9] text-xs text-slate-600 transition-colors shadow-2xs"
        >
          <Search className="w-3.5 h-3.5 text-slate-600" />
          <span className="hidden sm:inline">Search records, assets, hashes...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#f1f5f9] border border-[#cbd5e1] rounded text-slate-600">
            ⌘K
          </kbd>
        </button>

        {/* Demo Data Reset */}
        <button
          id="btn-reset-demo"
          onClick={resetToDemoData}
          title="Reset back to initial August 2026 close demo state"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-[#f1f5f9] rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Role Switcher (Crucial for Controller vs Accountant vs Auditor vs CFO) */}
        <div className="relative group">
          <button
            id="btn-role-switcher"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e2e8f0] bg-[#f8fafc] hover:bg-[#f1f5f9] text-xs text-slate-800 shadow-2xs font-medium"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-600" />
            <div className="text-left">
              <span className="block leading-tight font-semibold text-slate-900">{currentUser.name.split(',')[0]}</span>
              <span className="block text-[10px] text-slate-600 uppercase">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-600" />
          </button>
          <select
            id="user-role-select"
            aria-label="Switch User Persona / Role"
            value={currentUser.role}
            onChange={(e) => switchUserRole(e.target.value as UserRole)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full bg-[#f8fafc] text-slate-800"
          >
            {users.map((u) => (
              <option key={u.id} value={u.role} className="bg-[#f8fafc] text-slate-800">
                {u.name} ({u.role}) — {u.title}
              </option>
            ))}
          </select>
        </div>

        {/* Ledger AI Trigger */}
        <button
          id="btn-open-ledger-ai"
          onClick={() => setIsAIPanelOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-700" />
          <span>Ledger AI</span>
        </button>
      </div>
    </header>
  );
};
