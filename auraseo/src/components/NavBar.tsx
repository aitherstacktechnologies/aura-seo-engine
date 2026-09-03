import { useState, useEffect, useRef, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, History, FileText, ArrowUpRight, Activity } from 'lucide-react';
import { MagneticButton } from '../lib/motion';
import logoImage from '../assets/logo.png';

interface NavBarProps {
  onHistoryClick: () => void;
  onExportClick: () => void;
  hasAudit: boolean;
}

const navItems = [
  { label: 'Home', href: '/', id: 'home' },
  { label: 'Features', href: '#features', id: 'features' },
  { label: 'How It Works', href: '#how-it-works', id: 'how' },
];

function NavBarComponent({ onHistoryClick, onExportClick, hasAudit }: NavBarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const handleNavClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (href.startsWith('#')) {
      setTimeout(() => {
        const target = document.querySelector(href);
        if (target) {
          const offset = 100;
          const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.location.href = href;
    }
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'w-[95%] max-w-5xl' 
          : 'w-[95%] max-w-6xl'
      }`}
    >
      <div 
        className={`relative glass-nav rounded-2xl border border-accent/20 transition-all duration-300 ${
          isScrolled 
            ? 'shadow-[0_8px_40px_rgba(103,78,188,0.2)]' 
            : 'shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
        }`}
      >
        <div className="relative px-4 sm:px-6 py-3 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group" onClick={closeMobileMenu}>
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <img 
                src={logoImage} 
                alt="AuraSEO Logo" 
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-contain"
                loading="eager"
                decoding="async"
              />
            </motion.div>
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="text-base sm:text-lg font-bold text-text-primary">Aura</span>
                <span className="text-base sm:text-lg font-extrabold text-accent">SEO</span>
              </div>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-1 relative">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className="relative px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
              >
                {hoveredItem === item.id && (
                  <motion.div
                    layoutId="navHover"
                    className="absolute inset-0 bg-accent/15 border border-accent/40 rounded-lg pointer-events-none"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/10 border border-success/20">
              <Activity className="w-3 h-3 text-success" />
              <span className="text-[10px] text-success font-semibold uppercase tracking-wider">API Active</span>
            </div>

            <MagneticButton
              href="https://aitherstack-tech-5vteyqr7i-aither-stack-technologies.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-[#674EBC] font-extrabold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:scale-105 transition-transform duration-200 group"
            >
              <span>Agency</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </MagneticButton>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onHistoryClick}
              className="btn-secondary p-2.5 rounded-xl text-sm"
              aria-label="View History"
              type="button"
            >
              <History className="w-4 h-4" />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onExportClick}
              disabled={!hasAudit}
              className="bg-white text-[#674EBC] font-extrabold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform duration-200"
              type="button"
            >
              <FileText className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden btn-secondary p-2 rounded-lg relative z-10"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            type="button"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileMenuOpen ? (
                <motion.div
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden border-t border-accent/20 overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-2 max-h-[calc(100vh-120px)] overflow-y-auto">
                {navItems.map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-accent/10 active:bg-accent/20 transition-colors duration-200 cursor-pointer select-none"
                  >
                    {item.label}
                  </a>
                ))}
                <a
                  href="https://aitherstack-tech-5vteyqr7i-aither-stack-technologies.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMobileMenu}
                  className="bg-white text-[#674EBC] font-extrabold px-4 py-3 rounded-xl text-sm flex items-center justify-between hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer select-none"
                >
                  <span>Official Agency</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setTimeout(() => onExportClick(), 150);
                  }}
                  disabled={!hasAudit}
                  className="bg-white text-[#674EBC] font-extrabold w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-40 mt-2 hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer select-none"
                  type="button"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export PDF</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeMobileMenu}
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
            style={{ top: '80px' }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

export const NavBar = memo(NavBarComponent);