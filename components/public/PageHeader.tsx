'use client';

import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  italic?: string;
  subtitle: string;
  desc: string;
}

export default function PageHeader({ title, italic, subtitle, desc }: PageHeaderProps) {
  return (
    <section className="page-header-v3">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="header-content-v3"
        >
          <span className="header-subtitle">{subtitle}</span>
          <h1 className="display-lg mt-24">
            {title} {italic && <span className="serif-italic text-gradient">{italic}</span>}
          </h1>
          <p className="header-desc mt-32">{desc}</p>
        </motion.div>
      </div>

      <div className="header-glow" />

      <style jsx>{`
        .page-header-v3 {
          padding: 220px 0 100px;
          position: relative;
          overflow: hidden;
          text-align: center;
        }

        .header-subtitle {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: var(--accent);
        }

        .header-desc {
          font-size: 1.2rem;
          color: var(--muted);
          line-height: 1.7;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .header-glow {
          position: absolute;
          top: -20%;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 100%;
          background: radial-gradient(circle, rgba(255, 77, 0, 0.08) 0%, transparent 70%);
          z-index: -1;
          filter: blur(80px);
        }

        .mt-24 { margin-top: 24px; }
        .mt-32 { margin-top: 32px; }
      `}</style>
    </section>
  );
}
