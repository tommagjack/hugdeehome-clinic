import React from 'react';
import { HelpCircle } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  icon: Icon = HelpCircle,
  title = 'ไม่พบข้อมูล',
  description = 'ยังไม่มีข้อมูลในส่วนนี้ หรืออยู่ระหว่างการอัปเดตโดยผู้ดูแลระบบ',
  actionLabel,
  onAction,
  actionTo,
  className = ''
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 md:p-12 rounded-2xl bg-white border border-brand-border/80 ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-brand-cream text-brand-brown flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-lg md:text-xl font-bold text-brand-text mb-2">{title}</h3>
      <p className="text-sm md:text-base text-brand-text-muted max-w-md mb-6 leading-relaxed">{description}</p>
      {(actionLabel && (onAction || actionTo)) && (
        <Button 
          variant="primary" 
          size="md" 
          onClick={onAction} 
          to={actionTo}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
