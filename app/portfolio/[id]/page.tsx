'use client';

import { use, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Calendar, User, Clapperboard, Camera, Loader2 } from 'lucide-react';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

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
  role?: string;
  deliverables?: string;
}

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [project, setProject] = useState<Project | null>(null);
  const [nextProject, setNextProject] = useState<{id: number, title: string} | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      const { data, error } = await supabase.from('portfolio').select('*').eq('id', id).single();
      if (error || !data) {
        setLoading(false);
        return; // Next.js notFound() works best outside async effects, but we can handle UI empty state
      }
      setProject(data);

      const { data: allProjects } = await supabase.from('portfolio').select('id, title').order('created_at', { ascending: false });
      if (allProjects && allProjects.length > 0) {
        const currentIndex = allProjects.findIndex(p => p.id === parseInt(id));
        if (currentIndex !== -1) {
          const nextIndex = currentIndex === allProjects.length - 1 ? 0 : currentIndex + 1;
          setNextProject(allProjects[nextIndex]);
        }
      }
      setLoading(false);
    }
    fetchProject();
  }, [id]);

  if (loading) return (
    <main className="project-detail-v3">
      <Navbar />
      <div className="h-screen flex-center"><Loader2 className="w-8 h-8 animate-spin text-accent" /></div>
    </main>
  );

  if (!project) return notFound();

  const hasSocial = !!project.platform && project.platform !== 'none';

  return (
    <main className="project-detail-v3">
      <Navbar />

      {/* Clean Hero */}
      <section className="project-hero">
        <div className="container hero-container">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/portfolio" className="back-link group">
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>All Projects</span>
            </Link>

            {hasSocial && (
              <div className="platform-badge mt-24">
                {project.platform === 'tiktok' && <span>TikTok</span>}
                {project.platform === 'instagram' && <span>Instagram</span>}
                {project.platform === 'youtube' && <span>YouTube</span>}
              </div>
            )}

            <h1 className="display-lg project-title mt-24">
              {project.title}
            </h1>

            <div className="project-meta mt-40">
              <div className="meta-item">
                <Clapperboard className="w-4 h-4 text-accent" />
                <span>{project.category}</span>
              </div>
              <div className="meta-item">
                <User className="w-4 h-4 text-accent" />
                <span>{project.client || 'Personal Project'}</span>
              </div>
              <div className="meta-item">
                <Calendar className="w-4 h-4 text-accent" />
                <span>{project.year}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Content */}
      <section className="project-content section">
        <div className="container">
          <div className="content-grid">
            {/* Left: Description + Details */}
            <motion.div
              className="content-left"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="section-title">The <span className="serif-italic">Vision</span></h2>
              <p className="project-desc mt-32">{project.description}</p>

              <div className="details-list mt-60">
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-val">{project.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Role</span>
                  <span className="detail-val">{project.role || 'Creative & Performance'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Deliverables</span>
                  <span className="detail-val">{project.deliverables || 'Visual & Audio Content'}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Year</span>
                  <span className="detail-val">{project.year}</span>
                </div>
              </div>

              {hasSocial && project.social_url && (
                <a
                  href={project.social_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline mt-48 group"
                >
                  {project.platform === 'instagram' ? (
                    <Camera className="w-4 h-4 mr-2" />
                  ) : (
                    <ExternalLink className="w-4 h-4 mr-2" />
                  )}
                  View Original Post
                </a>
              )}
            </motion.div>

            {/* Right: Social Embed or Visual */}
            <motion.div
              className="content-right"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {hasSocial && project.video_url ? (
                <div className="social-embed-wrapper">
                  <div className="embed-header">
                    <span className="embed-label">
                      {project.platform} Feature
                    </span>
                    {project.social_url && (
                      <a
                        href={project.social_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="embed-visit"
                        aria-label="Visit social profile"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {project.platform === 'tiktok' && (
                    <div className="tiktok-profile-embed">
                      <iframe
                        src={project.video_url}
                        className="social-iframe"
                        allow="encrypted-media"
                        title="TikTok Video"
                      />
                    </div>
                  )}

                  {project.platform === 'instagram' && (
                    <div className="instagram-profile-embed">
                      <div className="ig-card glass">
                        {project.image_url && (
                          <Image
                            src={project.image_url}
                            alt="Instagram Preview"
                            width={400}
                            height={400}
                            className="ig-preview-img"
                          />
                        )}
                        <div className="ig-overlay">
                          <Camera className="w-8 h-8 mb-16" />
                          <a
                            href={project.social_url || project.video_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary mt-24"
                          >
                            View on Instagram
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="project-visual-card glass">
                  {project.image_url && (
                    <Image
                      src={project.image_url}
                      alt="Detail view"
                      width={800}
                      height={1000}
                      className="detail-visual-img"
                    />
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Next Project */}
      {nextProject && (
        <section className="next-project section">
          <div className="container">
            <div className="next-wrapper glass">
              <span className="next-label">Next Project</span>
              <Link href={`/portfolio/${nextProject.id}`} className="next-title-link">
                <h2 className="next-title display-lg">{nextProject.title} ↗</h2>
              </Link>
            </div>
          </div>
        </section>
      )}

      <Footer />

      <style jsx>{`
        .project-hero {
          position: relative;
          display: flex;
          align-items: flex-end;
          padding-top: 150px;
          padding-bottom: 60px;
          border-bottom: 1px solid var(--glass-border);
        }

        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .back-link {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .back-link:hover { color: white; }

        .platform-badge {
          display: inline-block;
          padding: 6px 16px;
          background: var(--accent);
          color: white;
          font-size: 0.65rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border-radius: 99px;
        }

        .project-title {
          font-size: clamp(3rem, 8vw, 8rem);
          max-width: 900px;
        }

        .project-meta {
          display: flex;
          gap: 48px;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
        }

        .content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 120px;
          align-items: start;
        }

        .section-title {
          font-family: var(--font-display);
          font-size: 2.5rem;
          font-weight: 800;
        }

        .project-desc {
          font-size: 1.2rem;
          line-height: 1.8;
          color: var(--muted);
        }

        .details-list {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--glass-border);
        }

        .detail-label {
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--muted);
        }

        .detail-val {
          font-size: 0.95rem;
          font-weight: 600;
        }

        .project-visual-card {
          border-radius: 40px;
          overflow: hidden;
        }

        .detail-visual-img {
          width: 100%;
          height: auto;
          display: block;
        }

        /* Social Embed */
        .social-embed-wrapper {
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.02);
        }

        .embed-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 28px;
          border-bottom: 1px solid var(--glass-border);
        }

        .embed-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
        }

        .embed-visit {
          color: var(--muted);
          transition: color 0.3s;
        }

        .embed-visit:hover { color: var(--accent); }

        .tiktok-profile-embed {
          width: 100%;
          aspect-ratio: 9/16;
          max-height: 700px;
        }

        .social-iframe {
          width: 100%;
          height: 100%;
          border: none;
        }

        /* Instagram card fallback */
        .ig-card {
          position: relative;
          overflow: hidden;
          border-radius: 0;
          aspect-ratio: 1;
        }

        .ig-preview-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.4);
        }

        .ig-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .ig-handle {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 800;
        }

        /* Next Project */
        .next-wrapper {
          padding: 120px 80px;
          border-radius: 60px;
          text-align: center;
          transition: all 0.6s var(--ease);
        }

        .next-wrapper:hover {
          background: rgba(255, 77, 0, 0.05);
          border-color: var(--accent);
        }

        .next-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: var(--accent);
          display: block;
          margin-bottom: 32px;
        }

        .next-title-link {
          text-decoration: none;
          color: inherit;
        }

        .next-wrapper:hover .next-title { color: var(--accent); }

        .mt-24 { margin-top: 24px; }
        .mt-32 { margin-top: 32px; }
        .mt-40 { margin-top: 40px; }
        .mt-48 { margin-top: 48px; }
        .mt-60 { margin-top: 60px; }
        .mr-2 { margin-right: 8px; }
        .mb-16 { margin-bottom: 16px; }

        @media (max-width: 1024px) {
          .content-grid { grid-template-columns: 1fr; gap: 80px; }
          .project-hero { height: 80vh; min-height: 600px; }
          .project-meta { gap: 24px; }
          .next-wrapper { padding: 80px 40px; }
        }

        @media (max-width: 768px) {
          .project-title { font-size: 3rem; }
        }
      `}</style>
    </main>
  );
}
