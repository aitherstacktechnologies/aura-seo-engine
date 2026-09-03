import { memo } from 'react';
import { ArrowUpRight, Sparkles, Code, Mic, Zap } from 'lucide-react';

const features = [
  { icon: Code, label: 'Web Engineering', color: '#674EBC' },
  { icon: Mic, label: 'Voice AI', color: '#8D86C9' },
  { icon: Sparkles, label: 'Custom Solutions', color: '#D7D3DA' },
];

function AitherStackCTAComponent() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative rounded-3xl p-8 sm:p-12 md:p-14 text-center overflow-hidden border border-accent/30 group cta-gradient">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/40 mb-6">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Aither Stack Technologies</span>
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
              Need Custom Web Engineering
              <br />
              <span className="text-gradient">& Voice AI Solutions?</span>
            </h2>

            <p className="text-text-secondary max-w-lg mx-auto mb-8">
              Get enterprise-grade web development, performance optimization, and intelligent voice AI solutions tailored to your business needs.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <a
                href="https://aitherstack-tech-5vteyqr7i-aither-stack-technologies.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-[#674EBC] font-extrabold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform duration-200 shadow-[0_4px_25px_rgba(103,78,188,0.3)]"
              >
                <Zap className="w-5 h-5" />
                <span>Visit Our Agency Web</span>
                <ArrowUpRight className="w-5 h-5" />
              </a>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm">
              {features.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2 text-text-secondary transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <item.icon className="w-4 h-4" style={{ color: item.color }} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const AitherStackCTA = memo(AitherStackCTAComponent);