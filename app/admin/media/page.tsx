'use client';

import Image from 'next/image';
import { Upload, Trash2, Copy } from 'lucide-react';

const mediaItems = [
  { id: 1, name: 'akira-main.png', type: 'image', size: '2.4 MB', src: '/akira-main.png' },
  { id: 2, name: 'akira-hero.png', type: 'image', size: '0.6 MB', src: '/akira-hero.png' },
  { id: 3, name: 'studio-bg.jpg', type: 'image', size: '1.2 MB', src: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?auto=format&fit=crop&w=400&q=60' },
  { id: 4, name: 'performance.jpg', type: 'image', size: '0.9 MB', src: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=400&q=60' },
  { id: 5, name: 'acting-reel.mp4', type: 'video', size: '48 MB', src: '' },
  { id: 6, name: 'documentary-vo.mp3', type: 'audio', size: '12 MB', src: '' },
];

const typeIcon: Record<string, string> = { image: '🖼️', video: '🎬', audio: '🎵' };

export default function MediaLibraryPage() {
  return (
    <div className="fade-in">
      <div className="page-header mb-32">
        <div>
          <h1 className="display-md">Media <span className="serif-italic text-gradient">Library</span></h1>
          <p className="text-muted mt-8">{mediaItems.length} files · 65.1 MB used</p>
        </div>
        <label className="btn btn-primary flex-center gap-8 cursor-pointer">
          <Upload className="w-4 h-4" /> Upload File
          <input type="file" className="sr-only" aria-label="Upload media file" />
        </label>
      </div>

      {/* Upload drop zone */}
      <div className="drop-zone glass-card mb-32">
        <Upload className="w-8 h-8 text-muted" />
        <p className="text-muted mt-12">Drag & drop files here, or click Upload</p>
        <p className="text-xs text-muted mt-4">Supports JPG, PNG, MP4, MP3 — Max 100MB</p>
      </div>

      {/* Media grid */}
      <div className="media-grid">
        {mediaItems.map(item => (
          <div key={item.id} className="media-card glass-card">
            <div className="media-preview">
              {item.type === 'image' && item.src ? (
                <Image src={item.src} alt={item.name} fill className="media-img" sizes="(max-width: 768px) 50vw, 25vw" />
              ) : (
                <div className="media-placeholder">
                  <span className="media-type-icon">{typeIcon[item.type]}</span>
                </div>
              )}
              <div className="media-hover-actions">
                <button className="media-icon-btn" aria-label="Copy URL" title="Copy URL"><Copy className="w-4 h-4" /></button>
                <button className="media-icon-btn danger" aria-label="Delete" title="Delete"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="media-info">
              <p className="media-name">{item.name}</p>
              <p className="media-size text-muted text-xs">{item.size}</p>
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page-header { display: flex; justify-content: space-between; align-items: flex-start; }
        .drop-zone { padding: 48px; text-align: center; display: flex; flex-direction: column; align-items: center; border-radius: 16px; border: 2px dashed var(--glass-border); cursor: pointer; transition: border-color 0.3s; }
        .drop-zone:hover { border-color: var(--accent); }
        .media-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
        .media-card { border-radius: 16px; overflow: hidden; }
        .media-preview { position: relative; aspect-ratio: 1; overflow: hidden; background: rgba(255,255,255,0.03); }
        .media-img { object-fit: cover; }
        .media-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; }
        .media-type-icon { font-size: 2.5rem; }
        .media-hover-actions { position: absolute; inset: 0; background: rgba(0,0,0,0.7); opacity: 0; display: flex; align-items: center; justify-content: center; gap: 12px; transition: opacity 0.3s; }
        .media-card:hover .media-hover-actions { opacity: 1; }
        .media-icon-btn { width: 36px; height: 36px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; color: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
        .media-icon-btn:hover { background: white; color: black; }
        .media-icon-btn.danger:hover { background: #ef4444; border-color: #ef4444; color: white; }
        .media-info { padding: 12px 16px; }
        .media-name { font-size: 0.8rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .media-size { margin-top: 2px; }
        .cursor-pointer { cursor: pointer; }
        .sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); }
        .gap-8 { gap: 8px; }
        .mt-4 { margin-top: 4px; }
        .mt-12 { margin-top: 12px; }
        .mb-32 { margin-bottom: 32px; }
        @media (max-width: 1100px) { .media-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (max-width: 768px) { .media-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>
    </div>
  );
}
