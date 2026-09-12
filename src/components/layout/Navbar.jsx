import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ClipboardCheck, Phone, ArrowRight } from 'lucide-react';
import Logo from '../common/Logo';
import Button from '../common/Button';

export default function Navbar({ settings }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'บริการ', path: '/services' },
    { name: 'เกี่ยวกับเรา', path: '/about' },
    { name: 'แบบประเมิน', path: '/assessment' },
    { name: 'คู่มือดูแลลูก', path: '/home-guide' },
    { name: 'ติดต่อเรา', path: '/contact' }
  ];

  // Detect scroll to add subtle border/shadow and white bg
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-soft border-b border-brand-border/60 py-3' 
          : 'bg-brand-warm-white/90 backdrop-blur-sm border-b border-brand-border/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo on Left */}
          <div className="flex-shrink-0">
            <Logo settings={settings} />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'text-brand-brown bg-brand-cream font-semibold'
                      : 'text-brand-text hover:text-brand-brown hover:bg-white/80'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right CTA: "เริ่มประเมินเบื้องต้น" (Strictly NO booking button) */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              to="/assessment"
              variant="primary"
              size="md"
              icon={ClipboardCheck}
              className="shadow-sm font-semibold hover:shadow"
            >
              เริ่มประเมินเบื้องต้น
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl text-brand-text hover:bg-brand-cream transition-colors focus-visible:outline-brand-blue"
              aria-label={isMobileMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-brand-text" />
              ) : (
                <Menu className="w-6 h-6 text-brand-text" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bg-white/98 backdrop-blur-lg border-b border-brand-border shadow-soft-xl animate-fade-in p-5">
          <nav className="flex flex-col gap-1.5 mb-5">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between transition-colors ${
                    active
                      ? 'bg-brand-cream text-brand-brown font-semibold'
                      : 'text-brand-text hover:bg-brand-soft-blue/40'
                  }`}
                >
                  <span>{link.name}</span>
                  <ArrowRight className={`w-4 h-4 ${active ? 'text-brand-brown' : 'text-neutral-300'}`} />
                </Link>
              );
            })}
          </nav>

          {/* Mobile Drawer CTA */}
          <div className="pt-3 border-t border-brand-border/60 flex flex-col gap-2.5">
            <Button
              to="/assessment"
              variant="primary"
              size="lg"
              icon={ClipboardCheck}
              className="w-full justify-center shadow-sm font-semibold"
            >
              เริ่มประเมินเบื้องต้น
            </Button>
            <a
              href={`tel:${settings?.phone || '0946753557'}`}
              className="flex items-center justify-center gap-2 py-2.5 text-sm text-brand-text-muted hover:text-brand-brown transition-colors"
            >
              <Phone className="w-4 h-4 text-brand-brown" />
              <span>ติดต่อโทร: {settings?.phoneFormatted || '094-675-3557'}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
