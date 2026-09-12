import React from 'react';
import { Link } from 'react-router-dom';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'cream' | 'pink'
  size = 'md', // 'sm' | 'md' | 'lg'
  to,
  href,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-brand-blue disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3.5 gap-2.5 rounded-2xl'
  };

  const variantStyles = {
    primary: 'bg-brand-blue text-brand-text hover:bg-brand-blue-dark active:scale-[0.98] shadow-sm',
    secondary: 'bg-brand-brown text-white hover:bg-brand-brown-dark active:scale-[0.98] shadow-sm',
    outline: 'border border-brand-border text-brand-text bg-white/70 hover:bg-white hover:border-brand-brown/40 active:scale-[0.98]',
    ghost: 'text-brand-text hover:bg-brand-cream/60 active:scale-[0.98]',
    cream: 'bg-brand-cream text-brand-brown hover:bg-brand-yellow/30 active:scale-[0.98]',
    pink: 'bg-brand-pink text-white hover:opacity-90 active:scale-[0.98] shadow-sm'
  };

  const classes = `${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`;

  const content = (
    <>
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4 flex-shrink-0" />}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4 flex-shrink-0" />}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} onClick={onClick} {...props}>
      {content}
    </button>
  );
}
