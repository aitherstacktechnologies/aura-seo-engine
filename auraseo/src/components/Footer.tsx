import { memo } from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
];

const socialLinks = [
  {
    name: 'Email',
    href: 'mailto:muhammadzaman.dev@gmail.com',
    icon: Mail,
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/muhammad_official.dev/',
    icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: 'GitHub',
    href: 'https://github.com/aitherstacktechnologies',
    icon: () => (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
      </svg>
    ),
  },
];

function FooterComponent() {
  return (
    <footer className="relative z-10 border-t border-accent/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/src/assets/logo.png" 
                alt="AuraSEO Logo" 
                className="w-12 h-12 rounded-xl object-contain"
                loading="lazy"
                decoding="async"
              />
              <div>
                <div className="flex items-center">
                  <span className="text-xl font-bold text-text-primary">Aura</span>
                  <span className="text-xl font-extrabold text-accent">SEO</span>
                </div>
                <p className="text-text-muted text-xs">v01.0</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Instant web diagnostics engine. Get comprehensive PageSpeed insights and actionable recommendations in seconds.
            </p>
          </div>

          <div>
            <h4 className="text-text-primary font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <div className="space-y-3">
              {quickLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-text-secondary text-sm hover:text-accent hover:translate-x-1 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-text-primary font-semibold mb-4 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex items-center gap-3 mb-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-xl border border-accent/30 flex items-center justify-center text-text-secondary hover:text-accent hover:border-accent/70 hover:-translate-y-0.5 transition-all duration-200"
                  title={link.name}
                  aria-label={link.name}
                >
                  <link.icon />
                </a>
              ))}
            </div>
            <a
              href="https://aitherstack-tech-5vteyqr7i-aither-stack-technologies.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#674EBC] font-extrabold px-4 py-2.5 rounded-xl inline-flex items-center gap-2 hover:scale-105 transition-transform duration-200 group shadow-[0_4px_15px_rgba(103,78,188,0.25)]"
            >
              <span>Our Web</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <div className="pt-8 border-t border-accent/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm text-center sm:text-left">
            2024 AuraSEO. Built with precision.
          </p>
          <div className="flex items-center gap-2 text-sm flex-wrap justify-center">
            <span className="text-text-muted">Engineered by</span>
            <a 
              href="https://aitherstack-tech-5vteyqr7i-aither-stack-technologies.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent font-medium hover:underline transition-all duration-200"
            >
              Aither Stack Technologies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const Footer = memo(FooterComponent);