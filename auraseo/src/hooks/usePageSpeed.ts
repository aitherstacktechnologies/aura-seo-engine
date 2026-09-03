import { useState, useCallback, useRef, useEffect } from 'react';
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
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  const runAudit = useCallback(async (url: string, device: DeviceType): Promise<AuditResult | null> => {
    const apiKey = import.meta.env.VITE_PAGESPEED_API_KEY;

    if (!apiKey) {
      const msg = 'PageSpeed API key not configured. Add VITE_PAGESPEED_API_KEY to your environment.';
      setError(msg);
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const auditResult = await runPageSpeedAudit(url, device, apiKey);
      if (isMounted.current) {
        setResult(auditResult);
      }
      
      saveAudit(auditResult).catch((err) => {
        console.error('Failed to save audit:', err);
      });
      
      return auditResult;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      if (isMounted.current) {
        setError(message);
      }
      return null;
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setResult(null);
  }, []);

  return { isLoading, error, result, runAudit, reset };
}