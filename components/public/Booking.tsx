'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<{title: string}[]>([
    { title: 'Voice Artistry' },
    { title: 'Performance Acting' },
    { title: 'Creative Influence' }
  ]);
  const [form, setForm] = useState({
    client_name: '', email: '', phone: '', company: '', service_requested: '', budget: '', date: '', message: '',
  });

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('title').eq('is_active', true);
      if (data && data.length > 0) setServices(data);
    };
    fetchServices();
  }, []);

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const { error } = await supabase.from('bookings').insert([{
      client_name: form.client_name,
      email: form.email,
      phone: form.phone,
      company: form.company,
      service_requested: form.service_requested,
      budget: form.budget,
      date: form.date,
      message: form.message,
    }]);
    setIsSubmitting(false);
    if (!error) {
      setSubmitted(true);
    } else {
      console.error(error);
    }
  };

  return (
    <section className="booking-simple-section" id="booking">
      <div className="container">
        
        <motion.div 
          className="booking-hero-block"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="block-title">Book A Session</h2>
          <div className="block-breadcrumbs">
            <span>Home</span> <span className="separator">/</span> <span className="current">Book A Session</span>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div 
          className="booking-form-card"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="booking-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="success-icon">✓</div>
                <h3 className="success-title">Message Received</h3>
                <p className="success-msg text-muted">
                  Thank you, <strong className="success-name">{form.client_name}</strong>. We will get back to you shortly.
                </p>
                <button
                  className="btn-submit mt-24"
                  onClick={() => { setSubmitted(false); setForm({ client_name:'', email:'', phone:'', company:'', service_requested:'', budget:'', date:'', message:'' }); }}
                >
                  Submit Another
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="simple-form"
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="form-grid-2">
                  <div className="input-wrap">
                    <label>Your Name*</label>
                    <input 
                      type="text" 
                      aria-label="Your Name"
                      title="Your Name"
                      placeholder="Enter Your First Name" 
                      required 
                      value={form.client_name}
                      onChange={e => update('client_name', e.target.value)}
                    />
                  </div>
                  <div className="input-wrap">
                    <label>Your Email*</label>
                    <input 
                      type="email" 
                      aria-label="Your Email"
                      title="Your Email"
                      placeholder="Enter Your Email Address" 
                      required 
                      value={form.email}
                      onChange={e => update('email', e.target.value)}
                    />
                  </div>
                  <div className="input-wrap">
                    <label>Your Phone*</label>
                    <input 
                      type="tel" 
                      aria-label="Your Phone"
                      title="Your Phone"
                      placeholder="Enter Your Phone Number" 
                      required 
                      value={form.phone}
                      onChange={e => update('phone', e.target.value)}
                    />
                  </div>
                  <div className="input-wrap">
                    <label>Company / Organization</label>
                    <input 
                      type="text" 
                      aria-label="Company or Organization"
                      title="Company or Organization"
                      placeholder="Enter Your Company" 
                      value={form.company}
                      onChange={e => update('company', e.target.value)}
                    />
                  </div>
                  <div className="input-wrap">
                    <label>Service Requested*</label>
                    <select 
                      aria-label="Service Requested"
                      title="Service Requested"
                      required 
                      className="field-select"
                      value={form.service_requested}
                      onChange={e => update('service_requested', e.target.value)}
                    >
                      <option value="" disabled>Select a Service</option>
                      {services.map(s => (
                        <option key={s.title} value={s.title}>{s.title}</option>
                      ))}
                      <option value="Other">Other / General Inquiry</option>
                    </select>
                  </div>
                  <div className="input-wrap">
                    <label>Estimated Budget</label>
                    <input 
                      type="text" 
                      aria-label="Estimated Budget"
                      title="Estimated Budget"
                      placeholder="e.g. $1000" 
                      value={form.budget}
                      onChange={e => update('budget', e.target.value)}
                    />
                  </div>
                  <div className="input-wrap full-width-grid">
                    <label>Preferred Date</label>
                    <input 
                      type="date" 
                      aria-label="Preferred Date"
                      title="Preferred Date"
                      placeholder="mm/dd/yyyy"
                      value={form.date}
                      onChange={e => update('date', e.target.value)}
                    />
                  </div>
                </div>

                <div className="input-wrap mt-24">
                  <label>Your Message*</label>
                  <textarea 
                    aria-label="Your Message"
                    title="Your Message"
                    placeholder="Enter Your Messages Here..." 
                    required 
                    rows={6}
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                  />
                </div>

                <div className="submit-row">
                  <button type="submit" className="btn-submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Sending...' : 'Submit Now'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>

      </div>

      <style jsx>{`
        .booking-simple-section {
          padding: 120px 0 160px;
          background: var(--bg);
        }

        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* Giant Header Block matching the design but in site theme */
        .booking-hero-block {
          background: #ff4d00;
          background: linear-gradient(135deg, #ff4d00 0%, #ff8a00 100%);
          border-radius: 24px;
          padding: 80px 40px;
          text-align: center;
          margin-bottom: 40px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: var(--fg);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          border: 1px solid var(--glass-border);
        }

        .block-title {
          font-family: var(--font-display);
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          letter-spacing: -0.04em;
          margin-bottom: 16px;
          color: var(--fg);
          text-transform: uppercase;
        }

        .block-breadcrumbs {
          font-size: 1rem;
          font-weight: 600;
          color: var(--muted);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .current {
          color: var(--fg);
          font-weight: 800;
        }

        /* Form Card - Glassmorphism theme */
        .booking-form-card {
          background: var(--glass);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 24px;
          padding: 60px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.4);
          color: var(--fg);
        }

        .form-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .full-width-grid {
          grid-column: 1 / -1;
        }

        .input-wrap {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .input-wrap label {
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--fg);
          opacity: 0.7;
          margin-bottom: 4px;
        }

        .input-wrap input,
        .input-wrap textarea,
        .field-select {
          width: 100%;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          padding: 18px 24px;
          border-radius: 12px;
          font-size: 1rem;
          color: var(--fg);
          font-family: inherit;
          outline: none;
          transition: all 0.3s ease;
          appearance: none;
        }

        .field-select {
          cursor: pointer;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 24px center;
          background-size: 16px;
        }

        .field-select option {
          background: #111;
          color: #fff;
        }

        .input-wrap input::placeholder,
        .input-wrap textarea::placeholder {
          color: #adb5bd;
        }

        .input-wrap input:focus,
        .input-wrap textarea:focus,
        .field-select:focus {
          border-color: var(--accent);
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 0 0 4px rgba(255, 77, 0, 0.1);
        }

        .input-wrap textarea {
          resize: vertical;
        }

        .submit-row {
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        .btn-submit {
          background: var(--accent);
          color: #fff;
          border: none;
          padding: 18px 60px;
          border-radius: 50px;
          font-size: 1rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-submit:hover:not(:disabled) {
          background: #ff8a00;
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(255, 77, 0, 0.4);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* Success State */
        .booking-success {
          text-align: center;
          padding: 60px 20px;
        }

        .success-icon {
          font-size: 4rem;
          color: var(--accent);
          margin-bottom: 24px;
        }

        .success-title {
          font-size: 2.5rem;
          font-weight: 800;
          margin-bottom: 16px;
        }

        .success-msg {
          font-size: 1.1rem;
          color: var(--muted);
        }

        .mt-24 { margin-top: 24px; }

        @media (max-width: 768px) {
          .booking-simple-section { padding: 80px 0 100px; }
          .booking-hero-block { padding: 60px 24px; border-radius: 20px; }
          .block-title { font-size: 2.5rem; }
          .booking-form-card { padding: 32px 20px; border-radius: 20px; }
          .form-grid-2 { grid-template-columns: 1fr; gap: 24px; }
          .success-title { font-size: 1.8rem; }
          .btn-submit { width: 100%; padding: 18px 30px; }
        }
      `}</style>
    </section>
  );
}
