import { useRef, memo } from 'react';
import { useInView } from 'framer-motion';
import { Globe, Zap, BarChart2, FileText, ArrowUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Enter URL',
    description: 'Simply enter the website URL you want to audit. Choose mobile or desktop analysis.',
    icon: <Globe className="w-6 h-6" />,
    color: '#674EBC',
  },
  {
    number: '02',
    title: 'AI Analysis',
    description: 'Our system runs multiple tests using Google PageSpeed Insights API.',
    icon: <Zap className="w-6 h-6" />,
    color: '#8D86C9',
  },
  {
    number: '03',
    title: 'View Results',
    description: 'Receive comprehensive scores and actionable insights instantly.',
    icon: <BarChart2 className="w-6 h-6" />,
    color: '#D7D3DA',
  },
  {
    number: '04',
    title: 'Export Report',
    description: 'Generate beautiful PDF reports to share with clients or stakeholders.',
    icon: <FileText className="w-6 h-6" />,
    color: '#674EBC',
  },
];

function HowItWorksComponent() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="how-it-works" className="py-24 px-4 sm:px-6 relative">
      <div
        ref={ref}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6 border border-accent/30">
            <span className="text-xs sm:text-sm font-medium text-text-secondary">Simple 4-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Four simple steps to get comprehensive web performance insights.
          </p>
        </div>

        <div className="relative">
          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, i) => {
              const isReverse = i % 2 === 1;
              return (
                <div 
                  key={i} 
                  className={`lg:flex items-center gap-8 ${isReverse ? 'lg:flex-row-reverse' : ''}`}
                  style={{ 
                    opacity: inView ? 1 : 0,
                    transform: inView ? 'translateY(0)' : 'translateY(40px)',
                    transition: `all 0.5s ease ${0.2 + i * 0.1}s`
                  }}
                >
                  <div className="lg:w-1/2 mb-4 lg:mb-0">
                    <div className="glass-card rounded-2xl p-6 h-full relative overflow-hidden border border-accent/20 hover:border-accent/40 transition-all duration-200 hover:-translate-y-1">
                      <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-4">
                          <div 
                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                            style={{ 
                              backgroundColor: `${step.color}20`,
                              color: step.color,
                              boxShadow: `0 0 20px ${step.color}30`,
                            }}
                          >
                            {step.icon}
                          </div>
                          <span 
                            className="text-4xl font-bold font-mono opacity-30"
                            style={{ color: step.color }}
                          >
                            {step.number}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h3>
                        <p className="text-text-secondary text-sm">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden lg:block lg:w-1/2" />
                </div>
              );
            })}
          </div>
        </div>

        <div 
          className="mt-20 glass-card rounded-2xl p-8 text-center relative overflow-hidden border border-accent/30"
          style={{ 
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.5s ease 0.6s'
          }}
        >
          <h3 className="text-xl font-bold text-text-primary mb-4">Ready to Start?</h3>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Run your first audit and discover how to improve your website performance.
          </p>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-white text-[#674EBC] font-extrabold px-6 py-3 rounded-xl inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200 shadow-[0_4px_20px_rgba(103,78,188,0.3)]"
          >
            <span>Start Auditing</span>
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

export const HowItWorks = memo(HowItWorksComponent);