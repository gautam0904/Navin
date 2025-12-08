import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const toastConfig: Record<
  ToastType,
  { icon: React.ReactNode; bgColor: string; textColor: string; borderColor: string }
> = {
  success: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    bgColor: 'bg-[rgba(16,185,129,0.1)]',
    textColor: 'text-[--git-status-added]',
    borderColor: 'border-[--git-status-added]',
  },
  error: {
    icon: <XCircle className="w-4 h-4" />,
    bgColor: 'bg-[rgba(239,68,68,0.1)]',
    textColor: 'text-[--color-error]',
    borderColor: 'border-[--color-error]',
  },
  warning: {
    icon: <AlertCircle className="w-4 h-4" />,
    bgColor: 'bg-[rgba(245,158,11,0.1)]',
    textColor: 'text-[#f59e0b]',
    borderColor: 'border-[#f59e0b]',
  },
  info: {
    icon: <AlertCircle className="w-4 h-4" />,
    bgColor: 'bg-[rgba(59,130,246,0.1)]',
    textColor: 'text-[--color-primary]',
    borderColor: 'border-[--color-primary]',
  },
};

export function ToastComponent({ toast, onClose }: ToastProps) {
  const config = toastConfig[toast.type];
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, onClose]);

  return (
    <div
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border shadow-lg
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        animate-in slide-in-from-top-2 fade-in
      `}
    >
      {config.icon}
      <span className="text-sm font-medium flex-1">{toast.message}</span>
      <button onClick={() => onClose(toast.id)} className="p-0.5 hover:bg-black/10 rounded">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onClose: (id: string) => void;
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastComponent key={toast.id} toast={toast} onClose={onClose} />
      ))}
    </div>
  );
}

// Toast manager hook
let toastIdCounter = 0;

export function createToast(message: string, type: ToastType = 'info', duration?: number): Toast {
  return {
    id: `toast-${++toastIdCounter}`,
    message,
    type,
    duration,
  };
}
