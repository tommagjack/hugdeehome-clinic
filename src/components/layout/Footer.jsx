import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Clock, ExternalLink, ShieldAlert, Lock } from 'lucide-react';
import Logo from '../common/Logo';

export default function Footer({ settings }) {
  const currentYear = new Date().getFullYear();
  const clinicNameTh = settings?.clinicNameTh || 'คลินิกพัฒนาการเด็กบ้านฮักดี';
  const slogan = settings?.slogan || 'อบอุ่นเหมือนบ้าน พัฒนาการก้าวหน้าด้วยรัก';
  const phone = settings?.phone || '094-675-3557';
  const email = settings?.email || 'hugdeehome@gmail.com';
  const lineId = settings?.lineId || '@hugdeehome';
  const lineUrl = settings?.lineUrl || 'https://line.me/R/ti/p/@hugdeehome';
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/hugdeehome/';
  const messengerUrl = settings?.messengerUrl || 'https://m.me/hugdeehome';
  const mapsUrl = settings?.mapsUrl || 'https://maps.app.goo.gl/k4rgFC8ej7QQcQCH8';
  const addressTh = settings?.addressTh || '104/7 หมู่ 17 ตำบลบ้านต๋อม อำเภอเมืองพะเยา จังหวัดพะเยา 56000';
  const openingHours = settings?.openingHours || {
    monday: 'ปิดทำการ',
    tuesdayFriday: '11:00 – 19:00 น.',
    saturdaySunday: '09:00 – 18:00 น.',
    note: 'กรุณานัดหมายวันและเวลาล่วงหน้าก่อนเข้ารับบริการ'
  };

  return (
    <footer className="bg-brand-cream/80 border-t border-brand-border text-brand-text pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-brand-border/70">
          
          {/* Col 1: Brand Info (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Logo settings={settings} variant="default" className="mb-4" />
            <p className="text-sm md:text-base text-brand-text-muted mt-2 leading-relaxed max-w-sm">
              "{slogan}"
            </p>
            <p className="text-xs text-brand-text-muted mt-3 leading-relaxed max-w-sm">
              พื้นที่แห่งการเรียนรู้และส่งเสริมศักยภาพเด็ก ผ่านกิจกรรมบำบัดและการดูแลเฉพาะบุคคลที่เข้าใจธรรมชาติของเด็กและครอบครัว
            </p>

            {/* Social Channels */}
            <div className="flex items-center gap-3 mt-6">
              <a
                href={lineUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-brand-border text-brand-text hover:bg-[#06C755]/10 hover:border-[#06C755] hover:text-[#06C755] flex items-center justify-center transition-all shadow-sm"
                aria-label="LINE Official @hugdeehome"
                title="LINE Official @hugdeehome"
              >
                <span className="font-bold text-xs">LINE</span>
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-brand-border text-brand-text hover:bg-brand-blue/30 hover:border-brand-blue flex items-center justify-center transition-all shadow-sm"
                aria-label="Facebook Page"
                title="Facebook บ้านฮักดี"
              >
                <span className="font-bold text-xs">FB</span>
              </a>
              <a
                href={messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-brand-border text-brand-text hover:bg-[#0084FF]/10 hover:border-[#0084FF] hover:text-[#0084FF] flex items-center justify-center transition-all shadow-sm"
                aria-label="Facebook Messenger"
                title="แชท Facebook Messenger กับเพจ"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.453 5.516 3.73 7.215v3.527l3.39-1.86c.915.253 1.884.39 2.88.39 5.523 0 10-4.145 10-9.272S17.523 2 12 2zm1.05 12.46l-2.67-2.85-5.21 2.85 5.73-6.08 2.74 2.85 5.14-2.85-5.73 6.08z" />
                </svg>
              </a>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-white border border-brand-border text-brand-text hover:bg-brand-blue/30 hover:border-brand-blue flex items-center justify-center transition-all shadow-sm"
                aria-label="Google Maps"
                title="Google Maps นำทาง"
              >
                <MapPin className="w-4 h-4 text-brand-brown" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-brand-text text-sm uppercase tracking-wider mb-4">
              แผนผังเว็บไซต์
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-brand-text-muted hover:text-brand-brown transition-colors">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-brand-text-muted hover:text-brand-brown transition-colors">
                  บริการของเรา
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-brand-text-muted hover:text-brand-brown transition-colors">
                  เกี่ยวกับเรา
                </Link>
              </li>
              <li>
                <Link to="/assessment" className="text-brand-text-muted hover:text-brand-brown transition-colors">
                  แบบประเมินเบื้องต้น
                </Link>
              </li>
              <li>
                <Link to="/home-guide" className="text-brand-text-muted hover:text-brand-brown transition-colors">
                  คู่มือดูแลลูก
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-brand-text-muted hover:text-brand-brown transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-brand-text text-sm uppercase tracking-wider mb-4">
              ข้อมูลติดต่อ
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-brown flex-shrink-0 mt-1" />
                <span className="text-brand-text-muted leading-relaxed">
                  {addressTh}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-brown flex-shrink-0" />
                <a href={`tel:${phone}`} className="text-brand-text hover:text-brand-brown font-medium">
                  {settings?.phoneFormatted || phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="font-bold text-xs text-brand-brown w-4 text-center">@</span>
                <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="text-brand-text hover:text-brand-brown font-medium">
                  {lineId}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-[#0084FF] flex-shrink-0">
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.453 5.516 3.73 7.215v3.527l3.39-1.86c.915.253 1.884.39 2.88.39 5.523 0 10-4.145 10-9.272S17.523 2 12 2zm1.05 12.46l-2.67-2.85-5.21 2.85 5.73-6.08 2.74 2.85 5.14-2.85-5.73 6.08z" />
                </svg>
                <a href={messengerUrl} target="_blank" rel="noopener noreferrer" className="text-brand-text hover:text-[#0084FF] font-medium text-xs">
                  m.me/hugdeehome
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-brown flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-brand-text-muted hover:text-brand-brown text-xs break-all">
                  {email}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Opening Hours (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-brand-text text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-brown" />
              <span>เวลาทำการ</span>
            </h4>
            <div className="space-y-2 text-sm bg-white/70 p-4 rounded-2xl border border-brand-border">
              <div className="flex justify-between items-center pb-2 border-b border-brand-border/60">
                <span className="text-brand-text-muted">วันจันทร์</span>
                <span className="font-medium text-brand-brown">
                  {openingHours?.monday || 'ปิดทำการ'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-brand-border/60">
                <span className="text-brand-text-muted">อังคาร – ศุกร์</span>
                <span className="font-medium text-brand-text">
                  {openingHours?.tuesdayFriday || '11:00 – 19:00 น.'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-brand-text-muted">เสาร์ – อาทิตย์</span>
                <span className="font-medium text-brand-text">
                  {openingHours?.saturdaySunday || '09:00 – 18:00 น.'}
                </span>
              </div>
            </div>
            {openingHours?.note && (
              <p className="text-xs text-brand-text-muted mt-2.5 leading-relaxed">
                * {openingHours.note.replace(/^\*\s*/, '')}
              </p>
            )}
          </div>

        </div>

        {/* Bottom Bar: Clinical Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-brand-text-muted">
          <div className="flex items-center gap-2 text-center md:text-left">
            <ShieldAlert className="w-3.5 h-3.5 text-brand-brown flex-shrink-0" />
            <span>
              ข้อสงวนสิทธิ์: ข้อมูลและแบบประเมินบนเว็บไซต์นี้จัดทำขึ้นเพื่อการคัดกรองเบื้องต้นและการเรียนรู้เท่านั้น ไม่ใช่การวินิจฉัยทางการแพทย์
            </span>
          </div>

          <div className="flex items-center gap-4 flex-shrink-0">
            <span>© {currentYear} {clinicNameTh}</span>
            <Link 
              to="/admin/login" 
              className="inline-flex items-center gap-1 text-neutral-400 hover:text-brand-brown transition-colors"
              title="เข้าสู่ระบบผู้ดูแล"
            >
              <Lock className="w-3 h-3" />
              <span>ผู้ดูแลระบบ</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
