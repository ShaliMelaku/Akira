'use client';

import { useState, useEffect } from 'react';
import { ArrowUp, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

export default function GlobalUI() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress">
        <div className="scroll-bar" />
      </div>

      {/* Floating Actions */}
      <div className="floating-actions">
        {mounted && (
          <button 
            className="action-btn glass" 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        <button 
          className={`action-btn glass scroll-top ${showScrollTop ? 'visible' : ''}`}
          onClick={scrollToTop}
          aria-label="Scroll to Top"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          z-index: 100000;
        }
        .scroll-bar {
          height: 100%;
          background: var(--accent);
          width: ${scrollProgress}%;
          transition: width 0.1s ease;
        }
        .floating-actions {
          position: fixed;
          bottom: 40px;
          right: 40px;
          display: flex;
          flex-direction: column;
          gap: 16px;
          z-index: 99999;
        }

        .action-btn {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fg);
          background: var(--glass);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          border: 1px solid var(--glass-border);
        }

        .action-btn:hover {
          background: var(--accent);
          border-color: var(--accent);
          color: white;
          transform: translateY(-5px);
          box-shadow: 0 10px 20px var(--accent-soft);
        }

        .scroll-top {
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
        }

        .scroll-top.visible {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .floating-actions {
            bottom: 24px;
            right: 24px;
            gap: 12px;
          }
          .action-btn {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </>
  );
}
