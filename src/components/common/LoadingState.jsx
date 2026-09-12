import React from 'react';

export default function LoadingState({ message = 'กำลังโหลดข้อมูล...', className = '' }) {
  return (
    <div className={`flex flex-col items-center justify-center p-12 text-center ${className}`}>
      <div className="relative w-12 h-12 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-brand-cream animate-ping opacity-30" />
        <div className="w-12 h-12 rounded-full border-4 border-brand-blue border-t-transparent animate-spin" />
      </div>
      <p className="text-sm md:text-base text-brand-text-muted font-medium">{message}</p>
    </div>
  );
}
