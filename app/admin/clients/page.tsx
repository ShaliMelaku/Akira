'use client';

import { useState } from 'react';
import { Search, Plus, Mail, Phone, MoreHorizontal, Star, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const clients = [
  { id: 1, name: 'Abebe Kebede', company: 'Awash Bank', email: 'abebe@awashbank.com', phone: '+251 911 000 001', type: 'Commercial', status: 'Active', value: '85K ETB', rating: 5, projects: 3 },
  { id: 2, name: 'Sarah Tesfaye', company: 'Safaricom Ethiopia', email: 'sarah@safaricom.et', phone: '+251 912 000 002', type: 'Campaign', status: 'Active', value: '120K ETB', rating: 5, projects: 2 },
  { id: 3, name: 'Dawit Haile', company: 'Creative Agency ET', email: 'dawit@agency.et', phone: '+251 913 000 003', type: 'Film', status: 'Completed', value: '45K ETB', rating: 4, projects: 1 },
  { id: 4, name: 'Meron Alemu', company: 'Ethiopian Airlines', email: 'meron@ethiopianair.com', phone: '+251 914 000 004', type: 'Voiceover', status: 'Prospect', value: '60K ETB', rating: 4, projects: 0 },
  { id: 5, name: 'Yonas Bekele', company: 'Habesha Cement', email: 'yonas@habesha.com', phone: '+251 915 000 005', type: 'Commercial', status: 'Active', value: '95K ETB', rating: 5, projects: 4 },
  { id: 6, name: 'Hiwot Girma', company: 'Telebirr', email: 'hiwot@telebirr.com', phone: '+251 916 000 006', type: 'Social', status: 'Completed', value: '30K ETB', rating: 3, projects: 1 },
];

const statusColors: Record<string, string> = {
  Active: 'status-active',
  Completed: 'status-completed',
  Prospect: 'status-pending',
};

export default function ClientsPage() {
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="display-md">Client <span className="serif-italic text-gradient">CRM</span></h1>
          <p className="text-muted mt-8">Manage relationships with {clients.length} clients</p>
        </div>
        <button className="btn btn-primary flex-center gap-8" onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      {/* Stats Row */}
      <div className="crm-stats mb-32">
        <div className="crm-stat glass-card">
          <span className="stat-num text-gradient">6</span>
          <span className="stat-lbl">Total Clients</span>
        </div>
        <div className="crm-stat glass-card">
          <span className="stat-num text-gradient">3</span>
          <span className="stat-lbl">Active Now</span>
        </div>
        <div className="crm-stat glass-card">
          <span className="stat-num text-gradient">435K</span>
          <span className="stat-lbl">Total Value (ETB)</span>
        </div>
        <div className="crm-stat glass-card">
          <span className="stat-num text-gradient">4.5★</span>
          <span className="stat-lbl">Avg. Rating</span>
        </div>
      </div>

      {/* Search */}
      <div className="search-row mb-24">
        <div className="search-wrap glass-card">
          <Search className="w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder="Search clients or companies..."
            className="search-field"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search clients"
            title="Search clients"
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Client</th>
              <th>Type</th>
              <th>Contact</th>
              <th>Projects</th>
              <th>Value</th>
              <th>Rating</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(client => (
              <tr key={client.id}>
                <td>
                  <div className="client-cell">
                    <div className="client-avatar">{client.name[0]}</div>
                    <div>
                      <strong>{client.name}</strong>
                      <div className="text-muted text-xs">{client.company}</div>
                    </div>
                  </div>
                </td>
                <td><span className="type-badge">{client.type}</span></td>
                <td>
                  <div className="contact-cell">
                    <a href={`mailto:${client.email}`} className="contact-icon" aria-label="Email"><Mail className="w-3 h-3" /></a>
                    <a href={`tel:${client.phone}`} className="contact-icon" aria-label="Call"><Phone className="w-3 h-3" /></a>
                  </div>
                </td>
                <td>{client.projects}</td>
                <td className="text-accent font-bold">{client.value}</td>
                <td>
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < client.rating ? 'star-filled' : 'star-empty'}`} />
                    ))}
                  </div>
                </td>
                <td><span className={`status-pill ${statusColors[client.status]}`}>{client.status}</span></td>
                <td>
                  <button className="icon-btn" aria-label="More options"><MoreHorizontal className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div 
              className="modal-box glass-card elite-modal-compact" 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <div className="modal-header">
                <h3 className="text-xl font-bold">Add New Client</h3>
                <button className="close-btn" onClick={() => setShowModal(false)} title="Close Modal"><X size={20} /></button>
              </div>
              
              <div className="modal-scroll-area">
                <div className="modal-form">
                  <div className="form-group">
                    <label className="form-lbl">Full Name</label>
                    <input className="form-input" placeholder="Abebe Kebede" />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Company</label>
                    <input className="form-input" placeholder="Awash Bank" />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Email Address</label>
                    <input className="form-input" type="email" placeholder="abebe@company.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Phone Number</label>
                    <input className="form-input" type="tel" placeholder="+251 911..." />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Project Type</label>
                    <select className="form-input" title="Project Type">
                      <option>Commercial</option>
                      <option>Voiceover</option>
                      <option>Film</option>
                      <option>Social</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={() => setShowModal(false)}>Save Client</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
        .crm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .crm-stat { text-align: center; padding: 24px; }
        .stat-num { font-family: var(--font-display); font-size: 2rem; font-weight: 900; display: block; }
        .stat-lbl { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-top: 4px; display: block; }
        .search-row { display: flex; gap: 12px; }
        .search-wrap { display: flex; align-items: center; gap: 12px; padding: 12px 20px; flex: 1; border-radius: 12px; }
        .search-field { background: transparent; border: none; outline: none; color: white; font-size: 0.9rem; flex: 1; }
        .search-field::placeholder { color: var(--muted); }
        .client-cell { display: flex; align-items: center; gap: 12px; }
        .client-avatar { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,77,0,0.15); color: var(--accent); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.9rem; flex-shrink: 0; }
        .type-badge { padding: 4px 10px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 99px; font-size: 0.7rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
        .contact-cell { display: flex; gap: 8px; }
        .contact-icon { width: 28px; height: 28px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--muted); transition: all 0.2s; }
        .contact-icon:hover { background: var(--accent); color: white; border-color: var(--accent); }
        .rating-stars { display: flex; gap: 2px; }
        .star-filled { color: #f59e0b; }
        .star-empty { color: rgba(255,255,255,0.15); }
        .icon-btn { background: none; border: none; color: var(--muted); cursor: pointer; padding: 4px; border-radius: 6px; transition: all 0.2s; }
        .icon-btn:hover { background: rgba(255,255,255,0.05); color: white; }
        .overflow-hidden { overflow: hidden; border-radius: 16px; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 1000; display: flex; align-items: center; justify-content: center; }
        .modal-box { padding: 40px; border-radius: 24px; width: 100%; max-width: 500px; }
        .modal-form { display: flex; flex-direction: column; gap: 16px; }
        .modal-actions { display: flex; gap: 12px; justify-content: flex-end; }
        .gap-8 { gap: 8px; }
        .mb-24 { margin-bottom: 24px; }
        .mb-32 { margin-bottom: 32px; }
        .mt-8 { margin-top: 8px; }
        .mt-24 { margin-top: 24px; }
        .font-bold { font-weight: 700; }
        @media (max-width: 900px) { .crm-stats { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </div>
  );
}
