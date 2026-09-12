import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';

export default function FloatingCTA({ settings }) {
  const phone = settings?.phone || '094-675-3557';
  const lineUrl = settings?.lineUrl || 'https://line.me/R/ti/p/@hugdeehome';
  const messengerUrl = settings?.messengerUrl || 'https://m.me/hugdeehome';

  return (
    <aside aria-label="ช่องทางติดต่อด่วน" className="fixed bottom-5 right-5 z-30 flex flex-col items-end gap-2.5">
      {/* Facebook Messenger Quick CTA */}
      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#0084FF] text-white shadow-soft-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-xs sm:text-sm font-semibold group"
        aria-label="แชทผ่าน Facebook Messenger"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 flex-shrink-0">
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.453 5.516 3.73 7.215v3.527l3.39-1.86c.915.253 1.884.39 2.88.39 5.523 0 10-4.145 10-9.272S17.523 2 12 2zm1.05 12.46l-2.67-2.85-5.21 2.85 5.73-6.08 2.74 2.85 5.14-2.85-5.73 6.08z" />
        </svg>
        <span className="hidden sm:inline">Messenger</span>
        <span className="sm:hidden">แชท</span>
      </a>

      {/* LINE Official Quick CTA */}
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-[#06C755] text-white shadow-soft-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-xs sm:text-sm font-semibold group"
        aria-label="ติดต่อผ่าน LINE Official"
      >
        <MessageCircle className="w-4 h-4 fill-current" />
        <span className="hidden sm:inline">LINE (@hugdeehome)</span>
        <span className="sm:hidden">LINE</span>
      </a>

      {/* Phone Quick CTA */}
      <a
        href={`tel:${phone}`}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-brand-blue text-brand-text shadow-soft-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-xs sm:text-sm font-semibold group"
        aria-label={`โทรติดต่อ ${phone}`}
      >
        <Phone className="w-4 h-4 text-brand-brown" />
        <span className="hidden sm:inline">{settings?.phoneFormatted || phone}</span>
        <span className="sm:hidden">โทร</span>
      </a>
    </aside>
  );
}
