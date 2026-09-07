import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id?: string;
  title: string;
  value: string;
  secondary?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  icon: LucideIcon;
  badgeText?: string;
  badgeVariant?: 'default' | 'amber' | 'emerald' | 'rose' | 'blue';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  value,
  secondary,
  trend,
  icon: Icon,
  badgeText,
  badgeVariant = 'default',
  onClick,
}) => {
  const getBadgeClasses = () => {
    switch (badgeVariant) {
      case 'emerald':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'amber':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      case 'rose':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
      case 'blue':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      default:
        return 'bg-[#16161c] text-slate-300 border-[#222226]';
    }
  };

  return (
    <div
      id={id}
      onClick={onClick}
      className={`bg-[#111114] rounded-xl border border-[#222226] p-5 shadow-xs transition-all ${
        onClick ? 'cursor-pointer hover:border-[#2d2d35] hover:bg-[#141418]' : 'hover:border-[#2d2d35]'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="w-8 h-8 rounded-lg bg-[#16161c] border border-[#222226] flex items-center justify-center text-slate-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-bold text-white tracking-tight">{value}</span>
        {trend && (
          <span
            className={`text-xs font-semibold ${
              trend.isPositive ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
        <span>{secondary}</span>
        {badgeText && (
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getBadgeClasses()}`}
          >
            {badgeText}
          </span>
        )}
      </div>
    </div>
  );
};
