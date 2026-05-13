'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Edit2, Trash2, Loader2, X, Upload, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/lib/cropUtils';
import Image from 'next/image';

type Post = {
  id: number;
  title: string;
  category: string;
  created_at: string;
  published_at: string;
  status: 'Published' | 'Draft';
  views: number;
  excerpt: string;
  image_url: string;
  video_url?: string;
  related_link?: string;
};

export default function BlogCMSPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const [draft, setDraft] = useState<Partial<Post>>({
    title: '',
    category: 'Acting Tips',
    excerpt: '',
    image_url: '',
    video_url: '',
    related_link: '',
    status: 'Draft'
  });

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) {
      console.error('Fetch error:', error);
      setError(error.message);
    } else if (data) {
      setPosts(data);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (isMounted) {
        if (error) setError(error.message);
        else if (data) setPosts(data);
        setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setDraft({ title: '', category: 'Acting Tips', excerpt: '', image_url: '', video_url: '', related_link: '', status: 'Draft' });
    setShowModal(true);
  };

  const openEdit = (post: Post) => {
    setEditingId(post.id);
    setDraft(post);
    setShowModal(true);
  };

  const openRecrop = async (url: string) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onload = () => setCroppingImage(reader.result as string);
      reader.readAsDataURL(blob);
    } catch {
      toast.error('Could not load image for re-cropping');
    }
  };

  const savePost = async () => {
    if (!draft.title) return toast.error('Headline is required');
    setSaving(true);
    const payload = { ...draft, updated_at: new Date().toISOString() };
    const { error } = editingId 
      ? await supabase.from('blogs').update(payload).eq('id', editingId)
      : await supabase.from('blogs').insert([payload]);

    if (error) toast.error('Failed to save article');
    else {
      toast.success(editingId ? 'Article updated' : 'New article deployed');
      setShowModal(false);
      fetchPosts();
    }
    setSaving(false);
  };

  const deletePost = async (id: number) => {
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) toast.error('Deletion failed');
    else {
      toast.success('Article removed');
      setDeleteConfirm(null);
      fetchPosts();
    }
  };

  const [uploading, setUploading] = useState<'image' | 'video' | null>(null);
  const [croppingImage, setCroppingImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{ x: number, y: number, width: number, height: number } | null>(null);

  const imgInput = useRef<HTMLInputElement>(null);
  const vidInput = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'video') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'image') {
      // Read locally first — avoids CORS block when cropping canvas pixels
      const reader = new FileReader();
      reader.onload = () => setCroppingImage(reader.result as string);
      reader.readAsDataURL(file);
      return;
    }

    // Video: upload directly
    setUploading('video');
    const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
    const { error: uploadError } = await supabase.storage.from('media').upload(`blog/${fileName}`, file);
    if (uploadError) {
      toast.error('Upload failed');
    } else {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(`blog/${fileName}`);
      setDraft(prev => ({ ...prev, video_url: publicUrl }));
      toast.success('Video synchronized');
    }
    setUploading(null);
  };

  const saveCroppedImage = async () => {
    if (!croppingImage || !croppedAreaPixels) return;
    setUploading('image');
    try {
      const croppedBlob = await getCroppedImg(croppingImage, croppedAreaPixels);
      if (!croppedBlob) throw new Error();
      const fileName = `blog/cropped-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage.from('media').upload(fileName, croppedBlob, { contentType: 'image/jpeg' });
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(fileName);
      setDraft(prev => ({ ...prev, image_url: publicUrl }));
      setCroppingImage(null);
      toast.success('Image cropped');
    } catch {
      toast.error('Crop failed');
    }
    setUploading(null);
  };

  const togglePublish = async (post: Post) => {
    const newStatus = post.status === 'Published' ? 'Draft' : 'Published';
    await supabase.from('blogs').update({ status: newStatus, published_at: newStatus === 'Published' ? new Date().toISOString() : null }).eq('id', post.id);
    fetchPosts();
  };

  const totalViews = posts.filter(p => p.status === 'Published').reduce((a, b) => a + b.views, 0);
  const publishedCount = posts.filter(p => p.status === 'Published').length;

  return (
    <div className="cms-page">
      <div className="flex-between mb-32">
        <h1 className="text-3xl font-black">Blog <span className="text-gradient">CMS</span></h1>
        <button className="btn-primary" onClick={openCreate} title="Create New Article"><Plus size={18} /> New Article</button>
      </div>

      {error && <div className="error-box mb-32">Database table missing. Please run the SQL provided.</div>}

      <div className="blog-stats mb-40">
        <div className="stat-card glass-card">
          <span className="stat-val">{posts.length}</span>
          <span className="stat-tag">Total Posts</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-val text-accent">{publishedCount}</span>
          <span className="stat-tag">Published</span>
        </div>
        <div className="stat-card glass-card">
          <span className="stat-val">{totalViews.toLocaleString()}</span>
          <span className="stat-tag">Views</span>
        </div>
      </div>

      {loading ? <div className="loader"><Loader2 className="animate-spin" /></div> : (
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-card glass-card">
              <div className="post-content">
                <div className="flex gap-12 mb-8 items-center">
                  <span className="text-accent text-[0.6rem] font-black uppercase tracking-widest">{post.category}</span>
                  <span className={`status-tag ${post.status === 'Published' ? 'bg-green' : 'bg-gray'}`}>{post.status}</span>
                </div>
                <h3 className="text-lg font-bold">{post.title}</h3>
                <p className="text-muted text-sm mt-4 line-clamp-1">{post.excerpt}</p>
              </div>
              <div className="post-actions">
                <button className="btn-action" onClick={() => togglePublish(post)} title={post.status === 'Published' ? 'Unpublish' : 'Publish'}>{post.status === 'Published' ? 'Draft' : 'Publish'}</button>
                <button className="icon-btn" onClick={() => openEdit(post)} title="Edit Article"><Edit2 size={16} /></button>
                <button className="icon-btn text-error" onClick={() => setDeleteConfirm(post.id)} title="Delete Article"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="elite-modal-compact glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="text-xl font-bold">{editingId ? 'Edit' : 'Create'} Article</h2>
              <button className="close-btn" onClick={() => setShowModal(false)} title="Close Modal"><X size={20} /></button>
            </div>
            
            <div className="modal-scroll-area">
              <div className="modal-form">
                <div className="field">
                  <label className="form-lbl">Title</label>
                  <input className="form-input" value={draft.title} onChange={e => setDraft({...draft, title: e.target.value})} placeholder="Headline..." title="Article Title" />
                </div>
                <div className="field">
                  <label className="form-lbl">Category</label>
                  <select className="form-input" value={draft.category} onChange={e => setDraft({...draft, category: e.target.value})} title="Article Category">
                    <option>Acting Tips</option>
                    <option>Industry Insights</option>
                    <option>Behind the Scenes</option>
                    <option>Personal</option>
                  </select>
                </div>
                <div className="field">
                  <label className="form-lbl">Cover Image</label>
                  {draft.image_url && (
                    <div className="preview-wrap">
                      <Image src={draft.image_url} alt="Cover Preview" fill unoptimized />
                      <div className="preview-overlay-actions">
                        <button className="overlay-btn" onClick={() => openRecrop(draft.image_url!)} title="Adjust Crop"><Edit2 size={14}/></button>
                        <button className="overlay-btn remove-btn-fix" onClick={() => setDraft({...draft, image_url: ''})} title="Remove Image"><X size={14}/></button>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-8">
                    <input className="form-input flex-1" value={draft.image_url || ''} onChange={e => setDraft({...draft, image_url: e.target.value})} placeholder="URL..." title="Image URL" />
                    <button className="btn-icon-lite" onClick={() => imgInput.current?.click()} title="Upload Image">
                      {uploading === 'image' ? <Loader2 className="animate-spin" size={16}/> : <Upload size={16}/>}
                    </button>
                    <input type="file" ref={imgInput} hidden accept="image/*" onChange={e => handleFileUpload(e, 'image')} title="Select Image File" />
                  </div>
                </div>
                <div className="field">
                  <label className="form-lbl">Video</label>
                  <div className="flex gap-8">
                    <input className="form-input flex-1" value={draft.video_url || ''} onChange={e => setDraft({...draft, video_url: e.target.value})} placeholder="URL..." title="Video URL" />
                    <button className="btn-icon-lite" onClick={() => vidInput.current?.click()} title="Upload Video"><Upload size={16}/></button>
                    <input type="file" ref={vidInput} hidden accept="video/*" onChange={e => handleFileUpload(e, 'video')} title="Select Video File" />
                  </div>
                </div>
                <div className="field">
                  <label className="form-lbl">Summary</label>
                  <textarea className="form-input" value={draft.excerpt} onChange={e => setDraft({...draft, excerpt: e.target.value})} rows={3} title="Article Summary" placeholder="Brief excerpt..." />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setShowModal(false)} title="Cancel Changes">Cancel</button>
              <button className="btn-primary" onClick={savePost} disabled={saving} title="Save Article">{saving ? 'Saving...' : 'Deploy Article'}</button>
            </div>
          </div>
        </div>
      )}

      {croppingImage && (
        <div className="modal-overlay cropper-overlay">
          <div className="modal-box cropper-container-elite">
            <div className="crop-area cropper-workspace-elite">
              <Cropper 
                image={croppingImage} 
                crop={crop} 
                zoom={zoom} 
                aspect={16/9} 
                onCropChange={setCrop} 
                onCropComplete={(_, p) => setCroppedAreaPixels(p)} 
                onZoomChange={setZoom} 
              />
            </div>
            <div className="mt-24">
              <label className="text-[0.65rem] font-black uppercase text-muted mb-8 block">Zoom</label>
              <input 
                type="range" 
                value={zoom} 
                min={1} 
                max={3} 
                step={0.1} 
                onChange={(e) => setZoom(Number(e.target.value))} 
                title="Crop Zoom" 
                className="w-full"
              />
            </div>
            <div className="flex-end gap-12 mt-24">
              <button className="btn-ghost" onClick={() => setCroppingImage(null)} title="Cancel Cropping">Cancel</button>
              <button className="btn-primary" onClick={saveCroppedImage} title="Save Crop">Apply Crop</button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay z-50">
          <div className="modal-box max-w-xs text-center">
            <h3 className="font-bold">Delete Article?</h3>
            <p className="text-sm text-muted mt-8">This action is irreversible.</p>
            <div className="flex-center gap-12 mt-24">
              <button className="btn-ghost" onClick={() => setDeleteConfirm(null)} title="Keep Article">Cancel</button>
              <button className="btn-primary bg-red-600" onClick={() => deletePost(deleteConfirm)} title="Confirm Delete">Delete</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .cms-page { padding: 40px; max-width: 1000px; margin: 0 auto; }
        .flex-between { display: flex; justify-content: space-between; align-items: center; }
        .flex-end { display: flex; justify-content: flex-end; align-items: center; }
        .flex-center { display: flex; justify-content: center; align-items: center; }
        .btn-primary { background: var(--accent); color: white; padding: 12px 24px; border-radius: 8px; font-weight: 700; display: flex; align-items: center; gap: 8px; font-size: 0.9rem; }
        .blog-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .stat-card { padding: 24px; text-align: center; border-radius: 16px; }
        .stat-val { display: block; font-size: 2rem; font-weight: 900; }
        .stat-tag { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; color: var(--muted); letter-spacing: 0.1em; }
        .posts-list { display: grid; gap: 12px; }
        .post-card { padding: 20px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
        .status-tag { padding: 4px 8px; border-radius: 100px; font-size: 0.55rem; font-weight: 900; text-transform: uppercase; }
        .bg-green { background: #22c55e; color: white; }
        .bg-gray { background: #4b5563; color: white; }
        .icon-btn { width: 36px; height: 36px; border-radius: 10px; border: 1px solid var(--glass-border); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .icon-btn:hover { background: rgba(255,255,255,0.1); border-color: white; }
        .post-actions { display: flex; gap: 8px; align-items: center; }
        .btn-action { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; padding: 8px 16px; border-radius: 8px; background: var(--glass); border: 1px solid var(--glass-border); color: var(--fg); cursor: pointer; }
        .close-btn { background: none; border: none; color: var(--muted); cursor: pointer; transition: color 0.3s; display: flex; align-items: center; justify-content: center; }
        .close-btn:hover { color: var(--fg); }
        
        .modal-form { display: flex; flex-direction: column; gap: 12px; }
        .form-lbl { font-size: 0.6rem; font-weight: 800; text-transform: uppercase; color: var(--muted); margin-bottom: 4px; display: block; letter-spacing: 0.05em; }
        .form-input { width: 100%; background: var(--glass); border: 1px solid var(--glass-border); border-radius: 6px; padding: 10px 12px; color: var(--fg); font-size: 0.8rem; transition: all 0.2s; }
        .form-input:focus { border-color: var(--accent); outline: none; }
        .form-input::placeholder { color: var(--muted); }
        
        :global([data-theme='light']) .form-input { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.15); color: #0a0a0a; }
        :global([data-theme='light']) .form-lbl { color: rgba(0,0,0,0.5); }
        :global([data-theme='light']) .btn-action { color: #0a0a0a; background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.1); }
        :global([data-theme='light']) .btn-icon-lite { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.1); color: #0a0a0a; }
        :global([data-theme='light']) .icon-btn { border-color: rgba(0,0,0,0.1); color: #0a0a0a; }
        :global([data-theme='light']) .icon-btn:hover { background: rgba(0,0,0,0.08); border-color: rgba(0,0,0,0.2); }
        :global([data-theme='light']) .post-card { color: #0a0a0a; }
        :global([data-theme='light']) .stat-card { color: #0a0a0a; }
        :global([data-theme='light']) .modal-footer { background: rgba(0,0,0,0.03); }
        :global([data-theme='light']) .btn-ghost { color: rgba(0,0,0,0.6); }
        :global([data-theme='light']) .close-btn { color: rgba(0,0,0,0.4); }
        :global([data-theme='light']) .close-btn:hover { color: #0a0a0a; }
        
        .preview-wrap { position: relative; width: 100%; aspect-ratio: 16/9; border-radius: 10px; overflow: hidden; margin-bottom: 4px; border: 1px solid var(--glass-border); }
        .preview-overlay-actions { position: absolute; top: 8px; right: 8px; display: flex; gap: 4px; z-index: 10; }
        .overlay-btn { width: 24px; height: 24px; border-radius: 50%; background: rgba(0,0,0,0.6); color: white; display: flex; align-items: center; justify-content: center; border: none; cursor: pointer; transition: all 0.2s; }
        .overlay-btn:hover { background: var(--accent); }
        .overlay-btn.remove-btn-fix:hover { background: #ef4444; }
        
        .btn-icon-lite { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 6px; padding: 10px; color: var(--fg); cursor: pointer; }
        .crop-area { position: relative; width: 100%; border-radius: 10px; overflow: hidden; }
        .max-w-2xl { max-width: 600px; }
        .max-w-xs { max-width: 320px; }
        
        .modal-footer { padding: 16px 24px; background: rgba(255,255,255,0.02); border-top: 1px solid var(--glass-border); display: flex; gap: 10px; justify-content: flex-end; }
        .btn-ghost { padding: 10px 20px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; color: var(--muted); cursor: pointer; background: transparent; border: none; }
        .btn-primary { padding: 10px 20px; border-radius: 6px; font-size: 0.8rem; font-weight: 700; background: var(--accent); color: white; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; }
      `}</style>
    </div>
  );
}
