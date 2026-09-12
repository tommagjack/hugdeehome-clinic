import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Target, 
  Compass, 
  Sparkles, 
  Users, 
  Award, 
  BookOpen, 
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Badge from '../components/common/Badge';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function About({ settings }) {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await storage.getTeam();
        setTeam(data);
      } catch (err) {
        console.error('Failed to load team data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, []);

  return (
    <div className="py-12 md:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
      
      {/* 1. Page Hero: เรื่องราวของบ้านฮักดี */}
      <section className="max-w-5xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs md:text-sm font-semibold text-brand-brown tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-border mb-4 inline-block">
            เกี่ยวกับเรา
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text mb-4">
            เรื่องราวของบ้านฮักดี
          </h1>
          <p className="text-lg sm:text-xl text-brand-brown font-medium leading-relaxed mb-6">
            "อบอุ่นเหมือนบ้าน พัฒนาการก้าวหน้าด้วยรัก"
          </p>
          <div className="space-y-4 text-base md:text-lg text-brand-text-muted leading-thai-relaxed text-left sm:text-center">
            <p>
              <strong>คลินิกพัฒนาการเด็กบ้านฮักดี (HugDeeHome)</strong> ก่อตั้งขึ้นจากความตั้งใจที่จะสร้างพื้นที่บำบัดและส่งเสริมพัฒนาการเด็กที่ไม่ทำให้เด็กรู้สึกกลัวหรือกดดัน
            </p>
            <p>
              เราเชื่อว่า สภาพแวดล้อมที่ผ่อนคลาย ความเข้าใจที่แท้จริง และการสร้างความผูกพันอันอบอุ่นระหว่างนักบำบัด เด็ก และผู้ปกครอง คือกุญแจสำคัญที่ปลดปล่อยศักยภาพตามธรรมชาติของเด็กได้อย่างยั่งยืน
            </p>
          </div>
        </div>

        {/* Featured Atmosphere Photo */}
        <div className="rounded-3xl overflow-hidden border border-brand-border shadow-soft-lg aspect-[16/9] max-w-4xl mx-auto relative group">
          <img 
            src="/images/hero-child-playing.jpg" 
            alt="บรรยากาศการทำกิจกรรมและการเล่นที่อบอุ่นเหมือนบ้านที่บ้านฮักดี" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-4 left-6 right-6 text-white text-xs sm:text-sm flex items-center justify-between">
            <span className="font-semibold drop-shadow">บ้านฮักดี • พื้นที่ที่เด็กๆ ได้เติบโตอย่างมีความสุขและมั่นใจ</span>
            <span className="hidden sm:inline bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs">
              Natural & Warm Care
            </span>
          </div>
        </div>
      </section>

      {/* 2. วิสัยทัศน์ และ พันธกิจ */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-brand-border rounded-3xl p-8 sm:p-10 shadow-soft flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-brand-soft-blue text-brand-blue-dark flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-brand-brown uppercase tracking-wider block mb-2">Vision</span>
            <h2 className="text-2xl font-bold text-brand-text mb-4">วิสัยทัศน์ของเรา</h2>
            <p className="text-base text-brand-text-muted leading-thai-relaxed">
              มุ่งมั่นเป็นบ้านแห่งการพัฒนาการที่ผู้ปกครองในจังหวัดพะเยาและพื้นที่ใกล้เคียงไว้วางใจ เป็นสะพานเชื่อมให้เด็กแต่ละคนเติบโตอย่างมีความสุข พึ่งพาตนเองได้ และมีส่วนร่วมในสังคมอย่างเต็มศักยภาพ
            </p>
          </div>
        </div>

        <div className="bg-white border border-brand-border rounded-3xl p-8 sm:p-10 shadow-soft flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-brand-cream text-brand-brown flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <span className="text-xs font-semibold text-brand-brown uppercase tracking-wider block mb-2">Mission</span>
            <h2 className="text-2xl font-bold text-brand-text mb-4">พันธกิจของเรา</h2>
            <ul className="space-y-3 text-sm sm:text-base text-brand-text-muted leading-thai-relaxed">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-brown flex-shrink-0 mt-1" />
                <span>ให้บริการประเมินและกิจกรรมบำบัดตามหลักวิชาชีพที่ได้มาตรฐานและมีจริยธรรม</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-brown flex-shrink-0 mt-1" />
                <span>ออกแบบกิจกรรมเฉพาะบุคคลที่ตอบสนองต่อจุดแข็งและความท้าทายของเด็กแต่ละคน</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-brand-brown flex-shrink-0 mt-1" />
                <span>เสริมพลังและองค์ความรู้แก่ครอบครัว เพื่อให้สามารถสานต่อการดูแลที่บ้านได้อย่างมีประสิทธิภาพ</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 3. แนวทางการให้บริการ (Clinical Approach) */}
      <section className="bg-brand-cream/60 border border-brand-border rounded-3xl p-8 sm:p-12 lg:p-16">
        <SectionHeading
          eyebrow="แนวทางการทำงาน"
          title="หลักการดูแลที่บ้านฮักดี"
          subtitle="เรายึดมั่นในการทำงานแบบองค์รวมที่มองรอบด้านของชีวิตเด็ก"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-brand-border">
            <h3 className="text-lg font-bold text-brand-text mb-2">1. สภาพแวดล้อมที่ปลอดภัย</h3>
            <p className="text-sm text-brand-text-muted leading-thai-relaxed">
              อุปกรณ์และห้องกิจกรรมถูกจัดเตรียมให้ปลอดภัย สะอาด และกระตุ้นความอยากรู้อยากเห็นในระดับที่พอเหมาะ
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border">
            <h3 className="text-lg font-bold text-brand-text mb-2">2. การเรียนรู้ผ่านการเล่น</h3>
            <p className="text-sm text-brand-text-muted leading-thai-relaxed">
              การเล่นคือเครื่องมือบำบัดที่มีประสิทธิภาพสูงสุด เมื่อเด็กสนุก สมองจะเปิดรับและสร้างการเรียนรู้ใหม่ได้เร็วที่สุด
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border">
            <h3 className="text-lg font-bold text-brand-text mb-2">3. สื่อสารโปร่งใสกับผู้ปกครอง</h3>
            <p className="text-sm text-brand-text-muted leading-thai-relaxed">
              หลังทุกคาบกิจกรรม มีการสรุปความก้าวหน้า ข้อสังเกต และคำแนะนำสำหรับกิจกรรมที่คุณพ่อคุณแม่นำไปทำต่อที่บ้าน
            </p>
          </div>
        </div>
      </section>

      {/* 4. ทีมงาน (Team Members) */}
      <section>
        <SectionHeading
          eyebrow="ทีมงานของเรา"
          title="บุคลากรผู้ร่วมเดินทางกับคุณ"
          subtitle="นักกิจกรรมบำบัดและทีมงานที่มุ่งมั่นส่งมอบการดูแลด้วยหัวใจ"
        />

        {loading ? (
          <LoadingState message="กำลังโหลดข้อมูลทีมงาน..." />
        ) : team.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member) => (
              <div
                key={member.id}
                className="brand-card flex flex-col items-center text-center p-8 group"
              >
                {/* Photo / Avatar Placeholder */}
                <div className="w-28 h-28 rounded-full bg-brand-cream border-2 border-brand-border flex items-center justify-center mb-5 overflow-hidden shadow-sm">
                  {member.photoUrl ? (
                    <img 
                      src={member.photoUrl} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Users className="w-12 h-12 text-brand-brown/60" />
                  )}
                </div>

                <h3 className="text-lg sm:text-xl font-bold text-brand-text mb-1 group-hover:text-brand-brown transition-colors">
                  {member.name}
                </h3>

                <div className="text-xs font-semibold text-brand-brown mb-3">
                  {member.position}
                </div>

                {member.professionalTitle && (
                  <Badge variant="blue" size="sm" className="mb-4">
                    {member.professionalTitle}
                  </Badge>
                )}

                <div className="w-full text-xs text-brand-text-muted space-y-2 pt-4 border-t border-brand-border/60 text-left">
                  {member.education && member.education !== '[ข้อมูลรอการเพิ่มโดย Admin]' && (
                    <div className="flex items-start gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-brand-brown flex-shrink-0 mt-0.5" />
                      <span>{member.education}</span>
                    </div>
                  )}

                  {member.expertise && (
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-brand-brown flex-shrink-0 mt-0.5" />
                      <span>ความเชี่ยวชาญ: {member.expertise}</span>
                    </div>
                  )}
                </div>

                {member.biography && (
                  <p className="mt-4 text-xs text-brand-text-muted leading-relaxed text-left italic border-l-2 border-brand-blue pl-2.5">
                    "{member.biography}"
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-brand-text-muted">
            [ข้อมูลทีมงานรอการเพิ่มโดย Admin]
          </div>
        )}
      </section>

    </div>
  );
}
