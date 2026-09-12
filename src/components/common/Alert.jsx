import React from 'react';
import { AlertCircle, Info, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Alert({
  children,
  title,
  type = 'info', // 'info' | 'warning' | 'success' | 'note'
  className = ''
}) {
  const configs = {
    info: {
      bg: 'bg-brand-soft-blue',
      border: 'border-brand-blue/40',
      text: 'text-brand-text',
      icon: Info,
      iconColor: 'text-brand-blue-dark'
    },
    warning: {
      bg: 'bg-brand-yellow/20',
      border: 'border-brand-yellow/60',
      text: 'text-brand-text',
      icon: AlertTriangle,
      iconColor: 'text-brand-brown'
    },
    success: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-900',
      icon: CheckCircle2,
      iconColor: 'text-emerald-600'
    },
    note: {
      bg: 'bg-brand-cream',
      border: 'border-brand-border',
      text: 'text-brand-text',
      icon: AlertCircle,
      iconColor: 'text-brand-brown'
    }
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3.5 p-4 md:p-5 rounded-2xl border ${config.bg} ${config.border} ${config.text} ${className}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 text-sm md:text-base leading-relaxed">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div>{children}</div>
      </div>
    </div>
  );
}
