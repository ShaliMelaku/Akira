'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface Client {
  id: number;
  name: string;
  website_url?: string;
  logo_url?: string;
  created_at?: string;
}

export default function Logos() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setClients(data);
      }
    };
    fetchClients();
  }, []);

  if (clients.length === 0) return null;

  // Triple the array for a very long and seamless marquee
  const displayClients = [...clients, ...clients, ...clients];

  return (
    <section className="logos-section">
      <div className="container">
        <div className="logos-header mb-48 text-center">
          <span className="logos-subtitle">Our Trusted Clients</span>
        </div>
      </div>
        
      <div className="marquee-container">
        <div className="marquee-track">
          {displayClients.map((client, i) => {
            const content = (
              <>
                <div className="logo-img-wrapper">
                  {client.logo_url ? (
                    <Image 
                      src={client.logo_url}
                      alt={client.name}
                      fill
                      className="logo-img"
                    />
                  ) : (
                    <span className="placeholder-logo">{client.name.charAt(0)}</span>
                  )}
                </div>
                <span className="logo-name-v2">{client.name}</span>
              </>
            );

            return (
              <div key={`${client.id}-${i}`} className="logo-item glass">
                {client.website_url ? (
                  <a href={client.website_url} target="_blank" rel="noopener noreferrer" className="logo-link">
                    {content}
                  </a>
                ) : (
                  <div className="logo-link">{content}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .logos-section {
          padding: 80px 0;
          background: var(--glass);
          border-top: 1px solid var(--glass-border);
          border-bottom: 1px solid var(--glass-border);
          overflow: hidden;
        }

        .logos-subtitle {
          font-family: var(--font-display);
          font-size: 0.7rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--muted);
        }

        .marquee-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 20px 0;
        }

        .marquee-container::before,
        .marquee-container::after {
          content: "";
          position: absolute;
          top: 0;
          width: 200px;
          height: 100%;
          z-index: 2;
          pointer-events: none;
        }

        .marquee-container::before {
          left: 0;
          background: linear-gradient(to right, var(--bg) 0%, transparent 100%);
        }

        .marquee-container::after {
          right: 0;
          background: linear-gradient(to left, var(--bg) 0%, transparent 100%);
        }

        .marquee-track {
          display: flex;
          gap: 32px;
          width: max-content;
          animation: marquee 40s linear infinite;
        }

        .marquee-track:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-33.33% - 10.66px)); }
        }

        .logo-item {
          border-radius: 20px;
          transition: all 0.4s var(--ease);
          filter: grayscale(1) brightness(0.8) opacity(0.5);
          min-width: 200px;
        }
        
        .logo-link {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px 40px;
          width: 100%;
          height: 100%;
          text-decoration: none;
          color: inherit;
        }

        .logo-item:hover {
          filter: grayscale(0) brightness(1) opacity(1);
          background: var(--glass);
          transform: translateY(-5px);
          border-color: var(--accent);
        }

        .logo-img-wrapper {
          width: 32px;
          height: 32px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          overflow: hidden;
          background: white; 
          padding: 4px;
        }

        .placeholder-logo {
          color: black;
          font-weight: 900;
          font-size: 1.2rem;
        }

        .logo-img {
          object-fit: contain;
          padding: 4px;
        }

        .logo-name-v2 {
          font-family: var(--font-display);
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
          color: var(--fg);
        }

        .mb-48 { margin-bottom: 48px; }

        @media (max-width: 768px) {
          .logo-link { padding: 12px 24px; }
          .logo-item { min-width: 160px; }
          .logo-name-v2 { font-size: 0.9rem; }
          .logo-img-wrapper { width: 24px; height: 24px; }
          .marquee-track { gap: 16px; }
        }
      `}</style>
    </section>
  );
}
