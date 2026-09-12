import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Clock, 
  FileText,
  Sliders
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function AssessmentsCMS() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const loadAssessments = async () => {
    setLoading(true);
    try {
      const data = await storage.getAssessments();
      setAssessments(data);
    } catch (err) {
      console.error('Error loading assessments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
  }, []);

  const handleTogglePublish = async (asm) => {
    const updated = {
      ...asm,
      status: asm.status === 'published' ? 'draft' : 'published'
    };
    await storage.saveAssessment(updated);
    loadAssessments();
  };

  const handleDelete = async () => {
    if (deletingId) {
      await storage.deleteAssessment(deletingId);
      setDeletingId(null);
      loadAssessments();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">
            จัดการแบบประเมินพัฒนาการ (Assessment CMS)
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            สร้างและปรับแต่งแบบคัดกรองออนไลน์ คำถาม และเกณฑ์คะแนน
          </p>
        </div>
        <Button
          to="/admin/assessment/builder/new"
          variant="primary"
          size="md"
          icon={Plus}
          className="font-semibold shadow-sm"
        >
          สร้างแบบประเมินใหม่
        </Button>
      </div>

      {/* Assessment Table / List */}
      {loading ? (
        <LoadingState message="กำลังโหลดแบบประเมิน..." />
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream/60 border-b border-brand-border text-xs uppercase tracking-wider text-brand-text font-semibold">
                <tr>
                  <th className="px-6 py-4">ลำดับ</th>
                  <th className="px-6 py-4">ชื่อแบบประเมิน</th>
                  <th className="px-6 py-4">หมวดหมู่</th>
                  <th className="px-6 py-4">ช่วงวัย</th>
                  <th className="px-6 py-4">จำนวนข้อ</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {assessments.map((asm, idx) => (
                  <tr key={asm.id} className="hover:bg-brand-warm-white/60 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-brand-text-muted">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-text">{asm.title}</div>
                      <div className="text-xs text-brand-text-muted line-clamp-1">{asm.description}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="yellow" size="sm">{asm.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-text-muted">
                      {asm.targetAge}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-brand-text">
                      {asm.questions?.length || 0} ข้อ (~{asm.estimatedMinutes || 5} นาที)
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(asm)}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          asm.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {asm.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{asm.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/admin/assessment/builder/${asm.id}`}
                          className="p-1.5 rounded-lg text-brand-brown hover:bg-brand-cream transition-colors flex items-center gap-1 text-xs font-semibold"
                          title="เปิดใน Assessment Builder"
                        >
                          <Sliders className="w-4 h-4" />
                          <span>Builder</span>
                        </Link>
                        <button
                          onClick={() => setDeletingId(asm.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="ยืนยันการลบแบบประเมิน"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบแบบประเมินนี้? คำถามและเกณฑ์คะแนนทั้งหมดจะถูกลบออกจากระบบ"
        confirmLabel="ลบแบบประเมิน"
        confirmVariant="pink"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
}
