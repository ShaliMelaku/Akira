'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type SiteConfig = {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
};

export type SocialLink = {
  platform: string;
  url: string;
};

export function useSettings() {
  const [config, setConfig] = useState<SiteConfig>({
    name: 'Akira Akuna',
    email: 'blackforestua40@gmail.com',
    phone: '+251 923 808 551',
    location: 'Addis Ababa, Ethiopia',
    bio: 'Award-winning voice artist, performance actor and creative influencer based in Ethiopia.'
  });
  const [socials, setSocials] = useState<SocialLink[]>([
    { platform: 'Instagram', url: 'https://instagram.com/aki_akuna' },
    { platform: 'TikTok', url: 'https://tiktok.com/@akuna844' },
    { platform: 'WhatsApp', url: 'https://wa.me/251923808551' }
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data } = await supabase.from('settings').select('*');
        if (data) {
          const siteConfig = data.find(s => s.setting_key === 'site_config');
          if (siteConfig) setConfig(siteConfig.setting_value);

          const socialLinks = data.find(s => s.setting_key === 'social_links');
          if (socialLinks) setSocials(socialLinks.setting_value);
        }
      } catch (err) {
        console.error('Failed to fetch settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { config, socials, loading };
}
