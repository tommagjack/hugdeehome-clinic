import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  GraduationCap, 
  Sparkles, 
  Info, 
  CheckCircle2,
  Upload,
  Camera,
  Image as ImageIcon
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingState from '../components/common/LoadingState';
import Alert from '../components/common/Alert';
import { storage } from '../services/storage';

export default function AboutTeamCMS({ mode = 'team' }) { // 'team' or 'about'
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    position: 'นักกิจกรรมบำบัดวิชาชีพ',
    professionalTitle: '',
    education: '',
    expertise: '',
    biography: '',
    photoUrl: ''
  });

  const loadTeam = async () => {
    setLoading(true);
    try {
      const data = await storage.getTeam();
      setTeam(data);
    } catch (err) {
      console.error('Error loading team:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeam();
  }, []);

  const handleOpenCreate = () => {
    setEditingMember('new');
    setFormData({
      name: '',
      position: 'นักกิจกรรมบำบัดวิชาชีพ (Occupational Therapist)',
      professionalTitle: 'ผู้เชี่ยวชาญด้านพัฒนาการเด็ก',
      education: '[ข้อมูลรอการเพิ่มโดย Admin]',
      expertise: '',
      biography: '',
      photoUrl: ''
    });
  };

  const handleOpenEdit = (member) => {
    setEditingMember(member.id);
    setFormData(member);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ขนาดไฟล์รูปภาพต้องไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, photoUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setFormData(prev => ({ ...prev, photoUrl: '' }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (editingMember !== 'new') {
      payload.id = editingMember;
    }
    await storage.saveTeamMember(payload);
    setEditingMember(null);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    loadTeam();
  };

  const handleDelete = async () => {
    if (deletingId) {
      await storage.deleteTeamMember(deletingId);
      setDeletingId(null);
      loadTeam();
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">
            จัดการข้อมูลทีมงาน & บุคลากร (Team CMS)
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            จัดการรายชื่อ ประวัติ และความเชี่ยวชาญของนักบำบัดประจำบ้านฮักดี
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenCreate}
          className="font-semibold shadow-sm"
        >
          เพิ่มสมาชิกทีม
        </Button>
      </div>

      {savedSuccess && (
        <Alert type="success">บันทึกข้อมูลสมาชิกทีมงานเรียบร้อยแล้ว</Alert>
      )}

      {/* Team Cards Grid */}
      {loading ? (
        <LoadingState message="กำลังโหลดข้อมูลทีมงาน..." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl border border-brand-border p-6 shadow-soft flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div 
                    onClick={() => handleOpenEdit(member)}
                    className="w-16 h-16 rounded-2xl bg-brand-cream border border-brand-border flex items-center justify-center overflow-hidden flex-shrink-0 cursor-pointer relative group/avatar shadow-sm"
                    title="คลิกเพื่อแก้ไขรูปถ่ายและข้อมูล"
                  >
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform" />
                    ) : (
                      <Users className="w-8 h-8 text-brand-brown/60" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 flex items-center justify-center transition-opacity text-white">
                      <Camera className="w-5 h-5 drop-shadow" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(member)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-brown hover:bg-brand-cream"
                      title="แก้ไข"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeletingId(member.id)}
                      className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-pink hover:bg-brand-pink/10"
                      title="ลบ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-brand-text mb-1">{member.name}</h3>
                <p className="text-xs text-brand-brown font-semibold mb-2">{member.position}</p>
                {member.professionalTitle && (
                  <Badge variant="blue" size="sm" className="mb-3">{member.professionalTitle}</Badge>
                )}

                <div className="space-y-1.5 text-xs text-brand-text-muted pt-3 border-t border-brand-border/60">
                  {member.education && (
                    <div className="flex items-start gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-brown flex-shrink-0 mt-0.5" />
                      <span>{member.education}</span>
                    </div>
                  )}
                  {member.expertise && (
                    <div className="flex items-start gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-brown flex-shrink-0 mt-0.5" />
                      <span>{member.expertise}</span>
                    </div>
                  )}
                </div>

                {member.biography && (
                  <p className="text-xs text-brand-text-muted mt-3 italic line-clamp-2">
                    "{member.biography}"
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-simple">
          <div className="bg-white rounded-3xl border border-brand-border shadow-soft-xl max-w-xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setEditingMember(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-cream"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-brand-text mb-4">
              {editingMember === 'new' ? 'เพิ่มสมาชิกทีมงานใหม่' : 'แก้ไขข้อมูลสมาชิกทีมงาน'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              {/* Photo Upload & Preview Section */}
              <div className="p-4 rounded-2xl bg-brand-cream/60 border border-brand-border flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-brand-border flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative group">
                  {formData.photoUrl ? (
                    <img
                      src={formData.photoUrl}
                      alt="รูปถ่ายสมาชิก"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-10 h-10 text-brand-brown/40" />
                  )}
                </div>

                <div className="flex-grow space-y-2 text-center sm:text-left w-full">
                  <span className="block text-xs font-semibold text-brand-text">
                    รูปถ่ายสมาชิกทีมงาน / นักบำบัด
                  </span>
                  
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-blue text-brand-text font-semibold text-xs hover:bg-brand-blue-dark transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>อัปโหลดรูปภาพ</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>

                    {formData.photoUrl && (
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl text-brand-pink hover:bg-brand-pink/10 text-xs font-semibold transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>ลบรูป</span>
                      </button>
                    )}
                  </div>

                  <p className="text-[11px] text-brand-text-muted">
                    รองรับ JPG, PNG, WebP • แนะนำภาพสี่เหลี่ยมจัตุรัส (1:1) • ไม่เกิน 2MB
                  </p>
                </div>
              </div>

              {/* Optional URL field */}
              <div>
                <label className="block text-[11px] font-medium text-brand-text-muted mb-1">
                  หรือใส่ลิงก์รูปภาพ (Image URL) โดยตรง:
                </label>
                <input
                  type="url"
                  value={formData.photoUrl}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://example.com/therapist.jpg"
                  className="w-full px-3 py-1.5 rounded-xl border border-brand-border text-xs focus:border-brand-blue focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  ชื่อ-นามสกุล <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="เช่น นักกิจกรรมบำบัด พลอยไพลิน"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    ตำแหน่งงาน
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    placeholder="เช่น นักกิจกรรมบำบัดวิชาชีพ"
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    ตำแหน่งทางวิชาชีพ / คำระบุ
                  </label>
                  <input
                    type="text"
                    value={formData.professionalTitle}
                    onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
                    placeholder="เช่น ผู้เชี่ยวชาญ Sensory Integration"
                    className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  ประวัติการศึกษา (หากยังไม่มี ให้ระบุ: [ข้อมูลรอการเพิ่มโดย Admin])
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="[ข้อมูลรอการเพิ่มโดย Admin]"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  ความเชี่ยวชาญ
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  placeholder="เช่น กิจกรรมบำบัดเด็ก, Sensory Integration, สมาธิและ EF"
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  ข้อความแนะนำตัว / ปรัชญาการทำงาน
                </label>
                <textarea
                  rows={3}
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  placeholder="ความมุ่งมั่นในการดูแลเด็กและครอบครัว..."
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" onClick={() => setEditingMember(null)}>
                  ยกเลิก
                </Button>
                <Button type="submit" variant="primary" size="md" icon={Save}>
                  บันทึกข้อมูล
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="ยืนยันการลบสมาชิกทีมงาน"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลสมาชิกทีมงานนี้ออกจากระบบ?"
        confirmLabel="ลบข้อมูล"
        confirmVariant="pink"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
}
