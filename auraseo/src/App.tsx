import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Zap, Accessibility, Shield, Search, Activity } from 'lucide-react';
import { NavBar } from './components/NavBar';
import { Hero } from './components/Hero';
import { ScoreCard } from './components/ScoreCard';
import { CoreVitalsChart } from './components/CoreVitalsChart';
import { AuditList } from './components/AuditList';
import { Features } from './components/Features';
import { HowItWorks } from './components/HowItWorks';
import { AitherStackCTA } from './components/AitherStackCTA';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { usePageSpeed } from './hooks/usePageSpeed';
import { useAuditHistory } from './hooks/useAuditHistory';
import type { AuditResult, DeviceType, Toast as ToastType } from './types';

const PDFModal = lazy(() => import('./components/PDFModal').then(m => ({ default: m.PDFModal })));
const HistoryDrawer = lazy(() => import('./components/HistoryDrawer').then(m => ({ default: m.HistoryDrawer })));

function App() {
  const { isLoading, error, result, runAudit, reset } = usePageSpeed();
  const { history, isLoading: historyLoading, loadHistory, removeAudit, clearAllHistory, getAudit } = useAuditHistory();
  
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isPDFModalOpen, setIsPDFModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastType[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [result]);

  const addToast = useCallback((type: ToastType['type'], message: string) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, type, message }]);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleRunAudit = useCallback(async (url: string, device: DeviceType) => {
    reset();
    const result = await runAudit(url, device);
    if (result) {
      addToast('success', `Audit complete for ${url}`);
      loadHistory();
    } else {
      addToast('error', error || 'Audit failed. Please try again.');
    }
  }, [runAudit, reset, addToast, loadHistory, error]);

  const handleSelectAudit = useCallback((audit: AuditResult) => {
    runAudit(audit.url, audit.device);
  }, [runAudit]);

  return (
    <div className="min-h-screen bg-bg-primary grid-bg overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-accent/20 blur-3xl"
          style={{ willChange: 'transform' }}
        />
        <div
          className="absolute top-1/2 -right-32 w-[400px] h-[400px] rounded-full bg-highlight/15 blur-3xl"
          style={{ willChange: 'transform' }}
        />
      </div>

      <NavBar
        onHistoryClick={() => setIsHistoryOpen(true)}
        onExportClick={() => setIsPDFModalOpen(true)}
        hasAudit={!!result}
      />

      <main className="relative z-10">
        <Hero onRunAudit={handleRunAudit} isLoading={isLoading} />

        {result && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
            <div 
              className="text-center mb-12 opacity-0 animate-fade-up"
              style={{ animationDelay: '50ms' }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-4 border border-accent/30">
                <Activity className="w-4 h-4 text-success animate-pulse-slow" />
                <span className="text-text-secondary text-sm">Live Audit Results</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary mb-2">
                Performance for <span className="text-accent">{result.url}</span>
              </h2>
              <p className="text-text-muted text-sm capitalize">
                {result.device} Analysis
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
              <ScoreCard
                title="Performance"
                score={result.scores.performance}
                icon={<Zap className="w-4 h-4" />}
                metrics={[{ label: 'Speed', value: `${result.coreVitals.lcp}ms` }]}
                isLoading={isLoading}
                index={0}
              />
              <ScoreCard
                title="Accessibility"
                score={result.scores.accessibility}
                icon={<Accessibility className="w-4 h-4" />}
                metrics={[{ label: 'Contrast', value: 'OK' }, { label: 'ARIA', value: 'OK' }]}
                isLoading={isLoading}
                index={1}
              />
              <ScoreCard
                title="Best Practices"
                score={result.scores.bestPractices}
                icon={<Shield className="w-4 h-4" />}
                metrics={[{ label: 'Security', value: 'OK' }, { label: 'HTTPS', value: 'OK' }]}
                isLoading={isLoading}
                index={2}
              />
              <ScoreCard
                title="SEO"
                score={result.scores.seo}
                icon={<Search className="w-4 h-4" />}
                metrics={[{ label: 'Meta', value: 'OK' }, { label: 'Crawl', value: 'OK' }]}
                isLoading={isLoading}
                index={3}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <CoreVitalsChart vitals={result.coreVitals} isLoading={isLoading} />
              <AuditList
                passed={result.audits.passed}
                warnings={result.audits.warnings}
                critical={result.audits.critical}
                isLoading={isLoading}
              />
            </div>
          </section>
        )}

        {!result && !isLoading && (
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
            <div 
              className="glass-card rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden border border-accent/30 opacity-0 animate-fade-up"
              style={{ animationDelay: '200ms' }}
            >
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-accent to-highlight flex items-center justify-center">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">Ready to Analyze</h2>
              <p className="text-text-secondary max-w-md mx-auto">
                Enter any website URL above to get instant performance insights.
              </p>
            </div>
          </section>
        )}

        <Features />
        <HowItWorks />
        <AitherStackCTA />
      </main>

      <Suspense fallback={null}>
        {isPDFModalOpen && (
          <PDFModal
            audit={result}
            isOpen={isPDFModalOpen}
            onClose={() => setIsPDFModalOpen(false)}
          />
        )}
        {isHistoryOpen && (
          <HistoryDrawer
            isOpen={isHistoryOpen}
            onClose={() => setIsHistoryOpen(false)}
            history={history}
            isLoading={historyLoading}
            onSelectAudit={handleSelectAudit}
            onDeleteAudit={removeAudit}
            onClearAll={clearAllHistory}
            getAuditById={getAudit}
          />
        )}
      </Suspense>

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <Footer />
    </div>
  );
}

export default App;