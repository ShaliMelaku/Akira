'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, Mail, Key, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data?.session) {
        router.push('/admin');
      }
    } catch (err: unknown) {
      setError('An unexpected error occurred. Please check your connection.');
      console.error('Login error:', err);
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="admin-login-wrap">
      <div className="bg-glow" />
      
      <div className="login-box glass">
        <div className="text-center mb-48">
          <div className="logo-icon">A</div>
          <h1 className="login-title mt-24">Admin <span className="serif-italic">Access</span></h1>
          <p className="text-muted mt-8">Secure Dashboard Authentication</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="adminEmail" className="form-label">Email Address</label>
            <div className="input-wrap">
              <Mail className="w-4 h-4 icon-l" />
              <input 
                id="adminEmail" 
                name="email"
                type="email" 
                className="form-input" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="blackforestua40@gmail.com" 
              />
            </div>
          </div>
          
          <div className="form-group mt-24">
            <label htmlFor="adminPass" className="form-label">Password</label>
            <div className="input-wrap">
              <Key className="w-4 h-4 icon-l" />
              <input 
                id="adminPass" 
                name="password"
                type="password" 
                className="form-input" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="btn btn-primary w-full mt-40 flex-center group" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Lock className="w-4 h-4 mr-2" />}
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="text-center mt-32">
          <Link href="/" className="back-home-link group">
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
            <span>Back to Website</span>
          </Link>
        </div>
      </div>

      <style jsx>{`
        .admin-login-wrap {
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg);
          padding: 40px 20px;
          position: relative;
          overflow-y: auto;
          color: var(--fg);
        }

        .bg-glow {
          position: absolute;
          width: 60%;
          height: 60%;
          background: radial-gradient(circle, rgba(255, 77, 0, 0.08) 0%, transparent 70%);
          filter: blur(80px);
          z-index: 1;
        }

        .login-box {
          width: 95%;
          max-width: 480px;
          padding: 40px;
          border-radius: 40px;
          position: relative;
          z-index: 10;
          box-sizing: border-box;
        }

        .logo-icon {
          width: 64px;
          height: 64px;
          background: var(--accent);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          margin: 0 auto;
          box-shadow: 0 10px 30px rgba(255, 77, 0, 0.3);
        }

        .login-title {
          font-family: var(--font-display);
          font-size: 2rem;
          font-weight: 900;
          letter-spacing: -0.02em;
          color: var(--fg);
        }

        .error-msg {
          color: #ef4444;
          font-size: 0.8rem;
          margin-top: 12px;
          text-align: center;
          font-weight: 600;
        }

        .form-label {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          display: block;
          margin-bottom: 12px;
        }

        .input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .icon-l {
          position: absolute;
          left: 20px;
          color: var(--muted);
          pointer-events: none;
        }

        .form-input {
          width: 100%;
          padding: 16px 20px 16px 52px;
          background: var(--glass);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          color: var(--fg);
          font-size: 1rem;
          outline: none;
          transition: all 0.3s ease;
        }

        .form-input:focus {
          border-color: var(--accent);
          background: rgba(255, 77, 0, 0.05);
        }

        .back-home-link {
          display: inline-flex;
          align-items: center;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--muted);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .back-home-link:hover {
          color: var(--fg);
        }

        .w-full { width: 100%; }
        .mt-8 { margin-top: 8px; }
        .mt-24 { margin-top: 24px; }
        .mt-32 { margin-top: 32px; }
        .mt-40 { margin-top: 40px; }
        .mt-48 { margin-bottom: 48px; }
        .mr-2 { margin-right: 8px; }

        @media (max-width: 600px) {
          .login-box { padding: 40px 24px; }
          .login-title { font-size: 1.75rem; }
          .logo-icon { width: 56px; height: 56px; font-size: 1.75rem; }
        }
        
        @media (max-width: 400px) {
          .login-box { padding: 32px 20px; border-radius: 32px; }
          .login-title { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
