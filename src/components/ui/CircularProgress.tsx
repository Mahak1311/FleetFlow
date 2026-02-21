import React from 'react';
import { cn } from '@/lib/utils';

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  dark?: boolean;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 8,
  label,
  dark = false,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  const getColor = () => {
    if (value >= 80) return '#10b981'; // emerald
    if (value >= 60) return '#3b82f6'; // blue
    if (value >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={dark ? '#1e2537' : '#e5e7eb'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getColor()}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn(
          'text-2xl font-bold',
          dark ? 'text-white' : 'text-gray-900'
        )}>
          {value}%
        </span>
        {label && (
          <span className={cn(
            'text-xs',
            dark ? 'text-gray-400' : 'text-gray-600'
          )}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
