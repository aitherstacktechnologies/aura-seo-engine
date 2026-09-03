import { useState, useEffect, useCallback, useRef } from 'react';
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadHistory = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAuditHistory();
      if (isMounted.current) {
        setHistory(data);
      }
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const removeAudit = useCallback(async (id: string) => {
    const success = await deleteAudit(id);
    if (success && isMounted.current) {
      setHistory((prev) => prev.filter((item) => item.id !== id));
    }
  }, []);

  const clearAllHistory = useCallback(async () => {
    const success = await clearHistory();
    if (success && isMounted.current) {
      setHistory([]);
    }
  }, []);

  const getAudit = useCallback(async (id: string): Promise<AuditResult | null> => {
    return await getAuditById(id);
  }, []);

  useEffect(() => {
    void loadHistory();
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