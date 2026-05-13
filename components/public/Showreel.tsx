'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X } from 'lucide-react';
import Image from 'next/image';

export default function Showreel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="showreel-v3 section" id="showreel">
      <div className="container">
        <motion.div
          className="showreel-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="showreel-main glass">
            <Image 
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1600&q=80"
              alt="Showreel Preview"
              fill
              className="showreel-preview-img"
            />
            <div className="showreel-overlay-v3">
              <div className="showreel-content">
                <span className="showreel-label">the highlight</span>
                <h2 className="display-lg showreel-title mt-16">experience <br/> <span className="serif-italic">the magic</span></h2>
                
                <button 
                  className="play-btn-v3 mt-40"
                  onClick={() => setIsOpen(true)}
                  aria-label="Play showreel"
                >
                  <div className="play-pulse" />
                  <Play className="w-6 h-6 fill-current" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Video Modal Placeholder */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="video-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="modal-backdrop" onClick={() => setIsOpen(false)} />
            <motion.div 
              className="modal-content glass"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <button className="modal-close" onClick={() => setIsOpen(false)} aria-label="Close modal">
                <X className="w-6 h-6" />
              </button>
              <div className="video-placeholder">
                <div className="v-icon">🎥</div>
                <h3>Showreel Coming Soon</h3>
                <p>Currently rendering the 2026 Director&apos;s Cut.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .showreel-v3 {
          padding-top: 0;
        }

        .showreel-container {
          position: relative;
          width: 100%;
          height: 70vh;
          min-height: 500px;
          border-radius: 60px;
          overflow: hidden;
          box-shadow: 0 50px 100px rgba(0,0,0,0.5);
        }

        .showreel-main {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .showreel-preview-img {
          object-fit: cover;
          filter: grayscale(1) brightness(0.4);
          transition: all 1.5s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .showreel-container:hover .showreel-preview-img {
          filter: grayscale(0.5) brightness(0.5);
          transform: scale(1.05);
        }

        .showreel-overlay-v3 {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          background: radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.4) 100%);
        }

        .showreel-label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: var(--accent);
        }

        .showreel-title {
          text-transform: uppercase;
          line-height: 0.9;
        }

        .play-btn-v3 {
          width: 100px;
          height: 100px;
          background: white;
          color: black;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
          box-shadow: 0 0 40px rgba(255,255,255,0.2);
        }

        .play-btn-v3:hover {
          transform: scale(1.15);
          box-shadow: 0 0 60px rgba(255,255,255,0.4);
        }

        .play-pulse {
          position: absolute;
          inset: -10px;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 50%;
          animation: pulse-ring 2s infinite;
        }

        @keyframes pulse-ring {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(1.3); opacity: 0; }
        }

        /* Modal Styles */
        .video-modal {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
        }

        .modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.95);
          backdrop-filter: blur(20px);
        }

        .modal-content {
          position: relative;
          width: 100%;
          max-width: 1000px;
          aspect-ratio: 16/9;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--glass-border);
          overflow: hidden;
        }

        .modal-close {
          position: absolute;
          top: 32px;
          right: 32px;
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        .modal-close:hover {
          background: var(--accent);
          transform: rotate(90deg);
        }

        .video-placeholder {
          text-align: center;
        }

        .v-icon {
          font-size: 4rem;
          margin-bottom: 24px;
        }

        .video-placeholder h3 {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          margin-bottom: 12px;
        }

        .video-placeholder p {
          color: var(--muted);
          font-size: 1.1rem;
        }

        .mt-16 { margin-top: 16px; }
        .mt-40 { margin-top: 40px; }

        @media (max-width: 768px) {
          .showreel-container { height: 40vh; min-height: 300px; border-radius: 40px; }
          .play-btn-v3 { width: 70px; height: 70px; }
          .showreel-title { font-size: 2.2rem; }
          .modal-content { border-radius: 24px; padding: 20px; }
          .modal-close { top: 16px; right: 16px; width: 40px; height: 40px; }
        }
      `}</style>
    </section>
  );
}
