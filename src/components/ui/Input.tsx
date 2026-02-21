import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  dark?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, dark = false, className, ...props }, ref) => {
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
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2 rounded-lg border transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-brand-blue/50',
            dark
              ? 'bg-dark-card border-dark-border text-white placeholder-gray-400'
              : 'bg-white border-light-border text-gray-900 placeholder-gray-400',
            error && 'border-brand-red focus:ring-brand-red/50',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-brand-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
