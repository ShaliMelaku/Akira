'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, Quote, X } from 'lucide-react';

type Testimonial = {
  id: number;
  name: string;
  company: string;
  text: string;
  rating: number;
};

const initialTestimonials: Testimonial[] = [
  { id: 1, name: 'Sarah T.', company: 'Safaricom Ethiopia', text: 'Akira brought an incredible level of professionalism and energy to our latest campaign. His voiceover work perfectly captured the tone we were aiming for.', rating: 5 },
  { id: 2, name: 'Michael D.', company: 'Creative Agency', text: 'Working with Akira is always a seamless experience. He takes direction flawlessly and always delivers high-quality audio ahead of schedule.', rating: 5 },
  { id: 3, name: 'Elsa B.', company: 'Independent Filmmaker', text: 'His on-screen presence is magnetic. Akira is a dedicated actor who truly understands character depth. I look forward to our next collaboration.', rating: 5 }
];

export default function TestimonialsCMSPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [draft, setDraft] = useState({ name: '', company: '', text: '', rating: 5 });

  useEffect(() => {
    const saved = localStorage.getItem('akira_testimonials');
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTestimonials(JSON.parse(saved));
    }
  }, []);

  const saveToLocal = (data: Testimonial[]) => {
    setTestimonials(data);
    localStorage.setItem('akira_testimonials', JSON.stringify(data));
  };

  const remove = (id: number) => {
    saveToLocal(testimonials.filter(t => t.id !== id));
  };

  const startEdit = (t: Testimonial) => {
    setDraft({ name: t.name, company: t.company, text: t.text, rating: t.rating });
    setEditingId(t.id);
    setShowAdd(true);
  };

  const handleSave = () => {
    if (editingId !== null) {
      saveToLocal(testimonials.map(t => t.id === editingId ? { ...t, ...draft } : t));
    } else {
      // eslint-disable-next-line react-hooks/purity
      saveToLocal([{ id: Date.now(), ...draft }, ...testimonials]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowAdd(false);
    setEditingId(null);
    setDraft({ name: '', company: '', text: '', rating: 5 });
  };

  return (
    <div className="fade-in">
      <div className="page-header mb-32">
        <div>
          <h1 className="display-md">Client <span className="serif-italic text-gradient">Testimonials</span></h1>
          <p className="text-muted mt-8">Manage the reviews displayed on the home page</p>
        </div>
        <button className="btn btn-primary flex-center gap-8" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> Add Testimonial
        </button>
      </div>

      <div className="testimonials-list">
        {testimonials.map(t => (
          <div key={t.id} className="testimonial-row glass-card flex justify-between align-start">
            <div className="flex gap-16 flex-1">
              <div className="quote-icon-wrap mt-8">
                <Quote className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-muted italic mb-16">&quot;{t.text}&quot;</p>
                <div className="flex align-center gap-12">
                  <h4 className="font-bold">{t.name}</h4>
                  <span className="text-xs uppercase tracking-wide text-muted">{t.company}</span>
                  <div className="flex text-accent text-xs ml-auto mr-16">
                    {Array.from({length: t.rating}).map((_, i) => <span key={i}>★</span>)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-8 mt-8">
              <button className="cms-icon-btn" aria-label="Edit" title="Edit" onClick={() => startEdit(t)}><Edit2 className="w-4 h-4" /></button>
              <button className="cms-icon-btn danger" aria-label="Delete" title="Delete" onClick={() => remove(t.id)}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box glass-card elite-modal-compact" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Testimonial</h3>
              <button className="close-btn" onClick={closeModal} title="Close Modal"><X size={20} /></button>
            </div>
            
            <div className="modal-scroll-area">
              <div className="modal-form">
                <div className="form-group mb-16">
                  <label className="form-lbl">Client Name</label>
                  <input className="form-input" aria-label="Client Name" title="Client Name" value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Sarah T." />
                </div>
                <div className="form-group mb-16">
                  <label className="form-lbl">Company / Role</label>
                  <input className="form-input" aria-label="Company or Role" title="Company or Role" value={draft.company} onChange={e => setDraft(p => ({ ...p, company: e.target.value }))} placeholder="e.g. Safaricom" />
                </div>
                <div className="form-group mb-16">
                  <label className="form-lbl">Rating (1-5)</label>
                  <input className="form-input" type="number" min="1" max="5" aria-label="Rating" title="Rating" placeholder="5" value={draft.rating} onChange={e => setDraft(p => ({ ...p, rating: parseInt(e.target.value) || 5 }))} />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Testimonial Text</label>
                  <textarea className="form-input resize-y min-h-100" aria-label="Testimonial Text" title="Testimonial Text" value={draft.text} onChange={e => setDraft(p => ({ ...p, text: e.target.value }))} placeholder="Enter the client's quote here..." />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal}>Cancel</button>
              <button className="btn btn-primary flex align-center gap-8" onClick={handleSave}>
                <Save className="w-4 h-4" /> {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .testimonials-list { display: flex; flex-direction: column; gap: 16px; }
        .testimonial-row { padding: 24px; border-radius: 16px; }
        .quote-icon-wrap { width: 32px; height: 32px; flex-shrink: 0; background: rgba(255, 77, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        
        .cms-icon-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 10px; color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .cms-icon-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        .cms-icon-btn.danger:hover { background: #ef4444; border-color: #ef4444; color: white; }

        .flex-1 { flex: 1; }
        .resize-y { resize: vertical; }
        .min-h-100 { min-height: 100px; }
        .justify-between { justify-content: space-between; }
        .justify-end { justify-content: flex-end; }
        .align-start { align-items: flex-start; }
        .align-center { align-items: center; }
        .gap-8 { gap: 8px; }
        .gap-12 { gap: 12px; }
        .gap-16 { gap: 16px; }
        .mb-8 { margin-bottom: 8px; }
        .mb-16 { margin-bottom: 16px; }
        .mb-24 { margin-bottom: 24px; }
        .mb-32 { margin-bottom: 32px; }
        .mt-8 { margin-top: 8px; }
        .mt-32 { margin-top: 32px; }
        .ml-auto { margin-left: auto; }
        .mr-16 { margin-right: 16px; }
        .font-bold { font-weight: 700; }
        .italic { font-style: italic; }
        .text-xs { font-size: 0.75rem; }
        .block { display: block; }
      `}</style>
    </div>
  );
}
