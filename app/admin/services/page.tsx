'use client';

import { useState, useEffect } from 'react';
import { Edit2, Plus, Trash2, Loader2, CheckCircle, XCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type Service = {
  id: number;
  title: string;
  category: string;
  price: string;
  description: string;
  is_active: boolean;
};

export default function ServicesEditorPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [draft, setDraft] = useState<Partial<Service>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
    if (error) toast.error('Failed to load services');
    else setServices(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await fetchServices();
    };
    init();
  }, []);

  const startEdit = (s: Service) => { 
    setEditing(s.id); 
    setDraft({ ...s }); 
  };

  const saveEdit = async () => {
    if (!draft.title?.trim()) return toast.error('Service title is required');
    if (!draft.price?.trim()) return toast.error('Pricing information is required');
    if (!draft.description?.trim()) return toast.error('Service description is required');
    
    // Allow any price format: "5,000", "From 50,000", "Free", etc.
    // No numeric validation — price is free-text

    const { error } = await supabase.from('services').update(draft).eq('id', editing);
    if (error) toast.error('Update failed: ' + error.message);
    else {
      toast.success('Service updated successfully');
      setEditing(null);
      fetchServices();
    }
  };

  const toggleStatus = async (s: Service) => {
    const { error } = await supabase.from('services').update({ is_active: !s.is_active }).eq('id', s.id);
    if (error) toast.error('Failed to toggle status');
    else fetchServices();
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    
    // Perform delete
    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', deleteConfirm);

    if (error) {
      toast.error('Database error: ' + error.message);
    } else {
      toast.success('Service permanently removed');
      setDeleteConfirm(null);
      // Force a fresh fetch
      await fetchServices();
    }
  };

  const openAddModal = () => {
    setDraft({ title: '', category: 'Voiceover', price: '', description: '', is_active: true });
    setShowAddModal(true);
  };

  const saveNewService = async () => {
    if (!draft.title?.trim()) return toast.error('Service title is required');
    if (!draft.category) return toast.error('Category selection is required');
    if (!draft.price?.trim()) return toast.error('Investment amount is required');
    if (!draft.description?.trim()) return toast.error('Description is required');

    const { error } = await supabase.from('services').insert([{
      title: draft.title,
      category: draft.category,
      price: draft.price,
      description: draft.description,
      is_active: draft.is_active ?? true,
    }]);
    if (error) {
      toast.error('Deploy failed: ' + error.message);
    } else {
      toast.success('New service deployed to platform');
      setShowAddModal(false);
      fetchServices();
    }
  };

  return (
    <div className="fade-in">
      <div className="page-header mb-40">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="display-md text-3xl font-bold">Services <span className="text-gradient">Engine</span></h1>
          <p className="text-muted mt-8">Configure your offerings and market pricing</p>
        </motion.div>
        <button className="btn btn-primary flex-center gap-8" onClick={openAddModal}>
          <Plus size={18} /> New Service
        </button>
      </div>

      {loading ? (
        <div className="flex-center py-60"><Loader2 className="animate-spin text-accent" size={40} /></div>
      ) : (
        <div className="services-grid">
          <AnimatePresence>
            {services.map((s, i) => {
              const isEditing = editing === s.id;
              return (
                <motion.div 
                  key={s.id} 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`service-card glass-card ${!s.is_active ? 'dimmed' : ''}`}
                >
                  <div className="card-top">
                    <div className="category-tag">{s.category}</div>
                    <div className="card-actions">
                      <button className="icon-action-btn" onClick={() => toggleStatus(s)} title={s.is_active ? 'Deactivate' : 'Activate'}>
                        {s.is_active ? <CheckCircle size={18} className="text-success" /> : <XCircle size={18} className="text-muted" />}
                      </button>
                      <button className="icon-action-btn" onClick={() => startEdit(s)} title="Edit"><Edit2 size={16} /></button>
                      <button className="icon-action-btn danger" onClick={() => setDeleteConfirm(s.id)} title="Delete"><Trash2 size={16} /></button>
                    </div>
                  </div>

                  <div className="card-content mt-16">
                    {isEditing ? (
                      <div className="inline-edit-stack">
                        <input className="form-input mb-8" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} placeholder="Title" onPaste={e => e.preventDefault()} />
                        <div className="flex gap-8 mb-8">
                          <select className="form-input" value={draft.category} onChange={e => setDraft({...draft, category: e.target.value})} title="Service Category">
                            <option>Voiceover</option>
                            <option>Acting</option>
                            <option>Social Media</option>
                            <option>Hosting</option>
                            <option>Strategy</option>
                            <option>Other</option>
                          </select>
                          <input className="form-input" value={draft.price} onChange={e => setDraft({...draft, price: e.target.value})} placeholder="Price" onPaste={e => e.preventDefault()} />
                        </div>
                        <textarea className="form-input ta-small" value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})} placeholder="Description" />
                        <div className="flex justify-end gap-8 mt-12">
                          <button className="btn btn-ghost btn-xs" onClick={() => setEditing(null)}>Cancel</button>
                          <button className="btn btn-primary btn-xs" onClick={saveEdit}>Save</button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-xl font-bold">{s.title}</h3>
                        <div className="price-tag mt-4 text-accent font-bold">ETB {s.price}</div>
                        <p className="text-sm text-muted mt-12 leading-relaxed line-clamp-3">{s.description}</p>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Detailed Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <motion.div 
              className="elite-modal-compact glass-card" 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
              <div className="modal-header">
                <h2 className="text-xl font-bold">New <span className="text-gradient">Service</span></h2>
                <button className="close-btn" onClick={() => setShowAddModal(false)} title="Close Modal"><X size={20} /></button>
              </div>

              <div className="modal-scroll-area">
                <div className="modal-form">
                  <div className="form-group">
                    <label className="form-lbl">Service Title</label>
                    <input className="form-input" placeholder="e.g. Masterclass Voiceover" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label className="form-lbl">Base Category</label>
                    <select className="form-input" value={draft.category} onChange={e => setDraft({...draft, category: e.target.value})} title="Service Category">
                      <option>Voiceover</option>
                      <option>Acting</option>
                      <option>Social Media</option>
                      <option>Hosting</option>
                      <option>Strategy</option>
                      <option>Production</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-lbl">Investment (ETB)</label>
                    <div className="price-input-container">
                      <input className="form-input" placeholder="e.g. 50,000 or From 30,000" value={draft.price} onChange={e => setDraft({...draft, price: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-lbl">Service Description</label>
                    <textarea className="form-input elite-ta" placeholder="Describe the value proposition..." value={draft.description} onChange={e => setDraft({...draft, description: e.target.value})} />
                  </div>

                  <div className="form-group flex align-center gap-12 mt-12">
                    <button 
                      className={`toggle-pill ${draft.is_active ? 'active' : ''}`}
                      onClick={() => setDraft({...draft, is_active: !draft.is_active})}
                    >
                      {draft.is_active ? 'Active' : 'Draft'}
                    </button>
                    <span className="text-xs text-muted font-bold uppercase tracking-wider">Status</span>
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowAddModal(false)}>Discard</button>
                <button className="btn btn-primary" onClick={saveNewService}>Deploy Service</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal - Elite Version */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="modal-overlay elite-blur" onClick={() => setDeleteConfirm(null)}>
            <motion.div 
              className="confirm-box-elite glass-card" 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.8, rotateX: -10 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            >
              <div className="modal-accent-line" />
              <div className="text-center">
                <div className="warning-icon-elite mb-24">
                  <div className="icon-pulse" />
                  <Trash2 size={28} className="text-white relative z-10" />
                </div>
                <h3 className="display-sm text-2xl font-black tracking-tight">Delete <span className="text-gradient">Service?</span></h3>
                <p className="text-muted text-sm mt-12 leading-relaxed">
                  You are about to permanently remove this package from the Akira ecosystem. 
                  This action <span className="text-white font-bold">cannot be undone</span>.
                </p>
              </div>
              <div className="flex justify-center gap-16 mt-40">
                <button className="btn btn-ghost px-24 py-12 text-muted hover:text-white" onClick={() => setDeleteConfirm(null)}>
                  Cancel
                </button>
                <button className="btn btn-primary bg-error-elite px-32 py-12" onClick={confirmDelete}>
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .services-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 24px; }
        .service-card { padding: 32px; border-radius: 24px; transition: all 0.3s ease; }
        .service-card:hover { transform: translateY(-5px); box-shadow: 0 12px 40px rgba(0,0,0,0.3); }
        .service-card.dimmed { opacity: 0.6; grayscale: 0.5; }
        
        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .category-tag { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); background: var(--accent-soft); padding: 4px 12px; border-radius: 99px; }
        .card-actions { display: flex; gap: 4px; }
        .icon-action-btn { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.02); color: var(--muted); cursor: pointer; transition: all 0.2s; border: none; }
        .icon-action-btn:hover { background: rgba(255,255,255,0.1); color: var(--fg); }
        .icon-action-btn.danger:hover { color: #ef4444; }
        
        .ta-small { min-height: 60px; font-size: 0.85rem; }
        .price-tag { font-size: 1.1rem; }
        
        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .form-lbl { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; display: block; letter-spacing: 0.05em; }
        .form-input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); border-radius: 6px; padding: 10px 12px; color: white; font-size: 0.8rem; transition: all 0.2s; }
        .form-input:focus { border-color: var(--accent); outline: none; }
        .elite-ta { min-height: 120px; resize: vertical; }
        
        .price-input-container { position: relative; }
        .currency { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-weight: 800; font-size: 0.8rem; color: var(--accent); }
        .pl-52 { padding-left: 52px; }
        
        .toggle-pill { padding: 6px 16px; border-radius: 99px; background: rgba(255,255,255,0.05); color: var(--muted); font-size: 0.7rem; font-weight: 900; text-transform: uppercase; border: 1px solid var(--glass-border); cursor: pointer; transition: all 0.3s; }
        .toggle-pill.active { background: var(--accent); color: white; border-color: var(--accent); box-shadow: 0 4px 12px rgba(255,77,0,0.3); }

        .elite-blur { 
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(12px) saturate(180%); 
          background: rgba(0,0,0,0.6); 
          z-index: 10000;
        }
        .confirm-box-elite { 
          width: 400px; 
          height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px; 
          border-radius: 24px; 
          position: relative; 
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.1);
          background: linear-gradient(135deg, rgba(15,15,15,0.98), rgba(5,5,5,1));
          box-shadow: 0 40px 100px rgba(0,0,0,0.8);
          text-align: center;
        }
        .modal-accent-line { position: absolute; top: 0; left: 0; width: 100%; height: 4px; background: linear-gradient(90deg, transparent, #ef4444, transparent); }
        
        .warning-icon-elite { 
          width: 64px; 
          height: 64px; 
          border-radius: 20px; 
          background: linear-gradient(135deg, #ef4444, #991b1b); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          margin: 0 auto; 
          position: relative;
          box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
        }
        .icon-pulse { position: absolute; inset: -8px; border-radius: 32px; border: 2px solid #ef4444; opacity: 0.2; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.2; } 100% { transform: scale(1.2); opacity: 0; } }

        .bg-error-elite { 
          background: #ef4444 !important; 
          border: none !important;
          font-weight: 900 !important;
          letter-spacing: 0.05em !important;
          box-shadow: 0 10px 20px rgba(239, 68, 68, 0.2) !important;
        }
        .bg-error-elite:hover { background: #dc2626 !important; transform: translateY(-2px); box-shadow: 0 15px 30px rgba(239, 68, 68, 0.3) !important; }

        .py-12 { padding-top: 12px; padding-bottom: 12px; }
        .px-32 { padding-left: 32px; padding-right: 32px; }
        .px-24 { padding-left: 24px; padding-right: 24px; }
        .justify-center { justify-content: center; }

        @media (max-width: 768px) {
          .services-grid { grid-template-columns: 1fr; }
          .page-header { flex-direction: column; align-items: flex-start; gap: 24px; }
          .btn-primary { width: 100%; justify-content: center; }
          .card-actions { gap: 8px; }
          .icon-action-btn { width: 44px; height: 44px; }
          .confirm-box-elite { padding: 40px 24px; }
        }

        @media (max-width: 600px) { .elite-modal { padding: 32px 24px; } }
      `}</style>
    </div>
  );
}
