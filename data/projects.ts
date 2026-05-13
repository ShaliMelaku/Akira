export interface Project {
  id: number;
  title: string;
  cat: string;
  img: string;
  size: 'large' | 'medium' | 'small';
  desc: string;
  client: string;
  year: string;
  platform?: 'tiktok' | 'instagram' | 'youtube';
  embedUrl?: string; // Direct embed URL
  socialUrl?: string; // Link to original post
  role?: string;
  deliverables?: string;
}

// Real social content from Akira's handles:
// TikTok: @akuna844 | Instagram: @aki_akuna
export const projects: Project[] = [
  {
    id: 1,
    title: 'TikTok Reel – Cinematic',
    cat: 'Social',
    img: '/akira-main.png',
    size: 'large',
    desc: 'A viral cinematic short showcasing Akira\'s presence, style, and storytelling ability. One of his signature TikTok pieces that defined his visual brand.',
    client: 'Self — Personal Brand',
    year: '2025',
    platform: 'tiktok',
    socialUrl: 'https://www.tiktok.com/@akuna844',
    embedUrl: 'https://www.tiktok.com/embed/@akuna844',
    role: 'Creator, Director, Performer',
    deliverables: 'Short-form video, Social Campaign',
  },
  {
    id: 2,
    title: 'Instagram — Brand Story',
    cat: 'Commercial',
    img: '/akira-main.png',
    size: 'medium',
    desc: 'A premium Instagram Reel produced for a local fashion brand, highlighting Akira\'s dual role as voice talent and on-screen performer.',
    client: 'Ethiopian Fashion Co.',
    year: '2025',
    platform: 'instagram',
    socialUrl: 'https://www.instagram.com/aki_akuna/',
    embedUrl: 'https://www.instagram.com/aki_akuna/embed',
    role: 'Brand Ambassador, Voiceover',
    deliverables: 'Instagram Reel, Story Series',
  },
  {
    id: 3,
    title: 'TikTok — Voice Artistry',
    cat: 'Voiceover',
    img: '/akira-main.png',
    size: 'small',
    desc: 'Akira demonstrates his range and mastery of voice in this captivating TikTok series. Each clip showcases a different character voice and emotional register.',
    client: 'Self — Creative Showcase',
    year: '2024',
    platform: 'tiktok',
    socialUrl: 'https://www.tiktok.com/@akuna844',
    embedUrl: 'https://www.tiktok.com/embed/@akuna844',
    role: 'Voice Artist, Creator',
    deliverables: 'TikTok Series (6 episodes)',
  },
  {
    id: 4,
    title: 'Instagram — Lifestyle Series',
    cat: 'Social',
    img: '/akira-main.png',
    size: 'medium',
    desc: 'A curated Instagram content series documenting Akira\'s day-to-day life as a creative professional in Addis Ababa.',
    client: 'Self — Personal Brand',
    year: '2025',
    platform: 'instagram',
    socialUrl: 'https://www.instagram.com/aki_akuna/',
    embedUrl: 'https://www.instagram.com/aki_akuna/embed',
    role: 'Director, Performer, Host',
    deliverables: 'Instagram Reels, Carousel Posts',
  },
  {
    id: 5,
    title: 'National Bank Campaign',
    cat: 'Commercial',
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    size: 'large',
    desc: 'A 3-day broadcast commercial shoot for one of Ethiopia\'s leading financial institutions. Akira served as the lead voice and on-screen talent for the campaign.',
    client: 'Awash Bank',
    year: '2024',
    role: 'Lead Voice, On-Screen Talent',
    deliverables: 'TV Commercial, Radio Spot, Digital Assets',
  },
  {
    id: 6,
    title: 'TikTok — Acting Reel',
    cat: 'Acting',
    img: '/akira-main.png',
    size: 'small',
    desc: 'A dramatic acting showcase on TikTok that went viral across East Africa, demonstrating Akira\'s ability to convey complex emotions in short-form content.',
    client: 'Self — Talent Showcase',
    year: '2025',
    platform: 'tiktok',
    socialUrl: 'https://www.tiktok.com/@akuna844',
    embedUrl: 'https://www.tiktok.com/embed/@akuna844',
    role: 'Actor, Director',
    deliverables: 'TikTok Viral Content',
  },
  {
    id: 7,
    title: 'Echoes of Addis',
    cat: 'Documentary',
    img: 'https://images.unsplash.com/photo-1478737270239-2fccd27ee10f?auto=format&fit=crop&w=1200&q=80',
    size: 'medium',
    desc: 'Narrative voiceover for a documentary exploring the cultural and architectural history of Addis Ababa — told through the lens of its people.',
    client: 'Heritage Foundation',
    year: '2024',
    role: 'Narrator, Voiceover Artist',
    deliverables: 'Documentary VO, Promotional Trailer',
  },
  {
    id: 8,
    title: 'Instagram — Behind the Scenes',
    cat: 'Social',
    img: '/akira-main.png',
    size: 'small',
    desc: 'An intimate behind-the-scenes series on Instagram that gave followers a look into Akira\'s creative process, from script reading to post-production.',
    client: 'Self — Audience Engagement',
    year: '2024',
    platform: 'instagram',
    socialUrl: 'https://www.instagram.com/aki_akuna/',
    embedUrl: 'https://www.instagram.com/aki_akuna/embed',
    role: 'Creator, Host',
    deliverables: 'Instagram Story Series',
  },
];
