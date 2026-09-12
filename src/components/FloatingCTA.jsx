import { Phone, MessageSquare, Calendar, MapPin } from 'lucide-react';
import { t } from '../utils/helpers';

export default function FloatingCTA({ lang, clinicSettings }) {
  const lineLink = `https://line.me/R/ti/p/%40${String(clinicSettings?.line_id || 'hugdeehome').replace('@', '')}`;
  const phoneLink = `tel:${clinicSettings?.phone || '094-675-3557'}`;
  const portalUrl = import.meta.env.VITE_CLINIC_PORTAL_URL || 'https://hugdee-portal.vercel.app';
  
  // Clean Map Link
  const mapLink = clinicSettings?.facebook_url || "https://maps.google.com/?q=Hug+Dee+Home+Clinic+Phayao";

  return (
    <>
      {/* Desktop Floating CTAs (Bottom Right) */}
      <div className="hidden lg:flex flex-col gap-3 fixed bottom-8 right-8 z-40 animate-soft-scale">
        {/* LINE Chat Button */}
        <a
          href={lineLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#06C755] hover:bg-[#05b04b] text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <MessageSquare className="w-5 h-5 fill-white" />
          <span className="font-bold text-sm">LINE ปรึกษาเรา</span>
        </a>

        {/* Appointment Portal Button */}
        <a
          href={portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-3 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
        >
          <Calendar className="w-5 h-5" />
          <span className="font-bold text-sm">{t(lang, 'นัดหมายบริการ', 'Book Appointment')}</span>
        </a>
      </div>

      {/* Mobile Floating Bottom Bar (Sticky at bottom, but only on screen widths < 1024px) */}
      {/* Note: In mobile layout, we will render it. We offset the padding of body to make sure it doesn't block content */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-primary/10 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] grid grid-cols-4 h-16 divide-x divide-primary/10">
        {/* Phone Call */}
        <a
          href={phoneLink}
          className="flex flex-col items-center justify-center text-clinicText active:bg-primary/5 active:text-primary transition-colors"
        >
          <Phone className="w-5 h-5 text-primary" />
          <span className="text-xxs font-semibold mt-1">{t(lang, 'โทรหาเรา', 'Call')}</span>
        </a>

        {/* LINE Chat */}
        <a
          href={lineLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-clinicText active:bg-primary/5 active:text-primary transition-colors"
        >
          <MessageSquare className="w-5 h-5 text-[#06C755]" />
          <span className="text-xxs font-semibold mt-1">LINE</span>
        </a>

        {/* Directions / Maps */}
        <a
          href="https://maps.app.goo.gl/o1H5n8Q4rR38pXb78"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center text-clinicText active:bg-primary/5 active:text-primary transition-colors"
        >
          <MapPin className="w-5 h-5 text-clinicGreen" />
          <span className="text-xxs font-semibold mt-1">{t(lang, 'แผนที่', 'Maps')}</span>
        </a>

        {/* Appointment Portal */}
        <a
          href={portalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center bg-primary text-white active:bg-primary-dark transition-colors"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-xxs font-bold mt-1">{t(lang, 'นัดหมาย', 'Book')}</span>
        </a>
      </div>
    </>
  );
}
