import { Link, useLocation } from 'react-router-dom';
import { Home, Puzzle, BookOpen, MessageSquare, MapPin } from 'lucide-react';
import { t } from '../utils/helpers';

export default function MobileBottomNav({ lang, clinicSettings }) {
  const location = useLocation();
  const lineLink = `https://line.me/R/ti/p/%40${String(clinicSettings?.line_id || 'hugdeehome').replace('@', '')}`;

  const navItems = [
    { path: '/', labelTh: 'หน้าแรก', labelEn: 'Home', icon: Home },
    { path: '/services', labelTh: 'บริการ', labelEn: 'Services', icon: Puzzle },
    { path: '/articles', labelTh: 'ความรู้', labelEn: 'Articles', icon: BookOpen },
    { 
      path: 'line', 
      labelTh: 'LINE', 
      labelEn: 'LINE', 
      icon: MessageSquare, 
      isExternal: true, 
      link: lineLink,
      iconColor: 'text-[#06C755]' 
    },
    { path: '/contact', labelTh: 'ติดต่อ', labelEn: 'Contact', icon: MapPin },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-clinicBg border-t border-primary/10 shadow-lg grid grid-cols-5 h-16">
      {navItems.map((item, idx) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        if (item.isExternal) {
          return (
            <a
              key={idx}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center text-clinicText active:text-primary"
            >
              <Icon className={`w-5 h-5 ${item.iconColor || 'text-primary'}`} />
              <span className="text-xxs font-semibold mt-1">
                {t(lang, item.labelTh, item.labelEn)}
              </span>
            </a>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-colors ${
              isActive 
                ? 'text-primary bg-primary/5 font-bold' 
                : 'text-clinicText hover:text-primary'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'text-clinicMuted'}`} />
            <span className="text-xxs mt-1">
              {t(lang, item.labelTh, item.labelEn)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
