import { useState, useCallback } from 'react';
import type { AuditResult, DeviceType } from '../types';
import { runPageSpeedAudit } from '../lib/pagespeed';
import { saveAudit } from '../lib/supabase';

interface UsePageSpeedReturn {
  isLoading: boolean;
  error: string | null;
  result: AuditResult | null;
  runAudit: (url: string, device: DeviceType) => Promise<AuditResult | null>;
  reset: () => void;
}

export function usePageSpeed(): UsePageSpeedReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AuditResult | null>(null);

  const runAudit = useCallback(async (url: string, device: DeviceType): Promise<AuditResult | null> => {
    const apiKey = import.meta.env.VITE_PAGESPEED_API_KEY;

    if (!apiKey) {
      setError('PageSpeed API key not configured. Add VITE_PAGESPEED_API_KEY to your environment.');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const auditResult = await runPageSpeedAudit(url, device, apiKey);
      setResult(auditResult);
      
      saveAudit(auditResult);
      
      return auditResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return { isLoading, error, result, runAudit, reset };
}