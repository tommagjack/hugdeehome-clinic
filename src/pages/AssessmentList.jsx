import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ClipboardCheck, 
  Clock, 
  Users, 
  ArrowRight, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2 
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function AssessmentList({ settings }) {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAssessments() {
      try {
        const data = await storage.getAssessments();
        setAssessments(data.filter(a => a.status === 'published'));
      } catch (err) {
        console.error('Failed to load assessments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAssessments();

    const handleUpdate = () => {
      loadAssessments();
    };
    window.addEventListener('hugdee_data_updated', handleUpdate);
    return () => window.removeEventListener('hugdee_data_updated', handleUpdate);
  }, []);

  return (
    <div className="py-12 md:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs md:text-sm font-semibold text-brand-brown tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-border mb-4 inline-block">
          ระบบสำรวจพัฒนาการออนไลน์
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text mb-4">
          แบบประเมินพัฒนาการเบื้องต้น
        </h1>
        <p className="text-base sm:text-lg text-brand-text-muted leading-thai-relaxed">
          แบบประเมินนี้จัดทำขึ้นเพื่อคัดกรองและสำรวจข้อสังเกตเบื้องต้นเกี่ยวกับพัฒนาการและพฤติกรรมของเด็ก เพื่อเป็นแนวทางสำหรับผู้ปกครองในการสังเกตลูกอย่างใกล้ชิด
        </p>
      </div>

      {/* Prominent Mandatory Clinical Disclaimer */}
      <div className="max-w-4xl mx-auto">
        <Alert type="warning" title="คำชี้แจงสำคัญก่อนเริ่มทำแบบประเมิน">
          ผลการประเมินนี้เป็นเพียงการคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรคหรือการประเมินโดยผู้เชี่ยวชาญ 
          หากท่านมีข้อกังวลเกี่ยวกับพัฒนาการหรือพฤติกรรมของเด็ก ควรปรึกษากุมารแพทย์หรือนักกิจกรรมบำบัดวิชาชีพเพื่อรับการประเมินอย่างละเอียดและเหมาะสมเฉพาะบุคคล
        </Alert>
      </div>

      {/* Assessment Directory */}
      {loading ? (
        <LoadingState message="กำลังโหลดแบบประเมิน..." />
      ) : assessments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {assessments.map((asm) => (
            <div
              key={asm.id}
              className="brand-card flex flex-col justify-between group p-7 sm:p-8"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="yellow">{asm.category || 'พัฒนาการเด็ก'}</Badge>
                  <div className="flex items-center gap-3 text-xs text-brand-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-brown" />
                      ~{asm.estimatedMinutes || 5} นาที
                    </span>
                    <span className="flex items-center gap-1">
                      <ClipboardCheck className="w-3.5 h-3.5 text-brand-blue-dark" />
                      {asm.questions?.length || 0} ข้อ
                    </span>
                  </div>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-brand-text mb-3 group-hover:text-brand-brown transition-colors">
                  {asm.title}
                </h2>

                <p className="text-sm text-brand-text-muted leading-thai-relaxed mb-6">
                  {asm.description}
                </p>

                <div className="bg-brand-cream/60 p-3.5 rounded-xl border border-brand-border text-xs text-brand-brown font-medium mb-6">
                  ช่วงวัยเป้าหมาย: <strong>{asm.targetAge}</strong>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between">
                <span className="text-xs text-brand-text-muted">ไม่มีค่าใช้จ่าย</span>
                <Button
                  to={`/assessment/${asm.id}`}
                  variant="primary"
                  size="md"
                  icon={ArrowRight}
                  iconPosition="right"
                  className="font-semibold shadow-sm"
                >
                  เริ่มประเมิน
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-brand-text-muted">
          ยังไม่มีแบบประเมินที่เผยแพร่ในขณะนี้
        </div>
      )}

      {/* How to use the screening */}
      <div className="max-w-4xl mx-auto bg-brand-cream/50 border border-brand-border rounded-3xl p-8 sm:p-10">
        <h3 className="text-lg sm:text-xl font-bold text-brand-text mb-4 text-center">
          ข้อแนะนำในการตอบแบบสำรวจ
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-brand-text-muted">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-blue text-brand-text font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              1
            </div>
            <p>ตอบตามพฤติกรรมและความสามารถจริงที่สังเกตเห็นบ่อยที่สุดในชีวิตประจำวัน</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-blue text-brand-text font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              2
            </div>
            <p>ไม่จำเป็นต้องกดดันหรือทดสอบเด็กอย่างจริงจังในขณะทำแบบประเมิน</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-brand-blue text-brand-text font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
              3
            </div>
            <p>ผลลัพธ์จะประมวลผลทันที พร้อมข้อแนะนำเบื้องต้นที่นำไปปรับใช้ในบ้านได้</p>
          </div>
        </div>
      </div>

    </div>
  );
}
