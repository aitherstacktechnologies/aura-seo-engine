import { useState, memo, useCallback } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ChevronDown, Copy, Check, Lightbulb } from 'lucide-react';
import type { AuditItem } from '../types';

interface AuditListProps {
  passed: AuditItem[];
  warnings: AuditItem[];
  critical: AuditItem[];
  isLoading?: boolean;
}

type TabType = 'critical' | 'warnings' | 'passed';

const tabsConfig = [
  { key: 'critical' as const, label: 'Critical' },
  { key: 'warnings' as const, label: 'Warnings' },
  { key: 'passed' as const, label: 'Passed' },
];

const getColor = (tab: TabType) => {
  switch (tab) {
    case 'critical': return { color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
    case 'warnings': return { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' };
    case 'passed': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
  }
};

const ListIcon = ({ type, className }: { type: TabType; className?: string }) => {
  const iconClass = className || "w-5 h-5";
  switch (type) {
    case 'critical': return <XCircle className={iconClass} />;
    case 'warnings': return <AlertTriangle className={iconClass} />;
    case 'passed': return <CheckCircle className={iconClass} />;
  }
};

const getFixTip = (auditId: string, title: string): string => {
  const tips: Record<string, string> = {
    'first-contentful-paint': 'Optimize server response time, eliminate render-blocking resources, and use text compression.',
    'largest-contentful-paint': 'Optimize images, preload key resources, and improve server response times.',
    'total-blocking-time': 'Break up long tasks, reduce JavaScript execution time, and minimize third-party scripts.',
    'cumulative-layout-shift': 'Always set size attributes on images and videos, and reserve space for dynamic content.',
    'speed-index': 'Minimize main-thread work, reduce JavaScript payloads, and prioritize visible content.',
    'interactive': 'Reduce time spent parsing, compiling, and executing JavaScript.',
    'render-blocking-resources': 'Inline critical CSS, defer non-critical CSS, and reduce unused CSS.',
    'uses-text-compression': 'Enable gzip or Brotli compression on your web server.',
    'uses-responsive-images': 'Serve appropriately sized images and use modern formats like WebP.',
    'offscreen-images': 'Lazy-load below-the-fold images using the loading="lazy" attribute.',
    'unminified-css': 'Use a CSS minifier to remove whitespace and comments from your stylesheets.',
    'unminified-javascript': 'Use a JavaScript minifier like Terser or UglifyJS for production code.',
    'unused-css-rules': 'Remove unused CSS selectors and use tools like PurgeCSS.',
    'unused-javascript': 'Code-split your bundles, remove dead code, and use tree-shaking.',
    'efficient-animated-content': 'Use video instead of animated GIFs for better compression.',
    'duplicated-javascript': 'Remove duplicate modules and consolidate libraries.',
    'legacy-javascript': 'Use module/nomodule pattern and transpile only what is needed.',
    'preload-lcp-image': 'Add <link rel="preload"> for your LCP image to prioritize loading.',
    'total-byte-weight': 'Reduce resource sizes, enable compression, and remove unnecessary assets.',
    'dom-size': 'Keep DOM under 1500 nodes, 60 nesting depth, and 30 sibling children for best performance.',
    'critical-request-chains': 'Reduce chain length by inlining critical resources and using resource hints.',
    'user-timings': 'Use the User Timing API to mark and measure key user experience events.',
    'bootup-time': 'Reduce script execution time by code-splitting and removing unused code.',
    'mainthread-work-breakdown': 'Minimize main-thread work by offloading to web workers when possible.',
    'font-display': 'Use font-display: swap or optional to prevent invisible text during font load.',
    'third-party-summary': 'Audit and reduce the impact of third-party scripts and tags.',
    'third-party-facades': 'Defer loading third-party embeds until user interaction.',
    'largest-contentful-paint-element': 'Identify and optimize the specific LCP element for faster rendering.',
    'layout-shift-elements': 'Identify elements causing layout shifts and set explicit dimensions.',
    'uses-long-cache-ttl': 'Set long cache lifetimes on static assets (1 year for versioned files).',
    'uses-optimized-images': 'Use modern image formats like WebP/AVIF and compress images appropriately.',
    'uses-rel-preconnect': 'Add <link rel="preconnect"> for important third-party origins.',
    'color-contrast': 'Ensure text has sufficient contrast ratio (4.5:1 for normal text, 3:1 for large).',
    'image-alt': 'Add descriptive alt attributes to all <img> elements for accessibility.',
    'meta-viewport': 'Include <meta name="viewport" content="width=device-width, initial-scale=1">.',
    'document-title': 'Add a unique, descriptive <title> element to every page.',
    'meta-description': 'Add a unique meta description (150-160 characters) to every page.',
    'http-status-code': 'Ensure all pages return a 200 (OK) status code.',
    'is-crawlable': 'Allow search engines to crawl your pages by checking robots.txt and meta robots.',
    'robots-txt': 'Ensure robots.txt is valid and not blocking important pages.',
  };
  
  if (tips[auditId]) return tips[auditId];
  
  const titleLower = title.toLowerCase();
  if (titleLower.includes('image')) return 'Optimize images: use modern formats, proper sizing, and lazy loading.';
  if (titleLower.includes('css')) return 'Minify CSS, remove unused rules, and inline critical styles.';
  if (titleLower.includes('javascript') || titleLower.includes('js')) return 'Minify, tree-shake, and code-split your JavaScript bundles.';
  if (titleLower.includes('font')) return 'Preload fonts and use font-display: swap to improve text rendering.';
  if (titleLower.includes('accessibility') || titleLower.includes('aria')) return 'Follow WCAG 2.1 guidelines and test with screen readers.';
  if (titleLower.includes('cache')) return 'Configure long cache lifetimes for static assets with versioning.';
  if (titleLower.includes('compress')) return 'Enable gzip or Brotli compression on your server.';
  if (titleLower.includes('security') || titleLower.includes('https')) return 'Use HTTPS everywhere and implement proper security headers.';
  
  return 'Review the official documentation for detailed implementation guidance and best practices.';
};

function AuditListComponent({ passed, warnings, critical, isLoading }: AuditListProps) {
  const [activeTab, setActiveTab] = useState<TabType>('critical');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const tabs = tabsConfig.map(t => ({
    ...t,
    count: t.key === 'critical' ? critical.length : t.key === 'warnings' ? warnings.length : passed.length,
  }));

  const currentItems = activeTab === 'critical' ? critical : activeTab === 'warnings' ? warnings : passed;
  const tabColor = getColor(activeTab);

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
      } catch {
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }, []);

  if (isLoading) {
    return (
      <div 
        className="glass-card rounded-2xl p-6 opacity-0 animate-fade-up"
        style={{ animationDelay: '300ms' }}
      >
        <div className="flex gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton w-28 h-10 rounded-xl" />
          ))}
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton w-full h-16 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      className="glass-card rounded-2xl p-6 border border-accent/20 transition-transform duration-200"
      style={{ animationDelay: '300ms', opacity: 0, animation: 'fadeUp 0.5s ease 0.3s forwards' }}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-text-primary">Diagnostics</h3>
      </div>
      
      <div className="flex gap-2 mb-6 flex-wrap">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const color = getColor(tab.key);
          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setExpandedId(null);
              }}
              className="px-4 py-2.5 text-sm rounded-xl transition-all duration-200 active:scale-95 cursor-pointer"
              style={{
                color: isActive ? color.color : '#94A3B8',
                backgroundColor: isActive ? color.bg : 'transparent',
                border: `1px solid ${isActive ? color.color + '40' : 'transparent'}`,
              }}
              type="button"
            >
              <span className="inline-flex items-center gap-2">
                <ListIcon type={tab.key} className="w-5 h-5" />
                {tab.label}
              </span>
              <span 
                className="ml-2 px-2 py-0.5 rounded-full text-xs font-mono"
                style={{
                  backgroundColor: isActive ? color.color + '30' : 'rgba(255, 255, 255, 0.05)',
                  color: isActive ? color.color : '#64748b',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {currentItems.length === 0 ? (
          <div className="text-center py-10">
            <div 
              className="w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
            >
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <p className="text-text-secondary">No {activeTab} issues found</p>
          </div>
        ) : (
          currentItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border border-border overflow-hidden hover:border-accent/40 transition-colors duration-200"
            >
              <button
                onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/[0.02] transition-colors cursor-pointer"
                type="button"
                aria-expanded={expandedId === item.id}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: tabColor.bg,
                      color: tabColor.color,
                    }}
                  >
                    <ListIcon type={activeTab} className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-text-primary text-sm font-medium text-left truncate pr-4">{item.title}</p>
                    <p className="text-text-muted text-xs mt-0.5 text-left line-clamp-1">{item.description}</p>
                  </div>
                </div>
                <ChevronDown 
                  className={`w-5 h-5 text-text-muted transition-transform duration-200 flex-shrink-0 ${
                    expandedId === item.id ? 'rotate-180' : ''
                  }`} 
                />
              </button>
              
              {expandedId === item.id && (
                <div className="px-4 pb-4 pt-0">
                  <div className="ml-13 pl-4 border-l-2 border-border space-y-3">
                    <p className="text-text-secondary text-sm leading-relaxed text-left">{item.description}</p>
                    
                    {item.snippet && (
                      <div className="relative bg-bg-secondary rounded-lg p-3 font-mono group/snippet">
                        <code className="text-accent text-xs break-all block pr-10">{item.snippet}</code>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(item.snippet!, item.id);
                          }}
                          className="absolute top-2 right-2 p-1.5 rounded-md bg-bg-primary/60 hover:bg-accent/20 text-text-secondary hover:text-accent transition-colors cursor-pointer"
                          aria-label="Copy code"
                          type="button"
                        >
                          {copiedId === item.id ? (
                            <Check className="w-3.5 h-3.5 text-success" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}

                    {activeTab !== 'passed' && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-accent/5 border border-accent/20">
                        <Lightbulb className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-accent mb-1">How to Fix</p>
                          <p className="text-xs text-text-secondary leading-relaxed text-left">
                            {getFixTip(item.id, item.title)}
                          </p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'passed' && (
                      <div className="flex items-start gap-2 p-3 rounded-lg bg-success/5 border border-success/20">
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-semibold text-success mb-1">Passed</p>
                          <p className="text-xs text-text-secondary leading-relaxed text-left">
                            This audit passed successfully. Your site is following this best practice correctly.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export const AuditList = memo(AuditListComponent);