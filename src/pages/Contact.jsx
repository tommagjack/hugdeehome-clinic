import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ExternalLink, 
  Send, 
  MessageCircle, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { storage } from '../services/storage';

export default function Contact({ settings }) {
  const [formData, setFormData] = useState({
    parentName: '',
    phone: '',
    childAge: '',
    topic: 'สอบถามข้อมูลบริการทั่วไป',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const phone = settings?.phone || '094-675-3557';
  const phoneFormatted = settings?.phoneFormatted || '094-675-3557';
  const lineId = settings?.lineId || '@hugdeehome';
  const lineUrl = settings?.lineUrl || 'https://line.me/R/ti/p/@hugdeehome';
  const email = settings?.email || 'hugdeehome@gmail.com';
  const facebookUrl = settings?.facebookUrl || 'https://www.facebook.com/hugdeehome/';
  const mapsUrl = settings?.mapsUrl || 'https://maps.app.goo.gl/k4rgFC8ej7QQcQCH8';
  const mapsEmbedUrl = settings?.mapsEmbedUrl || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.206497121404!2d99.88794837582522!3d19.197089948834415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d8329bc019cd51%3A0xe54d9b4b0e8b4e7a!2z4Lia4LmJ4Liy4LiZ4LmA4Lin4Liq4Li04Li1IOC4hOC4peC4tOC4meC4tOC4gSDguIHguLiy4Lia4Liy4LiB4Li04LiI4LiB4Lij4Lij4LiV4Liw4Lia4Lix4LiX4LiH!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth';
  const addressTh = settings?.addressTh || '104/7 หมู่ 17 ตำบลบ้านต๋อม อำเภอเมืองพะเยา จังหวัดพะเยา 56000';
  const openingHours = settings?.openingHours || {
    monday: 'ปิดทำการ (Closed)',
    tuesdayFriday: '11:00 – 19:00 น.',
    saturdaySunday: '09:00 – 18:00 น.',
    note: 'เพื่อให้การดูแลเป็นไปอย่างต่อเนื่องและเด็กได้รับความเป็นส่วนตัวสูงสุด กรุณาติดต่อเพื่อนัดหมายล่วงหน้าก่อนเดินทางมายังคลินิก'
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.parentName.trim() || !formData.phone.trim()) {
      setError('กรุณาระบุชื่อผู้ปกครองและเบอร์โทรศัพท์สำหรับติดต่อกลับ');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await storage.saveInquiry(formData);
      setSubmitted(true);
      setFormData({
        parentName: '',
        phone: '',
        childAge: '',
        topic: 'สอบถามข้อมูลบริการทั่วไป',
        message: ''
      });
    } catch (err) {
      console.error('Error saving inquiry:', err);
      setError('ไม่สามารถส่งข้อความได้ในขณะนี้ กรุณาติดต่อผ่าน LINE หรือโทรศัพท์');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 md:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs md:text-sm font-semibold text-brand-brown tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-border mb-4 inline-block">
          ช่องทางติดต่อเรา
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text mb-4">
          ติดต่อบ้านฮักดี
        </h1>
        <p className="text-base sm:text-lg text-brand-text-muted leading-thai-relaxed">
          ยินดีต้อนรับผู้ปกครองทุกท่าน สามารถสอบถามข้อมูล ปรึกษาข้อสังเกต หรือติดต่อเพื่อวางแผนเข้าพบนักกิจกรรมบำบัด
        </p>
      </div>

      {/* Main Grid: Direct Channels & Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Official Contact Channels & Hours (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Contact Details Card */}
          <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-soft space-y-6">
            <h2 className="text-xl font-bold text-brand-text border-b border-brand-border/60 pb-3">
              ข้อมูลคลินิก
            </h2>

            <div className="space-y-4 text-sm sm:text-base">
              <div className="flex items-start gap-3.5">
                <MapPin className="w-5 h-5 text-brand-brown flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-brand-text block mb-1">ที่ตั้งคลินิก:</span>
                  <p className="text-brand-text-muted text-sm leading-relaxed">{addressTh}</p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Phone className="w-5 h-5 text-brand-brown flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-brand-text block mb-1">เบอร์โทรศัพท์:</span>
                  <a href={`tel:${phone}`} className="text-brand-brown font-bold hover:underline text-base">
                    {phoneFormatted}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-md bg-[#06C755] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">
                  L
                </div>
                <div>
                  <span className="font-semibold text-brand-text block mb-1">LINE Official:</span>
                  <a href={lineUrl} target="_blank" rel="noopener noreferrer" className="text-brand-text hover:text-brand-brown font-medium">
                    {lineId}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-5 h-5 rounded-md bg-[#0084FF] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-1">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.453 5.516 3.73 7.215v3.527l3.39-1.86c.915.253 1.884.39 2.88.39 5.523 0 10-4.145 10-9.272S17.523 2 12 2zm1.05 12.46l-2.67-2.85-5.21 2.85 5.73-6.08 2.74 2.85 5.14-2.85-5.73 6.08z" />
                  </svg>
                </div>
                <div>
                  <span className="font-semibold text-brand-text block mb-1">Facebook Messenger:</span>
                  <a href={settings?.messengerUrl || 'https://m.me/hugdeehome'} target="_blank" rel="noopener noreferrer" className="text-brand-text hover:text-brand-brown font-medium">
                    m.me/hugdeehome (แชทกับเพจ)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <Mail className="w-5 h-5 text-brand-brown flex-shrink-0 mt-1" />
                <div>
                  <span className="font-semibold text-brand-text block mb-1">อีเมล:</span>
                  <a href={`mailto:${email}`} className="text-brand-text-muted hover:text-brand-brown text-sm break-all">
                    {email}
                  </a>
                </div>
              </div>
            </div>

            {/* Direct Quick Action Buttons */}
            <div className="pt-4 border-t border-brand-border/60 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <Button
                href={settings?.messengerUrl || 'https://m.me/hugdeehome'}
                variant="outline"
                size="md"
                className="w-full justify-center text-xs font-semibold bg-[#0084FF]/10 text-[#0084FF] border-[#0084FF]/30 hover:bg-[#0084FF] hover:text-white"
              >
                Messenger
              </Button>
              <Button
                href={lineUrl}
                variant="primary"
                size="md"
                className="w-full justify-center text-xs font-semibold"
              >
                LINE Official
              </Button>
              <Button
                href={`tel:${phone}`}
                variant="secondary"
                size="md"
                className="w-full justify-center text-xs font-semibold"
              >
                โทรหาคลินิก
              </Button>
            </div>
          </div>

          {/* Opening Hours Card */}
          <div className="bg-brand-cream/70 rounded-3xl border border-brand-border p-6 sm:p-8 space-y-4">
            <h3 className="text-lg font-bold text-brand-text flex items-center gap-2">
              <Clock className="w-5 h-5 text-brand-brown" />
              <span>เวลาทำการ</span>
            </h3>

            <div className="space-y-2.5 text-sm bg-white p-4 rounded-2xl border border-brand-border">
              <div className="flex justify-between items-center pb-2 border-b border-brand-border/60">
                <span className="text-brand-text-muted">วันจันทร์</span>
                <span className="font-semibold text-brand-brown">
                  {openingHours?.monday || 'ปิดทำการ (Closed)'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-brand-border/60">
                <span className="text-brand-text-muted">อังคาร – ศุกร์</span>
                <span className="font-semibold text-brand-text">
                  {openingHours?.tuesdayFriday || '11:00 – 19:00 น.'}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-brand-text-muted">เสาร์ – อาทิตย์</span>
                <span className="font-semibold text-brand-text">
                  {openingHours?.saturdaySunday || '09:00 – 18:00 น.'}
                </span>
              </div>
            </div>

            {openingHours?.note && (
              <p className="text-xs text-brand-text-muted leading-relaxed">
                * {openingHours.note.replace(/^\*\s*/, '')}
              </p>
            )}
          </div>

        </div>

        {/* Right Column: Inquiry Message Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-brand-border p-6 sm:p-10 shadow-soft">
          <h2 className="text-2xl font-bold text-brand-text mb-2">
            ส่งข้อความสอบถาม
          </h2>
          <p className="text-sm text-brand-text-muted mb-6 leading-relaxed">
            กรอกข้อมูลและข้อสังเกตของลูกเบื้องต้น เจ้าหน้าที่จะติดต่อกลับเพื่อให้ข้อมูลและคำแนะนำตามเวลาทำการ
          </p>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-emerald-900">
                ส่งข้อความเรียบร้อยแล้ว
              </h3>
              <p className="text-sm text-emerald-800 max-w-md mx-auto leading-relaxed">
                บ้านฮักดีได้รับข้อความของท่านแล้ว เจ้าหน้าที่จะติดต่อกลับผ่านเบอร์โทรศัพท์หรือช่องทางที่ท่านระบุไว้โดยเร็วที่สุด
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSubmitted(false)}
              >
                ส่งข้อความเพิ่มเติม
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <Alert type="warning">{error}</Alert>}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                    ชื่อผู้ปกครอง <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="เช่น คุณแม่นันทิยา"
                    className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-warm-white focus:bg-white focus:border-brand-blue text-sm text-brand-text focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                    เบอร์โทรศัพท์ <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="เช่น 081-234-5678"
                    className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-warm-white focus:bg-white focus:border-brand-blue text-sm text-brand-text focus-visible:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                    อายุของเด็ก
                  </label>
                  <input
                    type="text"
                    value={formData.childAge}
                    onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
                    placeholder="เช่น 3 ขวบ 6 เดือน"
                    className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-warm-white focus:bg-white focus:border-brand-blue text-sm text-brand-text focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                    หัวข้อที่ต้องการสอบถาม
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-warm-white focus:bg-white focus:border-brand-blue text-sm text-brand-text focus-visible:outline-none"
                  >
                    <option value="สอบถามข้อมูลบริการทั่วไป">สอบถามข้อมูลบริการทั่วไป</option>
                    <option value="การประเมินพัฒนาการ">การประเมินพัฒนาการ</option>
                    <option value="กิจกรรมบำบัด & Sensory">กิจกรรมบำบัด & Sensory</option>
                    <option value="สมาธิและ EF">สมาธิและ EF</option>
                    <option value="ปรึกษาผลการประเมินออนไลน์">ปรึกษาผลการประเมินออนไลน์</option>
                    <option value="เรื่องอื่นๆ">เรื่องอื่นๆ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text uppercase tracking-wider mb-1.5">
                  ข้อความหรือข้อสังเกตที่ท่านกังวล
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="อธิบายพฤติกรรม ข้อสังเกต หรือสิ่งที่ท่านต้องการปรึกษา..."
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-warm-white focus:bg-white focus:border-brand-blue text-sm text-brand-text focus-visible:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  icon={Send}
                  className="w-full sm:w-auto font-semibold shadow-sm"
                >
                  ส่งข้อความถึงบ้านฮักดี
                </Button>
              </div>
            </form>
          )}

        </div>

      </div>

      {/* Google Maps Section */}
      <div className="bg-white rounded-3xl border border-brand-border overflow-hidden shadow-soft">
        <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-brand-border/60">
          <div>
            <h3 className="text-xl font-bold text-brand-text">
              แผนที่การเดินทางมายังบ้านฮักดี
            </h3>
            <p className="text-xs sm:text-sm text-brand-text-muted mt-1">
              ตำบลบ้านต๋อม อำเภอเมืองพะเยา จังหวัดพะเยา
            </p>
          </div>
          <Button
            href={mapsUrl}
            variant="outline"
            size="sm"
            icon={ExternalLink}
            iconPosition="right"
          >
            เปิดใน Google Maps
          </Button>
        </div>

        {/* Embedded Map */}
        <div className="w-full h-80 sm:h-96 bg-brand-cream/50 relative">
          <iframe
            title="Google Maps คลินิกพัฒนาการเด็กบ้านฮักดี"
            src={mapsEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

    </div>
  );
}
