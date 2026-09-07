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

export const Header: React.FC = () => {
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
    <header className="h-16 bg-[#111114] border-b border-[#222226] px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Organization & Entity Switcher */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
            TL
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Institutional Subledger
            </div>
            <div className="text-sm font-bold text-white leading-tight">
              {organization.name}
            </div>
          </div>
        </div>

        <div className="h-6 w-px bg-[#222226]" />

        {/* Legal Entity Selector */}
        <div className="relative group">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#222226] bg-[#16161c] hover:bg-[#1c1c21] text-xs font-medium text-slate-200 cursor-pointer transition-colors">
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span className="max-w-[200px] truncate">{selectedEntity.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>
          <select
            id="entity-selector"
            aria-label="Select Legal Entity"
            value={selectedEntityId}
            onChange={(e) => setSelectedEntityId(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full bg-[#16161c] text-slate-200"
          >
            {entities.map((ent) => (
              <option key={ent.id} value={ent.id} className="bg-[#16161c] text-slate-200">
                {ent.code} — {ent.name} ({ent.jurisdiction})
              </option>
            ))}
          </select>
        </div>

        {/* Data Health & Controls Indicator */}
        <div className="hidden xl:flex items-center gap-2 pl-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-medium">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Data Health: 96%</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#16161c] text-slate-300 border border-[#222226] text-xs font-medium">
            <Shield className="w-3.5 h-3.5 text-purple-400" />
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
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#222226] bg-[#16161c] hover:bg-[#1c1c21] text-xs text-slate-400 transition-colors shadow-2xs"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Search records, assets, hashes...</span>
          <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-[#1c1c21] border border-[#2d2d35] rounded text-slate-400">
            ⌘K
          </kbd>
        </button>

        {/* Demo Data Reset */}
        <button
          id="btn-reset-demo"
          onClick={resetToDemoData}
          title="Reset back to initial August 2026 close demo state"
          className="p-1.5 text-slate-400 hover:text-white hover:bg-[#1c1c21] rounded-lg transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Role Switcher (Crucial for Controller vs Accountant vs Auditor vs CFO) */}
        <div className="relative group">
          <button
            id="btn-role-switcher"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#222226] bg-[#16161c] hover:bg-[#1c1c21] text-xs text-slate-200 shadow-2xs font-medium"
          >
            <UserCheck className="w-3.5 h-3.5 text-purple-400" />
            <div className="text-left">
              <span className="block leading-tight font-semibold text-white">{currentUser.name.split(',')[0]}</span>
              <span className="block text-[10px] text-slate-400 uppercase">{currentUser.role}</span>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
          <select
            id="user-role-select"
            aria-label="Switch User Persona / Role"
            value={currentUser.role}
            onChange={(e) => switchUserRole(e.target.value as UserRole)}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full bg-[#16161c] text-slate-200"
          >
            {users.map((u) => (
              <option key={u.id} value={u.role} className="bg-[#16161c] text-slate-200">
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
          <Sparkles className="w-3.5 h-3.5 text-purple-200" />
          <span>Ledger AI</span>
        </button>
      </div>
    </header>
  );
};
