import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Clock, 
  Users, 
  CheckCircle2, 
  Phone, 
  MessageCircle, 
  Sparkles,
  Info,
  X
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import { storage } from '../services/storage';

export default function Services({ settings }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [activeModalService, setActiveModalService] = useState(null);

  const categories = [
    'ทั้งหมด',
    'การประเมินพัฒนาการ',
    'กิจกรรมบำบัด',
    'Sensory Integration',
    'สมาธิและ Executive Functions',
    'ทักษะการเรียนรู้',
    'ทักษะชีวิตประจำวัน'
  ];

  useEffect(() => {
    async function loadServices() {
      try {
        const data = await storage.getServices();
        setServices(data.filter(s => s.status === 'published'));
      } catch (err) {
        console.error('Failed to load services:', err);
      } finally {
        setLoading(false);
      }
    }
    loadServices();

    const handleUpdate = () => {
      loadServices();
    };
    window.addEventListener('hugdee_data_updated', handleUpdate);
    return () => window.removeEventListener('hugdee_data_updated', handleUpdate);
  }, []);

  const filteredServices = selectedCategory === 'ทั้งหมด'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const phone = settings?.phone || '094-675-3557';
  const lineUrl = settings?.lineUrl || 'https://line.me/R/ti/p/@hugdeehome';

  return (
    <div className="py-12 md:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs md:text-sm font-semibold text-brand-brown tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-border mb-4 inline-block">
          บริการของบ้านฮักดี
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text mb-4">
          การส่งเสริมพัฒนาการและกิจกรรมบำบัด
        </h1>
        <p className="text-base sm:text-lg text-brand-text-muted leading-thai-relaxed">
          ทุกบริการถูกออกแบบอย่างใส่ใจ โดยคำนึงถึงระดับพัฒนาการ ความสนใจ และบริบทของครอบครัว เพื่อให้เด็กได้เรียนรู้ผ่านกิจกรรมที่มีความหมาย
        </p>
      </div>

      {/* Category Filter Tabs (Wrapped cleanly onto new lines) */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        {categories.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                active
                  ? 'bg-brand-blue text-brand-text font-semibold shadow-sm'
                  : 'bg-white border border-brand-border text-brand-text hover:bg-brand-cream'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Service Listings */}
      {loading ? (
        <LoadingState message="กำลังโหลดข้อมูลบริการ..." />
      ) : filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="brand-card flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="blue">{service.category}</Badge>
                  <span className="text-xs text-brand-brown font-semibold bg-brand-cream px-2.5 py-1 rounded-lg">
                    {service.targetAge}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-brand-text mb-3 group-hover:text-brand-brown transition-colors">
                  {service.title}
                </h2>

                <p className="text-sm text-brand-text-muted leading-thai-relaxed mb-6">
                  {service.shortDescription}
                </p>

                {/* Micro info details */}
                <div className="space-y-2.5 text-xs text-brand-text-muted mb-6 bg-brand-warm-white p-3.5 rounded-xl border border-brand-border/60">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-brand-brown flex-shrink-0" />
                    <span>ระยะเวลา: <strong>{service.duration}</strong></span>
                  </div>
                  {service.showPrice && service.price && (
                    <div className="flex items-center gap-2">
                      <span className="text-brand-brown font-bold text-sm">฿</span>
                      <span>ค่าบริการ: <strong>{service.price.toLocaleString()} บาท</strong></span>
                    </div>
                  )}
                  {service.suitableFor && (
                    <div className="flex items-start gap-2 pt-1 border-t border-brand-border/40">
                      <Users className="w-3.5 h-3.5 text-brand-brown flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">เหมาะสำหรับ: {service.suitableFor}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveModalService(service)}
                  icon={Info}
                  className="text-xs"
                >
                  อ่านรายละเอียด
                </Button>

                <Button
                  href={lineUrl}
                  variant="primary"
                  size="sm"
                  icon={MessageCircle}
                  className="text-xs"
                >
                  สอบถามเพิ่มเติม
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="ไม่พบบริการในหมวดหมู่นี้"
          description="ลองเลือกหมวดหมู่อื่นเพื่อดูบริการที่มีทั้งหมดของบ้านฮักดี"
          actionLabel="ดูบริการทั้งหมด"
          onAction={() => setSelectedCategory('ทั้งหมด')}
        />
      )}

      {/* Detail Modal */}
      {activeModalService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-simple">
          <div className="bg-white rounded-3xl border border-brand-border shadow-soft-xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setActiveModalService(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-cream transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <Badge variant="blue" className="mb-2">{activeModalService.category}</Badge>
              <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">
                {activeModalService.title}
              </h2>
            </div>

            <div className="space-y-6 text-sm sm:text-base text-brand-text-muted leading-thai-relaxed">
              <div>
                <h4 className="font-bold text-brand-text text-sm uppercase tracking-wider mb-2">
                  รายละเอียดบริการ
                </h4>
                <p>{activeModalService.description || activeModalService.shortDescription}</p>
              </div>

              {activeModalService.suitableFor && (
                <div className="bg-brand-soft-blue/40 p-4 rounded-2xl border border-brand-blue/30">
                  <h4 className="font-bold text-brand-text text-sm mb-1">
                    เหมาะสำหรับใคร?
                  </h4>
                  <p className="text-sm">{activeModalService.suitableFor}</p>
                </div>
              )}

              {activeModalService.benefits && (
                <div>
                  <h4 className="font-bold text-brand-text text-sm uppercase tracking-wider mb-2">
                    ประโยชน์ที่เด็กและครอบครัวจะได้รับ
                  </h4>
                  <p>{activeModalService.benefits}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-brand-border/70 text-sm">
                <div>
                  <span className="text-brand-text-muted text-xs block">ช่วงวัยที่รับบริการ</span>
                  <span className="font-bold text-brand-text">{activeModalService.targetAge}</span>
                </div>
                <div>
                  <span className="text-brand-text-muted text-xs block">ระยะเวลาต่อครั้ง</span>
                  <span className="font-bold text-brand-text">{activeModalService.duration}</span>
                </div>
              </div>

              {activeModalService.showPrice && activeModalService.price && (
                <div className="bg-brand-cream p-4 rounded-2xl border border-brand-border text-center">
                  <span className="text-xs text-brand-text-muted block mb-0.5">อัตราค่าบริการ</span>
                  <span className="text-2xl font-bold text-brand-brown">
                    {activeModalService.price.toLocaleString()} บาท
                  </span>
                </div>
              )}
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border/60 flex flex-col sm:flex-row items-center justify-end gap-3">
              <Button
                variant="outline"
                size="md"
                onClick={() => setActiveModalService(null)}
                className="w-full sm:w-auto"
              >
                ปิดหน้าต่าง
              </Button>
              <Button
                href={lineUrl}
                variant="primary"
                size="md"
                icon={MessageCircle}
                className="w-full sm:w-auto"
              >
                สอบถามคิวรับบริการผ่าน LINE
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Consultation Box */}
      <div className="bg-brand-cream/70 border border-brand-border rounded-3xl p-8 sm:p-12 text-center max-w-3xl mx-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-brand-text mb-3">
          ไม่แน่ใจว่าลูกควรเริ่มต้นจากบริการใด?
        </h3>
        <p className="text-sm sm:text-base text-brand-text-muted leading-thai-relaxed mb-6">
          ผู้ปกครองสามารถทำแบบประเมินพัฒนาการเบื้องต้นด้วยตนเองก่อน หรือติดต่อเพื่อพูดคุยกับนักกิจกรรมบำบัดของบ้านฮักดีได้โดยไม่มีข้อผูกมัด
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            to="/assessment"
            variant="primary"
            size="md"
            icon={ArrowRight}
            iconPosition="right"
          >
            ไปที่แบบประเมินเบื้องต้น
          </Button>
          <Button
            href={`tel:${phone}`}
            variant="outline"
            size="md"
            icon={Phone}
          >
            โทรปรึกษา: {settings?.phoneFormatted || phone}
          </Button>
        </div>
      </div>

    </div>
  );
}
