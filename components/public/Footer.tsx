'use client';

import { useSettings } from '@/hooks/useSettings';
import Link from 'next/link';

export default function Footer() {
  const { config, socials } = useSettings();

  return (
    <footer className="footer-large">
      <div className="container">
        <div className="footer-top">
          <h2 className="footer-big-brand">AKIRA<span className="dot">.</span></h2>
        </div>

        <div className="footer-middle mt-80">
          <div className="footer-cta-col">
            <h3 className="cta-heading">Ready to create<br/><span className="serif-italic">something legendary?</span></h3>
            <Link href="/booking" className="btn btn-primary mt-32">Book a Session</Link>
          </div>

          <div className="footer-links-grid">
            <div className="links-col">
              <span className="links-title">Explore</span>
              <ul className="footer-links-list">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/portfolio">Portfolio</Link></li>
                <li><Link href="/services">Services</Link></li>
                <li><Link href="/blog">Blog</Link></li>
              </ul>
            </div>

            <div className="links-col">
              <span className="links-title">Connect</span>
              <ul className="footer-links-list">
                <li><a href={`mailto:${config.email}`}>Email Inquiries</a></li>
                {socials.map((soc, i) => (
                  soc.platform && soc.url ? (
                    <li key={i}><a href={soc.url} target="_blank" rel="noopener noreferrer">{soc.platform}</a></li>
                  ) : null
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom mt-100">
          <div className="bottom-left">
            <p className="copyright">© {new Date().getFullYear()} AKIRA STUDIO. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="bottom-right">
            <div className="credit-badge glass">
              <span>DESIGNED BY</span>
              <span className="royal">ROYAL LABS</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .footer-large {
          padding: 180px 0 80px;
          border-top: 1px solid var(--glass-border);
          position: relative;
          background: linear-gradient(to bottom, transparent, rgba(255, 77, 0, 0.05));
          overflow: hidden;
        }

        .footer-big-brand {
          font-family: var(--font-display);
          font-size: clamp(4rem, 18vw, 16rem);
          font-weight: 900;
          line-height: 0.8;
          letter-spacing: -0.06em;
          text-transform: uppercase;
          color: var(--fg);
          text-align: center;
          opacity: 0.8;
          margin: 0;
          pointer-events: none;
        }

        .dot { color: var(--accent); }

        .footer-middle {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 120px;
          align-items: flex-start;
        }

        .cta-heading {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.02em;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
        }

        .links-title {
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--muted);
          display: block;
          margin-bottom: 32px;
        }

        .footer-links-list {
          list-style: none;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .footer-links-list a {
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--fg);
          transition: all 0.3s var(--ease);
          display: inline-block;
        }

        .footer-links-list a:hover {
          color: var(--accent);
          transform: translateX(8px);
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 60px;
          border-top: 1px solid var(--glass-border);
        }

        .copyright {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: var(--muted);
        }

        .credit-badge {
          padding: 10px 24px;
          border-radius: 99px;
          font-size: 0.65rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .credit-badge .royal {
          color: var(--accent);
        }

        .mt-32 { margin-top: 32px; }
        .mt-80 { margin-top: 80px; }
        .mt-100 { margin-top: 100px; }

        @media (max-width: 1200px) {
          .footer-middle { gap: 80px; }
        }

        @media (max-width: 1024px) {
          .footer-middle { grid-template-columns: 1fr; gap: 80px; }
          .footer-big-brand { font-size: 15vw; }
        }

        @media (max-width: 768px) {
          .footer-large { padding: 120px 0 60px; }
          .footer-big-brand { font-size: 20vw; text-align: left; }
          .footer-links-grid { gap: 40px; }
          .footer-bottom { flex-direction: column; gap: 40px; align-items: flex-start; }
          .cta-heading { font-size: 2.5rem; }
        }
      `}</style>
    </footer>
  );
}
