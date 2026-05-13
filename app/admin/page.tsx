'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, Calendar, Users, Eye, 
  ArrowUpRight, Clock, CheckCircle2, MoreHorizontal, Loader2 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

type Booking = {
  id: number;
  client_name: string;
  company: string;
  service_requested: string;
  status: string;
  created_at: string;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: '0',
    pending: 0,
    clients: 0,
    views: '2.4K'
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      try {
        const { data: bookings } = await supabase.from('bookings').select('*');
        
        if (bookings) {
          const pending = bookings.filter(b => b.status === 'Pending').length;
          const clients = new Set(bookings.map(b => b.email)).size;
          
          // Calculate approximate revenue (taking the lower bound of ranges)
          const totalRevenue = bookings.reduce((acc, curr) => {
            if (curr.status === 'Completed' || curr.status === 'Confirmed') {
              // Extract first number found in string (lower bound)
              const match = curr.budget?.match(/\d+/g);
              const val = match ? parseInt(match.join('').slice(0, Math.ceil(match.join('').length / 2))) : 0;
              // Simpler approach: just take the first part before the dash
              const firstPart = curr.budget?.split('-')[0].replace(/[^0-9]/g, '') || '0';
              return acc + parseInt(firstPart);
            }
            return acc;
          }, 0);

          setStats({
            revenue: (totalRevenue / 1000).toFixed(1) + 'K',
            pending,
            clients,
            views: '2.4K' // Static for now
          });

          // Sort and take top 3
          const recent = [...bookings]
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
            .slice(0, 3);
          setRecentBookings(recent);
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard-v3 fade-in">
      <div className="dashboard-header mb-40">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h1 className="display-md text-3xl font-bold tracking-tight">Executive <span className="text-gradient">Overview</span></h1>
          <p className="text-muted mt-8">Welcome back, Akira. Here is your platform&apos;s current performance.</p>
        </motion.div>
        
        <div className="header-actions">
          <button className="btn btn-primary btn-sm">Download Report</button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid-4 mb-40">
        {[
          { label: 'Total Revenue', val: stats.revenue, unit: 'ETB', trend: '+12%', icon: <TrendingUp size={20} />, cls: 'accent' },
          { label: 'Pending Bookings', val: stats.pending.toString().padStart(2, '0'), unit: '', trend: 'Needs Action', icon: <Calendar size={20} />, cls: 'warn' },
          { label: 'Active Clients', val: stats.clients.toString(), unit: '', trend: '+3 new', icon: <Users size={20} />, cls: 'success' },
          { label: 'Portfolio Views', val: stats.views, unit: '', trend: '+8%', icon: <Eye size={20} />, cls: 'info' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            className="stat-card-v3 glass-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={stat.label === 'Pending Bookings' ? '/admin/bookings' : '#'} className="block">
              <div className="stat-header">
                <div className={`stat-icon-box color-${stat.cls}`}>
                  {stat.icon}
                </div>
                <span className={`stat-trend ${stat.trend.includes('+') ? 'up' : 'warn'}`}>{stat.trend}</span>
              </div>
              <div className="stat-body mt-20">
                <h3 className="stat-label text-muted text-xs uppercase tracking-widest font-bold">{stat.label}</h3>
                <div className="stat-value-group mt-8">
                  <span className="stat-value text-3xl font-bold">{stat.val}</span>
                  {stat.unit && <span className="stat-unit text-xs ml-4 opacity-50">{stat.unit}</span>}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid-2 gap-32">
        {/* Recent Activity */}
        <motion.div 
          className="glass-card activity-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="panel-header mb-24">
            <h3 className="text-lg font-bold">Recent Bookings</h3>
            <Link href="/admin/bookings" className="text-xs text-accent font-bold uppercase tracking-wider">View All</Link>
          </div>
          
          <div className="table-responsive">
            {loading ? (
              <div className="flex-center py-40"><Loader2 className="animate-spin text-accent" /></div>
            ) : (
              <table className="admin-table-v3">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Service</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-20 text-muted text-sm">No recent bookings.</td>
                    </tr>
                  ) : recentBookings.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="client-info">
                          <div className="client-avatar">{row.client_name[0]}</div>
                          <div>
                            <div className="font-bold text-sm">{row.client_name}</div>
                            <div className="text-xs text-muted">{row.company || 'Private'}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-sm">{row.service_requested}</span></td>
                      <td>
                        <span className={`status-tag ${row.status.toLowerCase().replace(' ', '-')}`}>
                          {row.status}
                        </span>
                      </td>
                      <td>
                        <button className="p-8 text-muted hover:text-fg" aria-label="More options" title="More options"><MoreHorizontal size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="glass-card actions-panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-bold mb-24">Quick Actions</h3>
          <div className="actions-stack">
            <Link href="/admin/portfolio" className="action-row-btn glass">
              <div className="action-icon bg-accent-soft text-accent"><ArrowUpRight size={18}/></div>
              <div className="action-text">
                <span className="action-title">New Portfolio Project</span>
                <span className="action-desc text-xs text-muted">Upload media and set project tags</span>
              </div>
            </Link>
            <Link href="/admin/calendar" className="action-row-btn glass">
              <div className="action-icon bg-blue-soft text-blue"><Clock size={18}/></div>
              <div className="action-text">
                <span className="action-title">Schedule Availability</span>
                <span className="action-desc text-xs text-muted">Manage your booking calendar</span>
              </div>
            </Link>
            <Link href="/admin/testimonials" className="action-row-btn glass">
              <div className="action-icon bg-green-soft text-green"><CheckCircle2 size={18}/></div>
              <div className="action-text">
                <span className="action-title">Publish Testimonial</span>
                <span className="action-desc text-xs text-muted">Approve and feature client feedback</span>
              </div>
            </Link>
          </div>
          
          <div className="system-health mt-40 pt-24 border-t border-glass">
            <div className="flex justify-between align-center mb-12">
              <span className="text-xs font-bold text-muted uppercase tracking-wider">System Status</span>
              <span className="status-online text-xs font-bold text-success">ONLINE</span>
            </div>
            <div className="health-bar-bg">
              <div className="health-bar-fill"></div>
            </div>
            <p className="text-[10px] text-muted mt-8 uppercase tracking-widest">Global CDN Performance: 98.4% Efficiency</p>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .admin-dashboard-v3 {
          padding: 10px;
        }
        
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }

        .stat-card-v3 {
          padding: 24px;
          border-radius: 20px;
          transition: transform 0.3s var(--ease);
        }
        .stat-card-v3:hover { transform: translateY(-5px); }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .stat-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--glass);
          border: 1px solid var(--glass-border);
        }
        
        .color-accent { color: var(--accent); }
        .color-warn { color: #f59e0b; }
        .color-success { color: #10b981; }
        .color-info { color: #6366f1; }
        .stat-trend {
          font-size: 0.7rem;
          font-weight: 800;
          padding: 4px 8px;
          border-radius: 6px;
        }
        .stat-trend.up { background: rgba(16,185,129,0.1); color: #10b981; }
        .stat-trend.warn { background: rgba(245,158,11,0.1); color: #f59e0b; }

        .admin-table-v3 {
          width: 100%;
          border-collapse: collapse;
        }
        .admin-table-v3 th {
          text-align: left;
          padding: 12px 16px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          border-bottom: 1px solid var(--glass-border);
        }
        .admin-table-v3 td {
          padding: 16px;
          border-bottom: 1px solid var(--glass-border);
        }
        .admin-table-v3 tr:last-child td { border-bottom: none; }

        .client-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .client-avatar {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--accent-soft);
          color: var(--accent);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 0.8rem;
        }

        .status-tag {
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 99px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .status-tag.pending { background: rgba(245,158,11,0.1); color: #f59e0b; border: 1px solid rgba(245,158,11,0.2); }
        .status-tag.in-progress { background: rgba(99,102,241,0.1); color: #6366f1; border: 1px solid rgba(99,102,241,0.2); }
        .status-tag.completed { background: rgba(16,185,129,0.1); color: #10b981; border: 1px solid rgba(16,185,129,0.2); }

        .actions-stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .action-row-btn {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          border-radius: 16px;
          text-align: left;
          width: 100%;
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-row-btn:hover { background: var(--glass-border); transform: translateX(5px); }
        
        .action-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .action-title { display: block; font-weight: 700; font-size: 0.9rem; }
        
        .bg-accent-soft { background: rgba(255, 77, 0, 0.1); }
        .bg-blue-soft { background: rgba(59, 130, 246, 0.1); }
        .bg-green-soft { background: rgba(16, 185, 129, 0.1); }
        .text-blue { color: #3b82f6; }
        .text-green { color: #10b981; }

        .health-bar-bg {
          width: 100%;
          height: 6px;
          background: var(--glass-border);
          border-radius: 10px;
          overflow: hidden;
        }
        .health-bar-fill {
          height: 100%;
          background: linear-gradient(to right, var(--accent), #10b981);
          border-radius: 10px;
          width: 98%;
        }

        @media (max-width: 768px) {
          .dashboard-header { flex-direction: column; align-items: flex-start; gap: 20px; }
          .header-actions { width: 100%; }
          .header-actions .btn { width: 100%; justify-content: center; }
          .stat-card-v3 { padding: 20px; }
        }
      `}</style>
    </div>
  );
}
