'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Project {
  id: number;
  title: string;
  category: string;
  client?: string;
  year?: string;
  description?: string;
  image_url?: string;
  video_url?: string;
  social_url?: string;
  platform?: string;
  size?: string;
  created_at?: string;
}

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [projects, setProjects] = useState<Project[]>([]);
  const categories = ['All', 'Social', 'Commercial', 'Voiceover', 'Acting'];

  useEffect(() => {
    const fetchProjects = async () => {
      const { data } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
      if (data) setProjects(data);
    };
    fetchProjects();
  }, []);

  const filteredProjects = filter === 'All' 
    ? projects 
    : projects.filter(p => p.category === filter);

  return (
    <section className="section portfolio-v3" id="portfolio">
      <div className="container">
        <div className="portfolio-header-v3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="portfolio-subtitle">selected works</span>
            <h2 className="display-lg mt-16">
              Crafting <br/> <span className="serif-italic text-gradient">Masterpieces</span>
            </h2>
          </motion.div>

          <div className="filter-pill-wrapper mt-48">
            {categories.map(cat => (
              <button 
                key={cat}
                className={`filter-pill ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="portfolio-bento-grid mt-80">
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project, i) => (
              <motion.div 
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.23, 1, 0.32, 1] }}
                viewport={{ once: true }}
                className={`bento-item ${project.size || 'medium'}`}
              >
                <Link href={`/portfolio/${project.id}`} className="bento-link">
                  <div className="bento-inner bento-card glass">
                    {project.image_url && (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        className="bento-img"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    )}
                    <div className="bento-overlay">
                      <div className="overlay-content">
                        <span className="p-cat">{project.category}</span>
                        <h4 className="p-title">{project.title}</h4>
                        <div className="p-view-more">
                          <span>View Project</span>
                          <div className="p-arrow">→</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <style jsx>{`
        .portfolio-header-v3 {
          text-align: center;
        }

        .portfolio-subtitle {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--accent);
        }

        .mt-16 { margin-top: 16px; }
        .mt-48 { margin-top: 48px; }
        .mt-80 { margin-top: 80px; }

        .filter-pill-wrapper {
          display: flex;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
        }

        .filter-pill {
          background: var(--glass);
          border: 1px solid var(--glass-border);
          padding: 12px 28px;
          border-radius: 99px;
          color: var(--muted);
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .filter-pill:hover {
          border-color: var(--glass-border);
          color: var(--fg);
          background: var(--glass);
        }

        .filter-pill.active {
          background: var(--fg);
          color: var(--bg);
          border-color: var(--fg);
          box-shadow: 0 10px 30px var(--glass-border);
        }

        .portfolio-bento-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-auto-rows: 320px;
          gap: 24px;
        }

        .bento-item.large { grid-column: span 2; grid-row: span 2; }
        .bento-item.medium { grid-column: span 2; grid-row: span 1; }
        .bento-item.small { grid-column: span 1; grid-row: span 1; }

        .bento-link {
          display: block;
          width: 100%;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }

        .bento-inner {
          position: relative;
          width: 100%;
          height: 100%;
          padding: 0;
          cursor: pointer;
          border-radius: 40px;
          overflow: hidden;
        }

        .bento-img {
          object-fit: cover;
          filter: grayscale(1) brightness(0.5);
          transition: all 1.2s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .bento-inner:hover .bento-img {
          filter: grayscale(0) brightness(0.7);
          transform: scale(1.1);
        }

        .bento-overlay {
          position: absolute;
          inset: 0;
          padding: 40px;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 70%);
          opacity: 0.7;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .bento-inner:hover .bento-overlay {
          opacity: 1;
          background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 50%);
        }

        .p-cat {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--accent);
          margin-bottom: 8px;
          display: block;
        }

        .p-title {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 900;
          line-height: 1.1;
          letter-spacing: -0.02em;
          color: white;
        }

        .p-view-more {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 24px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          color: white;
        }

        .bento-inner:hover .p-view-more {
          opacity: 1;
          transform: translateY(0);
        }

        .p-arrow {
          font-size: 1.2rem;
          color: var(--accent);
        }

        @media (max-width: 1024px) {
          .portfolio-bento-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .bento-inner { border-radius: 24px; }
        }

        @media (max-width: 768px) {
          .portfolio-bento-grid { grid-template-columns: 1fr; grid-auto-rows: 400px; gap: 20px; }
          .bento-item.large, .bento-item.medium, .bento-item.small { grid-column: span 1; grid-row: span 1; }
          .p-title { font-size: 1.5rem; }
          .p-view-more { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
