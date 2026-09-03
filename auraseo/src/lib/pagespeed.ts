import type { AuditResult, DeviceType, PageSpeedScore, CoreVitals, AuditItem, PageSpeedAPIResponse } from '../types';

const API_BASE = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

export async function runPageSpeedAudit(
  url: string,
  device: DeviceType,
  apiKey: string
): Promise<AuditResult> {
  const encodedUrl = encodeURIComponent(url);
  const apiUrl = `${API_BASE}?url=${encodedUrl}&strategy=${device}&key=${apiKey}`;

  const response = await fetch(apiUrl);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error('API rate limit exceeded. Please wait a moment before trying again.');
    }
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  const data: PageSpeedAPIResponse = await response.json();

  return transformPageSpeedData(data, url, device);
}

function transformPageSpeedData(
  data: PageSpeedAPIResponse,
  url: string,
  device: DeviceType
): AuditResult {
  const { lighthouseResult, loadingExperience } = data;
  const { categories, audits } = lighthouseResult;

  const scores: PageSpeedScore = {
    performance: Math.round((categories.performance?.score || 0) * 100),
    accessibility: Math.round((categories.accessibility?.score || 0) * 100),
    bestPractices: Math.round((categories['best-practices']?.score || 0) * 100),
    seo: Math.round((categories.seo?.score || 0) * 100),
  };

  const coreVitals: CoreVitals = {
    lcp: loadingExperience.metrics?.LARGEST_CONTENTFUL_PAINT_MS?.percentile || 0,
    fid: loadingExperience.metrics?.FIRST_INPUT_DELAY_MS?.percentile || 0,
    cls: loadingExperience.metrics?.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile || 0,
  };

  const auditItems = Object.entries(audits)
    .filter(([, audit]) => audit.score !== null && audit.score !== undefined)
    .map(([id, audit]) => ({
      id,
      title: audit.title,
      description: audit.description.replace(/<[^>]*>/g, ''),
      score: audit.score,
      snippet: audit.details?.items?.[0]?.snippet,
    }));

  const passed: AuditItem[] = [];
  const warnings: AuditItem[] = [];
  const critical: AuditItem[] = [];

  auditItems.forEach((item) => {
    if (item.score === null || item.score === undefined) return;
    
    const auditItem: AuditItem = {
      id: item.id,
      title: item.title,
      description: item.description,
      snippet: item.snippet,
      category: 'passed',
    };

    if (item.score === 1) {
      auditItem.category = 'passed';
      passed.push(auditItem);
    } else if (item.score >= 0.5) {
      auditItem.category = 'warning';
      warnings.push(auditItem);
    } else {
      auditItem.category = 'critical';
      critical.push(auditItem);
    }
  });

  return {
    id: crypto.randomUUID(),
    url,
    device,
    timestamp: new Date(),
    scores,
    coreVitals,
    audits: { passed, warnings, critical },
  };
}

export function getScoreColor(score: number): string {
  if (score >= 90) return '#00f5d4';
  if (score >= 70) return '#fee440';
  if (score >= 50) return '#ffaa00';
  return '#ff4466';
}

export function getScoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 70) return 'Good';
  if (score >= 50) return 'Needs Work';
  return 'Poor';
}

export function validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.includes('.');
  } catch {
    return false;
  }
}

export function normalizeUrl(url: string): string {
  if (!url.startsWith('http')) {
    return `https://${url}`;
  }
  return url;
}