'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Plus, Edit2, Trash2, Camera, Video, Share2, Loader2, Save, X, Crop, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropUtils';

interface Project {
  id: number;
  title: string;
  category: string;
  client?: string;
  year?: string;
  description?: string;
  image_url?: string;
  video_url?: string;
  social_url?: string;
  platform?: string;
  size?: string;
  created_at?: string;
}

export default function PortfolioCMSPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    category: 'Commercial',
    client: '',
    year: new Date().getFullYear().toString(),
    description: '',
    image_url: '',
    video_url: '',
    social_url: '',
    platform: 'none',
    size: 'medium'
  });

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error('Failed to sync portfolio');
    } else if (data) {
      setItems(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data, error } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false });
      if (isMounted) {
        if (error) toast.error('Failed to sync portfolio');
        else if (data) setItems(data);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData({
      title: '',
      category: 'Commercial',
      client: '',
      year: new Date().getFullYear().toString(),
      description: '',
      image_url: '',
      video_url: '',
      social_url: '',
      platform: 'none',
      size: 'medium'
    });
    setShowModal(true);
  };

  const openEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category) return toast.error('Headline and Category are required');
    
    setSaving(true);
    const payload = { ...formData };

    const { error } = editingId !== null
      ? await supabase.from('portfolio').update(payload).eq('id', editingId)
      : await supabase.from('portfolio').insert([payload]);

    if (error) {
      toast.error('Cloud synchronization failed');
    } else {
      toast.success(editingId ? 'Project updated' : 'Project deployed to showcase');
      setShowModal(false);
      fetchProjects();
    }
    setSaving(false);
  };

  const remove = async (id: number) => {
    const { error } = await supabase.from('portfolio').delete().eq('id', id);
    if (error) toast.error('Deletion failed');
    else {
      toast.success('Project removed from portfolio');
      setDeleteConfirm(null);
      fetchProjects();
    }
  };

  // Media Handling
  const [uploading, setUploading] = useState(false);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
  const imgInput = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Read locally first — avoids CORS block when cropping canvas pixels
    const reader = new FileReader();
    reader.onload = () => setCroppingImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const openRecrop = async (url: string) => {
    // For already-uploaded images, fetch and convert to base64 so canvas can read pixels
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = () => setCroppingImage(reader.result as string);
      reader.readAsDataURL(blob);
    } catch {
      toast.error('Could not load image for cropping');
    }
  };

  const saveCroppedImage = async () => {
    if (!croppingImage || !croppedAreaPixels) return;
    setUploading(true);
    try {
      const croppedBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
      if (!croppedBlob) throw new Error('Processing failed');

      const fileName = `portfolio/cropped-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('media') 
        .upload(fileName, croppedBlob, { contentType: 'image/jpeg' });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
      setFormData(prev => ({ ...prev, image_url: publicUrl }));
      setCroppingImage(null);
      toast.success('Asset optimized');
    } catch {
      toast.error('Media upload failed');
    }
    setUploading(false);
  };

  return (
    <div className="fade-in">
      <div className="page-header mb-32">
        <div>
          <h1 className="display-md">Portfolio <span className="serif-italic text-gradient">CMS</span></h1>
          <p className="text-muted mt-8">{items.length} works in public showcase</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={18} className="mr-8" /> New Project
        </button>
      </div>

      {loading ? (
        <div className="flex-center py-60"><Loader2 className="animate-spin text-accent" size={40} /></div>
      ) : (
        <div className="portfolio-cms-grid">
          {items.map((project) => (
            <div key={project.id} className="portfolio-cms-card glass-card">
              <div className="cms-card-img">
                {project.image_url ? (
                  <Image src={project.image_url} alt={project.title} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex-center h-full bg-black/40"><Camera className="text-muted" size={32} /></div>
                )}
                <div className="card-overlay">
                  <div className="flex gap-12">
                    <button className="overlay-icon-btn" onClick={() => openEdit(project)} title="Edit Project"><Edit2 size={18} /></button>
                    <button className="overlay-icon-btn danger" onClick={() => setDeleteConfirm(project.id)} title="Delete Project"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
              <div className="cms-card-content">
                <div className="flex-between mb-8">
                  <span className="cms-cat-tag">{project.category}</span>
                  <span className="text-xs text-muted font-bold">{project.year}</span>
                </div>
                <h4 className="text-lg font-bold truncate">{project.title}</h4>
                <p className="text-xs text-muted mt-4 font-bold uppercase tracking-widest truncate">{project.client || 'Internal Project'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main CMS Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <motion.div 
              className="modal-box glass-card elite-modal-compact" 
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="modal-header">
                <h3 className="display-sm text-2xl font-black">{editingId ? 'Edit' : 'Deploy'} <span className="text-gradient">Work</span></h3>
                <button className="close-btn" onClick={() => setShowModal(false)} title="Close Modal"><X size={20} /></button>
              </div>

              <div className="modal-scroll-area">
                <div className="modal-form">
                  <div className="form-group">
                    <label className="form-lbl">Project Title</label>
                    <input className="form-input" placeholder="Enter headline..." value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-lbl">Category</label>
                      <select className="form-input" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} title="Select Category">
                        <option>Commercial</option>
                        <option>Voiceover</option>
                        <option>Film</option>
                        <option>Social</option>
                        <option>Documentary</option>
                        <option>Acting</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-lbl">Release Year</label>
                      <input className="form-input" placeholder="2024" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-lbl">Cover Asset</label>
                    {formData.image_url && (
                      <div className="media-preview-container mb-12">
                        <Image src={formData.image_url} alt="Preview" fill className="object-cover rounded-12" unoptimized />
                        <div className="preview-actions">
                          <button className="preview-action-btn" onClick={() => openRecrop(formData.image_url!)} title="Adjust Crop"><Crop size={14} /></button>
                          <button className="preview-action-btn danger" onClick={() => setFormData({...formData, image_url: ''})} title="Remove Asset"><X size={14} /></button>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-8">
                      <div className="input-icon-wrap flex-1">
                        <Globe size={14} className="icon" />
                        <input className="form-input pl-40" placeholder="Source URL..." value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} />
                      </div>
                      <button className="btn btn-ghost border-glass px-16 h-48" onClick={() => imgInput.current?.click()} disabled={uploading} title="Upload New Asset">
                        {uploading ? <Loader2 className="animate-spin" size={18} /> : <Camera size={18} />}
                      </button>
                      <input type="file" ref={imgInput} hidden accept="image/*" onChange={handleFileUpload} />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-lbl">Client / Brand</label>
                      <input className="form-input" placeholder="Akira Studio" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                    </div>
                    <div className="form-group">
                      <label className="form-lbl">Project Size</label>
                      <select className="form-input" value={formData.size} onChange={e => setFormData({...formData, size: e.target.value})} title="Select Display Size">
                        <option value="small">Small (1x1)</option>
                        <option value="medium">Medium (2x1)</option>
                        <option value="large">Large (2x2)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-group">
                      <label className="form-lbl">Video URL</label>
                      <div className="input-icon-wrap">
                        <Video size={14} className="icon" />
                        <input className="form-input pl-40" placeholder="Vimeo/YouTube/TikTok" value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label className="form-lbl">Social Link</label>
                      <div className="input-icon-wrap">
                        <Share2 size={14} className="icon" />
                        <input className="form-input pl-40" placeholder="IG/X Post Link" value={formData.social_url} onChange={e => setFormData({...formData, social_url: e.target.value})} />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-lbl">Detailed Description</label>
                    <textarea className="form-input blog-excerpt-ta" placeholder="Describe the creative process..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 size={16} className="animate-spin mr-8" /> : <Save size={16} className="mr-8" />}
                  {saving ? 'Syncing...' : (editingId ? 'Update Work' : 'Deploy to Showcase')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cropper Modal */}
      <AnimatePresence>
        {croppingImage && (
          <div className="modal-overlay cropper-overlay" onClick={() => setCroppingImage(null)}>
            <motion.div className="cropper-card glass-card cropper-container-elite" onClick={e => e.stopPropagation()} initial={{ opacity: 0, scale: 0.9 }}>
              <div className="cropper-box cropper-workspace-elite">
                <Cropper image={croppingImage} crop={crop} zoom={zoom} aspect={16/9} onCropChange={setCrop} onCropComplete={(_, p) => setCroppedAreaPixels(p)} onZoomChange={setZoom} />
              </div>
              <div className="p-24">
                <label className="text-[0.6rem] font-black uppercase tracking-widest text-muted block mb-12 text-center">Adjust Zoom Level</label>
                <input type="range" value={zoom} min={1} max={3} step={0.1} onChange={e => setZoom(Number(e.target.value))} className="zoom-range w-full" title="Zoom Control" />
                <div className="flex-end gap-12 mt-24">
                  <button className="btn btn-ghost" onClick={() => setCroppingImage(null)}>Cancel</button>
                  <button className="btn btn-primary" onClick={saveCroppedImage}>Finalize Crop</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="modal-overlay z-[12000]" onClick={() => setDeleteConfirm(null)}>
            <motion.div className="delete-card glass-card text-center" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <h3 className="text-xl font-bold mb-12">Archive Project?</h3>
              <p className="text-sm text-muted mb-32">This work will be removed from your public showcase immediately.</p>
              <div className="flex-center gap-12">
                <button className="btn btn-ghost" onClick={() => setDeleteConfirm(null)}>Keep</button>
                <button className="btn btn-primary bg-red-600" onClick={() => remove(deleteConfirm)}>Archive</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .portfolio-cms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 24px; }
        .portfolio-cms-card { border-radius: 20px; overflow: hidden; display: flex; flex-direction: column; transition: all 0.3s; }
        .portfolio-cms-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
        
        .cms-card-img { position: relative; aspect-ratio: 16/9; background: #000; overflow: hidden; }
        .card-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.3s; }
        .portfolio-cms-card:hover .card-overlay { opacity: 1; }
        
        .overlay-icon-btn { width: 44px; height: 44px; border-radius: 12px; background: white; color: black; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .overlay-icon-btn:hover { transform: scale(1.1); background: var(--accent); color: white; }
        .overlay-icon-btn.danger:hover { background: #ef4444; }
        
        .cms-card-content { padding: 16px; flex: 1; }
        .cms-cat-tag { font-size: 0.55rem; font-weight: 900; text-transform: uppercase; color: var(--accent); letter-spacing: 0.15em; }
        
        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 600px) { .form-row-2 { grid-template-columns: 1fr; } }
        
        .form-lbl { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; display: block; letter-spacing: 0.05em; }
        .form-input { width: 100%; background: var(--glass); border: 1px solid var(--glass-border); border-radius: 6px; padding: 10px 12px; color: var(--fg); font-size: 0.8rem; transition: all 0.2s; }
        .form-input::placeholder { color: var(--muted); }
        .form-input:focus { border-color: var(--accent); outline: none; }
        
        :global([data-theme='light']) .form-input { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.15); color: #0a0a0a; }
        :global([data-theme='light']) .form-lbl { color: rgba(0,0,0,0.5); }
        :global([data-theme='light']) .modal-footer { background: rgba(0,0,0,0.03); }
        :global([data-theme='light']) .btn-ghost { color: rgba(0,0,0,0.6); }
        :global([data-theme='light']) .input-icon-wrap .icon { color: rgba(0,0,0,0.4); }
        :global([data-theme='light']) .cms-card-content h4 { color: #0a0a0a; }
        :global([data-theme='light']) .portfolio-cms-card { background: rgba(255,255,255,0.85); border-color: rgba(0,0,0,0.08); }
        
        .input-icon-wrap { position: relative; display: flex; align-items: center; }
        .input-icon-wrap .icon { position: absolute; left: 10px; color: var(--muted); }
        .pl-40 { padding-left: 32px; }
        
        .media-preview-container { position: relative; width: 100%; aspect-ratio: 16/9; border: 1px solid var(--glass-border); border-radius: 10px; overflow: hidden; margin-bottom: 4px; }
        .preview-actions { position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; }
        .preview-action-btn { width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.6); color: white; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        
        .blog-excerpt-ta { min-height: 60px; resize: vertical; }
        
        .modal-footer { padding: 16px 24px; background: rgba(255,255,255,0.02); border-top: 1px solid var(--glass-border); display: flex; gap: 10px; justify-content: flex-end; }
        .btn-ghost { padding: 10px 20px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; color: var(--muted); cursor: pointer; background: transparent; border: none; }
        .btn-primary { padding: 10px 20px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; background: var(--accent); color: white; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; }

        .preview-action-btn:hover { background: var(--accent); transform: scale(1.1); }
        .preview-action-btn.danger:hover { background: #ef4444; }
        
        .blog-excerpt-ta { min-height: 80px; resize: vertical; }
        
        .cropper-card { margin: 0 auto; border-radius: 24px; overflow: hidden; background: var(--bg); border: 1px solid var(--glass-border); }
        .cropper-box { position: relative; width: 100%; background: #000; }
        .zoom-range { accent-color: var(--accent); }
        
        .delete-card { margin: 100px auto 0; max-width: 380px; padding: 40px; border-radius: 24px; }
        .bg-red-600 { background: #dc2626 !important; }
        
        .close-btn { background: none; border: none; color: var(--muted); cursor: pointer; transition: color 0.3s; }
        .close-btn:hover { color: var(--fg); }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .flex-center { display: flex; align-items: center; justify-content: center; }
        .flex-end { display: flex; justify-content: flex-end; align-items: center; }
        .py-60 { padding: 60px 0; }
        .mr-8 { margin-right: 8px; }
        .rounded-12 { border-radius: 12px; }
      `}</style>
    </div>
  );
}
