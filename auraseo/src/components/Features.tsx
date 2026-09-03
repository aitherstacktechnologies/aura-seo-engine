import { useRef, memo } from 'react';
import { useInView } from 'framer-motion';
import { Zap, BarChart2, Shield, Search, Globe, Clock, Accessibility } from 'lucide-react';


const advantages = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Real-Time Google API Data',
    description: 'Get instant insights into your website performance metrics powered by Google PageSpeed Insights API.',
    color: '#674EBC',
  },
  {
    icon: <BarChart2 className="w-6 h-6" />,
    title: 'Core Web Vitals Deep Scanning',
    description: 'Comprehensive LCP, FCP, CLS, and TBT analysis with actionable recommendations.',
    color: '#8D86C9',
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: 'Automated History Logging',
    description: 'Track your audit history and monitor performance improvements over time.',
    color: '#D7D3DA',
  },
];

const features = [
  { icon: <Search className="w-5 h-5" />, title: 'SEO Analysis', description: 'Complete SEO analysis with meta tags and crawlability.', color: '#674EBC' },
  { icon: <Accessibility className="w-5 h-5" />, title: 'Accessibility', description: 'WCAG 2.1 compliance checking and recommendations.', color: '#8D86C9' },
  { icon: <Shield className="w-5 h-5" />, title: 'Security', description: 'HTTPS verification and security best practices checks.', color: '#D7D3DA' },
  { icon: <Globe className="w-5 h-5" />, title: 'Global Testing', description: 'Test from mobile and desktop perspectives.', color: '#674EBC' },
];

const stats = [
  { value: '25K+', label: 'Daily API Calls' },
  { value: '99.9%', label: 'Uptime' },
  { value: '100+', label: 'Audit Metrics' },
  { value: '< 3s', label: 'Avg Response' },
];

function FeaturesComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="features" className="py-24 px-4 sm:px-6 relative">
      <div
        ref={ref}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border border-accent/30">
            <span className="text-xs sm:text-sm font-medium text-text-secondary">Why Choose Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
            Built for <span className="text-gradient">Performance</span>
            <br />
            <span className="text-text-secondary text-2xl sm:text-3xl md:text-4xl">Engineers & Marketers</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Everything you need to optimize your web presence and deliver exceptional user experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {advantages.map((advantage, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-8 group relative overflow-hidden border border-accent/20 hover:border-accent/50 transition-all duration-200 hover:-translate-y-1"
              style={{ 
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.5s ease ${i * 0.1}s`
              }}
            >
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-2xl opacity-20"
                style={{ background: advantage.color }}
              />
              <div className="relative z-10 text-center">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ 
                    backgroundColor: `${advantage.color}20`,
                    color: advantage.color,
                    boxShadow: `0 0 25px ${advantage.color}30`,
                  }}
                >
                  {advantage.icon}
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">{advantage.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{advantage.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl p-6 group relative overflow-hidden border border-accent/20 hover:border-accent/40 transition-all duration-200 hover:-translate-y-1"
              style={{ 
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.5s ease ${0.2 + i * 0.08}s`
              }}
            >
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ 
                  backgroundColor: `${feature.color}20`,
                  color: feature.color,
                  boxShadow: `0 0 15px ${feature.color}30`,
                }}
              >
                {feature.icon}
              </div>
              <h3 className="text-base font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-4 text-center border border-accent/20 transition-transform duration-200 hover:-translate-y-1"
              style={{ 
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(30px)',
                transition: `all 0.5s ease ${0.4 + i * 0.08}s`
              }}
            >
              <p className="text-xl sm:text-2xl font-bold font-mono text-gradient">{stat.value}</p>
              <p className="text-text-muted text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const Features = memo(FeaturesComponent);