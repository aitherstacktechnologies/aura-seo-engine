export interface PageSpeedScore {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface CoreVitals {
  lcp: number;
  fid: number;
  cls: number;
  fcp?: number;
  ttfb?: number;
}

export interface AuditItem {
  id: string;
  title: string;
  description: string;
  category: 'passed' | 'warning' | 'critical';
  snippet?: string;
}

export interface AuditResult {
  id: string;
  url: string;
  device: 'mobile' | 'desktop';
  timestamp: Date;
  scores: PageSpeedScore;
  coreVitals: CoreVitals;
  audits: {
    passed: AuditItem[];
    warnings: AuditItem[];
    critical: AuditItem[];
  };
}

export interface AuditHistoryItem {
  id: string;
  url: string;
  device: 'mobile' | 'desktop';
  score: number;
  createdAt: string;
}

export type DeviceType = 'mobile' | 'desktop';

export interface PageSpeedAPIResponse {
  lighthouseResult: {
    categories: {
      performance: { score: number };
      accessibility: { score: number };
      'best-practices': { score: number };
      seo: { score: number };
    };
    audits: Record<string, {
      score: number | null;
      title: string;
      description: string;
      details?: { items?: Array<{ snippet?: string }> };
    }>;
  };
  loadingExperience: {
    metrics: {
      LARGEST_CONTENTFUL_PAINT_MS?: { percentile: number };
      FIRST_INPUT_DELAY_MS?: { percentile: number };
      CUMULATIVE_LAYOUT_SHIFT_SCORE?: { percentile: number };
    };
  };
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}