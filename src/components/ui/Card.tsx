import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
  glass?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, dark = false, glass = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-card p-6 transition-all duration-200',
        glass && 'backdrop-blur-glass bg-white/10 border border-white/20 shadow-glass',
        !glass && dark && 'bg-dark-card border border-dark-border',
        !glass && !dark && 'bg-light-card border border-light-border shadow-elevated',
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div className={cn('mb-4', className)}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function CardTitle({ children, className, dark = false }: CardTitleProps) {
  return (
    <h3 className={cn(
      'text-xl font-semibold',
      dark ? 'text-white' : 'text-gray-900',
      className
    )}>
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
