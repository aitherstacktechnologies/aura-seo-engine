import { useEffect } from 'react';
import { X, Trash2, Monitor, Smartphone, Loader2, History } from 'lucide-react';
import type { AuditHistoryItem, AuditResult } from '../types';
import { getScoreColor } from '../lib/pagespeed';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: AuditHistoryItem[];
  isLoading: boolean;
  onSelectAudit: (audit: AuditResult) => void;
  onDeleteAudit: (id: string) => void;
  onClearAll: () => void;
  getAuditById: (id: string) => Promise<AuditResult | null>;
}

export function HistoryDrawer({
  isOpen,
  onClose,
  history,
  isLoading,
  onSelectAudit,
  onDeleteAudit,
  onClearAll,
  getAuditById,
}: HistoryDrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleSelect = async (id: string) => {
    const audit = await getAuditById(id);
    if (audit) {
      onSelectAudit(audit);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md glass border-l border-border animate-slide-right">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-highlight flex items-center justify-center">
              <History className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-primary">History</h2>
              <p className="text-text-muted text-xs">{history.length} audits</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5 text-text-secondary" />
          </button>
        </div>

        <div className="p-4">
          {history.length > 0 && (
            <button
              onClick={onClearAll}
              className="w-full btn-secondary py-2.5 rounded-xl text-sm text-error border-error/30 hover:border-error/50"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 pt-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-accent animate-spin" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/5 flex items-center justify-center">
                <History className="w-6 h-6 text-text-muted" />
              </div>
              <p className="text-text-secondary font-medium">No audits yet</p>
              <p className="text-text-muted text-sm mt-1">Run your first audit</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-xl p-4 cursor-pointer group card-3d"
                  onClick={() => handleSelect(item.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                        item.device === 'mobile' 
                          ? 'bg-highlight/15 text-highlight' 
                          : 'bg-accent/15 text-accent'
                      }`}>
                        {item.device === 'mobile' ? (
                          <Smartphone className="w-4 h-4" />
                        ) : (
                          <Monitor className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-text-primary text-sm font-medium truncate max-w-[160px]">
                          {item.url}
                        </p>
                        <p className="text-text-muted text-xs capitalize">{item.device}</p>
                      </div>
                    </div>
                    <div 
                      className="text-xl font-bold font-mono"
                      style={{ color: getScoreColor(item.score) }}
                    >
                      {item.score}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-muted text-xs">
                      {new Date(item.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteAudit(item.id);
                      }}
                      className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-error/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-error" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}