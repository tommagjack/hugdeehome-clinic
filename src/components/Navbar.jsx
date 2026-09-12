import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, LogIn } from 'lucide-react';
import { t } from '../utils/helpers';

export default function Navbar({ lang, setLang, clinicSettings }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  // Redirect to existing portal
  const portalUrl = import.meta.env.VITE_CLINIC_PORTAL_URL || 'https://hugdee-portal.vercel.app';

  // Opening hours text from settings or default
  const openingHours = lang === 'en' ? clinicSettings?.opening_hours_en : clinicSettings?.opening_hours_th;

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile sidebar on page navigation
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', labelTh: 'หน้าแรก', labelEn: 'Home' },
    { path: '/about', labelTh: 'รู้จักเรา', labelEn: 'About' },
    { path: '/services', labelTh: 'บริการ', labelEn: 'Services' },
    { path: '/assessment', labelTh: 'ขั้นตอน', labelEn: 'Process' },
    { path: '/concerns', labelTh: 'แบบประเมินเบื้องต้น', labelEn: 'Screening' },
    { path: '/articles', labelTh: 'บทความ', labelEn: 'Articles' },
    { path: '/promotions', labelTh: 'โปรโมชั่น', labelEn: 'Promotions' },
    { path: '/gallery', labelTh: 'แกลเลอรี', labelEn: 'Gallery' },
    { path: '/contact', labelTh: 'ติดต่อ', labelEn: 'Contact' },
  ];


  return (
    <header className={`sticky top-0 z-40 w-full transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-sm py-2' : 'bg-clinicBg/95 backdrop-blur-sm py-4'
    }`}>
      {/* Top Banner (Desktop only) */}
      {!isScrolled && (
        <div className="hidden lg:block border-b border-primary/10 pb-2 mb-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center text-xs text-clinicMuted">
            <div>
              <span>📍 {t(lang, clinicSettings?.address_th, clinicSettings?.address_en)}</span>
            </div>
            <div className="flex gap-4">
              <span>📞 {clinicSettings?.phone}</span>
              <span>💬 LINE: {clinicSettings?.line_id}</span>
              <span>🕒 {openingHours}</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition-transform">
              🏡
            </div>
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-bold text-clinicText leading-tight group-hover:text-primary transition-colors">
                {t(lang, 'บ้านฮักดี คลินิก', 'Hug Dee Home Clinic')}
              </span>
              <span className="text-xxs sm:text-xs text-clinicMuted leading-none">
                {t(lang, 'สาขากิจกรรมบำบัด', 'Occupational Therapy')}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-clinicText hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {t(lang, link.labelTh, link.labelEn)}
                </Link>
              );
            })}
          </nav>

          {/* Language Toggle & Clinic Portal CTA */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/20 text-xs font-semibold text-clinicText hover:bg-primary/5 transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>{lang === 'th' ? '🇬🇧 EN' : '🇹🇭 ไทย'}</span>
            </button>

            {/* Existing Clinic Portal Link */}
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>{t(lang, 'เข้าสู่ระบบบริหารคลินิก', 'Clinic Portal')}</span>
            </a>
          </div>

          {/* Mobile Buttons (Hamburger, Lang, Portal Link) */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Lang Button (Mobile) */}
            <button
              onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
              className="flex items-center justify-center p-2 rounded-lg border border-primary/20 text-clinicText hover:bg-primary/5"
            >
              <Globe className="w-5 h-5 text-primary" />
            </button>

            {/* Portal Button (Mobile icon) */}
            <a
              href={portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center p-2 rounded-lg bg-primary text-white hover:bg-primary-dark"
              title={t(lang, 'เข้าสู่ระบบบริหารคลินิก', 'Clinic Portal')}
            >
              <LogIn className="w-5 h-5" />
            </a>

            {/* Hamburger Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-clinicText hover:text-primary hover:bg-primary/5 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {isOpen && (
        <div className="lg:hidden border-t border-primary/10 animate-fade-up bg-white">
          <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-2.5 rounded-lg text-base font-semibold ${
                    isActive
                      ? 'text-primary bg-primary/5'
                      : 'text-clinicText hover:text-primary hover:bg-primary/5'
                  }`}
                >
                  {t(lang, link.labelTh, link.labelEn)}
                </Link>
              );
            })}
            
            {/* Admin Dashboard Entry link (Publicly visible but secure via login) */}
            <Link
              to="/admin/login"
              className="block px-4 py-2.5 rounded-lg text-base font-semibold text-clinicMuted hover:text-primary hover:bg-primary/5"
            >
              🔒 {t(lang, 'สำหรับผู้ดูแลระบบ', 'Admin Panel')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
