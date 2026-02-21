import React from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  dark?: boolean;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, dark = false, options, className, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className={cn(
            'block text-sm font-medium',
            dark ? 'text-gray-300' : 'text-gray-700'
          )}>
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2 rounded-lg border transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-brand-blue/50',
            dark
              ? 'bg-dark-card border-dark-border text-white'
              : 'bg-white border-light-border text-gray-900',
            error && 'border-brand-red focus:ring-brand-red/50',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-sm text-brand-red">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
