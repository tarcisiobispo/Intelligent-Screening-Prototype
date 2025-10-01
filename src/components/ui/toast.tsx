import * as React from "react";
import { CheckCircle, AlertTriangle, X, Loader2 } from "lucide-react";
import { cn } from "./utils";

export interface ToastProps {
  id: string;
  title?: string;
  description?: string;
  type?: "success" | "error" | "loading";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ id, title, description, type = "success", onClose }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: AlertTriangle,
    loading: Loader2,
  };

  const styles = {
    success: "border-[var(--success)] bg-[var(--success)]/10 text-[var(--success)]",
    error: "border-[var(--danger)] bg-[var(--danger)]/10 text-[var(--danger)]",
    loading: "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]",
  };

  const Icon = icons[type];

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-2 overflow-hidden rounded-md border p-3 pr-8 shadow-md transition-all max-w-sm",
        "bg-[var(--surface)] text-[var(--text)]",
        styles[type]
      )}
    >
      <div className="flex items-center space-x-2">
        <Icon className={cn("h-4 w-4 flex-shrink-0", type === "loading" && "animate-spin")} />
        <div className="grid gap-0.5 min-w-0">
          {title && <div className="text-sm font-medium truncate">{title}</div>}
          {description && <div className="text-xs opacity-80 line-clamp-2">{description}</div>}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100 focus:opacity-100 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}