import { cn } from '@/lib/utils';

interface StatusPillProps {
  status: string;
  variant?: 'vehicle' | 'trip' | 'driver';
  className?: string;
}

export function StatusPill({ status, variant = 'vehicle', className }: StatusPillProps) {
  const getColorClasses = () => {
    const normalized = status.toLowerCase().replace(/\s+/g, '_');
    
    switch (variant) {
      case 'vehicle':
        switch (normalized) {
          case 'available':
            return 'bg-brand-emerald/20 text-brand-emerald border-brand-emerald/30';
          case 'on_trip':
            return 'bg-brand-blue/20 text-brand-blue border-brand-blue/30';
          case 'in_shop':
            return 'bg-brand-amber/20 text-brand-amber border-brand-amber/30';
          case 'retired':
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
          default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
      
      case 'trip':
        switch (normalized) {
          case 'draft':
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
          case 'dispatched':
            return 'bg-brand-blue/20 text-brand-blue border-brand-blue/30';
          case 'on_route':
            return 'bg-brand-amber/20 text-brand-amber border-brand-amber/30';
          case 'completed':
            return 'bg-brand-emerald/20 text-brand-emerald border-brand-emerald/30';
          case 'cancelled':
            return 'bg-brand-red/20 text-brand-red border-brand-red/30';
          default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
      
      case 'driver':
        switch (normalized) {
          case 'on_duty':
            return 'bg-brand-emerald/20 text-brand-emerald border-brand-emerald/30';
          case 'on_trip':
            return 'bg-brand-blue/20 text-brand-blue border-brand-blue/30';
          case 'off_duty':
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
          case 'suspended':
            return 'bg-brand-red/20 text-brand-red border-brand-red/30';
          default:
            return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
      
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        getColorClasses(),
        className
      )}
    >
      {status}
    </span>
  );
}
