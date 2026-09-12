import React from 'react';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center', // 'center' | 'left'
  className = ''
}) {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <div className={`flex flex-col ${alignClass} mb-10 md:mb-14 ${className}`}>
      {eyebrow && (
        <span className="inline-block text-xs md:text-sm font-semibold text-brand-brown tracking-wider uppercase px-3 py-1 rounded-full bg-brand-cream border border-brand-border mb-3">
          {eyebrow}
        </span>
      )}
      {title && (
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-text tracking-tight max-w-3xl leading-snug">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="mt-3 text-base md:text-lg text-brand-text-muted max-w-2xl leading-thai-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
