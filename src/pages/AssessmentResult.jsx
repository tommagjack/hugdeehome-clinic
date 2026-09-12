import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Phone, 
  MessageCircle, 
  ArrowRight, 
  RotateCcw, 
  ShieldAlert,
  MapPin,
  Heart
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function AssessmentResult({ settings }) {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResult() {
      try {
        const [asm, rawSubmission] = await Promise.all([
          storage.getAssessmentById(id),
          sessionStorage.getItem(`hugdee_result_${id}`)
        ]);

        setAssessment(asm);
        if (rawSubmission) {
          setSubmission(JSON.parse(rawSubmission));
        }
      } catch (err) {
        console.error('Error loading result:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResult();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 max-w-3xl mx-auto px-4">
        <LoadingState message="กำลังประมวลผลการประเมิน..." />
      </div>
    );
  }

  if (!assessment || !submission) {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 text-center">
        <Alert type="warning">
          ไม่พบข้อมูลผลการประเมิน กรุณาทำแบบประเมินใหม่อีกครั้ง
        </Alert>
        <div className="mt-6">
          <Button to="/assessment" variant="primary">
            กลับหน้ารวมแบบประเมิน
          </Button>
        </div>
      </div>
    );
  }

  // Determine result level based on thresholds
  const score = submission.score || 0;
  const thresholds = assessment.scoringRules?.thresholds || [
    {
      minScore: 0,
      maxScore: 3,
      level: 1,
      badgeText: 'อยู่ในเกณฑ์เบื้องต้น',
      color: 'blue',
      interpretation: 'เด็กมีทักษะและพฤติกรรมส่วนใหญ่สอดคล้องตามเกณฑ์วัยเบื้องต้น สามารถสนับสนุนพัฒนาการต่อเนื่องได้ด้วยกิจกรรมในบ้าน',
      recommendation: 'ส่งเสริมการเล่นอิสระ การพูดคุยโต้ตอบ และเปิดโอกาสให้เด็กลงมือทำสิ่งต่างๆ ด้วยตนเองอย่างสม่ำเสมอ'
    },
    {
      minScore: 4,
      maxScore: 7,
      level: 2,
      badgeText: 'พบข้อสังเกตบางประการ ควรติดตาม',
      color: 'yellow',
      interpretation: 'พบข้อสังเกตในบางทักษะที่อาจต้องการการกระตุ้นหรือสภาพแวดล้อมที่เอื้อต่อการเรียนรู้เพิ่มเติม',
      recommendation: 'ลองเพิ่มกิจกรรมเล่นที่เน้นทักษะที่พบข้อสังเกต และติดตามดูพัฒนาการใน 1-2 เดือน'
    },
    {
      minScore: 8,
      maxScore: 99,
      level: 3,
      badgeText: 'แนะนำให้ปรึกษาผู้เชี่ยวชาญ',
      color: 'pink',
      interpretation: 'พบข้อสังเกตในหลายด้านที่อาจส่งผลต่อกิจวัตรประจำวันหรือการปรับตัวของเด็ก',
      recommendation: 'แนะนำให้นำเด็กมาพบนักกิจกรรมบำบัดหรือกุมารแพทย์พัฒนาการเด็ก เพื่อรับการตรวจประเมินอย่างละเอียด'
    }
  ];

  const matchedLevel = thresholds.find(t => score >= t.minScore && score <= t.maxScore) || thresholds[0];

  const phone = settings?.phone || '094-675-3557';
  const lineUrl = settings?.lineUrl || 'https://line.me/R/ti/p/@hugdeehome';

  return (
    <div className="py-12 md:py-18 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs md:text-sm font-semibold text-brand-brown tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-border mb-3 inline-block">
          ผลการประเมินเบื้องต้น
        </span>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-text mb-2">
          {assessment.title}
        </h1>
        <p className="text-sm text-brand-text-muted">
          แบบประเมินสำหรับช่วงวัย: <strong>{assessment.targetAge}</strong>
        </p>
      </div>

      {/* Primary Result Card */}
      <div className="bg-white rounded-3xl border border-brand-border shadow-soft p-7 sm:p-10 text-center animate-fade-in">
        
        {/* Score and Status Pill */}
        <div className="inline-flex flex-col items-center mb-6">
          <Badge 
            variant={matchedLevel.color === 'blue' ? 'blue' : matchedLevel.color === 'yellow' ? 'yellow' : 'pink'}
            size="md"
            className="text-sm sm:text-base px-4 py-1.5 font-bold mb-3"
          >
            {matchedLevel.badgeText}
          </Badge>
          <span className="text-xs text-brand-text-muted">
            คะแนนข้อสังเกตรวม: <strong className="text-brand-text text-sm">{score}</strong> คะแนน
          </span>
        </div>

        {/* Clinical Meaning / Interpretation (Parent-friendly language, NO diagnostic labels) */}
        <div className="max-w-2xl mx-auto bg-brand-warm-white p-6 rounded-2xl border border-brand-border/80 text-left mb-8 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-brand-brown uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>การแปลผลเบื้องต้น</span>
            </h3>
            <p className="text-sm sm:text-base text-brand-text leading-thai-relaxed">
              {matchedLevel.interpretation}
            </p>
          </div>

          <div className="pt-4 border-t border-brand-border/60">
            <h3 className="text-sm font-bold text-brand-brown uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-brand-pink fill-current" />
              <span>คำแนะนำสำหรับผู้ปกครอง</span>
            </h3>
            <p className="text-sm sm:text-base text-brand-text-muted leading-thai-relaxed">
              {matchedLevel.recommendation}
            </p>
          </div>
        </div>

        {/* Action CTAs for Consultation */}
        <div className="max-w-xl mx-auto space-y-3">
          <h4 className="text-sm font-bold text-brand-text mb-2">
            ต้องการปรึกษาข้อสังเกตของลูกกับนักกิจกรรมบำบัด?
          </h4>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              href={lineUrl}
              variant="primary"
              size="lg"
              icon={MessageCircle}
              className="w-full sm:w-auto font-semibold shadow-sm"
            >
              คุยกับเราผ่าน LINE (@hugdeehome)
            </Button>
            <Button
              href={`tel:${phone}`}
              variant="outline"
              size="lg"
              icon={Phone}
              className="w-full sm:w-auto"
            >
              โทรศัพท์: {settings?.phoneFormatted || phone}
            </Button>
          </div>
          <p className="text-xs text-brand-text-muted pt-2">
            คลินิกยินดีตอบข้อซักถามเบื้องต้นและให้คำแนะนำที่เป็นมิตร
          </p>
        </div>

      </div>

      {/* Mandatory Disclaimer Box */}
      <Alert type="warning" title="ข้อควรทราบสำคัญ">
        {assessment.disclaimer || 'ผลการประเมินนี้เป็นเพียงการคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรคหรือการประเมินโดยผู้เชี่ยวชาญ หากมีข้อกังวลเกี่ยวกับพัฒนาการของเด็ก ควรปรึกษาผู้เชี่ยวชาญเพื่อรับการประเมินอย่างเหมาะสม'}
      </Alert>

      {/* Retake or View Other Assessments */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-brand-border/60">
        <Button
          to={`/assessment/${assessment.id}`}
          variant="ghost"
          size="sm"
          icon={RotateCcw}
        >
          ทำแบบประเมินนี้ซ้ำ
        </Button>
        <Button
          to="/assessment"
          variant="outline"
          size="sm"
          icon={ArrowRight}
          iconPosition="right"
        >
          ดูแบบประเมินหัวข้ออื่น
        </Button>
      </div>

    </div>
  );
}
