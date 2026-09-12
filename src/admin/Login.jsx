import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ShieldCheck, ArrowLeft } from 'lucide-react';
import Logo from '../components/common/Logo';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { authService } from '../services/auth';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = authService.login(username, password);
    if (res.success) {
      navigate('/admin/dashboard');
    } else {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-warm-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block mb-4">
          <Logo variant="mark-only" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">
          ระบบจัดการหลังบ้าน (CMS)
        </h2>
        <p className="mt-2 text-sm text-brand-text-muted">
          คลินิกพัฒนาการเด็กบ้านฮักดี (HugDeeHome)
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-10 rounded-3xl border border-brand-border shadow-soft-xl space-y-6">
          
          {error && <Alert type="warning">{error}</Alert>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                ชื่อผู้ใช้งาน (Username)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="username"
                  placeholder="ระบุชื่อผู้ใช้งาน"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-brand-warm-white focus:bg-white focus:border-brand-blue text-sm text-brand-text focus-visible:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                รหัสผ่าน (Password)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="ระบุรหัสผ่าน"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brand-border bg-brand-warm-white focus:bg-white focus:border-brand-blue text-sm text-brand-text focus-visible:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full justify-center font-semibold"
              >
                เข้าสู่ระบบ
              </Button>
            </div>
          </form>

          <div className="pt-4 border-t border-brand-border/60 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center gap-1.5 text-xs text-brand-text-muted hover:text-brand-brown transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>กลับสู่หน้าหลักของเว็บไซต์</span>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
