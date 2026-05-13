'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Clock, ChevronDown, Calendar, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type Status = 'Pending' | 'Confirmed' | 'Declined' | 'Completed';

type Booking = {
  id: number;
  client_name: string;
  company: string;
  service_requested: string;
  date: string;
  budget: string;
  status: Status;
  message: string;
  email: string;
  phone: string;
  created_at: string;
};

const statusConfig: Record<Status, { cls: string; icon: React.ReactNode }> = {
  Pending: { cls: 'status-pending', icon: <Clock className="w-3 h-3" /> },
  Confirmed: { cls: 'status-active', icon: <Check className="w-3 h-3" /> },
  Completed: { cls: 'status-completed', icon: <Check className="w-3 h-3" /> },
  Declined: { cls: 'status-declined', icon: <X className="w-3 h-3" /> },
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!active) return;
      
      if (error) {
        toast.error('Failed to load bookings');
      } else {
        setBookings(data || []);
      }
      setLoading(false);
    };

    load();
    return () => { active = false; };
  }, []);

  const fetchBookings = async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) toast.error('Failed to load bookings');
    else setBookings(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: number, status: Status) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id);
    
    if (error) {
      toast.error('Update failed: ' + error.message);
    } else {
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings();
    }
  };

  const counts = {
    Pending: bookings.filter(b => b.status === 'Pending').length,
    Confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    Completed: bookings.filter(b => b.status === 'Completed').length,
    Declined: bookings.filter(b => b.status === 'Declined').length,
  };

  return (
    <div className="fade-in">
      <div className="page-header mb-32">
        <div>
          <h1 className="display-md">Booking <span className="serif-italic text-gradient">Requests</span></h1>
          <p className="text-muted mt-8">Manage and respond to all incoming project inquiries</p>
        </div>
        <div className="flex align-center gap-12">
          <Calendar className="w-4 h-4 text-muted" />
          <span className="text-muted text-sm">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Status summary pills */}
      <div className="status-summary mb-40">
        {(Object.keys(counts) as Status[]).map((s, i) => (
          <motion.div 
            key={s} 
            className={`summary-pill glass-card ${statusConfig[s].cls}-border`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span className="text-2xl font-bold text-gradient">{counts[s]}</span>
            <span className="text-muted text-[10px] uppercase tracking-widest font-bold">{s}</span>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="flex-center py-80">
          <Loader2 className="w-10 h-10 animate-spin text-accent" />
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.length === 0 ? (
            <div className="glass-card p-80 text-center">
              <p className="text-muted">No booking requests found.</p>
            </div>
          ) : bookings.map(b => {
            const st = b.status;
            const cfg = statusConfig[st];
            const isOpen = expanded === b.id;

            return (
              <div key={b.id} className={`booking-card glass-card ${st === 'Pending' ? 'urgent' : ''}`}>
                <div className="booking-top" onClick={() => setExpanded(isOpen ? null : b.id)}>
                  <div className="booking-client">
                    <div className="client-av">{b.client_name[0]}</div>
                    <div>
                      <strong>{b.client_name}</strong>
                      <div className="text-muted text-xs">{b.company || 'Private Client'}</div>
                    </div>
                  </div>
                  <div className="booking-service">{b.service_requested}</div>
                  <div className="booking-date text-muted text-sm">{b.date || 'TBD'}</div>
                  <div className="booking-budget text-accent font-bold">{b.budget || 'N/A'}</div>
                  <div className={`status-pill ${cfg.cls} flex-center gap-4`}>
                    {cfg.icon} {st}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-muted chevron ${isOpen ? 'open' : ''}`} />
                </div>

                {isOpen && (
                  <div className="booking-detail">
                    <div className="contact-info mb-16">
                      <div className="contact-item">
                        <span className="text-muted text-xs uppercase tracking-wide block">Email</span>
                        <a href={`mailto:${b.email}`} className="text-accent font-bold">{b.email}</a>
                      </div>
                      <div className="contact-item">
                        <span className="text-muted text-xs uppercase tracking-wide block">Phone</span>
                        <a href={`tel:${b.phone}`} className="text-accent font-bold">{b.phone}</a>
                      </div>
                    </div>

                    <div className="detail-msg glass-card">
                      <p className="text-muted text-sm">Client message:</p>
                      <p className="mt-8">&ldquo;{b.message}&rdquo;</p>
                    </div>

                    {st === 'Pending' && (
                      <div className="booking-actions mt-16">
                        <button className="btn btn-primary" onClick={() => updateStatus(b.id, 'Confirmed')}>
                          <Check className="w-4 h-4 mr-8" /> Confirm Booking
                        </button>
                        <button className="btn btn-ghost text-red" onClick={() => updateStatus(b.id, 'Declined')}>
                          <X className="w-4 h-4 mr-8" /> Decline
                        </button>
                      </div>
                    )}
                    {st === 'Confirmed' && (
                      <div className="booking-actions mt-16">
                        <button className="btn btn-outline" onClick={() => updateStatus(b.id, 'Completed')}>
                          Mark as Completed
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .status-summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .summary-pill { padding: 24px; border-radius: 20px; display: flex; flex-direction: column; gap: 8px; border: 1px solid var(--glass-border); }
        .status-pending-border { border-top: 3px solid #f59e0b; }
        .status-active-border { border-top: 3px solid #10b981; }
        .status-completed-border { border-top: 3px solid var(--accent); }
        .status-declined-border { border-top: 3px solid #ef4444; }
        
        .bookings-list { display: flex; flex-direction: column; gap: 16px; }
        .booking-card { border-radius: 20px; overflow: hidden; transition: all 0.3s ease; }
        .booking-card:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
        .booking-card.urgent { border-left: 4px solid #f59e0b; }
        
        .booking-top { 
          display: grid; 
          grid-template-columns: 2.2fr 1.8fr 1.2fr 1fr 1.2fr auto; 
          gap: 24px; 
          align-items: center; 
          padding: 24px; 
          cursor: pointer; 
        }
        .booking-top:hover { background: rgba(255,255,255,0.03); }
        
        .booking-client { display: flex; align-items: center; gap: 16px; }
        .client-av { 
          width: 44px; 
          height: 44px; 
          border-radius: 12px; 
          background: var(--accent-soft); 
          color: var(--accent); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          font-weight: 800; 
          flex-shrink: 0; 
          font-size: 1.1rem;
        }
        
        .booking-service { font-size: 0.95rem; font-weight: 600; }
        .booking-date { font-size: 0.85rem; font-weight: 500; }
        .booking-budget { font-size: 1rem; font-weight: 800; }
        
        .chevron { transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1); }
        .chevron.open { transform: rotate(180deg); color: var(--accent); }
        
        .booking-detail { padding: 0 24px 24px; border-top: 1px solid var(--glass-border); margin-top: -1px; padding-top: 24px; }
        .contact-info { display: flex; gap: 48px; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid var(--glass-border); }
        .contact-item { display: flex; flex-direction: column; gap: 6px; }
        .detail-msg { padding: 20px; border-radius: 16px; background: rgba(255,255,255,0.01); border: 1px solid var(--glass-border); }
        .booking-actions { display: flex; gap: 16px; }
        
        .text-2xl { font-size: 1.8rem; }
        .status-pill { font-size: 0.7rem; font-weight: 800; padding: 6px 12px; border-radius: 99px; text-transform: uppercase; letter-spacing: 0.05em; }
        
        @media (max-width: 1200px) { 
          .booking-top { grid-template-columns: 2fr 1.5fr 1fr auto; } 
          .booking-date, .booking-budget { display: none; } 
        }
        
        @media (max-width: 768px) { 
          .status-summary { grid-template-columns: repeat(2,1fr); gap: 16px; } 
          .booking-top { grid-template-columns: 1.5fr 1fr auto; gap: 16px; }
          .booking-service { display: none; }
          .contact-info { flex-direction: column; gap: 20px; }
        }
      `}</style>
    </div>
  );
}
