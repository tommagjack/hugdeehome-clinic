import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Settings, Puzzle, BookOpen, Tag, Image, Heart, HelpCircle, LayoutDashboard, LogOut, ArrowLeft, FileSpreadsheet } from 'lucide-react';
import { db } from '../utils/db';
import { t } from '../utils/helpers';

export default function AdminSidebar({ lang }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    db.logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'หน้าสรุปหลัก', enLabel: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/settings', label: 'ตั้งค่าคลินิก', enLabel: 'Clinic Settings', icon: Settings },
    { path: '/admin/services', label: 'จัดการบริการ', enLabel: 'Services CMS', icon: Puzzle },
    { path: '/admin/articles', label: 'จัดการบทความ', enLabel: 'Articles CMS', icon: BookOpen },
    { path: '/admin/promotions', label: 'จัดการโปรโมชั่น', enLabel: 'Promotions CMS', icon: Tag },
    { path: '/admin/gallery', label: 'จัดการแกลเลอรี', enLabel: 'Gallery CMS', icon: Image },
    { path: '/admin/testimonials', label: 'เสียงตอบรับผู้ปกครอง', enLabel: 'Testimonials CMS', icon: Heart },
    { path: '/admin/faqs', label: 'จัดการคำถามพบบ่อย', enLabel: 'FAQs CMS', icon: HelpCircle },
    { path: '/admin/assessments', label: 'จัดการแบบประเมิน', enLabel: 'Assessments CMS', icon: FileSpreadsheet },
  ];

  return (
    <aside className="w-64 bg-white border-r border-primary/10 flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div className="flex flex-col flex-grow">
        
        {/* Brand logo header */}
        <div className="p-6 border-b border-primary/10 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm">
              🏡
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-xs text-clinicText uppercase tracking-wider">Hug Dee CMS</span>
              <span className="text-[10px] text-clinicMuted">Control Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5 flex-grow overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-sm'
                    : 'text-clinicText hover:bg-primary/5 hover:text-primary-dark'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{t(lang, item.label, item.enLabel)}</span>
              </Link>
            );
          })}
        </nav>

      </div>

      {/* Footer operations (Back to site, Log out) */}
      <div className="p-4 border-t border-primary/10 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-clinicMuted hover:bg-primary/5 hover:text-primary-dark transition-all"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span>{t(lang, 'กลับไปยังหน้าเว็บหลัก', 'Back to Public Website')}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-xs font-semibold text-clinicPink-dark hover:bg-clinicPink-light/35 transition-all text-left"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>{t(lang, 'ออกจากระบบ CMS', 'Log Out')}</span>
        </button>
      </div>

    </aside>
  );
}
