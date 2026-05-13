'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Sun, Moon, Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/services', label: 'Services' },
  { href: '/booking', label: 'Booking' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mounted]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className={`site-nav${scrolled ? ' scrolled' : ''}`}>
      <div className="container nav-inner">
        {/* Logo */}
        <Link href="/" className="nav-logo">
          AKIRA<span className="nav-logo-dot">.</span>
        </Link>

        {/* Desktop links & Theme Toggle */}
        <div className="nav-links">
          {NAV_LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="nav-link">
              {label}
            </Link>
          ))}
          {mounted && (
            <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}
        </div>

        {/* Desktop CTA */}
        <div className="nav-actions">
          <Link href="/booking" className="nav-book-btn">
            Book Now
          </Link>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            title={menuOpen ? "Close Menu" : "Open Menu"}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Backdrop */}
      <div className={`nav-overlay ${menuOpen ? 'show' : ''}`} onClick={() => setMenuOpen(false)} />

      {/* Mobile dropdown */}
      <div className={`nav-mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            AKIRA<span className="nav-logo-dot">.</span>
          </Link>
          <button 
            className="nav-close" 
            onClick={() => setMenuOpen(false)}
            aria-label="Close Menu"
            title="Close Menu"
          >
            <X size={24} />
          </button>
        </div>

        <div className="nav-mobile-inner">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="nav-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
          <div className="nav-mobile-footer">
            {mounted && (
              <button className="theme-toggle-mobile" onClick={toggleTheme}>
                {theme === 'dark' ? <><Sun size={18} /> Light Mode</> : <><Moon size={18} /> Dark Mode</>}
              </button>
            )}
            <Link href="/booking" className="nav-book-btn w-full text-center" onClick={() => setMenuOpen(false)}>
              Book Now
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-actions { display: flex; align-items: center; gap: 16px; }
        .theme-toggle {
          background: none;
          border: none;
          color: var(--muted);
          cursor: pointer;
          padding: 8px;
          border-radius: 50%;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .theme-toggle:hover { color: var(--fg); background: var(--glass); }

        .nav-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .nav-overlay.show { opacity: 1; pointer-events: auto; }

        .nav-mobile-menu {
          position: fixed;
          top: 0;
          right: -100%;
          width: 85%;
          max-width: 400px;
          height: 100vh;
          background: var(--bg);
          z-index: 10000;
          transition: right 0.5s var(--ease);
          box-shadow: -20px 0 60px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          padding: 32px;
        }
        .nav-mobile-menu.open { right: 0; }

        .mobile-menu-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 60px;
        }
        .nav-close {
          background: none;
          border: none;
          color: var(--fg);
          cursor: pointer;
        }

        .nav-mobile-inner { display: flex; flex-direction: column; gap: 20px; flex: 1; }
        .nav-mobile-link { 
          font-size: 2.5rem; 
          font-weight: 900; 
          text-transform: uppercase; 
          letter-spacing: -0.04em;
          color: var(--fg);
          transition: transform 0.3s ease;
        }
        .nav-mobile-link:hover { transform: translateX(10px); color: var(--accent); }
        
        .nav-mobile-footer { 
          margin-top: auto; 
          padding-top: 40px;
          display: flex; 
          flex-direction: column; 
          gap: 16px; 
        }
        .theme-toggle-mobile {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          padding: 16px 24px;
          border-radius: 16px;
          color: var(--fg);
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .w-full { width: 100%; }
        .text-center { justify-content: center; }
      `}</style>
    </nav>
  );
}
