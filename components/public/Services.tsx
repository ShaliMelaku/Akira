'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mic2, Film, Share2, ArrowRight, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const MOCK_SERVICES = [
  { 
    title: 'Voice Artistry', 
    price: '20K+', 
    category: 'Voiceover',
    description: 'Professional voiceovers for commercials, animation, and narrations. High-end sonic branding with cinematic depth.',
    is_active: true
  },
  { 
    title: 'Performance Acting', 
    price: '45K+', 
    category: 'Acting',
    description: 'Film, TV, and stage performance. Bringing magnetic presence and emotional intelligence to every character.',
    is_active: true
  },
  { 
    title: 'Creative Influence', 
    price: '100K+', 
    category: 'Influence',
    description: 'Strategic brand collaborations and social media influence for premium identities and luxury narratives.',
    is_active: true
  },
];

type Service = {
  id?: number;
  title: string;
  category: string;
  price: string;
  description: string;
  is_active: boolean;
};

const getIcon = (category: string) => {
  switch (category) {
    case 'Voiceover': return <Mic2 className="w-8 h-8" />;
    case 'Acting': return <Film className="w-8 h-8" />;
    case 'Influence': return <Share2 className="w-8 h-8" />;
    default: return <Mic2 className="w-8 h-8" />;
  }
};

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setServices(data);
      } else {
        setServices(MOCK_SERVICES);
      }
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <section className="section services-section" id="services">
      <div className="container">
        <div className="text-center mb-80">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="subtitle">expert offerings</span>
            <h2 className="display-lg mt-16">Premium <span className="text-gradient">Services</span></h2>
          </motion.div>
        </div>

        {loading ? (
          <div className="flex-center py-80">
            <Loader2 className="w-8 h-8 animate-spin text-accent" />
          </div>
        ) : (
          <div className="services-grid">
            {services.map((service, i) => (
              <motion.div 
                key={service.id || service.title}
                className="service-card glass"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
              >
                <div className="card-accent" />
                
                <div className="card-header">
                  <div className="service-icon-wrapper">
                    {getIcon(service.category)}
                  </div>
                  <div className="price-tag">
                    <span className="price-val">{service.price}</span>
                    <span className="price-curr">ETB</span>
                  </div>
                </div>
                
                <div className="card-body mt-32">
                  <h3 className="card-title">{service.title}</h3>
                  <p className="card-desc mt-16">{service.description}</p>
                  
                  <div className="divider-v3 mt-32" />
                  
                  <ul className="feature-list mt-32">
                    <li key="feat-1">
                      <Check className="w-4 h-4 text-accent" />
                      <span>Professional delivery</span>
                    </li>
                    <li key="feat-2">
                      <Check className="w-4 h-4 text-accent" />
                      <span>High-end quality</span>
                    </li>
                  </ul>
                </div>

                <div className="card-footer mt-48">
                  <Link href="/booking" className="btn btn-outline w-full group" style={{ textDecoration: 'none' }}>
                    Enquire Now
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .subtitle {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--accent);
        }

        .mt-16 { margin-top: 16px; }
        .mt-32 { margin-top: 32px; }
        .mt-48 { margin-top: 48px; }
        .mb-80 { margin-bottom: 80px; }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
        }

        .service-card {
          position: relative;
          padding: 60px 48px;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .card-accent {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(to right, var(--accent), transparent);
          opacity: 0;
          transition: opacity 0.6s ease;
        }

        .service-card:hover {
          transform: translateY(-16px);
          background: var(--glass);
          border-color: var(--accent-soft);
          box-shadow: 0 30px 60px rgba(0,0,0,0.15);
        }

        .service-card:hover .card-accent {
          opacity: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .service-icon-wrapper {
          color: var(--accent);
          filter: drop-shadow(0 0 10px var(--accent-soft));
        }

        .price-tag {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .price-val {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 900;
          color: var(--fg);
          line-height: 1;
        }

        .price-curr {
          font-size: 0.6rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--muted);
          letter-spacing: 0.1em;
        }

        .card-title {
          font-family: var(--font-display);
          font-size: 1.8rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--fg);
        }

        .card-desc {
          font-size: 0.95rem;
          line-height: 1.7;
          color: var(--muted);
        }

        .divider-v3 {
          height: 1px;
          width: 40px;
          background: var(--glass-border);
        }

        .feature-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .feature-list li {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--fg);
          opacity: 0.8;
        }

        .text-accent { color: var(--accent); }
        .w-full { width: 100%; }
        .ml-2 { margin-left: 8px; }

        @media (max-width: 1200px) {
          .services-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr; }
          .service-card { padding: 48px 32px; }
          .card-title { font-size: 1.5rem; }
        }
      `}</style>
    </section>
  );
}
