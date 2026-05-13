'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Save, Camera, Loader2, Link as LinkIcon, X } from 'lucide-react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

type Client = {
  id: number;
  name: string;
  website_url: string;
  logo_url: string;
};

export default function ClientsCMSPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  
  const [draft, setDraft] = useState({ name: '', website_url: '', logo_url: '' });

  const fetchClients = useCallback(async () => {
    const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
    if (data) setClients(data);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data } = await supabase.from('customers').select('*').order('created_at', { ascending: false });
      if (isMounted && data) setClients(data);
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const remove = async (id: number) => {
    if (!confirm('Are you sure you want to remove this client?')) return;
    await supabase.from('customers').delete().eq('id', id);
    setClients(prev => prev.filter(c => c.id !== id));
    toast.success('Client removed');
  };

  const startEdit = (c: Client) => {
    setDraft({ name: c.name, website_url: c.website_url || '', logo_url: c.logo_url || '' });
    setEditingId(c.id);
    setFileToUpload(null);
    setShowAdd(true);
  };

  const closeModal = useCallback(() => {
    setShowAdd(false);
    setEditingId(null);
    setFileToUpload(null);
    setDraft({ name: '', website_url: '', logo_url: '' });
  }, []);

  const handleSave = useCallback(async () => {
    if (!draft.name) return toast.error('Client name is required');
    setUploading(true);
    let finalLogoUrl = draft.logo_url;

    if (fileToUpload) {
      const fileExt = fileToUpload.name.split('.').pop();
      const ts = Date.now();
      const fileName = `clients/${ts}.${fileExt}`;
      const { data, error } = await supabase.storage.from('akira_media').upload(fileName, fileToUpload);
      
      if (error) {
        toast.error('Logo upload failed');
        setUploading(false);
        return;
      }
      
      if (data) {
        const { data: publicUrlData } = supabase.storage.from('akira_media').getPublicUrl(fileName);
        finalLogoUrl = publicUrlData.publicUrl;
      }
    }

    const payload = { ...draft, logo_url: finalLogoUrl };

    if (editingId !== null) {
      const { error } = await supabase.from('customers').update(payload).eq('id', editingId);
      if (error) toast.error('Failed to update client');
      else toast.success('Client updated');
    } else {
      const { error } = await supabase.from('customers').insert(payload);
      if (error) toast.error('Failed to add client');
      else toast.success('Client added');
    }

    setUploading(false);
    closeModal();
    fetchClients();
  }, [draft, editingId, fileToUpload, fetchClients, closeModal]);

  return (
    <div className="fade-in">
      <div className="page-header mb-32">
        <div>
          <h1 className="display-md">Our <span className="serif-italic text-gradient">Clients</span></h1>
          <p className="text-muted mt-8">Manage the logos displayed in the scrolling marquee</p>
        </div>
        <button className="btn btn-primary flex-center gap-8" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>

      <div className="customers-grid">
        {clients.map(c => (
          <div key={c.id} className="customer-card glass-card flex justify-between align-center">
            <div className="flex align-center gap-16">
              <div className="customer-logo-wrap">
                {c.logo_url ? (
                  <Image src={c.logo_url} alt={c.name} width={48} height={48} className="object-contain" />
                ) : (
                  <div className="placeholder-logo">{c.name.charAt(0)}</div>
                )}
              </div>
              <div>
                <h4 className="font-bold text-lg">{c.name}</h4>
                {c.website_url && <p className="text-sm text-muted">{c.website_url}</p>}
              </div>
            </div>
            
            <div className="flex gap-8">
              <button className="cms-icon-btn" aria-label="Edit" title="Edit" onClick={() => startEdit(c)}><Edit2 className="w-4 h-4" /></button>
              <button className="cms-icon-btn danger" aria-label="Delete" title="Delete" onClick={() => remove(c.id)}><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {clients.length === 0 && <p className="text-muted">No clients added yet.</p>}
      </div>

      {showAdd && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box glass-card elite-modal-compact" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="text-xl font-bold">{editingId ? 'Edit' : 'Add'} Client</h3>
              <button className="close-btn" onClick={closeModal} title="Close Modal"><X size={20} /></button>
            </div>
            
            <div className="modal-scroll-area">
              <div className="modal-form">
                <div className="form-group mb-16">
                  <label className="form-lbl">Client Name</label>
                  <input className="form-input" aria-label="Client Name" title="Client Name" value={draft.name} onChange={e => setDraft(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Safaricom" />
                </div>
                
                <div className="form-group mb-16">
                  <label className="form-lbl">Website URL (Optional)</label>
                  <div className="input-icon-wrap">
                    <LinkIcon className="w-4 h-4 icon" />
                    <input className="form-input pl-40" aria-label="Website URL" title="Website URL" value={draft.website_url} onChange={e => setDraft(p => ({ ...p, website_url: e.target.value }))} placeholder="https://..." />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-lbl">Client Logo</label>
                  <div className="input-icon-wrap">
                    <Camera className="w-4 h-4 icon" />
                    <input 
                      type="file" 
                      accept="image/*"
                      aria-label="Client Logo"
                      title="Client Logo"
                      className="form-input pl-40" 
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFileToUpload(file);
                          setDraft(p => ({ ...p, logo_url: URL.createObjectURL(file) }));
                        }
                      }}
                    />
                  </div>
                  {draft.logo_url && (
                    <div className="mt-12 p-8 border border-glass rounded-12 w-fit bg-white">
                      <Image src={draft.logo_url} alt="Preview" width={100} height={50} className="object-contain" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={closeModal} disabled={uploading}>Cancel</button>
              <button className="btn btn-primary flex align-center gap-8" onClick={handleSave} disabled={uploading}>
                {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .customers-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .customer-card { padding: 20px; border-radius: 16px; }
        .customer-logo-wrap { width: 56px; height: 56px; border-radius: 12px; background: white; display: flex; align-items: center; justify-content: center; overflow: hidden; padding: 8px; flex-shrink: 0; }
        .placeholder-logo { color: black; font-weight: 800; font-size: 1.5rem; }
        .object-contain { object-fit: contain; }
        
        .cms-icon-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 10px; color: var(--muted); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .cms-icon-btn:hover { background: rgba(255,255,255,0.1); color: white; }
        .cms-icon-btn.danger:hover { background: #ef4444; border-color: #ef4444; color: white; }
        
        .input-icon-wrap { position: relative; }
        .input-icon-wrap .icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--muted); z-index: 10; }
        .pl-40 { padding-left: 40px; }
        
        .flex { display: flex; }
        .justify-between { justify-content: space-between; }
        .justify-end { justify-content: flex-end; }
        .align-center { align-items: center; }
        .gap-8 { gap: 8px; }
        .gap-12 { gap: 12px; }
        .gap-16 { gap: 16px; }
        .mb-8 { margin-bottom: 8px; }
        .mb-16 { margin-bottom: 16px; }
        .mb-24 { margin-bottom: 24px; }
        .mb-32 { margin-bottom: 32px; }
        .mt-8 { margin-top: 8px; }
        .mt-12 { margin-top: 12px; }
        .mt-32 { margin-top: 32px; }
        .p-8 { padding: 8px; }
        .w-fit { width: fit-content; }
        .border { border: 1px solid; }
        .border-glass { border-color: var(--glass-border); }
        .rounded-12 { border-radius: 12px; }
        .bg-white { background: white; }
        .font-bold { font-weight: 700; }
        .text-lg { font-size: 1.1rem; }
        .text-sm { font-size: 0.85rem; }
        .text-xs { font-size: 0.75rem; }
        .block { display: block; }
        
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        @media (max-width: 768px) {
          .customers-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
