import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Button from './Button';

export default function ConfirmDialog({
  isOpen,
  title = 'ยืนยันการทำรายการ',
  message = 'คุณแน่ใจหรือไม่ว่าต้องการดำเนินการนี้? การกระทำนี้ไม่สามารถย้อนกลับได้',
  confirmLabel = 'ยืนยัน',
  cancelLabel = 'ยกเลิก',
  confirmVariant = 'secondary', // 'secondary' | 'pink'
  onConfirm,
  onCancel,
  loading = false
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-simple">
      <div className="bg-white rounded-3xl border border-brand-border shadow-soft-xl max-w-md w-full p-6 relative animate-fade-in">
        <button 
          onClick={onCancel}
          className="absolute top-5 right-5 text-neutral-400 hover:text-brand-text p-1 rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-brand-yellow/30 text-brand-brown flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-brand-text leading-snug">{title}</h3>
            <p className="text-sm text-brand-text-muted mt-1.5 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-brand-border/60">
          <Button 
            variant="ghost" 
            size="md" 
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button 
            variant={confirmVariant} 
            size="md" 
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
