import React from 'react';
import { Button } from './button';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger'
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
        <div className="bg-[var(--surface)] rounded-lg shadow-lg border border-[var(--border)] p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className={`w-6 h-6 ${variant === 'danger' ? 'text-[var(--danger)]' : 'text-[var(--warning)]'}`} />
            <h3 className="text-lg font-semibold text-[var(--text)]">{title}</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="ml-auto h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Message */}
          <p className="text-[var(--muted)] mb-6">{message}</p>
          
          {/* Actions */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
            <Button 
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={variant === 'danger' ? 'bg-[var(--danger)] hover:bg-[var(--danger)]/90' : 'bg-[var(--warning)] hover:bg-[var(--warning)]/90'}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}