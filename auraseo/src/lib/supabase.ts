import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { AuditResult, AuditHistoryItem } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function saveAudit(audit: AuditResult): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) {
    console.warn('Supabase not configured. Audit will not be saved.');
    return null;
  }

  const { data, error } = await supabase
    .from('audits')
    .insert({
      url: audit.url,
      device: audit.device,
      scores: audit.scores,
      core_vitals: audit.coreVitals,
      audits_list: audit.audits,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error saving audit:', error);
    return null;
  }

  return data.id;
}

export async function getAuditHistory(): Promise<AuditHistoryItem[]> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  const { data, error } = await supabase
    .from('audits')
    .select('id, url, device, scores, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Error fetching audit history:', error);
    return [];
  }

  return (data || []).map((item) => ({
    id: item.id,
    url: item.url,
    device: item.device,
    score: item.scores?.performance ?? 0,
    createdAt: item.created_at,
  }));
}

export async function getAuditById(id: string): Promise<AuditResult | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from('audits')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching audit:', error);
    return null;
  }

  return {
    id: data.id,
    url: data.url,
    device: data.device,
    timestamp: new Date(data.created_at),
    scores: data.scores,
    coreVitals: data.core_vitals,
    audits: data.audits_list,
  };
}

export async function deleteAudit(id: string): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  const { error } = await supabase
    .from('audits')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting audit:', error);
    return false;
  }

  return true;
}

export async function clearHistory(): Promise<boolean> {
  if (!isSupabaseConfigured || !supabase) {
    return false;
  }

  const { error } = await supabase
    .from('audits')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (error) {
    console.error('Error clearing history:', error);
    return false;
  }

  return true;
}