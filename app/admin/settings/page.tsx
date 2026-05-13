'use client';

import { useState, useEffect } from 'react';
import { Save, User, Globe, Palette, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ 
    name: 'Akira Akuna', 
    email: 'blackforestua40@gmail.com', 
    phone: '+251 923 808 551', 
    location: 'Addis Ababa, Ethiopia', 
    bio: 'Award-winning voice artist...' 
  });
  const [socials, setSocials] = useState<{platform: string, url: string}[]>([]);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase.from('settings').select('*');
    
    if (data) {
      const config = data.find(s => s.setting_key === 'site_config');
      if (config) setProfile(config.setting_value);
      
      const socs = data.find(s => s.setting_key === 'social_links');
      if (socs) setSocials(socs.setting_value);
    }
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await fetchSettings();
    };
    init();
  }, []);

  const saveAll = async () => {
    // Verification
    if (!profile.name?.trim()) return toast.error('Professional name is required');
    if (!profile.email?.trim()) return toast.error('Primary email is required');
    if (!profile.location?.trim()) return toast.error('Studio location is required');
    
    // Email format verification
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(profile.email)) return toast.error('Invalid email format');

    // Social links verification
    const hasEmptySocial = socials.some(s => !s.url?.trim());
    if (hasEmptySocial) return toast.error('All social links must have a valid URL');

    setSaving(true);
    try {
      const { error: err1 } = await supabase.from('settings').upsert({ 
        setting_key: 'site_config', 
        setting_value: profile 
      }, { onConflict: 'setting_key' });

      const { error: err2 } = await supabase.from('settings').upsert({ 
        setting_key: 'social_links', 
        setting_value: socials 
      }, { onConflict: 'setting_key' });

      if (err1 || err2) throw new Error('Update failed');
      toast.success('Settings synchronized successfully');
    } catch {
      toast.error('Failed to sync settings with database');
    }
    setSaving(false);
  };

  const addSocial = () => setSocials([...socials, { platform: 'Instagram', url: '' }]);
  const updateSocial = (idx: number, key: 'platform' | 'url', val: string) => {
    const next = [...socials];
    next[idx] = { ...next[idx], [key]: val };
    setSocials(next);
  };
  const removeSocial = (idx: number) => setSocials(socials.filter((_, i) => i !== idx));

  return (
    <div className="fade-in">
      <div className="page-header mb-40">
        <div>
          <h1 className="display-md text-3xl font-bold">Account <span className="text-gradient">Settings</span></h1>
          <p className="text-muted mt-8">Manage your profile and platform preferences</p>
        </div>
        <button 
          className="btn btn-primary flex-center gap-8" 
          onClick={saveAll} 
          disabled={saving}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? 'Deploying...' : 'Deploy Changes'}
        </button>
      </div>

      {loading ? (
        <div className="flex-center py-80"><Loader2 size={40} className="animate-spin text-accent" /></div>
      ) : (
        <div className="settings-grid">
          {/* Profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="settings-section glass-card">
            <div className="section-hdr">
              <User className="w-5 h-5 text-accent" />
              <h3>Identity & Branding</h3>
            </div>
            <div className="settings-form mt-24">
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-lbl">Professional Name</label>
                  <input className="form-input" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} title="Professional Name" placeholder="e.g. Akira Akuna" onPaste={e => e.preventDefault()} />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Primary Email</label>
                  <input className="form-input" type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} title="Email Address" placeholder="blackforestua40@gmail.com" onPaste={e => e.preventDefault()} />
                </div>
              </div>
              <div className="form-row-2">
                <div className="form-group">
                  <label className="form-lbl">Phone Contact</label>
                  <input className="form-input" type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} title="Phone Number" placeholder="+251..." onPaste={e => e.preventDefault()} />
                </div>
                <div className="form-group">
                  <label className="form-lbl">Studio Location</label>
                  <input className="form-input" value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} title="Studio Location" placeholder="Addis Ababa, Ethiopia" onPaste={e => e.preventDefault()} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-lbl">Executive Bio</label>
                <textarea className="form-input bio-ta" value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} title="Professional Bio" placeholder="Tell your story..." onPaste={e => e.preventDefault()} />
              </div>
            </div>
          </motion.div>

          {/* Social Presence */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="settings-section glass-card">
            <div className="section-hdr">
              <Globe className="w-5 h-5 text-accent" />
              <h3>Digital Presence</h3>
            </div>
            <div className="settings-form mt-24">
              <p className="text-xs text-muted mb-12 uppercase tracking-widest font-bold">Manage your global social links</p>
              <AnimatePresence>
                {socials.map((soc, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, scale: 0.9 }} 
                    className="form-group social-row-elite"
                  >
                    <div className="social-input-group">
                      <select 
                        className="form-input platform-select" 
                        value={soc.platform} 
                        onChange={e => updateSocial(i, 'platform', e.target.value)}
                        title="Social Platform"
                      >
                        <option>Instagram</option>
                        <option>TikTok</option>
                        <option>YouTube</option>
                        <option>Twitter</option>
                        <option>LinkedIn</option>
                        <option>WhatsApp</option>
                        <option>Facebook</option>
                      </select>
                      <input 
                        className="form-input" 
                        value={soc.url} 
                        onChange={e => updateSocial(i, 'url', e.target.value)} 
                        placeholder="https://..."
                        title="Profile URL"
                        onPaste={e => e.preventDefault()}
                      />
                    </div>
                    <button className="remove-btn-elite" onClick={() => removeSocial(i)} aria-label="Remove social link">&times;</button>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button className="btn btn-outline btn-sm w-fit mt-12" onClick={addSocial}>+ Add Connection</button>
            </div>
          </motion.div>

          {/* System Health / Meta */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="settings-section glass-card col-span-2">
            <div className="section-hdr">
              <Palette className="w-5 h-5 text-accent" />
              <h3>Platform Configuration</h3>
            </div>
            <div className="grid-3 gap-32 mt-24">
              <div className="config-item glass p-24 rounded-20">
                <h4 className="text-sm font-bold mb-8">PWA Status</h4>
                <div className="flex align-center gap-8">
                  <div className="w-8 h-8 rounded-full bg-success"></div>
                  <span className="text-xs uppercase font-bold tracking-widest">Active & Installable</span>
                </div>
              </div>
              <div className="config-item glass p-24 rounded-20">
                <h4 className="text-sm font-bold mb-8">Service Worker</h4>
                <div className="flex align-center gap-8">
                  <div className="w-8 h-8 rounded-full bg-success"></div>
                  <span className="text-xs uppercase font-bold tracking-widest">v4.2.0 Stabilized</span>
                </div>
              </div>
              <div className="config-item glass p-24 rounded-20">
                <h4 className="text-sm font-bold mb-8">Data Sync</h4>
                <div className="flex align-center gap-8">
                  <div className="w-8 h-8 rounded-full bg-accent"></div>
                  <span className="text-xs uppercase font-bold tracking-widest">Supabase Live</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      <style jsx>{`
        .settings-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; }
        .col-span-2 { grid-column: span 2; }
        .settings-section { padding: 40px; border-radius: 32px; }
        .section-hdr { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
        .section-hdr h3 { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; }
        .settings-form { display: flex; flex-direction: column; gap: 24px; }
        .form-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 10px; }
        .form-lbl { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); }
        .bio-ta { min-height: 120px; resize: vertical; line-height: 1.6; }
        
        .social-row-elite { display: flex; align-items: center; gap: 12px; }
        .social-input-group { flex: 1; display: flex; gap: 8px; }
        .platform-select { width: 130px; flex-shrink: 0; }
        .url-input-elite { flex: 1; }
        .remove-btn-elite { width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.03); color: var(--muted); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer; border: 1px solid var(--glass-border); transition: all 0.2s; }
        .remove-btn-elite:hover { background: #ef4444; color: white; border-color: #ef4444; }

        .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); }
        .config-item { border: 1px solid var(--glass-border); }

        @media (max-width: 1100px) { .settings-grid { grid-template-columns: 1fr; } .col-span-2 { grid-column: span 1; } }
        @media (max-width: 600px) { .form-row-2, .grid-3 { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
