import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Globe, 
  Home, 
  Layers, 
  Info, 
  Users, 
  ClipboardCheck, 
  BookOpen, 
  Phone, 
  Settings, 
  Image, 
  Share2, 
  Clock, 
  LogOut, 
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import Logo from '../components/common/Logo';
import { authService } from '../services/auth';

export default function AdminLayout({ children, settings }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const menuSections = [
    {
      title: 'หลัก',
      items: [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard }
      ]
    },
    {
      title: 'เนื้อหาเว็บไซต์ (Website)',
      items: [
        { name: 'หน้าแรก (Home)', path: '/admin/home', icon: Home },
        { name: 'บริการ (Services)', path: '/admin/services', icon: Layers },
        { name: 'เกี่ยวกับเรา (About Us)', path: '/admin/about', icon: Info },
        { name: 'ทีมงาน (Team)', path: '/admin/team', icon: Users },
        { name: 'แบบประเมิน (Assessment)', path: '/admin/assessment', icon: ClipboardCheck },
        { name: 'คู่มือดูแลลูก (Home Guide)', path: '/admin/home-guide', icon: BookOpen },
        { name: 'ติดต่อเรา & ข้อความ (Contact)', path: '/admin/contact', icon: Phone }
      ]
    },
    {
      title: 'การตั้งค่า (Settings)',
      items: [
        { name: 'ข้อมูลทั่วไป (General)', path: '/admin/settings/general', icon: Settings },
        { name: 'โลโก้คลินิก (Logo)', path: '/admin/settings/logo', icon: Image },
        { name: 'โซเชียลมีเดีย (Social Media)', path: '/admin/settings/social', icon: Share2 },
        { name: 'เวลาทำการ (Opening Hours)', path: '/admin/settings/hours', icon: Clock }
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === '/admin/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-brand-warm-white flex">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-brand-border flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto p-5">
          
          {/* Admin Header / Brand */}
          <div className="flex items-center justify-between pb-5 border-b border-brand-border/70 mb-4">
            <Logo settings={settings} variant="mark-only" />
            <div className="flex flex-col ml-2 flex-grow">
              <span className="font-bold text-sm text-brand-text">HugDeeHome CMS</span>
              <span className="text-[11px] text-brand-brown">ระบบจัดการคลินิก</span>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-neutral-400 hover:text-brand-text"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <div className="space-y-6 flex-grow">
            {menuSections.map((section, sIdx) => (
              <div key={sIdx}>
                <h4 className="text-[11px] font-bold text-brand-brown uppercase tracking-wider px-3 mb-1.5">
                  {section.title}
                </h4>
                <nav className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                          active
                            ? 'bg-brand-blue/30 text-brand-text font-bold border-l-4 border-brand-brown'
                            : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-cream/60'
                        }`}
                      >
                        <Icon className={`w-4 h-4 ${active ? 'text-brand-brown' : 'text-neutral-400'}`} />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>

          {/* Sidebar Footer User Info & Logout */}
          <div className="pt-4 mt-4 border-t border-brand-border/70 flex flex-col gap-2">
            <div className="flex items-center justify-between px-3 py-2 bg-brand-warm-white rounded-xl border border-brand-border/60">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-brand-text">{currentUser.displayName}</span>
                <span className="text-[10px] text-brand-text-muted font-mono">@{currentUser.username}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors"
                title="ออกจากระบบ"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-brand-brown hover:bg-brand-cream rounded-xl transition-colors"
            >
              <span>เปิดดูหน้าเว็บจริง</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-brand-border flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl text-brand-text lg:hidden hover:bg-brand-cream"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-sm font-semibold text-brand-text hidden sm:inline">
              คลินิกพัฒนาการเด็กบ้านฮักดี • Admin Console
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-brand-brown bg-brand-cream px-3 py-1.5 rounded-xl border border-brand-border flex items-center gap-1 hover:bg-brand-yellow/30 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>ดูเว็บไซต์</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {children}
        </main>

      </div>

    </div>
  );
}
