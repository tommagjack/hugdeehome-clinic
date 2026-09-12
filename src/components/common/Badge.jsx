import React from 'react';

export default function Badge({
  children,
  variant = 'blue', // 'blue' | 'brown' | 'yellow' | 'pink' | 'cream' | 'gray'
  size = 'md', // 'sm' | 'md'
  className = ''
}) {
  const variantStyles = {
    blue: 'bg-brand-soft-blue text-brand-text border-brand-blue/30',
    brown: 'bg-brand-cream text-brand-brown border-brand-brown/30',
    yellow: 'bg-brand-yellow/25 text-brand-text border-brand-yellow/50',
    pink: 'bg-brand-pink/15 text-brand-pink border-brand-pink/30',
    cream: 'bg-brand-cream text-brand-text-muted border-brand-border',
    gray: 'bg-neutral-100 text-neutral-600 border-neutral-200'
  };

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-xs md:text-sm px-3 py-1'
  };

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant] || variantStyles.blue} ${sizeStyles[size] || sizeStyles.md} ${className}`}>
      {children}
    </span>
  );
}
