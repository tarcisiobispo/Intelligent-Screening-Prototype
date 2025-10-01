import * as React from "react";
import { Toast, ToastProps } from "./toast";

interface ToastContextType {
  toast: (props: Omit<ToastProps, "id" | "onClose">) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  loading: (title: string, description?: string) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastProps[]>([]);

  const addToast = React.useCallback((props: Omit<ToastProps, "id" | "onClose">) => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast: ToastProps = {
      ...props,
      id,
      onClose: () => removeToast(id),
    };

    setToasts((prev) => [...prev, toast]);

    // Auto dismiss after duration (except loading)
    if (props.type !== "loading") {
      const duration = props.duration || 3000; // Reduzido para 3s
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "success" });
  }, [addToast]);

  const error = React.useCallback((title: string, description?: string) => {
    addToast({ title, description, type: "error" });
  }, [addToast]);

  const loading = React.useCallback((title: string, description?: string) => {
    return addToast({ title, description, type: "loading" });
  }, [addToast]);

  const value = React.useMemo(
    () => ({
      toast: addToast,
      success,
      error,
      loading,
      dismiss: removeToast,
    }),
    [addToast, success, error, loading, removeToast]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-50 flex max-h-screen w-full flex-col space-y-2 md:max-w-[320px]">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}