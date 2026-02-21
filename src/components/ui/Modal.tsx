import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  dark?: boolean;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'md', dark = false }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div
        className={cn(
          'relative w-full rounded-card shadow-2xl animate-in fade-in zoom-in duration-200',
          dark ? 'bg-dark-card text-white' : 'bg-white text-gray-900',
          {
            'max-w-sm': maxWidth === 'sm',
            'max-w-md': maxWidth === 'md',
            'max-w-lg': maxWidth === 'lg',
            'max-w-xl': maxWidth === 'xl',
            'max-w-2xl': maxWidth === '2xl',
          }
        )}
      >
        {/* Header */}
        <div className={cn(
          'flex items-center justify-between p-6 border-b',
          dark ? 'border-dark-border' : 'border-gray-200'
        )}>
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className={cn(
              'p-1 rounded-lg transition-colors',
              dark ? 'hover:bg-white/10' : 'hover:bg-gray-100'
            )}
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
