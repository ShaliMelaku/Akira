'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Clock, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
 
type Post = {
  id: number;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  image_url: string;
  published_at: string;
};

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'Published')
        .order('published_at', { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    }
    fetchPosts();
  }, []);

  if (loading) return <div className="flex-center py-100"><Loader2 className="animate-spin text-accent" size={40} /></div>;
  if (posts.length === 0) return (
    <div className="text-center py-100">
      <h3 className="text-muted">No published articles yet. Check back soon.</h3>
    </div>
  );
  return (
    <section className="section blog-v3" id="blog">
      <div className="container">
        <div className="blog-header-v3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="blog-subtitle">insights & stories</span>
            <h2 className="display-lg mt-16">
              Latest <span className="serif-italic text-gradient">Articles</span>
            </h2>
          </motion.div>
        </div>

        <div className="blog-grid mt-80">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              className={`blog-card glass group ${i === 0 ? 'featured' : ''}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="card-image">
                <Image 
                  src={post.image_url || 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80'} 
                  alt={post.title} 
                  fill 
                  className="blog-img"
                />
                <div className="card-cat-badge">
                  {post.category}
                </div>
              </div>
              
              <div className="card-body">
                <div className="card-meta">
                  <div className="meta-item">
                    <Clock className="w-4 h-4" />
                    <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : 'Draft'}</span>
                  </div>
                </div>
                
                <h3 className="card-title mt-16">{post.title}</h3>
                <p className="card-excerpt mt-16">{post.excerpt}</p>
                
                <Link href={`/blog/${post.id}`} className="read-more mt-32 group">
                  <span>Read Article</span>
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .blog-subtitle {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--accent);
          text-align: center;
          display: block;
        }

        .blog-header-v3 {
          text-align: center;
        }

        .blog-grid {
          display: grid;
          grid-template-columns: 1.3fr 0.7fr;
          grid-template-rows: repeat(2, 1fr);
          gap: 32px;
        }

        .blog-card {
          border-radius: 40px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: all 0.6s var(--ease);
          cursor: pointer;
        }

        .blog-card.featured {
          grid-row: span 2;
        }

        .blog-card:hover {
          transform: translateY(-12px);
          background: var(--glass);
          border-color: var(--accent-soft);
        }

        .card-image {
          position: relative;
          width: 100%;
          aspect-ratio: 1.5;
          overflow: hidden;
        }

        .blog-img {
          object-fit: cover;
          filter: grayscale(0.2) brightness(0.8);
          transition: transform 1.2s var(--ease);
        }

        .blog-card:hover .blog-img {
          transform: scale(1.1);
          filter: grayscale(0) brightness(1);
        }

        .card-cat-badge {
          position: absolute;
          top: 24px;
          left: 24px;
          padding: 8px 16px;
          background: var(--accent);
          color: white;
          border-radius: 99px;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          z-index: 2;
        }

        .card-body {
          padding: 40px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .card-meta {
          display: flex;
          gap: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 1.4rem;
          font-weight: 800;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--fg);
        }

        .card-excerpt {
          font-size: 0.95rem;
          line-height: 1.6;
          color: var(--muted);
          flex: 1;
        }

        .read-more {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--accent);
          text-decoration: none;
        }

        .mt-16 { margin-top: 16px; }
        .mt-32 { margin-top: 32px; }
        .mt-80 { margin-top: 80px; }

        @media (max-width: 1024px) {
          .blog-grid { grid-template-columns: 1fr; grid-template-rows: auto; }
          .blog-card.featured { grid-row: auto; }
        }

        @media (max-width: 768px) {
          .card-body { padding: 32px; }
          .card-title { font-size: 1.2rem; }
        }
      `}</style>
    </section>
  );
}
