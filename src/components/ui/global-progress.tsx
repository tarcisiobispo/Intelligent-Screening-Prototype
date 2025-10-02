import React, { useState, useEffect } from 'react';
import { Progress } from './progress';

interface GlobalProgressProps {
  isVisible: boolean;
  progress?: number;
  message?: string;
}

let progressInstance: {
  show: (message?: string) => void;
  hide: () => void;
  setProgress: (value: number) => void;
} | null = null;

export function GlobalProgress({ isVisible, progress = 0, message }: GlobalProgressProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-[var(--surface)] border-b border-[var(--border)] shadow-sm">
      <div className="px-4 py-2">
        <div className="flex items-center gap-3">
          <Progress value={progress} className="flex-1 h-2" />
          <span className="text-xs text-[var(--muted)] min-w-[60px]">{progress}%</span>
        </div>
        {message && (
          <p className="text-xs text-[var(--muted)] mt-1">{message}</p>
        )}
      </div>
    </div>
  );
}

// Global progress manager
export const globalProgress = {
  show: (message?: string) => {
    window.dispatchEvent(new CustomEvent('globalProgress', { 
      detail: { isVisible: true, progress: 0, message } 
    }));
  },
  
  hide: () => {
    window.dispatchEvent(new CustomEvent('globalProgress', { 
      detail: { isVisible: false } 
    }));
  },
  
  setProgress: (value: number, message?: string) => {
    window.dispatchEvent(new CustomEvent('globalProgress', { 
      detail: { isVisible: true, progress: value, message } 
    }));
  }
};