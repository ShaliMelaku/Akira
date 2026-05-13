'use client';

import { useState, useEffect, use } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Calendar, Link as LinkIcon, Loader2, Share2, MessageCircle, Clock, Eye, Play, X, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

type Post = {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  image_url: string;
  video_url?: string;
  related_link?: string;
  published_at: string;
  views: number;
};

// Helper to handle video embedding
function getEmbedUrl(url: string) {
  if (!url) return null;
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
    return `https://www.youtube.com/embed/${id}?autoplay=1`;
  }
  if (url.includes('vimeo.com')) {
    const id = url.split('/').pop();
    return `https://player.vimeo.com/video/${id}?autoplay=1`;
  }
  return url; // Fallback for direct links or other platforms
}

export default function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    async function fetchPost() {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (data) {
        setPost(data);
        await supabase.from('blogs').update({ views: (data.views || 0) + 1 }).eq('id', data.id);
      }
      setLoading(false);
    }
    fetchPost();
  }, [resolvedParams.id]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="loader-wrapper">
        <Loader2 className="animate-spin text-accent" size={48} />
        <span className="loader-text mt-16">Syncing Insight...</span>
      </div>
      <style jsx>{`
        .loader-wrapper { display: flex; flex-direction: column; align-items: center; }
        .loader-text { font-family: var(--font-display); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em; color: var(--accent); }
      `}</style>
    </div>
  );

  if (!post) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-24">
      <h1 className="display-md">404 <span className="serif-italic text-gradient">Missing</span></h1>
      <p className="text-muted mt-16">The article you are looking for has been purged or moved.</p>
      <Link href="/blog" className="btn btn-primary mt-32">Back to Blog</Link>
    </div>
  );

  const embedUrl = getEmbedUrl(post.video_url || '');

  return (
    <main className="post-page-ultra">
      <motion.div className="scroll-indicator" style={{ scaleX }} />
      <Navbar />
      
      {/* Cinematic Hero */}
      <section className="ultra-hero">
        <motion.div 
          className="hero-bg-container"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
        >
          <Image 
            src={post.image_url || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc'} 
            alt={post.title}
            fill
            className="hero-img-parallax"
            priority
          />
          <div className="hero-gradient-overlay" />
        </motion.div>

        <div className="container hero-content">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Link href="/blog" className="back-breadcrumb group">
              <ChevronLeft size={16} className="transition-transform group-hover:-translate-x-1" />
              <span className="text">Insight Feed</span>
            </Link>

            <div className="title-wrapper mt-48">
              <motion.span 
                className="category-label"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                {post.category}
              </motion.span>
              <h1 className="post-title-main mt-16">
                {post.title.split(' ').map((word, i) => (
                  <motion.span 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + (i * 0.1) }}
                    className="title-word"
                  >
                    {word}{' '}
                  </motion.span>
                ))}
              </h1>
            </div>

            <motion.div 
              className="hero-stats mt-48"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              <div className="stat-item"><Calendar size={14} className="text-accent" /><span>{new Date(post.published_at).toLocaleDateString()}</span></div>
              <div className="stat-dot" />
              <div className="stat-item"><Clock size={14} className="text-accent" /><span>Tactical Breakdown</span></div>
              <div className="stat-dot" />
              <div className="stat-item"><Eye size={14} className="text-accent" /><span>{post.views || 0} views</span></div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Article Body */}
      <section className="post-content-section">
        <div className="container-body">
          <div className="content-layout">
            <aside className="article-sidebar">
              <div className="sticky-sidebar">
                <div className="sidebar-group">
                  <h4 className="sidebar-title">Tac-Ops</h4>
                  <div className="sidebar-links">
                    <button className="sidebar-action" title="Share this article" aria-label="Share this article">
                      <Share2 size={16} /> Share
                    </button>
                    <button className="sidebar-action" title="Join the discussion" aria-label="Join the discussion">
                      <MessageCircle size={16} /> Discuss
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            <article className="main-article">
              <div className="article-inner glass-pane">
                <div className="lead-paragraph">{post.excerpt}</div>
                <div className="divider-elite mt-60 mb-60" />

                <div className="body-rich-text">
                  {/* Integrated Video Player */}
                  {post.video_url && (
                    <motion.div 
                      className="feature-video-box mb-60"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="video-inner glass">
                        <AnimatePresence mode="wait">
                          {!isPlaying ? (
                            <motion.div 
                              key="cover"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="video-cover"
                            >
                              <Image src={post.image_url} alt="Feature Thumbnail" fill className="object-cover opacity-50" />
                              <button 
                                onClick={() => setIsPlaying(true)} 
                                className="play-btn-elite"
                                title="Play video"
                                aria-label="Play video"
                              >
                                <div className="play-icon-pulse">
                                  <Play size={32} fill="white" />
                                </div>
                                <span className="play-label">Initialize Display</span>
                              </button>
                            </motion.div>
                          ) : (
                            <motion.div 
                              key="player"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="video-player-frame"
                            >
                              {embedUrl?.includes('embed') ? (
                                <iframe 
                                  src={embedUrl}
                                  className="w-full h-full border-0"
                                  allow="autoplay; fullscreen; picture-in-picture"
                                  allowFullScreen
                                  title={`Video player for ${post.title}`}
                                />
                              ) : (
                                <video src={post.video_url} controls autoPlay className="w-full h-full" />
                              )}
                              <button 
                                onClick={() => setIsPlaying(false)} 
                                className="close-video"
                                title="Close video"
                                aria-label="Close video"
                              >
                                <X size={20} />
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  )}

                  <p>In the professional landscape, excellence is not a choice—it is the baseline. This article breaks down the technical and creative vision behind {post.title.toLowerCase()}.</p>
                  
                  <blockquote className="cinematic-quote mt-60 mb-60">
                    <span className="quote-mark">“</span>
                    Mastery is the intersection of preparation and opportunity. Every frame matters.
                    <span className="quote-author">— Akira Creative Directive</span>
                  </blockquote>

                  <p className="mt-32">The implementation of {post.category} services for this project required a specialized protocol, focusing on {post.excerpt.split(' ').slice(0, 5).join(' ')} and beyond.</p>
                </div>

                {post.related_link && (
                  <div className="external-link-box mt-60">
                    <div className="box-header"><LinkIcon size={20} className="text-accent" /><span>Resource Protocol</span></div>
                    <a href={post.related_link} target="_blank" rel="noopener noreferrer" className="external-btn">Access External Intel</a>
                  </div>
                )}
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        .post-page-ultra { background: var(--bg); color: var(--fg); min-h-screen; }
        .scroll-indicator { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: var(--accent); transform-origin: 0%; z-index: 100000; box-shadow: 0 0 10px var(--accent); }
        .container { max-width: 1600px; margin: 0 auto; padding: 0 80px; }
        .container-body { max-width: 1300px; margin: 0 auto; padding: 0 60px; }
        .ultra-hero { position: relative; height: 80vh; display: flex; align-items: center; overflow: hidden; background: #000; }
        .hero-bg-container { position: absolute; inset: 0; z-index: 0; }
        .hero-img-parallax { object-fit: cover; filter: brightness(0.4) contrast(1.1); }
        .hero-gradient-overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--bg) 0%, rgba(0,0,0,0.4) 50%, transparent 100%); }
        .hero-content { position: relative; z-index: 1; width: 100%; }
        .back-breadcrumb { display: inline-flex; align-items: center; gap: 12px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.3em; color: var(--accent); text-decoration: none; }
        .category-label { display: inline-block; font-family: var(--font-display); font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.4em; color: rgba(255,255,255,0.5); border-left: 2px solid var(--accent); padding-left: 16px; }
        .post-title-main { font-family: var(--font-display); font-size: clamp(3rem, 6vw, 6rem); font-weight: 900; line-height: 0.95; letter-spacing: -0.05em; max-width: 1100px; color: #fff; }
        .title-word { display: inline-block; }
        .hero-stats { display: flex; align-items: center; gap: 24px; color: rgba(255,255,255,0.6); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
        .stat-item { display: flex; align-items: center; gap: 8px; }
        .stat-dot { width: 4px; height: 4px; border-radius: 50%; background: var(--accent); opacity: 0.4; }

        /* Article Content */
        .content-layout { display: grid; grid-template-columns: 200px 1fr; gap: 80px; margin-top: -80px; }
        .article-sidebar { padding-top: 120px; }
        .sticky-sidebar { position: sticky; top: 120px; }
        .sidebar-title { font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: var(--accent); margin-bottom: 20px; }
        .sidebar-links { display: flex; flex-direction: column; gap: 12px; }
        .sidebar-action { display: flex; align-items: center; gap: 10px; background: none; border: none; color: var(--muted); font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; cursor: pointer; transition: color 0.3s; }
        .sidebar-action:hover { color: var(--fg); }
        :global([data-theme='light']) .sidebar-action { color: rgba(0,0,0,0.6) !important; }
        :global([data-theme='light']) .sidebar-action:hover { color: #000 !important; }

        .glass-pane { 
          background: var(--glass); 
          backdrop-filter: blur(40px); 
          border: 1px solid var(--glass-border); 
          border-radius: 40px; 
          padding: 100px; 
          box-shadow: 0 50px 100px rgba(0,0,0,0.3); 
          transition: all 0.4s ease;
        }

        :global([data-theme='light']) .glass-pane {
          background: rgba(255, 255, 255, 0.7);
          box-shadow: 0 50px 100px rgba(0,0,0,0.08);
          border-color: rgba(0,0,0,0.05);
        }

        .lead-paragraph { font-size: 2.2rem; line-height: 1.3; font-weight: 500; letter-spacing: -0.02em; color: var(--fg); }
        :global([data-theme='light']) .lead-paragraph { color: #000000 !important; font-weight: 600; }
        
        .divider-elite { height: 1px; width: 100px; background: var(--accent); }
        .body-rich-text { font-size: 1.25rem; line-height: 1.8; color: var(--fg); opacity: 0.85; }
        :global([data-theme='light']) .body-rich-text { opacity: 1 !important; color: #111111 !important; }

        /* Video Player */
        .feature-video-box { position: relative; aspect-ratio: 16 / 9; border-radius: 32px; overflow: hidden; background: #000; }
        .video-inner { width: 100%; height: 100%; position: relative; }
        .video-cover { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .video-player-frame { width: 100%; height: 100%; position: relative; }
        .close-video { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; }
        .close-video:hover { background: var(--accent); }

        .play-btn-elite { display: flex; flex-direction: column; align-items: center; gap: 20px; background: none; border: none; cursor: pointer; z-index: 1; }
        .play-icon-pulse { width: 80px; height: 80px; border-radius: 50%; background: var(--accent); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px rgba(255, 77, 0, 0.4); animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 0, 0.7); } 70% { transform: scale(1.1); box-shadow: 0 0 0 20px rgba(255, 77, 0, 0); } 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 0, 0); } }
        .play-label { font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em; color: #fff; }

        .cinematic-quote { 
          position: relative; 
          padding: 60px; 
          background: rgba(var(--accent-rgb, 255, 77, 0), 0.05); 
          border-radius: 24px; 
          font-family: var(--font-serif); 
          font-size: 2.4rem; 
          line-height: 1.3; 
          color: var(--fg); 
          font-style: italic; 
          transition: all 0.4s ease;
          border-left: 4px solid var(--accent);
        }

        :global([data-theme='light']) .cinematic-quote {
          background: rgba(0, 0, 0, 0.03) !important;
          color: #000000 !important;
          border-left: 6px solid var(--accent) !important;
          box-shadow: inset 10px 0 30px rgba(0,0,0,0.02) !important;
        }

        .quote-author { 
          display: block; 
          margin-top: 32px; 
          font-family: var(--font-main); 
          font-style: normal; 
          font-size: 0.8rem; 
          font-weight: 900; 
          text-transform: uppercase; 
          letter-spacing: 0.2em; 
          color: var(--accent); 
        }

        :global([data-theme='light']) .quote-author {
          color: var(--accent) !important;
          opacity: 1 !important;
        }

        .quote-mark { position: absolute; top: 20px; left: 40px; font-size: 8rem; opacity: 0.1; color: var(--accent); line-height: 1; }
        .quote-author { display: block; margin-top: 32px; font-family: var(--font-main); font-style: normal; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: var(--accent); }

        .external-link-box { padding: 40px; background: rgba(255, 77, 0, 0.05); border: 1px solid var(--accent-soft); border-radius: 24px; display: flex; flex-direction: column; gap: 16px; }
        .external-btn { font-family: var(--font-display); font-size: 1.4rem; font-weight: 800; color: var(--fg); text-decoration: underline; text-decoration-color: var(--accent); text-underline-offset: 8px; }

        @media (max-width: 1200px) { .content-layout { grid-template-columns: 1fr; } .article-sidebar { display: none; } .glass-pane { padding: 60px; } .lead-paragraph { font-size: 1.8rem; } }
        @media (max-width: 768px) { .container-body { padding: 0 24px; } .glass-pane { padding: 40px 24px; border-radius: 30px; } .post-title-main { font-size: 3rem; } .lead-paragraph { font-size: 1.4rem; } .cinematic-quote { font-size: 1.6rem; padding: 40px 24px; } }
      `}</style>
    </main>
  );
}
