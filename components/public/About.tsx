'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Award, Users, Target, BookOpen, Mic2, Star } from 'lucide-react';

export default function About() {
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  return (
    <section className="section about-v3" id="about">
      <div className="container">
        <div className="about-wrapper-v3">
          <div className="about-content-v3">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <span className="about-subtitle">The Artistry</span>
              <h2 className="display-lg mt-16">
                Voices that <br /> <span className="serif-italic text-gradient">Resonate</span>.
              </h2>
              <p className="mt-40 text-muted leading-relaxed text-lg">
                Akira is not just a voice; he is an experience. Based in Addis Ababa, he bridges the gap between traditional performance and modern digital influence, crafting narratives that command attention.
              </p>

              <p className="mt-24 text-muted leading-relaxed text-lg">
                With a decade of mastery in audio-visual storytelling, every project is treated as a masterpiece, meticulously designed to leave a lasting impact on audiences globally.
              </p>

              <div className="about-stats-v3 mt-60">
                <div className="stat-item-v3 glass">
                  <span className="stat-v">1.2M+</span>
                  <span className="stat-l">Community Accross Platforms</span>
                </div>
                <div className="stat-item-v3 glass">
                  <span className="stat-v">10+</span>
                  <span className="stat-l">Industry Certificate and Recognitions</span>
                </div>
              </div>

              <div className="about-action mt-60">
                <button
                  className="btn btn-primary"
                  onClick={() => setIsStoryOpen(true)}
                >
                  Read Full Story
                </button>
              </div>
            </motion.div>
          </div>

          <div className="about-image-sticky">
            <motion.div
              className="about-image-v3"
              initial={{ opacity: 0, scale: 1.1 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="img-reveal glass">
                <Image
                  src="/founder.png"
                  alt="Akira Performance"
                  fill
                  className="story-img"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="img-overlay-v3" />
              </div>
              <div className="floating-badge glass">
                <span className="badge-year">EST. 2018</span>
                <span className="badge-text">Performance Artist</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Detailed Story Popup */}
      <AnimatePresence>
        {isStoryOpen && (
          <motion.div
            className="story-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-backdrop" onClick={() => setIsStoryOpen(false)} />

            <motion.div
              className="story-modal-content glass"
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <button
                className="modal-close-v3"
                onClick={() => setIsStoryOpen(false)}
                aria-label="Close Story"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="modal-scroll-area">
                <div className="modal-inner">
                  <div className="modal-header">
                    <span className="modal-label">Legacy & Journey</span>
                    <h2 className="display-md mt-16">The Evolution of <span className="serif-italic">Akira</span></h2>
                  </div>

                  <div className="modal-grid mt-60">
                    <div className="modal-main-text">
                      <section className="story-section">
                        <div className="section-header">
                          <BookOpen className="w-5 h-5 text-accent" />
                          <h3>The Origin</h3>
                        </div>
                        <p className="mt-16 text-muted">
                          Born and raised in the vibrant heart of Addis Ababa, Akira&apos;s journey began on the stages of the National Theatre. What started as a passion for classical performance quickly evolved into a fascination with the power of the human voice.
                        </p>
                      </section>

                      <section className="story-section mt-48">
                        <div className="section-header">
                          <Mic2 className="w-5 h-5 text-accent" />
                          <h3>The Voice Artistry</h3>
                        </div>
                        <p className="mt-16 text-muted">
                          Akira has voiced some of the most iconic campaigns in East Africa, from Safaricom to Coca-Cola. His philosophy is simple: every brand has a soul, and every soul has a unique resonance. He doesn&apos;t just read scripts; he breathes life into brand identities.
                        </p>
                      </section>

                      <section className="story-section mt-48">
                        <div className="section-header">
                          <Target className="w-5 h-5 text-accent" />
                          <h3>The Vision</h3>
                        </div>
                        <p className="mt-16 text-muted">
                          As the founder of his own creative production house, Akira&apos;s mission is to elevate Ethiopian talent to a global stage. He blends traditional Ethiopian storytelling with modern cinematic techniques to create a bridge between cultures.
                        </p>
                      </section>
                    </div>

                    <div className="modal-sidebar">
                      <div className="founder-card glass">
                        <div className="founder-img-wrap">
                          <Image
                            src="/founder.png"
                            alt="The Founder"
                            width={150}
                            height={150}
                            className="founder-img"
                          />
                        </div>
                        <h4 className="mt-20">The Founder</h4>
                        <p className="text-sm text-accent font-bold mt-4 uppercase tracking-widest">Akira Akuna</p>
                        <div className="founder-achievements mt-24">
                          <div className="achieve-item">
                            <Award className="w-4 h-4" />
                            <span>Actor of the Year 2024</span>
                          </div>
                          <div className="achieve-item">
                            <Users className="w-4 h-4" />
                            <span>1.2M+ Global Following</span>
                          </div>
                          <div className="achieve-item">
                            <Star className="w-4 h-4" />
                            <span>Strategic Brand Partner</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .about-subtitle {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--accent);
        }

        .about-wrapper-v3 {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 100px;
          align-items: start;
        }

        .about-image-sticky {
          position: sticky;
          top: 140px;
        }

        .about-image-v3 {
          position: relative;
          will-change: transform, opacity;
        }

        .img-reveal {
          width: 100%;
          aspect-ratio: 0.85;
          border-radius: 40px;
          overflow: hidden;
          position: relative;
          border: 1px solid var(--glass-border);
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          transform: translateZ(0);
        }

        .story-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(0.2) contrast(1.1) brightness(0.8);
          transition: transform 1.5s ease;
          backface-visibility: hidden;
        }

        .about-image-v3:hover .story-img {
          transform: scale(1.05);
        }

        .img-overlay-v3 {
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.4));
        }

        .floating-badge {
          position: absolute;
          bottom: -30px;
          left: -30px;
          background: var(--bg);
          color: var(--fg);
          padding: 24px 32px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
          border: 1px solid var(--glass-border);
          z-index: 2;
          transform: translateZ(0);
          backface-visibility: hidden;
          pointer-events: none;
        }

        .badge-year {
          font-size: 0.65rem;
          font-weight: 900;
          opacity: 0.5;
          letter-spacing: 0.1em;
        }

        .badge-text {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          margin-top: 4px;
        }

        .stat-v {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 900;
          display: block;
          letter-spacing: -0.02em;
        }

        .stat-l {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
        }

        .stat-item-v3 {
          padding: 32px;
          border-radius: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
        }

        .about-stats-v3 {
          display: flex;
          gap: 24px;
        }

        /* ═══════════════════════════════════════════
           MODAL STYLES
        ═══════════════════════════════════════════ */
        .story-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .modal-backdrop {
          position: absolute;
          inset: 0;
          background: var(--bg);
          opacity: 0.95;
          backdrop-filter: blur(20px);
        }

        .story-modal-content {
          position: relative;
          width: 100%;
          max-width: 1000px;
          max-height: 85vh;
          border-radius: 40px;
          overflow: hidden;
          background: var(--bg);
          border: 1px solid var(--glass-border);
          box-shadow: 0 40px 100px rgba(0,0,0,0.2);
        }

        .modal-close-v3 {
          position: absolute;
          top: 30px;
          right: 30px;
          width: 50px;
          height: 50px;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 50%;
          color: var(--fg);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.3s ease;
        }

        .modal-close-v3:hover {
          background: var(--fg);
          color: var(--bg);
          transform: rotate(90deg);
        }

        .modal-scroll-area {
          height: 100%;
          overflow-y: auto;
          padding: 80px;
        }

        .modal-scroll-area::-webkit-scrollbar {
          width: 4px;
        }

        .modal-scroll-area::-webkit-scrollbar-thumb {
          background: var(--accent);
          border-radius: 10px;
        }

        .modal-label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--accent);
        }

        .modal-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 80px;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .section-header h3 {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
        }

        .story-section p {
          font-size: 1.1rem;
          line-height: 1.8;
        }

        .founder-card {
          padding: 40px;
          border-radius: 32px;
          text-align: center;
          position: sticky;
          top: 0;
        }

        .founder-img-wrap {
          width: 150px;
          height: 150px;
          border-radius: 30px;
          overflow: hidden;
          margin: 0 auto;
          border: 1px solid var(--glass-border);
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }

        .founder-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .founder-achievements {
          display: flex;
          flex-direction: column;
          gap: 16px;
          text-align: left;
        }

        .achieve-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--muted);
        }

        .achieve-item span {
          color: var(--fg);
        }

        .mt-8 { margin-top: 8px; }
        .mt-16 { margin-top: 16px; }
        .mt-20 { margin-top: 20px; }
        .mt-24 { margin-top: 24px; }
        .mt-32 { margin-top: 32px; }
        .mt-40 { margin-top: 40px; }
        .mt-48 { margin-top: 48px; }
        .mt-60 { margin-top: 60px; }

        @media (max-width: 1024px) {
          .about-wrapper-v3 { grid-template-columns: 1fr; gap: 80px; }
          .about-content-v3 { text-align: center; }
          .about-stats-v3 { justify-content: center; }
          .modal-grid { grid-template-columns: 1fr; gap: 60px; }
          .modal-scroll-area { padding: 60px 40px; }
        }

        @media (max-width: 768px) {
          .story-modal-overlay { padding: 20px; }
          .story-modal-content { max-height: 90vh; }
          .modal-scroll-area { padding: 60px 24px; }
          .display-md { font-size: 2.2rem; }
          .about-stats-v3 { flex-direction: column; gap: 16px; }
          .stat-item-v3 { padding: 24px; align-items: center; text-align: center; }
          .stat-v { font-size: 2rem; }
          .floating-badge { display: none; }
        }
      `}</style>
    </section>
  );
}
