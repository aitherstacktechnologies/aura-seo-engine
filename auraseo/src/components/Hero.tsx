import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import { Zap, Monitor, Smartphone, Loader2, ArrowRight, Search, Sparkles } from 'lucide-react';
import type { DeviceType } from '../types';
import { validateUrl, normalizeUrl } from '../lib/pagespeed';
import { fadeInUp, staggerContainer, MagneticButton } from '../lib/motion';

interface HeroProps {
  onRunAudit: (url: string, device: DeviceType) => void;
  isLoading: boolean;
}

const PRESETS = ['stripe.com', 'vercel.com', 'github.com', 'figma.com', 'airbnb.com'];

const STATS = [
  { label: 'Performance', value: '0-100' },
  { label: 'Core Vitals', value: 'LCP/FCP/CLS' },
  { label: 'Accessibility', value: 'WCAG 2.1' },
  { label: 'SEO Checks', value: '100+' },
];

function HeroComponent({ onRunAudit, isLoading }: HeroProps) {
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState<DeviceType>('desktop');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Enter a domain to audit');
      return;
    }
    const normalized = normalizeUrl(url);
    if (!validateUrl(normalized)) {
      setError('Enter a valid domain (e.g., example.com)');
      return;
    }
    setError('');
    onRunAudit(normalized, device);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-4 sm:px-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-[400px] h-[400px] rounded-full bg-accent/25 blur-3xl"
          style={{ willChange: 'transform' }}
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-0 -right-32 w-[400px] h-[400px] rounded-full bg-highlight/20 blur-3xl"
          style={{ willChange: 'transform' }}
          animate={{ 
            x: [0, -50, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
        <div className="absolute inset-0 grid-bg opacity-30" />
      </div>

      <motion.div 
        className="relative z-10 max-w-2xl w-full mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          variants={fadeInUp}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-accent/30"
        >
          <Sparkles className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs sm:text-sm font-medium text-text-secondary">
            Instant SEO & Web Performance Diagnostic
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-slow" />
        </motion.div>

        <motion.h1 
          variants={fadeInUp}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] tracking-tight"
        >
          <span className="block text-text-primary">Instant SEO</span>
          <span className="block">
            <motion.span 
              className="inline-block bg-gradient-to-r from-accent via-highlight to-accent bg-clip-text text-transparent"
              style={{ backgroundSize: '200% auto', willChange: 'background-position' }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              & Performance
            </motion.span>
          </span>
          <span className="block text-text-primary">Insights</span>
        </motion.h1>
        
        <motion.p 
          variants={fadeInUp}
          className="text-text-secondary text-base sm:text-lg mb-10 max-w-lg mx-auto px-4"
        >
          Run comprehensive PageSpeed audits powered by Google&apos;s API. Get real-time metrics, deep Core Web Vitals analysis, and actionable recommendations.
        </motion.p>

        <motion.form 
          variants={fadeInUp}
          onSubmit={handleSubmit}
          className="mb-6"
        >
          <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 border border-accent/30">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                type="text"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Enter domain (e.g., stripe.com)"
                className="w-full bg-transparent pl-12 pr-4 py-3.5 sm:py-4 text-text-primary input-field rounded-xl text-sm sm:text-base"
                disabled={isLoading}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
            
            <div className="flex gap-2 px-2 sm:px-4 sm:border-l sm:border-accent/20">
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                  device === 'desktop'
                    ? 'bg-accent/20 text-accent border border-accent/50'
                    : 'text-text-secondary hover:text-text-primary border border-transparent'
                }`}
                disabled={isLoading}
                aria-label="Desktop"
              >
                <Monitor className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setDevice('mobile')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all duration-200 ${
                  device === 'mobile'
                    ? 'bg-highlight/20 text-highlight border border-highlight/50'
                    : 'text-text-secondary hover:text-text-primary border border-transparent'
                }`}
                disabled={isLoading}
                aria-label="Mobile"
              >
                <Smartphone className="w-5 h-5" />
              </button>
            </div>

            <MagneticButton
              type="submit"
              disabled={isLoading}
              className="bg-white text-[#674EBC] font-extrabold flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base disabled:opacity-50 hover:scale-105 transition-transform duration-200 group shadow-[0_4px_20px_rgba(103,78,188,0.3)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Run Audit</span>
                  <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </>
              )}
            </MagneticButton>
          </div>

          {error && (
            <p className="text-error text-sm mt-3 text-left ml-2">
              {error}
            </p>
          )}
        </motion.form>

        <motion.div 
          variants={fadeInUp}
          className="flex flex-wrap items-center justify-center gap-2 mb-16"
        >
          <span className="text-text-muted text-sm">Try:</span>
          {PRESETS.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setUrl(preset);
                if (error) setError('');
              }}
              className="px-3 py-1.5 rounded-lg text-xs sm:text-sm text-text-secondary border border-border hover:border-accent/50 hover:text-accent transition-colors duration-200 active:scale-95"
              disabled={isLoading}
            >
              {preset}
            </button>
          ))}
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
        >
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              className="glass-card rounded-xl p-4 sm:p-5 transition-transform duration-200 hover:-translate-y-1"
            >
              <p className="text-xl sm:text-2xl font-bold font-mono text-gradient">{stat.value}</p>
              <p className="text-text-muted text-xs sm:text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}

export const Hero = memo(HeroComponent);