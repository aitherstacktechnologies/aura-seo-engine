import { useState, useEffect, useCallback } from 'react';
import type { AuditHistoryItem } from '../types';
import { getAuditHistory, deleteAudit, clearHistory, getAuditById } from '../lib/supabase';
import type { AuditResult } from '../types';

interface UseAuditHistoryReturn {
  history: AuditHistoryItem[];
  isLoading: boolean;
  loadHistory: () => Promise<void>;
  removeAudit: (id: string) => Promise<void>;
  clearAllHistory: () => Promise<void>;
  getAudit: (id: string) => Promise<AuditResult | null>;
}

export function useAuditHistory(): UseAuditHistoryReturn {
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAuditHistory();
      setHistory(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeAudit = useCallback(async (id: string) => {
    const success = await deleteAudit(id);
    if (success) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  }, []);

  const clearAllHistory = useCallback(async () => {
    const success = await clearHistory();
    if (success) {
      setHistory([]);
    }
  }, []);

  const getAudit = useCallback(async (id: string): Promise<AuditResult | null> => {
    return await getAuditById(id);
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    loadHistory,
    removeAudit,
    clearAllHistory,
    getAudit,
  };
}