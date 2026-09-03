import { useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, X, Info } from 'lucide-react';
import type { Toast as ToastType } from '../types';

interface ToastProps {
  toasts: ToastType[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: ToastType; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 5000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const config = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      border: 'border-success/30',
      text: 'text-success',
      bg: 'bg-success/10',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      border: 'border-warning/30',
      text: 'text-warning',
      bg: 'bg-warning/10',
    },
    error: {
      icon: <XCircle className="w-5 h-5" />,
      border: 'border-error/30',
      text: 'text-error',
      bg: 'bg-error/10',
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      border: 'border-accent/30',
      text: 'text-accent',
      bg: 'bg-accent/10',
    },
  };

  const { icon, border, text, bg } = config[toast.type];

  return (
    <div
      className={`${bg} backdrop-blur-xl rounded-xl p-4 flex items-center gap-3 min-w-[300px] max-w-md border ${border} animate-slide-right shadow-lg`}
      role="alert"
    >
      <span className={text}>{icon}</span>
      <p className="text-text-primary flex-1 text-sm font-medium">{toast.message}</p>
      <button
        onClick={() => onDismiss(toast.id)}
        className="p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        type="button"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4 text-text-muted" />
      </button>
    </div>
  );
}