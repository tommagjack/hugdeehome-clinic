import { Link } from 'react-router-dom';
import { Mail, Phone, MessageSquare, Clock, MapPin } from 'lucide-react';
import { t } from '../utils/helpers';

const Facebook = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);


export default function Footer({ lang, clinicSettings }) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { path: '/about', labelTh: 'รู้จักบ้านฮักดี', labelEn: 'About Us' },
    { path: '/services', labelTh: 'บริการของเรา', labelEn: 'Our Services' },
    { path: '/assessment', labelTh: 'ขั้นตอนประเมินพัฒนาการ', labelEn: 'Assessment Process' },
    { path: '/concerns', labelTh: 'สิ่งที่คุณพ่อคุณแม่กังวล', labelEn: 'Common Concerns' },
    { path: '/articles', labelTh: 'บทความความรู้เพื่อลูกน้อย', labelEn: 'Child Knowledge' },
    { path: '/promotions', labelTh: 'โปรโมชั่นและสิทธิพิเศษ', labelEn: 'Promotions' },
  ];

  return (
    <footer className="bg-white border-t border-primary/10 pt-16 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Clinic Brand Column */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-lg">
                🏡
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-clinicText leading-tight">
                  {t(lang, clinicSettings?.name_th, clinicSettings?.name_en)}
                </span>
                <span className="text-xxs text-clinicMuted">
                  {t(lang, 'คลินิกกิจกรรมบำบัด พะเยา', 'Occupational Therapy Clinic, Phayao')}
                </span>
              </div>
            </div>
            <p className="text-sm text-clinicMuted leading-relaxed">
              {t(
                lang,
                clinicSettings?.description_th || 'เราคือคลินิกกิจกรรมบำบัดที่พร้อมดูแลส่งเสริมพัฒนาการเด็กให้เติบโตในแบบของตัวเองด้วยความเข้าใจและหัวใจ',
                clinicSettings?.description_en || 'We are an occupational therapy clinic dedicated to supporting children\'s development with love and understanding.'
              )}
            </p>
          </div>

          {/* Opening Hours Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-bold text-clinicText uppercase tracking-wider">
              {t(lang, 'เวลาทำการ', 'Opening Hours')}
            </h3>
            <ul className="space-y-3 text-sm text-clinicMuted">
              <li className="flex gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-clinicText">{t(lang, 'อังคาร - ศุกร์', 'Tuesday - Friday')}</p>
                  <p>17:00 - 20:00</p>
                </div>
              </li>
              <li className="flex gap-2">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="font-semibold text-clinicText">{t(lang, 'เสาร์ - อาทิตย์', 'Saturday - Sunday')}</p>
                  <p>09:00 - 18:00</p>
                </div>
              </li>
              <li className="flex gap-2 text-clinicPink-dark font-medium">
                <Clock className="w-4 h-4 shrink-0" />
                <p>{t(lang, 'ปิดทุกวันจันทร์', 'Closed on Mondays')}</p>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-bold text-clinicText uppercase tracking-wider">
              {t(lang, 'ลิงก์ที่เป็นประโยชน์', 'Quick Links')}
            </h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-clinicMuted hover:text-primary transition-colors block py-0.5"
                  >
                    {t(lang, link.labelTh, link.labelEn)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin/login"
                  className="text-clinicMuted hover:text-primary transition-colors block py-0.5"
                >
                  🔒 {t(lang, 'สำหรับเจ้าหน้าที่ (CMS)', 'Staff Portal (CMS)')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contacts Column */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-bold text-clinicText uppercase tracking-wider">
              {t(lang, 'ข้อมูลติดต่อ', 'Contact Info')}
            </h3>
            <ul className="space-y-3 text-sm text-clinicMuted">
              <li className="flex gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{t(lang, clinicSettings?.address_th, clinicSettings?.address_en)}</span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <a href={`tel:${clinicSettings?.phone}`} className="hover:text-primary transition-colors">
                  {clinicSettings?.phone}
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <MessageSquare className="w-4 h-4 text-primary shrink-0" />
                <a
                  href={`https://line.me/R/ti/p/%40${String(clinicSettings?.line_id).replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  LINE: {clinicSettings?.line_id}
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <Facebook className="w-4 h-4 text-primary shrink-0" />
                <a
                  href={clinicSettings?.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Facebook: Hug Dee Home
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Footer Bottom (Copyright / Policies) */}
        <div className="mt-12 pt-8 border-t border-primary/10 flex flex-col md:flex-row justify-between items-center text-xs text-clinicMuted space-y-4 md:space-y-0">
          <p>© {currentYear} Hug Dee Home Clinic. All rights reserved.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">
              {t(lang, 'นโยบายความเป็นส่วนตัว', 'Privacy Policy')}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t(lang, 'ข้อกำหนดการใช้งาน', 'Terms of Use')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
