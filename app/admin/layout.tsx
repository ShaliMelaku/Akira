'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { 
  LayoutDashboard, Users, Calendar, Film, Briefcase, 
  Building2, MessageSquare, FileText, 
  Settings, LogOut, Bell, Search, Sun, Moon, Menu
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={18} /> },
  { label: 'Calendar', href: '/admin/calendar', icon: <Calendar size={18} /> },
  { label: 'Bookings', href: '/admin/bookings', icon: <FileText size={18} /> },
  { label: 'CRM / Clients', href: '/admin/clients', icon: <Users size={18} /> },
  { label: 'Portfolio', href: '/admin/portfolio', icon: <Film size={18} /> },
  { label: 'Services', href: '/admin/services', icon: <Briefcase size={18} /> },
  { label: 'Clients', href: '/admin/customers', icon: <Building2 size={18} /> },
  { label: 'Testimonials', href: '/admin/testimonials', icon: <MessageSquare size={18} /> },
  { label: 'Blog', href: '/admin/blog', icon: <FileText size={18} /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings size={18} /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
      setMounted(true);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session && pathname !== '/admin/login') {
        router.push('/admin/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [pathname, router]);

  const [notifs, setNotifs] = useState([
    { id: 1, text: 'New booking request from Abebe Kebede', time: '5m ago', read: false },
    { id: 2, text: 'Sarah Tesfaye confirmed the meeting', time: '1h ago', read: false },
    { id: 3, text: 'System update completed', time: '2h ago', read: true }
  ]);

  const unreadCount = notifs.filter(n => !n.read).length;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
  };

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, read: true })));
    setShowNotifs(false);
  };

  if (!mounted) return null;
  if (pathname === '/admin/login') return <>{children}</>;
  if (!session) return null; // Prevent flicker while redirecting

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-icon">A</div>
          <div className="header-text">
            <div className="brand-name font-display text-lg tracking-tight">AKIRA <span className="text-accent">ADMIN</span></div>
            <div className="brand-version text-muted text-[10px] uppercase tracking-widest font-bold">Studio v3.5</div>
          </div>
        </div>

        <div className="sidebar-scroll-area">
          <nav className="sidebar-nav">
            {menuItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href} 
                  className={`sidebar-link ${active ? 'active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sidebar-icon">{item.icon}</span>
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <Link href="/" className="sidebar-link footer-link">
            <LayoutDashboard size={16} />
            <span>Visit Site</span>
          </Link>
          <button className="sidebar-link logout-link" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-topbar glass-card">
          <div className="flex align-center gap-16">
            <button 
              className="mobile-menu-btn" 
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Sidebar"
              title="Open Sidebar"
            >
              <Menu size={20} />
            </button>
            <div className="search-bar">
              <Search size={18} className="text-muted" />
              <input type="text" placeholder="Quick search..." className="search-input" />
            </div>
          </div>
          
          <div className="flex align-center gap-12 relative">
            <button 
              className="theme-toggle-btn" 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle Theme"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="noti-btn" onClick={() => setShowNotifs(!showNotifs)}>
              <Bell size={18} />
              {unreadCount > 0 && <span className="badge-dot"></span>}
            </button>
            
            {showNotifs && (
              <div className="notifs-dropdown glass-card">
                <div className="notifs-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && <button onClick={markAllRead} className="text-xs text-accent">Mark all read</button>}
                </div>
                <div className="notifs-list">
                  {notifs.length === 0 ? (
                    <div className="p-16 text-muted text-sm text-center">No notifications</div>
                  ) : (
                    notifs.map(n => (
                      <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`}>
                        <div className="notif-text">{n.text}</div>
                        <div className="notif-time text-xs text-muted mt-4">{n.time}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            <div className="admin-avatar">A</div>
          </div>
        </header>
        
        {children}
      </main>

      <style jsx>{`
        .admin-sidebar {
          width: 260px;
          height: 100vh;
          background: var(--bg);
          border-right: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          position: fixed;
          top: 0;
          left: 0;
          z-index: 1000;
          transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .sidebar-header {
          padding: 32px 24px;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          width: 40px;
          height: 40px;
          background: var(--grad-accent);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-weight: 900;
          color: white;
          box-shadow: 0 8px 16px rgba(255, 77, 0, 0.2);
        }

        .sidebar-scroll-area {
          flex: 1;
          overflow-y: auto;
          padding: 0 16px;
        }

        .sidebar-scroll-area::-webkit-scrollbar { width: 4px; }
        .sidebar-scroll-area::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 10px; }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 14px;
          color: var(--muted);
          font-size: 0.9rem;
          font-weight: 600;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }

        .sidebar-link:hover {
          background: var(--glass);
          color: var(--fg);
          transform: translateX(4px);
        }

        .sidebar-link.active {
          background: var(--accent);
          color: white;
          box-shadow: 0 10px 20px rgba(255, 77, 0, 0.15);
        }

        .sidebar-link.active .sidebar-icon { color: white; opacity: 1; }

        .sidebar-footer {
          padding: 24px 16px;
          border-top: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .footer-link:hover { color: var(--fg); }
        .logout-link:hover { color: #ef4444; background: rgba(239, 68, 68, 0.05); }

        .theme-toggle-btn, .noti-btn {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          color: var(--muted);
          cursor: pointer;
          transition: all 0.2s;
        }

        .theme-toggle-btn:hover, .noti-btn:hover {
          color: var(--fg);
          border-color: var(--muted);
          background: rgba(255,255,255,0.05);
        }

        .mobile-menu-btn {
          display: none;
          background: none;
          border: none;
          color: var(--fg);
          cursor: pointer;
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 999;
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        @media (max-width: 1024px) {
          .admin-sidebar { transform: translateX(-260px); }
          .admin-sidebar.open { transform: translateX(0); }
          .mobile-menu-btn { display: block; }
          .sidebar-overlay.show { display: block; opacity: 1; pointer-events: auto; }
          .admin-content { padding: 20px; margin-left: 0; }
          .search-input { width: 140px; }
        }

        .admin-content {
          margin-left: 260px;
          flex: 1;
          padding: 40px;
          transition: all 0.4s var(--ease);
        }

        .admin-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          margin-bottom: 32px;
        }

        .search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          background: rgba(255,255,255,0.02);
          border: 1px solid var(--glass-border);
          border-radius: 10px;
        }

        .search-input {
          background: none;
          border: none;
          outline: none;
          color: var(--fg);
          font-size: 0.85rem;
          width: 200px;
        }


        .badge-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: #ef4444;
          border-radius: 50%;
        }

        .admin-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--grad-accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .relative { position: relative; }
        .notifs-dropdown {
          position: absolute;
          top: 50px;
          right: 60px;
          width: 320px;
          border-radius: 16px;
          overflow: hidden;
          z-index: 100;
          border: 1px solid var(--glass-border);
          box-shadow: 0 10px 40px rgba(0,0,0,0.5);
        }
        .notifs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid var(--glass-border);
          background: rgba(255,255,255,0.02);
        }
        .notifs-header h4 { font-weight: 700; font-size: 0.9rem; }
        .notifs-list {
          max-height: 300px;
          overflow-y: auto;
        }
        .notif-item {
          padding: 16px;
          border-bottom: 1px solid var(--glass-border);
          font-size: 0.85rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .notif-item:hover { background: rgba(255,255,255,0.02); }
        .notif-item:last-child { border-bottom: none; }
        .notif-item.unread { border-left: 3px solid var(--accent); background: rgba(255, 77, 0, 0.05); }
        .mt-4 { margin-top: 4px; }
      `}</style>
    </div>
  );
}
