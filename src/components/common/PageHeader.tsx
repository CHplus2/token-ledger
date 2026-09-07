import React from 'react';
import { Calendar, Shield, Info } from 'lucide-react';
import { useLedger } from '../../context/LedgerContext';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  badge?: string;
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, badge, actions }) => {
  const { organization } = useLedger();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#222226] mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#16161c] border border-[#222226] text-xs text-slate-300 shadow-2xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-purple-400" />
          <span>Period: <strong className="text-white">{organization.activePeriod}</strong></span>
        </div>
        {actions}
      </div>
    </div>
  );
};
