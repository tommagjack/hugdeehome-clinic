import { useEffect } from 'react';
import { ClipboardCheck, Sparkles, UserCheck, ShieldAlert, ArrowRight, MessageSquare } from 'lucide-react';
import { t, updateMeta } from '../utils/helpers';

export default function Assessment({ lang, clinicSettings }) {
  const lineLink = `https://line.me/R/ti/p/%40${String(clinicSettings?.line_id || 'hugdeehome').replace('@', '')}`;

  useEffect(() => {
    updateMeta(
      t(lang, 'ขั้นตอนการประเมินและเข้ารับบริการ | บ้านฮักดี พะเยา', 'Intake Assessment & Process | Hug Dee Home Phayao'),
      t(lang, 'ศึกษารายละเอียดแนวทางการประเมินพัฒนาการเด็ก การเตรียมตัวของผู้ปกครองก่อนนัดหมาย และรายละเอียดการเข้ารับบริการบำบัด', 'Learn about our assessment framework, what to bring on appointment day, and how to begin.'),
      '/assessment'
    );
  }, [lang]);

  const steps = [
    {
      num: '01',
      titleTh: 'ปรึกษาเบื้องต้น (Initial Consult)',
      titleEn: 'Initial Consult',
      descTh: 'คุณพ่อคุณแม่เล่าประวัติ พฤติกรรม หรือข้อติดขัดพัฒนาการที่กังวลผ่าน LINE หรือโทรศัพท์ เพื่อคัดกรองเบื้องต้นและจองเวลานัดประเมินจริง',
      descEn: 'Connect via LINE or phone call. Share your child\'s behavior milestones and schedules to book a face-to-face evaluation.',
      color: 'bg-primary'
    },
    {
      num: '02',
      titleTh: 'ประเมินพัฒนาการโดยตรง (Professional Assessment)',
      titleEn: 'Professional Assessment',
      descTh: 'นักกิจกรรมบำบัดใช้เครื่องมือประเมินมาตรฐานสังเกตทักษะกล้ามเนื้อ ประสาทสัมผัส สมาธิ และการเล่นร่วมกับเด็ก (ใช้เวลาประมาณ 60 - 90 นาที)',
      descEn: 'A 60-90 minute session where licensed therapists use standardized clinical tools to observe motor, sensory, and play skills.',
      color: 'bg-clinicGreen'
    },
    {
      num: '03',
      titleTh: 'วางแผนเป้าหมายการฝึก (Target Design)',
      titleEn: 'Target Design',
      descTh: 'นักกิจกรรมบำบัดชี้แจงผลการประเมิน จุดเด่น จุดบกพร่อง และพูดคุยวางเป้าหมายการฝึกที่ผู้ปกครองต้องการร่วมกันอย่างโปร่งใส',
      descEn: 'A feedback session mapping strengths and delays. Therapists collaborate with parents to design custom home and session goals.',
      color: 'bg-primary-light text-clinicText'
    },
    {
      num: '04',
      titleTh: 'ฝึกบำบัดและประเมินผลซ้ำ (Therapy & Follow-up)',
      titleEn: 'Therapy & Follow-up',
      descTh: 'เริ่มฝึกบำบัดต่อเนื่องสัปดาห์ละ 1-2 ครั้ง ควบคู่กับการนำกิจกรรมลับฝีมือไปฝึกซ้อมที่บ้าน พร้อมสรุปรายงานพัฒนาการวัดผลความก้าวหน้า',
      descEn: 'Continuous therapy 1-2 times weekly. Parents execute home programs, with scheduled progress reviews showing improvements.',
      color: 'bg-clinicPink-dark'
    }
  ];

  return (
    <div className="bg-clinicBg py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-xs font-bold bg-primary/10 text-primary-dark px-3 py-1 rounded-full uppercase tracking-wider">
            📋 {t(lang, 'กระบวนการส่งเสริมพัฒนาการ', 'Our Step-by-step Framework')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-clinicText mt-3 text-center">
            {t(lang, 'ขั้นตอนการประเมินและฝึกพัฒนาการ', 'Assessment & Therapy Process')}
          </h1>
          <p className="text-sm sm:text-base text-clinicMuted mt-3 text-center">
            {t(lang, 'เราเน้นกระบวนการที่โปร่งใส วัดผลได้จริง และให้ผู้ปกครองมีส่วนร่วมในทุกก้าวสำคัญของลูก', 'Engaging parents at every step for transparent and observable growth.')}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="space-y-6 max-w-5xl mx-auto mb-20">
          {steps.map((step) => (
            <div
              key={step.num}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-primary/5 shadow-sm flex flex-col sm:flex-row items-start gap-6"
            >
              <div className={`w-14 h-14 rounded-2xl ${step.color} text-white font-bold flex items-center justify-center text-xl shadow-md shrink-0`}>
                {step.num}
              </div>
              <div className="space-y-2">
                <h3 className="text-lg sm:text-xl font-bold text-clinicText">
                  {t(lang, step.titleTh, step.titleEn)}
                </h3>
                <p className="text-xs sm:text-sm text-clinicMuted leading-relaxed">
                  {t(lang, step.descTh, step.descEn)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* What is evaluated info */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-primary/5 shadow-sm max-w-5xl mx-auto mb-20">
          <div className="flex items-center gap-3 mb-6">
            <ClipboardCheck className="w-6 h-6 text-primary" />
            <h2 className="text-xl sm:text-2xl font-bold text-clinicText">
              {t(lang, 'เราประเมินพัฒนาการด้านใดบ้าง?', 'What Skills Do We Evaluate?')}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-clinicMuted">
            <div className="bg-clinicBg p-6 rounded-2xl border border-primary/5">
              <h4 className="font-bold text-clinicText mb-2">1. กล้ามเนื้อมัดเล็กและประสาทสัมพันธ์</h4>
              <p className="text-xs leading-relaxed">
                {t(lang, 'ประเมินการหยิบจับสิ่งของ การประสานสัมพันธ์ของตาและมือ ความคล่องตัวของนิ้วมือ ความพร้อมในการจับดินสอเขียนหนังสือและการสลัดมือ', 'Grasping precision, hand-eye coordination, pencil grasp preparedness, and fine motor dexterity.')}
              </p>
            </div>
            <div className="bg-clinicBg p-6 rounded-2xl border border-primary/5">
              <h4 className="font-bold text-clinicText mb-2">2. กล้ามเนื้อมัดใหญ่และการทรงตัว</h4>
              <p className="text-xs leading-relaxed">
                {t(lang, 'ประเมินการก้าวเดิน ทรงตัวบนขอบ การกระโดดสองขา การยืนขาเดียว การวางแผนเคลื่อนไหวหลบหลีก และความแข็งแรงของกล้ามเนื้อแกนกลางลำตัว', 'Balance, jumping, one-legged standing stability, core strength, and gross motor navigation planning.')}
              </p>
            </div>
            <div className="bg-clinicBg p-6 rounded-2xl border border-primary/5">
              <h4 className="font-bold text-clinicText mb-2">3. ระบบการประมวลผลประสาทรับความรู้สึก</h4>
              <p className="text-xs leading-relaxed">
                {t(lang, 'ประเมินความไว/ช้าของประสาทสัมผัสผิวหนัง (การหลีกหนีทราย/โคลน) การตอบสนองต่อเสียง การทรงตัว และความพร้อมในการปรับตัวกับสิ่งเร้า', 'Tactile sensitivities, auditory reactions, motion/height tolerances, and overall sensory regulation.')}
              </p>
            </div>
          </div>
        </div>

        {/* Preparation Guidelines */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-primary/5 shadow-sm max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <ShieldAlert className="w-6 h-6 text-clinicPink-dark" />
            <h2 className="text-xl sm:text-2xl font-bold text-clinicText">
              {t(lang, 'คำแนะนำการเตรียมตัวมาในวันนัดประเมิน', 'Parent Checklist for Assessment Day')}
            </h2>
          </div>

          <ul className="space-y-3.5 text-xs sm:text-sm text-clinicMuted">
            <li className="flex items-start gap-2.5">
              <span className="text-primary mt-0.5">✔</span>
              <span><strong>{t(lang, 'การพักผ่อนและการทานอาหาร', 'Sleep and Nutrition')}</strong>: {t(lang, 'ควรให้น้องนอนหลับพักผ่อนให้เต็มอิ่ม และรับประทานอาหารรองท้องมาล่วงหน้าเพื่อให้น้องมีสมาธิและมีพลังงานเพียงพอในระหว่างการประเมิน', 'Ensure the child is well-fed and has had sufficient sleep to optimize focus.')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-primary mt-0.5">✔</span>
              <span><strong>{t(lang, 'การแต่งกาย', 'Clothing')}</strong>: {t(lang, 'สวมเสื้อยืดและกางเกงที่เคลื่อนไหวได้สะดวก (แนะนำเป็นกางเกงขาสั้น/กางเกงวอร์มยืด) หลีกเลี่ยงกระโปรงหรือเสื้อผ้าที่หนาอึดอัด', 'Dress them in comfortable sports activewear (e.g. stretchable shorts/t-shirts) to support climbing.')}</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-primary mt-0.5">✔</span>
              <span><strong>{t(lang, 'เอกสารที่ควรเตรียมมา', 'Medical Logs')}</strong>: {t(lang, 'กรุณานำสมุดบันทึกพัฒนาการ (เล่มชมพู) รายงานประวัติพัฒนาการจากโรงเรียน หรือผลการประเมินใบรับรองแพทย์จากโรงพยาบาลเดิม (หากมี) มาด้วยครับ', 'Bring developmental diaries (pink book), teacher comment sheets, or previous clinical logs.')}</span>
            </li>
          </ul>
          
          <div className="mt-8 pt-8 border-t border-primary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-clinicMuted">
              {t(lang, 'มีคำถามเพิ่มเติมเกี่ยวกับขั้นตอนนี้? ปรึกษากับนักบำบัดทาง LINE ได้ฟรีครับ', 'Have any inquiries? Direct message our therapists on LINE.')}
            </p>
            <a
              href={lineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex justify-center items-center gap-2 bg-[#06C755] hover:bg-[#05b04b] text-white font-bold px-6 py-3 rounded-xl transition-all text-xs"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              {t(lang, 'ปรึกษานักบำบัด', 'Ask a Therapist')}
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
