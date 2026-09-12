import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Settings, 
  Image, 
  Share2, 
  Clock, 
  Save, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import LoadingState from '../components/common/LoadingState';
import Logo from '../components/common/Logo';
import { storage } from '../services/storage';

export default function SettingsCMS({ activeTab = 'general' }) {
  const [settings, setSettings] = useState(null);
  const [tab, setTab] = useState(activeTab);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes('logo')) setTab('logo');
    else if (location.pathname.includes('social')) setTab('social');
    else if (location.pathname.includes('hours')) setTab('hours');
    else setTab('general');
  }, [location.pathname]);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await storage.getSettings();
      setSettings(data);
      setLogoPreview(data.logoUrl || '');
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    try {
      const updated = {
        ...settings,
        logoUrl: logoPreview
      };
      await storage.updateSettings(updated);
      setSettings(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('ขนาดไฟล์ต้องไม่เกิน 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
  };

  if (loading || !settings) {
    return <LoadingState message="กำลังโหลดการตั้งค่า..." />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-brand-text">
          ตั้งค่าเว็บไซต์ (Website Settings)
        </h1>
        <p className="text-xs sm:text-sm text-brand-text-muted">
          จัดการข้อมูลทั่วไป โลโก้ ช่องทางโซเชียล และเวลาทำการของบ้านฮักดี
        </p>
      </div>

      {savedSuccess && (
        <Alert type="success">บันทึกการตั้งค่าเรียบร้อยแล้ว การเปลี่ยนแปลงจะมีผลบนเว็บไซต์ทันที</Alert>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-border pb-2">
        <button
          onClick={() => setTab('general')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            tab === 'general'
              ? 'bg-brand-brown text-white shadow-sm'
              : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-cream'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>ข้อมูลทั่วไป (General)</span>
        </button>

        <button
          onClick={() => setTab('logo')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            tab === 'logo'
              ? 'bg-brand-brown text-white shadow-sm'
              : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-cream'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>โลโก้ & แบรนดิ้ง (Logo)</span>
        </button>

        <button
          onClick={() => setTab('social')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            tab === 'social'
              ? 'bg-brand-brown text-white shadow-sm'
              : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-cream'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>โซเชียลมีเดีย (Social Media)</span>
        </button>

        <button
          onClick={() => setTab('hours')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            tab === 'hours'
              ? 'bg-brand-brown text-white shadow-sm'
              : 'text-brand-text-muted hover:text-brand-text hover:bg-brand-cream'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>เวลาทำการ (Opening Hours)</span>
        </button>
      </div>

      {/* Settings Form Container */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-soft">
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* TAB 1: General */}
          {tab === 'general' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-brand-text border-b border-brand-border pb-2">
                ข้อมูลคลินิกและสโลแกน
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    ชื่อภาษาไทย
                  </label>
                  <input
                    type="text"
                    value={settings.clinicNameTh}
                    onChange={(e) => setSettings({ ...settings, clinicNameTh: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    ชื่อภาษาอังกฤษ (English Name)
                  </label>
                  <input
                    type="text"
                    value={settings.clinicNameEn}
                    onChange={(e) => setSettings({ ...settings, clinicNameEn: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  สโลแกน / Brand Concept
                </label>
                <input
                  type="text"
                  value={settings.slogan}
                  onChange={(e) => setSettings({ ...settings, slogan: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    เบอร์โทรศัพท์คลินิก
                  </label>
                  <input
                    type="text"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value, phoneFormatted: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    อีเมลติดต่อ (Email)
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  ที่อยู่ภาษาไทย
                </label>
                <textarea
                  rows={2}
                  value={settings.addressTh}
                  onChange={(e) => setSettings({ ...settings, addressTh: e.target.value })}
                  className="w-full p-3 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  Google Maps URL (ลิ้งก์นำทาง)
                </label>
                <input
                  type="text"
                  value={settings.mapsUrl}
                  onChange={(e) => setSettings({ ...settings, mapsUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Logo */}
          {tab === 'logo' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-brand-text border-b border-brand-border pb-2">
                จัดการ Master Logo ของ HugDeeHome
              </h2>

              <Alert type="note" title="ข้อกำหนดการใช้โลโก้ตาม Brand Guideline">
                รักษา Aspect Ratio ของโลโก้ ห้ามดัดแปลงรูปทรง บิดเบี้ยว ตัดขอบ หรือใส่ Effect พิเศษ 
                หากยังไม่ได้อัปโหลดภาพ ระบบจะใช้ Logo Brandmark Component ที่คงอัตราส่วนและชุดสีของแบรนด์โดยอัตโนมัติ
              </Alert>

              {/* Current Preview */}
              <div className="p-8 rounded-3xl bg-brand-warm-white border border-brand-border flex flex-col items-center justify-center text-center">
                <span className="text-xs font-bold text-brand-brown uppercase tracking-wider mb-4">
                  ตัวอย่างการแสดงผลบนแถบนำทาง (Navbar Preview)
                </span>
                <div className="p-4 bg-white rounded-2xl border border-brand-border shadow-sm flex items-center justify-center">
                  <Logo settings={{ ...settings, logoUrl: logoPreview }} />
                </div>
              </div>

              {/* Upload input */}
              <div className="space-y-3">
                <label className="block text-xs font-semibold text-brand-text">
                  อัปโหลดไฟล์ Logo ของคลินิก (PNG, JPG, SVG, WebP)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-blue text-brand-text font-semibold text-xs sm:text-sm hover:bg-brand-blue-dark transition-colors shadow-sm">
                    <Upload className="w-4 h-4" />
                    <span>เลือกไฟล์รูปภาพโลโก้</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>

                  {logoPreview && (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={handleRemoveLogo}
                      icon={Trash2}
                      className="text-brand-pink hover:bg-brand-pink/10 text-xs"
                    >
                      ลบภาพและใช้ Placeholder
                    </Button>
                  )}
                </div>
                <p className="text-[11px] text-brand-text-muted">
                  ขนาดไฟล์ไม่เกิน 2MB • แนะนำภาพพื้นหลังโปร่งใส (Transparent PNG หรือ SVG)
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: Social Media */}
          {tab === 'social' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-brand-text border-b border-brand-border pb-2">
                ช่องทางโซเชียลมีเดีย
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    LINE Official ID
                  </label>
                  <input
                    type="text"
                    value={settings.lineId}
                    onChange={(e) => setSettings({ ...settings, lineId: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    LINE Official Link (URL แอดไลน์)
                  </label>
                  <input
                    type="text"
                    value={settings.lineUrl}
                    onChange={(e) => setSettings({ ...settings, lineUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    Facebook Page URL
                  </label>
                  <input
                    type="text"
                    value={settings.facebookUrl || ''}
                    onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                    placeholder="https://www.facebook.com/hugdeehome/"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    Facebook Messenger Link (m.me แชทกับเพจ)
                  </label>
                  <input
                    type="text"
                    value={settings.messengerUrl || ''}
                    onChange={(e) => setSettings({ ...settings, messengerUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                    placeholder="https://m.me/hugdeehome"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Opening Hours */}
          {tab === 'hours' && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-brand-text border-b border-brand-border pb-2">
                กำหนดเวลาทำการของคลินิก
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    วันจันทร์
                  </label>
                  <input
                    type="text"
                    value={settings.openingHours?.monday || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      openingHours: { ...settings.openingHours, monday: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    อังคาร – ศุกร์
                  </label>
                  <input
                    type="text"
                    value={settings.openingHours?.tuesdayFriday || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      openingHours: { ...settings.openingHours, tuesdayFriday: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    เสาร์ – อาทิตย์
                  </label>
                  <input
                    type="text"
                    value={settings.openingHours?.saturdaySunday || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      openingHours: { ...settings.openingHours, saturdaySunday: e.target.value }
                    })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  หมายเหตุเพิ่มเติมสำหรับผู้ปกครอง
                </label>
                <input
                  type="text"
                  value={settings.openingHours?.note || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    openingHours: { ...settings.openingHours, note: e.target.value }
                  })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border text-sm focus:border-brand-blue focus-visible:outline-none"
                />
              </div>

              {/* Live Preview Box */}
              <div className="pt-4 border-t border-brand-border">
                <span className="text-xs font-bold text-brand-brown uppercase tracking-wider block mb-3">
                  ตัวอย่างการแสดงผลบนหน้าเว็บไซต์จริง (Live Preview)
                </span>
                <div className="max-w-md bg-brand-cream/60 border border-brand-border rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3 text-brand-text font-bold text-sm">
                    <Clock className="w-4 h-4 text-brand-brown" />
                    <span>เวลาทำการ</span>
                  </div>
                  <div className="space-y-2 text-xs sm:text-sm bg-white p-3.5 rounded-xl border border-brand-border">
                    <div className="flex justify-between items-center pb-1.5 border-b border-brand-border/60">
                      <span className="text-brand-text-muted">วันจันทร์</span>
                      <span className="font-semibold text-brand-brown">
                        {settings.openingHours?.monday || 'ปิดทำการ'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-brand-border/60">
                      <span className="text-brand-text-muted">อังคาร – ศุกร์</span>
                      <span className="font-semibold text-brand-text">
                        {settings.openingHours?.tuesdayFriday || '11:00 – 19:00 น.'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-brand-text-muted">เสาร์ – อาทิตย์</span>
                      <span className="font-semibold text-brand-text">
                        {settings.openingHours?.saturdaySunday || '09:00 – 18:00 น.'}
                      </span>
                    </div>
                  </div>
                  {settings.openingHours?.note && (
                    <p className="text-[11px] text-brand-text-muted mt-2">
                      * {settings.openingHours.note.replace(/^\*\s*/, '')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-6 border-t border-brand-border flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={loadSettings}
              icon={RotateCcw}
            >
              รีเซ็ตการเปลี่ยนแปลง
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={Save}
              className="font-semibold shadow-sm"
            >
              บันทึกการตั้งค่า
            </Button>
          </div>

        </form>
      </div>

    </div>
  );
}
