import React from 'react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  dark?: boolean;
  className?: string;
}

export function KPICard({ title, value, subtitle, icon, trend, dark = false, className }: KPICardProps) {
  return (
    <div
      className={cn(
        'rounded-card p-6 transition-all duration-200 hover:scale-[1.02]',
        dark
          ? 'bg-dark-card border border-dark-border'
          : 'bg-light-card border border-light-border shadow-elevated',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            'text-sm font-medium',
            dark ? 'text-gray-400' : 'text-gray-600'
          )}>
            {title}
          </p>
          <p className={cn(
            'mt-2 text-3xl font-bold',
            dark ? 'text-white' : 'text-gray-900'
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              'mt-1 text-sm',
              dark ? 'text-gray-400' : 'text-gray-600'
            )}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn(
              'mt-2 inline-flex items-center text-sm font-medium',
              trend.isPositive ? 'text-brand-emerald' : 'text-brand-red'
            )}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span className="ml-1">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn(
            'p-3 rounded-lg',
            dark ? 'bg-brand-blue/20' : 'bg-brand-blue/10'
          )}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
