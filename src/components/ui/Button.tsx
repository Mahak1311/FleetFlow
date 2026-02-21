import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'success';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        'hover:scale-105 active:scale-95',
        {
          'bg-brand-blue hover:bg-blue-600 text-white': variant === 'primary',
          'bg-gray-200 hover:bg-gray-300 text-gray-900': variant === 'secondary',
          'bg-brand-red hover:bg-red-600 text-white': variant === 'danger',
          'bg-brand-emerald hover:bg-emerald-600 text-white': variant === 'success',
          'bg-transparent hover:bg-gray-100 text-gray-700': variant === 'ghost',
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-4 py-2 text-base': size === 'md',
          'px-6 py-3 text-lg': size === 'lg',
        },
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
