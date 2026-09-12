import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Home, Sparkles } from 'lucide-react';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function HomeCMS() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await storage.getSettings();
      setSettings(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await storage.updateSettings(settings);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (loading || !settings) {
    return <LoadingState message="กำลังโหลดข้อมูลหน้าแรก..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <div>
        <h1 className="text-2xl font-bold text-brand-text">
          จัดการเนื้อหาหน้าแรก (Home Page CMS)
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-muted">
          ปรับแต่งข้อความ Hero Section, ข้อความต้อนรับ และคำประกาศบนหน้าแรก
        </p>
      </div>

      {savedSuccess && (
        <Alert type="success">บันทึกเนื้อหาหน้าแรกเรียบร้อยแล้ว</Alert>
      )}

      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-soft">
        <form onSubmit={handleSave} className="space-y-6 text-sm">
          
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-brand-text border-b border-brand-border pb-2">
              Hero Section (ส่วนบนสุดของหน้าแรก)
            </h2>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                Headline หลัก (ข้อความพาดหัว)
              </label>
              <input
                type="text"
                value={settings.slogan}
                onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
              />
              <span className="text-[11px] text-brand-text-muted mt-1 block">
                ค่าเริ่มต้น: "อบอุ่นเหมือนบ้าน พัฒนาการก้าวหน้าด้วยรัก"
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                Subheadline (คำอธิบายรอง)
              </label>
              <textarea
                rows={3}
                value={settings.subheadline || 'พื้นที่แห่งการเรียนรู้และพัฒนาศักยภาพเด็ก ผ่านกิจกรรมที่ออกแบบให้เหมาะสมกับเด็กแต่ละคน โดยนักกิจกรรมบำบัดวิชาชีพ'}
                onChange={(e) => setSettings({ ...settings, subheadline: e.target.value })}
                className="w-full p-3 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none resize-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-brand-border flex justify-end">
            <Button type="submit" variant="primary" size="lg" icon={Save}>
              บันทึกเนื้อหาหน้าแรก
            </Button>
          </div>

        </form>
      </div>
    </div>
  );
}
