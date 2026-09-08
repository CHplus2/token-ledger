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
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e2e8f0] mb-6">
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-700 border border-purple-500/30">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f8fafc] border border-[#e2e8f0] text-xs text-slate-700 shadow-2xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-purple-600" />
          <span>Period: <strong className="text-slate-900">{organization.activePeriod}</strong></span>
        </div>
        {actions}
      </div>
    </div>
  );
};
