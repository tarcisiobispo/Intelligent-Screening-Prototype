import React from 'react';
import { Loader2, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'loading' | 'success' | 'error' | 'pending' | 'idle';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusIndicator({ 
  status, 
  message, 
  size = 'md', 
  showIcon = true 
}: StatusIndicatorProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4', 
    lg: 'w-5 h-5'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'loading':
        return {
          icon: <Loader2 className={`${iconSizes[size]} animate-spin`} />,
          color: 'text-[var(--primary)]',
          bgColor: 'bg-[var(--primary)]/10'
        };
      case 'success':
        return {
          icon: <CheckCircle className={iconSizes[size]} />,
          color: 'text-[var(--success)]',
          bgColor: 'bg-[var(--success)]/10'
        };
      case 'error':
        return {
          icon: <AlertCircle className={iconSizes[size]} />,
          color: 'text-[var(--danger)]',
          bgColor: 'bg-[var(--danger)]/10'
        };
      case 'pending':
        return {
          icon: <Clock className={iconSizes[size]} />,
          color: 'text-[var(--warning)]',
          bgColor: 'bg-[var(--warning)]/10'
        };
      default:
        return {
          icon: null,
          color: 'text-[var(--muted)]',
          bgColor: 'bg-[var(--muted)]/10'
        };
    }
  };

  const config = getStatusConfig();

  if (status === 'idle' && !message) return null;

  return (
    <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-md ${config.bgColor}`}>
      {showIcon && config.icon && (
        <span className={config.color}>
          {config.icon}
        </span>
      )}
      {message && (
        <span className={`${sizeClasses[size]} ${config.color} font-medium`}>
          {message}
        </span>
      )}
    </div>
  );
}