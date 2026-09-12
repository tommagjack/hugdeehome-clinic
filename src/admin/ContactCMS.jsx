import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Clock, 
  Trash2, 
  CheckCircle2, 
  User, 
  HelpCircle,
  Calendar
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function ContactCMS() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);

  const loadInquiries = async () => {
    setLoading(true);
    try {
      const data = await storage.getInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Error loading inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleDelete = async () => {
    if (deletingId) {
      const remaining = inquiries.filter(i => i.id !== deletingId);
      localStorage.setItem('hugdee_inquiries_v2', JSON.stringify(remaining));
      setInquiries(remaining);
      setDeletingId(null);
      if (selectedInquiry?.id === deletingId) {
        setSelectedInquiry(null);
      }
    }
  };

  const handleToggleStatus = (inq) => {
    const updated = inquiries.map(item => {
      if (item.id === inq.id) {
        return {
          ...item,
          status: item.status === 'replied' ? 'unread' : 'replied'
        };
      }
      return item;
    });
    localStorage.setItem('hugdee_inquiries_v2', JSON.stringify(updated));
    setInquiries(updated);
    if (selectedInquiry?.id === inq.id) {
      setSelectedInquiry({
        ...selectedInquiry,
        status: selectedInquiry.status === 'replied' ? 'unread' : 'replied'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text">
          ข้อความติดต่อจากผู้ปกครอง (Parent Inquiries)
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-muted">
          ตรวจสอบข้อความสอบถามและข้อกังวลที่ผู้ปกครองส่งผ่านหน้าติดต่อเรา
        </p>
      </div>

      {loading ? (
        <LoadingState message="กำลังโหลดข้อความ..." />
      ) : inquiries.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Messages List (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-border shadow-soft overflow-hidden">
            <div className="p-4 bg-brand-cream/60 border-b border-brand-border font-semibold text-xs text-brand-text flex justify-between items-center">
              <span>รายการข้อความทั้งหมด ({inquiries.length})</span>
            </div>

            <div className="divide-y divide-brand-border/60 max-h-[600px] overflow-y-auto">
              {inquiries.map((inq) => {
                const active = selectedInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className={`p-4 cursor-pointer transition-colors ${
                      active
                        ? 'bg-brand-soft-blue border-l-4 border-brand-blue'
                        : 'hover:bg-brand-warm-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-brand-text">{inq.parentName}</span>
                      <span className="text-[11px] text-brand-text-muted">
                        {new Date(inq.createdAt).toLocaleDateString('th-TH')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge variant="blue" size="sm">{inq.topic}</Badge>
                      {inq.status === 'replied' ? (
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                          ติดต่อกลับแล้ว
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium">
                          รอติดต่อกลับ
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-brand-text-muted line-clamp-1">
                      {inq.message || 'ไม่มีข้อความเพิ่มเติม'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Message Detail View (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-soft">
            {selectedInquiry ? (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-brand-border/60 pb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-brand-text">{selectedInquiry.parentName}</h2>
                      <Badge variant="blue">{selectedInquiry.topic}</Badge>
                    </div>
                    <span className="text-xs text-brand-text-muted flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      ส่งเมื่อ: {new Date(selectedInquiry.createdAt).toLocaleString('th-TH')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleStatus(selectedInquiry)}
                      className={`text-xs px-3 py-1.5 rounded-xl border font-medium transition-colors ${
                        selectedInquiry.status === 'replied'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {selectedInquiry.status === 'replied' ? 'ทำเครื่องหมายว่ายังไม่ตอบ' : 'ทำเครื่องหมายว่าตอบแล้ว'}
                    </button>
                    <button
                      onClick={() => setDeletingId(selectedInquiry.id)}
                      className="p-1.5 rounded-xl text-neutral-400 hover:text-brand-pink hover:bg-brand-pink/10"
                      title="ลบข้อความ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Contact numbers */}
                <div className="grid grid-cols-2 gap-4 bg-brand-warm-white p-4 rounded-2xl border border-brand-border text-xs sm:text-sm">
                  <div>
                    <span className="text-brand-text-muted block mb-1">เบอร์โทรศัพท์สำหรับติดต่อกลับ:</span>
                    <a href={`tel:${selectedInquiry.phone}`} className="text-base font-bold text-brand-brown hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                  <div>
                    <span className="text-brand-text-muted block mb-1">อายุของเด็ก:</span>
                    <span className="text-base font-bold text-brand-text">
                      {selectedInquiry.childAge || 'ไม่ได้ระบุ'}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div>
                  <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider mb-2">
                    ข้อความหรือข้อสังเกต:
                  </h4>
                  <div className="p-4 rounded-2xl bg-white border border-brand-border text-sm text-brand-text leading-relaxed">
                    {selectedInquiry.message || 'ผู้ปกครองไม่ได้ระบุข้อความเพิ่มเติม'}
                  </div>
                </div>

                {/* Direct Action */}
                <div className="pt-4 border-t border-brand-border/60 flex items-center gap-3">
                  <Button
                    href={`tel:${selectedInquiry.phone}`}
                    variant="primary"
                    size="md"
                    icon={Phone}
                  >
                    โทรหาผู้ปกครอง ({selectedInquiry.phone})
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-xs text-brand-text-muted">
                เลือกข้อความจากรายการทางซ้ายเพื่อดูรายละเอียด
              </div>
            )}
          </div>

        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border p-12 text-center text-brand-text-muted">
          ยังไม่มีข้อความสอบถามเข้ามาจากผู้ปกครอง
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="ยืนยันการลบข้อความ"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบข้อความนี้ออกจากระบบ?"
        confirmLabel="ลบข้อความ"
        confirmVariant="pink"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
}
