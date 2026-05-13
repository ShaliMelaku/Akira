'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const defaultTestimonials = [
  {
    id: 1,
    name: 'Sarah T.',
    company: 'Safaricom Ethiopia',
    text: 'Akira brought an incredible level of professionalism and energy to our latest campaign. His voiceover work perfectly captured the tone we were aiming for.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Michael D.',
    company: 'Creative Agency',
    text: 'Working with Akira is always a seamless experience. He takes direction flawlessly and always delivers high-quality audio ahead of schedule.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Elsa B.',
    company: 'Independent Filmmaker',
    text: 'His on-screen presence is magnetic. Akira is a dedicated actor who truly understands character depth. I look forward to our next collaboration.',
    rating: 5,
  }
];

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(defaultTestimonials);

  useEffect(() => {
    const saved = localStorage.getItem('akira_testimonials');
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTestimonials(JSON.parse(saved));
    }
  }, []);
  return (
    <section className="section testimonials-v3">
      <div className="container">
        <div className="testimonials-header-v3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="header-content"
          >
            <div>
              <span className="t-label">client feedback</span>
              <h2 className="display-lg mt-16">
                Client <span className="serif-italic text-gradient">Stories</span>
              </h2>
            </div>
            <p className="header-desc text-muted max-w-sm">
              Hear what industry leaders and creative partners have to say about collaborating with Akira.
            </p>
          </motion.div>
        </div>

        <div className="testimonials-grid mt-80">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              className="testimonial-card glass"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
            >
              <div className="card-top">
                <div className="quote-icon-wrapper">
                  <Quote className="w-8 h-8 opacity-20" />
                </div>
                <div className="stars-v3">
                  {[...Array(t.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
              </div>

              <p className="testimonial-text-v3 mt-32">
                &quot;{t.text}&quot;
              </p>

              <div className="testimonial-author-v3 mt-40">
                <div className="author-info">
                  <div className="author-avatar">{t.name.charAt(0)}</div>
                  <div>
                    <h4 className="author-name">{t.name}</h4>
                    <span className="author-company text-muted">{t.company}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .testimonials-header-v3 {
          margin-bottom: 60px;
        }

        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 40px;
        }

        .header-desc {
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .t-label {
          font-family: var(--font-display);
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: var(--accent);
        }

        .testimonials-grid {
          display: flex;
          gap: 32px;
          overflow-x: auto;
          padding-bottom: 40px;
          scroll-snap-type: x mandatory;
          scrollbar-width: none; /* Firefox */
        }

        .testimonials-grid::-webkit-scrollbar {
          display: none; /* Chrome/Safari */
        }

        .testimonial-card {
          min-width: 400px;
          max-width: 450px;
          flex: 0 0 auto;
          scroll-snap-align: start;
          padding: 60px 48px;
          border-radius: 40px;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .testimonial-card:hover {
          transform: translateY(-8px);
          background: var(--glass);
          border-color: var(--accent-soft);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quote-icon-wrapper {
          color: var(--accent);
        }

        .stars-v3 {
          display: flex;
          gap: 4px;
        }

        .fill-accent { fill: var(--accent); }
        .text-accent { color: var(--accent); }

        .testimonial-text-v3 {
          font-size: 1.1rem;
          line-height: 1.8;
          color: var(--muted);
          font-style: italic;
          flex: 1;
        }

        .testimonial-author-v3 {
          padding-top: 32px;
          border-top: 1px solid var(--glass-border);
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--accent), #ff8a00);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 1.2rem;
          font-weight: 900;
          color: white;
          box-shadow: 0 10px 20px rgba(255, 77, 0, 0.2);
        }

        .author-name {
          font-size: 1rem;
          font-weight: 700;
          color: var(--fg);
        }

        .author-company {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
        }

        .mt-16 { margin-top: 16px; }
        .mt-32 { margin-top: 32px; }
        .mt-40 { margin-top: 40px; }
        .mt-80 { margin-top: 80px; }

        .max-w-sm { max-width: 400px; }

        @media (max-width: 1024px) {
          .header-content { flex-direction: column; align-items: flex-start; gap: 24px; }
        }

        @media (max-width: 768px) {
          .testimonial-card { min-width: 300px; padding: 40px 32px; }
          .testimonial-text-v3 { font-size: 1rem; }
        }
      `}</style>
    </section>
  );
}
