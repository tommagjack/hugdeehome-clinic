import React from 'react';
import { Link } from 'react-router-dom';

export default function Logo({ 
  settings, 
  variant = 'default', // 'default' | 'footer' | 'admin' | 'mark-only'
  className = '' 
}) {
  const logoUrl = settings?.logoUrl || '/logo.png';
  const clinicNameTh = settings?.clinicNameTh || 'คลินิกพัฒนาการเด็กบ้านฮักดี';
  const clinicNameEn = settings?.clinicNameEn || 'HugDeeHome';
  const slogan = settings?.slogan || 'อบอุ่นเหมือนบ้าน พัฒนาการก้าวหน้าด้วยรัก';

  // If master logo exists or is configured, render it preserving exact aspect ratio
  if (logoUrl) {
    return (
      <Link 
        to="/" 
        className={`flex items-center gap-3 transition-opacity hover:opacity-90 ${className}`}
        aria-label={`${clinicNameTh} (${clinicNameEn})`}
      >
        <img 
          src={logoUrl} 
          alt={clinicNameTh} 
          className="h-10 md:h-12 w-auto object-contain rounded-full"
        />
        {variant !== 'mark-only' && (
          <div className="flex flex-col">
            <span className="font-bold text-brand-text text-base md:text-lg leading-tight">
              {clinicNameTh}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-brand-brown font-medium tracking-wide">
                {clinicNameEn}
              </span>
              {variant === 'footer' && (
                <span className="hidden sm:inline text-xs text-brand-text-muted">
                  • {slogan}
                </span>
              )}
            </div>
          </div>
        )}
      </Link>
    );
  }

  // Fallback: Warm minimal, premium brandmark placeholder
  // Combines a gentle home silhouette + nurturing seedling/heart in exact brand colors (#8FC9E3, #A86632)
  return (
    <Link 
      to="/" 
      className={`flex items-center gap-3 group transition-opacity hover:opacity-95 ${className}`}
      aria-label={`${clinicNameTh} (${clinicNameEn})`}
    >
      <div className="relative flex-shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-brand-cream border border-brand-border flex items-center justify-center p-1.5 transition-transform group-hover:scale-105 duration-300">
        <svg 
          viewBox="0 0 48 48" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full"
        >
          {/* Gentle Roof / Home silhouette */}
          <path 
            d="M8 24L24 10L40 24V38C40 39.1 39.1 40 38 40H10C8.9 40 8 39.1 8 38V24Z" 
            fill="#8FC9E3" 
            fillOpacity="0.35"
          />
          <path 
            d="M6 23L24 8L42 23" 
            stroke="#A86632" 
            strokeWidth="3.2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          {/* Nurturing Heart / Sprout in the center */}
          <path 
            d="M24 33C24 33 17 28 17 22.5C17 19.5 19.5 17.5 22 19C23.5 20 24 21.5 24 21.5C24 21.5 24.5 20 26 19C28.5 17.5 31 19.5 31 22.5C31 28 24 33 24 33Z" 
            fill="#E95BA8"
          />
          {/* Base foundation */}
          <path 
            d="M14 40H34" 
            stroke="#A86632" 
            strokeWidth="2.8" 
            strokeLinecap="round"
          />
        </svg>
      </div>

      {variant !== 'mark-only' && (
        <div className="flex flex-col">
          <span className="font-bold text-brand-text text-base md:text-lg leading-tight tracking-tight">
            {clinicNameTh}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-brown font-semibold tracking-wider">
              {clinicNameEn}
            </span>
            {variant === 'footer' && (
              <span className="hidden sm:inline text-xs text-brand-text-muted">
                • {slogan}
              </span>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}
