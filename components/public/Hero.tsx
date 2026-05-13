'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="hero-v3">
      {/* Abstract Background Element */}
      <div className="hero-background-noise" />
      <div className="hero-accent-blur" />

      <div className="container">
        <div className="hero-wrapper">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="hero-badge">
              <span className="badge-dot" />
              <span>Available for Global Projects</span>
            </div>

            <h1 className="hero-title mt-24">
              AKIRA
            </h1>
            <h2 className="hero-subtitle text-gradient-hero">The Voice.</h2>

            <p className="hero-desc mt-40">
              Capturing the raw essence of character through elite voice artistry, performance, and strategic creative influence.
            </p>

            <div className="hero-cta mt-60">
              <Link href="/portfolio" className="btn btn-primary group" style={{ textDecoration: 'none' }}>
                View Portfolio
                <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="portrait-container">
              <Image
                src="/founder.png"
                alt="Akira"
                fill
                className="portrait-img"
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="portrait-overlay" />
            </div>

            {/* Floating Stats */}
            <motion.div
              className="floating-stat top-left"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="stat-content glass">
                <span className="stat-val">7+</span>
                <span className="stat-label">Years<br />Experience</span>
              </div>
            </motion.div>

            <motion.div
              className="floating-stat bottom-right"
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="stat-content glass">
                <span className="stat-val">500+</span>
                <span className="stat-label">Projects<br />Completed</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .hero-v3 {
          min-height: 100vh;
          position: relative;
          display: flex;
          align-items: center;
          padding: 200px 0 140px;
          z-index: 2;
          overflow: hidden;
          background: var(--bg);
        }

        .hero-background-noise {
          position: absolute;
          inset: 0;
          background-image: url("https://www.transparenttextures.com/patterns/carbon-fibre.png");
          opacity: 0.03;
          pointer-events: none;
        }

        .hero-accent-blur {
          position: absolute;
          top: -10%;
          right: -10%;
          width: 50%;
          height: 50%;
          background: radial-gradient(circle, rgba(255, 77, 0, 0.1) 0%, transparent 70%);
          filter: blur(100px);
          pointer-events: none;
        }

        .hero-wrapper {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          align-items: center;
          gap: 60px;
        }

        .hero-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
          z-index: 10;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 16px;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 99px;
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--muted);
        }

        .badge-dot {
          width: 6px;
          height: 6px;
          background: #4CAF50;
          border-radius: 50%;
          box-shadow: 0 0 10px #4CAF50;
        }

        .hero-title {
          font-size: clamp(4rem, 15vw, 12rem);
          font-weight: 900;
          line-height: 0.85;
          letter-spacing: -0.05em;
          text-transform: uppercase;
        }

        .hero-subtitle {
          font-family: var(--font-serif);
          font-size: clamp(2rem, 8vw, 6rem);
          font-weight: 400;
          font-style: italic;
          line-height: 1;
          margin-top: -10px;
        }

        .text-gradient-hero {
          background: linear-gradient(to right, var(--fg) 30%, var(--muted) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-desc {
          font-size: 1.25rem;
          color: var(--muted);
          line-height: 1.7;
          max-width: 520px;
        }

        .hero-cta {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 24px;
          flex-wrap: wrap;
        }

        .hero-visual {
          width: 100%;
          position: relative;
        }

        .portrait-container {
          width: 100%;
          aspect-ratio: 4/5;
          border-radius: 40px;
          overflow: hidden;
          position: relative;
          background: var(--bg);
          border: 1px solid var(--glass-border);
          box-shadow: 0 30px 80px rgba(0,0,0,0.3);
        }

        .portrait-img {
          object-fit: cover;
          object-position: center 20%;
          filter: grayscale(1) brightness(0.8) contrast(1.1);
          transition: all 1.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .hero-visual:hover .portrait-img {
          filter: grayscale(0.2) brightness(1);
          transform: scale(1.05);
        }

        .portrait-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, var(--bg) 0%, transparent 60%);
        }

        .floating-stat {
          position: absolute;
          z-index: 5;
        }

        .stat-content {
          padding: 16px 24px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          gap: 16px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }

        .top-left {
          top: -20px;
          left: -40px;
        }

        .bottom-right {
          bottom: -20px;
          right: -40px;
        }

        .stat-val {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          color: var(--accent);
          line-height: 1;
        }

        .stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--fg);
          font-weight: 700;
          line-height: 1.3;
          text-align: left;
        }

        .scroll-indicator {
          position: absolute;
          bottom: 60px;
          right: 80px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .line {
          width: 1px;
          height: 80px;
          background: linear-gradient(to bottom, var(--accent), transparent);
        }

        .scroll-indicator span {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          writing-mode: vertical-lr;
          color: var(--muted);
          font-weight: 700;
        }

        .mt-24 { margin-top: 24px; }
        .mt-40 { margin-top: 40px; }
        .mt-60 { margin-top: 60px; }
        .mt-80 { margin-top: 80px; }
        .ml-3 { margin-left: 12px; }
        .mr-3 { margin-right: 12px; }

        @media (max-width: 1024px) {
          .hero-wrapper { grid-template-columns: 1fr; text-align: center; gap: 80px; }
          .hero-content { align-items: center; }
          .hero-cta { justify-content: center; }
          .stat-content { padding: 12px 20px; }
          .stat-val { font-size: 1.5rem; }
          .top-left { top: -10px; left: 0; }
          .bottom-right { bottom: -10px; right: 0; }
        }

        @media (max-width: 768px) {
          .hero-v3 { padding: 120px 0 60px; }
          .hero-title { font-size: clamp(2.5rem, 15vw, 6rem); line-height: 0.85; }
          .hero-subtitle { font-size: 2rem; }
          .hero-desc { font-size: 0.95rem; margin-top: 20px; }
          .hero-cta { flex-direction: column; width: 100%; gap: 12px; margin-top: 24px; }
          .hero-cta .btn { width: 100%; justify-content: center; }
          .top-left { left: 16px; top: -16px; }
          .bottom-right { right: 16px; bottom: -16px; }
          .stat-content { padding: 6px 12px; gap: 6px; }
          .stat-val { font-size: 1rem; }
          .stat-label { font-size: 0.5rem; }
        }

        @media (max-width: 480px) {
          .hero-title { font-size: clamp(2rem, 12vw, 4rem); }
          .top-left, .bottom-right { position: static; margin-top: 10px; width: fit-content; }
          .hero-visual { display: flex; flex-direction: column; align-items: center; }
          .img-reveal { aspect-ratio: 1; }
        }
      `}</style>
    </section>
  );
}
