import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  ArrowRight, 
  Heart, 
  Smile, 
  Users, 
  Sparkles, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  HelpCircle,
  BookOpen,
  Calendar,
  Clock
} from 'lucide-react';
import Button from '../components/common/Button';
import SectionHeading from '../components/common/SectionHeading';
import Badge from '../components/common/Badge';
import { storage } from '../services/storage';
import { COMMON_CONCERNS, FOUR_PILLARS } from '../services/seedData';

export default function Home({ settings }) {
  const [services, setServices] = useState([]);
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [servicesData, guidesData] = await Promise.all([
          storage.getServices(),
          storage.getHomeGuides()
        ]);
        setServices(servicesData.filter(s => s.status === 'published').slice(0, 6));
        setGuides(guidesData.filter(g => g.status === 'published').slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const phone = settings?.phone || '094-675-3557';
  const lineUrl = settings?.lineUrl || 'https://line.me/R/ti/p/@hugdeehome';
  const messengerUrl = settings?.messengerUrl || 'https://m.me/hugdeehome';
  const openingHours = settings?.openingHours;

  return (
    <div className="space-y-20 md:space-y-28 pb-20">
      {/* =========================================================================
          SECTION 1: HERO SECTION
         ========================================================================= */}
      <section className="relative overflow-hidden pt-8 md:pt-14 lg:pt-20">
        {/* Soft natural background elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-soft-blue/60 blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-brand-cream/80 blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Hero Text Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-border text-brand-brown text-xs md:text-sm font-semibold mb-6">
                <Heart className="w-3.5 h-3.5 text-brand-pink fill-current" />
                <span>คลินิกกิจกรรมบำบัดและส่งเสริมพัฒนาการเด็ก จ.พะเยา</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-brand-text tracking-tight leading-[1.25] mb-6">
                อบอุ่นเหมือนบ้าน <br />
                <span className="text-brand-brown">พัฒนาการก้าวหน้าด้วยรัก</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-brand-text-muted leading-thai-relaxed max-w-2xl mb-8">
                พื้นที่แห่งการเรียนรู้และพัฒนาศักยภาพเด็ก ผ่านกิจกรรมที่ออกแบบให้เหมาะสมกับเด็กแต่ละคน โดยนักกิจกรรมบำบัดวิชาชีพ
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Button
                  to="/assessment"
                  variant="primary"
                  size="lg"
                  icon={ClipboardCheck}
                  className="shadow-sm font-semibold text-base justify-center"
                >
                  ประเมินพัฒนาการเบื้องต้น
                </Button>
                <Button
                  to="/about"
                  variant="outline"
                  size="lg"
                  className="text-base justify-center"
                >
                  รู้จักบ้านฮักดี
                </Button>
              </div>

              {/* Key Highlights Micro-Bar */}
              <div className="mt-10 pt-6 border-t border-brand-border/60 grid grid-cols-3 gap-4 w-full max-w-lg text-left">
                <div>
                  <div className="font-bold text-base md:text-lg text-brand-text">Child-Centered</div>
                  <div className="text-xs text-brand-text-muted">ยึดเด็กเป็นศูนย์กลาง</div>
                </div>
                <div>
                  <div className="font-bold text-base md:text-lg text-brand-brown">Family-First</div>
                  <div className="text-xs text-brand-text-muted">ร่วมมือกับครอบครัว</div>
                </div>
                <div>
                  <div className="font-bold text-base md:text-lg text-brand-text">Play Therapy</div>
                  <div className="text-xs text-brand-text-muted">เรียนรู้ผ่านการเล่น</div>
                </div>
              </div>
            </div>

            {/* Hero Visual: Scandinavian / Warm Minimal Photo Composition */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md rounded-3xl bg-brand-cream/70 border border-brand-border p-4 sm:p-5 flex flex-col justify-between overflow-hidden shadow-soft-lg group">
                
                {/* Organic shapes illumination */}
                <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-brand-blue/30 blur-xl pointer-events-none" />
                <div className="absolute -bottom-10 -left-10 w-44 h-44 rounded-full bg-brand-yellow/30 blur-xl pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between mb-3">
                  <Badge variant="brown">บ้านฮักดี • Phayao</Badge>
                  <span 
                    className="text-xs text-brand-text-muted flex items-center gap-1.5" 
                    title={`จันทร์: ${openingHours?.monday || 'ปิดทำการ'} | อังคาร-ศุกร์: ${openingHours?.tuesdayFriday || '11:00-19:00'} | เสาร์-อาทิตย์: ${openingHours?.saturdaySunday || '09:00-18:00'}`}
                  >
                    <Clock className="w-3.5 h-3.5 text-brand-brown flex-shrink-0" />
                    <span>{openingHours?.tuesdayFriday ? `อ.–ศ. ${openingHours.tuesdayFriday}` : 'อ.–อา. 11:00-19:00'}</span>
                  </span>
                </div>

                {/* Real Warm Natural Child Photo */}
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-sm aspect-[4/3] mb-4 group-hover:scale-[1.02] transition-transform duration-500">
                  <img 
                    src="/images/hero-child-playing.jpg" 
                    alt="เด็กกำลังเล่นของเล่นเสริมพัฒนาการอย่างมีความสุขที่บ้านฮักดี"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-brand-text font-bold text-[11px] mb-1">
                      Meaningful Play
                    </span>
                    <p className="text-xs text-white/95 font-medium drop-shadow-sm">
                      ความสุขและการเรียนรู้ผ่านการเล่นที่มีความหมาย
                    </p>
                  </div>
                </div>

                <div className="relative z-10 bg-white/90 backdrop-blur-sm p-3.5 rounded-2xl border border-brand-border text-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-medium text-brand-text">ยินดีต้อนรับผู้ปกครองทุกท่าน</span>
                  </div>
                  <Link to="/contact" className="text-brand-brown font-semibold hover:underline flex items-center gap-1">
                    ติดต่อเรา <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: CONCEPT / PHILOSOPHY
          "เพราะเด็กแต่ละคน...มีเส้นทางการเติบโตที่แตกต่างกัน"
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-cream/60 border border-brand-border rounded-3xl p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Concept Text */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <span className="text-xs md:text-sm font-semibold text-brand-brown tracking-wider uppercase px-3 py-1 rounded-full bg-white border border-brand-border mb-4 inline-block">
                แนวคิดของบ้านฮักดี
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-text leading-snug mb-5">
                เพราะเด็กแต่ละคน... <br className="hidden sm:inline" />
                มีเส้นทางการเติบโตที่แตกต่างกัน
              </h2>
              <div className="space-y-4 text-base sm:text-lg text-brand-text-muted leading-thai-relaxed">
                <p>
                  ที่บ้านฮักดี เราเชื่ออย่างลึกซึ้งว่า ไม่มีเด็กคนไหนเหมือนกัน ทุกคนมีจุดแข็ง ความชอบ และจังหวะก้าวในการเรียนรู้ที่เป็นเอกลักษณ์ของตนเอง
                </p>
                <p>
                  เราจึงไม่ใช้กรอบสำเร็จรูปมาวัดคุณค่าของเด็ก แต่เราเริ่มต้นจากการ <strong>ทำความเข้าใจ</strong> ในสิ่งที่เขาเป็น ออกแบบกิจกรรมที่เขารู้สึกสนุก และร่วมมือกับครอบครัวเพื่อสร้างสิ่งแวดล้อมที่เกื้อหนุนให้เด็กเบ่งบานอย่างมั่นใจ
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-border/60 flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-brown">
                  <CheckCircle2 className="w-4 h-4 text-brand-brown" />
                  <span>เข้าใจเอกลักษณ์รายบุคคล</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brand-brown">
                  <CheckCircle2 className="w-4 h-4 text-brand-brown" />
                  <span>พ่อแม่มีส่วนร่วมในทุกขั้นตอน</span>
                </div>
              </div>
            </div>

            {/* Concept Photo: Child and Therapist / Mother playing */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-3xl overflow-hidden border border-brand-border shadow-soft aspect-[4/3] w-full max-w-md group">
                <img 
                  src="/images/therapy-child-play.jpg" 
                  alt="นักกิจกรรมบำบัดและเด็กกำลังทำกิจกรรมการเล่นอย่างอบอุ่น"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50" />
                <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
                  <span className="font-bold block drop-shadow-sm">Sensory & Play-Based Learning</span>
                  <span className="text-white/90 text-[11px]">กิจกรรมที่ผสานความสนุกและความผูกพัน</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: 4 PILLARS
          "เราให้ความสำคัญกับอะไร" (Focusing on typography & whitespace)
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="คุณค่าหลักของเรา"
          title="เราให้ความสำคัญกับอะไร"
          subtitle="4 เสาหลักในการดูแลเด็กและครอบครัวที่บ้านฮักดี"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {FOUR_PILLARS.map((pillar) => (
            <div 
              key={pillar.num}
              className="flex flex-col text-left p-6 sm:p-7 rounded-2xl bg-white border border-brand-border hover:border-brand-brown/40 transition-all duration-300 group"
            >
              {/* Pillar Number in Distinct Typography */}
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-blue/60 group-hover:text-brand-brown transition-colors mb-3">
                {pillar.num}
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-brand-text mb-1.5 leading-snug">
                {pillar.title}
              </h3>

              <div className="text-xs font-semibold text-brand-brown mb-3">
                {pillar.subtitle}
              </div>

              <p className="text-sm text-brand-text-muted leading-thai-relaxed flex-grow">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SERVICES PREVIEW FROM CMS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="บริการของบ้านฮักดี"
          title="การดูแลที่ตอบโจทย์เฉพาะบุคคล"
          subtitle="บริการส่งเสริมพัฒนาการและกิจกรรมบำบัดสำหรับเด็กตั้งแต่แรกเกิดถึง 12 ปี"
        />

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="flex flex-col justify-between p-6 sm:p-7 rounded-2xl bg-white border border-brand-border hover:border-brand-blue/60 hover:shadow-soft transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="blue">{service.category}</Badge>
                    <span className="text-xs text-brand-text-muted">{service.targetAge}</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-brand-text mb-2.5">
                    {service.title}
                  </h3>

                  <p className="text-sm text-brand-text-muted leading-thai-relaxed mb-6">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
                  <span className="text-xs text-brand-brown font-medium">
                    ระยะเวลา: {service.duration}
                  </span>
                  <Link
                    to="/services"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-brand-text hover:text-brand-brown transition-colors"
                  >
                    <span>รายละเอียด</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-brand-text-muted">
            อยู่ระหว่างการโหลดข้อมูลบริการ...
          </div>
        )}

        <div className="mt-12 text-center">
          <Button
            to="/services"
            variant="outline"
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
          >
            ดูบริการทั้งหมด
          </Button>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: COMMON PARENT CONCERNS
          "ลูกกำลังมีเรื่องที่คุณกังวลหรือไม่?"
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-soft-blue/40 border border-brand-blue/30 rounded-3xl p-8 sm:p-12 lg:p-16">
          <SectionHeading
            eyebrow="สำรวจข้อสังเกตเบื้องต้น"
            title="ลูกกำลังมีเรื่องที่คุณกังวลหรือไม่?"
            subtitle="หลายครั้งที่พฤติกรรมบางอย่างของเด็ก ไม่ใช่ความดื้อหรือความขี้เกียจ แต่อาจเป็นสัญญาณของการประมวลความรู้สึกหรือพัฒนาการที่กำลังต้องการความช่วยเหลือ"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10">
            {COMMON_CONCERNS.map((concern) => (
              <div 
                key={concern.id}
                className="p-5 rounded-2xl bg-white border border-brand-border flex flex-col justify-start text-left hover:border-brand-brown/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-brand-pink flex-shrink-0" />
                  <h4 className="font-bold text-brand-text text-sm sm:text-base">
                    {concern.title}
                  </h4>
                </div>
                <p className="text-xs text-brand-text-muted leading-relaxed">
                  {concern.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button
              to="/assessment"
              variant="primary"
              size="lg"
              icon={ClipboardCheck}
              className="shadow-sm font-semibold"
            >
              ลองประเมินเบื้องต้น
            </Button>
            <p className="text-xs text-brand-text-muted mt-3">
              ใช้เวลาประมาณ 3–5 นาที • ไม่มีค่าใช้จ่าย • เป็นแบบคัดกรองเบื้องต้นไม่ใช่การวินิจฉัยโรค
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: HOME GUIDE PREVIEW
          3-4 latest articles from CMS
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs md:text-sm font-semibold text-brand-brown tracking-wider uppercase px-3 py-1 rounded-full bg-brand-cream border border-brand-border mb-3 inline-block">
              คู่มือดูแลลูก
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-text">
              ความรู้และกิจกรรมส่งเสริมพัฒนาการที่บ้าน
            </h2>
          </div>
          <Link
            to="/home-guide"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-brown hover:underline"
          >
            <span>ดูบทความทั้งหมด</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {guides.map((guide) => (
            <Link
              key={guide.id}
              to={`/home-guide/${guide.slug}`}
              className="flex flex-col p-6 rounded-2xl bg-white border border-brand-border hover:shadow-soft hover:border-brand-brown/40 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between text-xs text-brand-text-muted mb-3">
                <Badge variant="yellow">{guide.category}</Badge>
                <span>{guide.publishedDate}</span>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-brand-text group-hover:text-brand-brown transition-colors mb-2.5 leading-snug line-clamp-2">
                {guide.title}
              </h3>

              <p className="text-sm text-brand-text-muted leading-thai-relaxed line-clamp-3 mb-6 flex-grow">
                {guide.excerpt}
              </p>

              <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-brown font-semibold">
                <span>อ่านบทความ</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: CONTACT CTA
          "หากคุณกำลังกังวลเกี่ยวกับพัฒนาการของลูก..."
         ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-cream border border-brand-border rounded-3xl p-8 sm:p-12 lg:p-16 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-white border border-brand-border text-brand-brown flex items-center justify-center mx-auto mb-4">
              <Heart className="w-6 h-6 text-brand-pink fill-current" />
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-text mb-4 leading-snug">
              หากคุณกำลังกังวลเกี่ยวกับพัฒนาการของลูก <br />
              บ้านฮักดียินดีเป็นส่วนหนึ่งในการเดินทางครั้งนี้
            </h2>

            <p className="text-base sm:text-lg text-brand-text-muted mb-8 leading-thai-relaxed">
              เราพร้อมรับฟัง ให้คำแนะนำเบื้องต้น และร่วมค้นหาแนวทางที่เหมาะสมที่สุดสำหรับเด็กและครอบครัว
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                href={`tel:${phone}`}
                variant="secondary"
                size="lg"
                icon={Phone}
                className="w-full sm:w-auto shadow-sm"
              >
                โทร: {settings?.phoneFormatted || phone}
              </Button>
              <Button
                href={lineUrl}
                variant="primary"
                size="lg"
                icon={MessageCircle}
                className="w-full sm:w-auto shadow-sm"
              >
                LINE: {settings?.lineId || '@hugdeehome'}
              </Button>
              <Button
                href={messengerUrl}
                variant="outline"
                size="lg"
                className="w-full sm:w-auto shadow-sm border-[#0084FF] text-[#0084FF] hover:bg-[#0084FF] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                  <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.453 5.516 3.73 7.215v3.527l3.39-1.86c.915.253 1.884.39 2.88.39 5.523 0 10-4.145 10-9.272S17.523 2 12 2zm1.05 12.46l-2.67-2.85-5.21 2.85 5.73-6.08 2.74 2.85 5.14-2.85-5.73 6.08z" />
                </svg>
                <span>แชท Messenger</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
