'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface ContactProps {
  hideHeader?: boolean;
}

export default function Contact({ hideHeader = false }: ContactProps) {
  const { config } = useSettings();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const fname = formData.get('fname') as string;
    const lname = formData.get('lname') as string;
    const msg = formData.get('message') as string;

    if (!fname?.trim() || !lname?.trim() || !email?.trim() || !msg?.trim()) {
      return; // 'required' handles this mostly, but safety first
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setFormState('submitting');
    setTimeout(() => setFormState('success'), 1500);
  };

  return (
    <section className="contact-editorial" id="contact">
      <div className="contact-inner">

        {/* Giant Heading */}
        {!hideHeader && (
          <motion.h1
            className="contact-hero-title"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            Contact <br />
            <span className="serif-italic text-gradient">Me</span>.
          </motion.h1>
        )}

        {/* Split Layout */}
        <motion.div
          className="contact-split"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Left: Contact Info */}
          <div className="contact-left">
            <a href={`mailto:${config.email}`} className="info-line">{config.email}</a>
            <a href={`tel:${config.phone.replace(/\s/g, '')}`} className="info-line">{config.phone}</a>
            <div className="info-addr">
              <span>{config.location}</span>
            </div>
          </div>

          {/* Right: Form */}
          <div className="contact-right">
            <AnimatePresence mode="wait">
              {formState === 'success' ? (
                <motion.div
                  key="success"
                  className="success-editorial"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <CheckCircle className="w-12 h-12" style={{ color: 'var(--accent)' }} />
                  <h3>Message received.</h3>
                  <p>I&apos;ll get back to you within 24 hours.</p>
                  <button className="editorial-btn mt-24" onClick={() => setFormState('idle')}>
                    Send another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="editorial-form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="form-group-editorial">
                    <label>Name (required)</label>
                    <div className="name-row">
                      <div className="input-col">
                        <span className="input-sublabel">First Name</span>
                        <input type="text" name="fname" required className="editorial-input" aria-label="First Name" title="First Name" placeholder="First" onPaste={e => e.preventDefault()} />
                      </div>
                      <div className="input-col">
                        <span className="input-sublabel">Last Name</span>
                        <input type="text" name="lname" required className="editorial-input" aria-label="Last Name" title="Last Name" placeholder="Last" onPaste={e => e.preventDefault()} />
                      </div>
                    </div>
                  </div>

                  <div className="form-group-editorial">
                    <label>Email (required)</label>
                    <input type="email" name="email" required className="editorial-input" aria-label="Email Address" title="Email Address" placeholder="blackforestua40@gmail.com" onPaste={e => e.preventDefault()} />
                  </div>

                  <div className="form-group-editorial">
                    <label>Message (required)</label>
                    <textarea name="message" required className="editorial-input editorial-textarea" aria-label="Message" title="Message" placeholder="Tell me about your project..." onPaste={e => e.preventDefault()} />
                  </div>

                  <button
                    type="submit"
                    className="editorial-btn"
                    disabled={formState === 'submitting'}
                  >
                    {formState === 'submitting' ? 'Sending...' : 'Submit'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .contact-editorial {
          min-height: 100vh;
          background: var(--bg);
          display: flex;
          align-items: center;
          padding: 120px 0 80px;
        }

        .contact-inner {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 80px;
        }

        .contact-hero-title {
          font-family: var(--font-display);
          font-size: clamp(3.5rem, 16vw, 18rem);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.04em;
          color: var(--fg);
          margin-bottom: 80px;
        }

        .text-center {
          text-align: center;
        }

        .accent-dot {
          color: var(--accent);
        }

        .contact-split {
          display: grid;
          grid-template-columns: 1fr 1.8fr;
          gap: 120px;
          align-items: start;
          padding-top: 24px;
          border-top: 1px solid var(--glass-border);
        }

        /* LEFT */
        .contact-left {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding-top: 8px;
        }

        .info-line {
          display: block;
          font-size: 0.95rem;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.3s ease;
          letter-spacing: 0.01em;
        }

        .info-line:hover { color: var(--fg); }

        .info-addr {
          display: flex;
          flex-direction: column;
          gap: 2px;
          margin-top: 8px;
        }

        .info-addr span {
          font-size: 0.95rem;
          color: var(--muted);
        }

        /* RIGHT / FORM */
        .editorial-form,
        .success-editorial {
          display: flex;
          flex-direction: column;
          gap: 40px;
        }

        .success-editorial {
          align-items: flex-start;
          padding: 40px 0;
        }

        .success-editorial h3 {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 800;
          color: var(--fg);
        }

        .success-editorial p {
          color: var(--muted);
          font-size: 1rem;
        }

        .form-group-editorial {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group-editorial > label {
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--fg);
          opacity: 0.8;
        }

        .name-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .input-col {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .input-sublabel {
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--fg);
          opacity: 0.5;
        }

        .editorial-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--glass-border);
          padding: 12px 0;
          color: var(--fg);
          font-family: inherit;
          font-size: 1rem;
          outline: none;
          width: 100%;
          transition: border-color 0.3s ease;
        }

        .editorial-input:focus {
          border-bottom-color: var(--accent);
        }

        .editorial-textarea {
          min-height: 80px;
          resize: none;
        }

        .editorial-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 16px 40px;
          background: var(--fg);
          color: var(--bg);
          font-family: var(--font-display);
          font-size: 0.8rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          align-self: flex-start;
        }

        .editorial-btn:hover {
          background: var(--accent);
          color: white;
        }

        .editorial-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .mt-24 { margin-top: 24px; }

        @media (max-width: 1100px) {
          .contact-inner { padding: 0 40px; }
          .contact-split { grid-template-columns: 1fr; gap: 60px; }
          .contact-hero-title { font-size: clamp(5rem, 16vw, 12rem); }
        }

        @media (max-width: 768px) {
          .contact-editorial { padding: 100px 0 60px; }
          .contact-inner { padding: 0 24px; }
          .name-row { grid-template-columns: 1fr; gap: 32px; }
          .contact-hero-title { margin-bottom: 60px; }
        }
      `}</style>
    </section>
  );
}
