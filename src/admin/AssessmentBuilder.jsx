import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft, 
  ArrowUp, 
  ArrowDown, 
  Eye, 
  CheckCircle2, 
  HelpCircle,
  Copy,
  Sliders,
  Settings,
  X,
  FileText
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function AssessmentBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState({
    title: 'แบบประเมินพัฒนาการเด็กชุดใหม่',
    slug: `assessment-${Date.now()}`,
    category: 'พัฒนาการเด็ก',
    targetAge: '1 – 6 ปี',
    estimatedMinutes: 5,
    description: 'แบบสำรวจพฤติกรรมและพัฒนาการเบื้องต้น',
    disclaimer: 'ผลการประเมินนี้เป็นเพียงการคัดกรองเบื้องต้น ไม่ใช่การวินิจฉัยโรคหรือการประเมินโดยผู้เชี่ยวชาญ หากมีข้อกังวลเกี่ยวกับพัฒนาการของเด็ก ควรปรึกษาผู้เชี่ยวชาญเพื่อรับการประเมินอย่างเหมาะสม',
    status: 'draft',
    scoringRules: {
      thresholds: [
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
      ]
    },
    questions: [
      {
        id: 'q_init_1',
        questionText: 'คำถามข้อแรกเกี่ยวกับการสังเกตพฤติกรรมของเด็ก',
        questionType: 'single_choice',
        section: 'หมวดทั่วไป',
        required: true,
        displayOrder: 1,
        options: [
          { text: 'ทำได้เป็นประจำอย่างคล่องแคล่ว', score: 0 },
          { text: 'ทำได้บางครั้ง ต้องช่วยเหลือ', score: 1 },
          { text: 'ยังไม่สามารถทำได้', score: 2 }
        ]
      }
    ]
  });

  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (id && id !== 'new') {
        try {
          const asm = await storage.getAssessmentById(id);
          if (asm) {
            setAssessment(asm);
          }
        } catch (err) {
          console.error('Error loading assessment for builder:', err);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [id]);

  const currentQuestion = assessment.questions[selectedQuestionIndex] || assessment.questions[0];

  // --- Question Manipulation ---
  const handleAddQuestion = () => {
    const newQ = {
      id: `q_${Date.now()}`,
      questionText: `ข้อคำถามใหม่ที่ ${assessment.questions.length + 1}`,
      questionType: 'single_choice',
      section: 'หมวดพัฒนาการ',
      required: true,
      displayOrder: assessment.questions.length + 1,
      options: [
        { text: 'ทำได้ตามปกติ', score: 0 },
        { text: 'ทำได้บ้างเล็กน้อย', score: 1 },
        { text: 'ทำไม่ได้เลย', score: 2 }
      ]
    };
    const updated = [...assessment.questions, newQ];
    setAssessment({ ...assessment, questions: updated });
    setSelectedQuestionIndex(updated.length - 1);
  };

  const handleDeleteQuestion = (idx) => {
    if (assessment.questions.length <= 1) {
      alert('แบบประเมินต้องมีอย่างน้อย 1 ข้อคำถาม');
      return;
    }
    const updated = assessment.questions.filter((_, i) => i !== idx);
    setAssessment({ ...assessment, questions: updated });
    setSelectedQuestionIndex(Math.max(0, idx - 1));
  };

  const handleMoveQuestion = (idx, direction) => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= assessment.questions.length) return;
    const list = [...assessment.questions];
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    setAssessment({ ...assessment, questions: list });
    setSelectedQuestionIndex(targetIdx);
  };

  const handleUpdateCurrentQuestion = (field, value) => {
    const list = [...assessment.questions];
    list[selectedQuestionIndex] = {
      ...list[selectedQuestionIndex],
      [field]: value
    };
    setAssessment({ ...assessment, questions: list });
  };

  // --- Options Manipulation ---
  const handleAddOption = () => {
    const opts = currentQuestion.options || [];
    const newOpts = [...opts, { text: `ตัวเลือกใหม่ ${opts.length + 1}`, score: opts.length }];
    handleUpdateCurrentQuestion('options', newOpts);
  };

  const handleUpdateOption = (optIdx, field, val) => {
    const opts = [...(currentQuestion.options || [])];
    opts[optIdx] = {
      ...opts[optIdx],
      [field]: field === 'score' ? Number(val) : val
    };
    handleUpdateCurrentQuestion('options', opts);
  };

  const handleDeleteOption = (optIdx) => {
    const opts = (currentQuestion.options || []).filter((_, i) => i !== optIdx);
    handleUpdateCurrentQuestion('options', opts);
  };

  // --- Threshold manipulation ---
  const handleUpdateThreshold = (tIdx, field, val) => {
    const thresholds = [...(assessment.scoringRules?.thresholds || [])];
    thresholds[tIdx] = {
      ...thresholds[tIdx],
      [field]: (field === 'minScore' || field === 'maxScore') ? Number(val) : val
    };
    setAssessment({
      ...assessment,
      scoringRules: { ...assessment.scoringRules, thresholds }
    });
  };

  // Save full assessment to storage
  const handleSave = async (statusOverride) => {
    const payload = {
      ...assessment,
      status: statusOverride || assessment.status,
      id: id === 'new' ? `asm_${Date.now()}` : assessment.id
    };
    await storage.saveAssessment(payload);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    if (id === 'new') {
      navigate(`/admin/assessment/builder/${payload.id}`, { replace: true });
    }
  };

  if (loading) {
    return <LoadingState message="กำลังเปิด Assessment Builder..." />;
  }

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto pb-16">
      
      {/* Top Action Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-border shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/assessment"
            className="p-2 rounded-xl text-neutral-500 hover:text-brand-brown hover:bg-brand-cream transition-colors"
            title="กลับหน้ารายการแบบประเมิน"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-brand-text">
                Assessment Builder
              </h1>
              <Badge variant={assessment.status === 'published' ? 'blue' : 'yellow'} size="sm">
                {assessment.status === 'published' ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
              </Badge>
            </div>
            <p className="text-xs text-brand-text-muted">
              สร้างและกำหนดเกณฑ์คะแนนแบบประเมินออนไลน์โดยไม่ต้องแก้ไขโค้ด
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            icon={Eye}
            onClick={() => setPreviewOpen(true)}
          >
            ทดลองพรีวิว
          </Button>

          {assessment.status === 'draft' ? (
            <Button
              variant="primary"
              size="sm"
              icon={CheckCircle2}
              onClick={() => handleSave('published')}
              className="font-semibold"
            >
              เผยแพร่แบบประเมิน
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSave('draft')}
            >
              เปลี่ยนเป็นฉบับร่าง
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            icon={Save}
            onClick={() => handleSave()}
          >
            บันทึก
          </Button>
        </div>
      </div>

      {saveSuccess && (
        <Alert type="success">บันทึกแบบประเมินเรียบร้อยแล้ว การเปลี่ยนแปลงจะสะท้อนสู่หน้าเว็บทันที</Alert>
      )}

      {/* =========================================================================
          3-COLUMN BUILDER UI
          Left: Question List | Center: Question Editor | Right: Settings & Scoring
         ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* =======================================================================
            LEFT COLUMN: Question List (3 cols)
           ======================================================================= */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-brand-border p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
            <span className="font-bold text-sm text-brand-text">
              รายการคำถาม ({assessment.questions.length})
            </span>
            <Button
              variant="cream"
              size="sm"
              icon={Plus}
              onClick={handleAddQuestion}
              className="text-xs px-2.5 py-1"
            >
              เพิ่มข้อ
            </Button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {assessment.questions.map((q, qIdx) => {
              const active = qIdx === selectedQuestionIndex;
              return (
                <div
                  key={q.id || qIdx}
                  onClick={() => setSelectedQuestionIndex(qIdx)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2 group ${
                    active
                      ? 'bg-brand-soft-blue border-brand-blue shadow-sm'
                      : 'bg-brand-warm-white border-brand-border hover:bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2 min-w-0 flex-1">
                    <span className="font-bold text-xs text-brand-brown w-5 text-center flex-shrink-0">
                      {qIdx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-brand-text truncate leading-snug">
                        {q.questionText}
                      </p>
                      <span className="text-[10px] text-brand-text-muted block mt-0.5">
                        {q.questionType} • {q.options?.length || 0} ตัวเลือก
                      </span>
                    </div>
                  </div>

                  {/* Reorder & Delete quick actions */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveQuestion(qIdx, 'up'); }}
                      disabled={qIdx === 0}
                      className="p-1 text-neutral-400 hover:text-brand-text disabled:opacity-20"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleMoveQuestion(qIdx, 'down'); }}
                      disabled={qIdx === assessment.questions.length - 1}
                      className="p-1 text-neutral-400 hover:text-brand-text disabled:opacity-20"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDeleteQuestion(qIdx); }}
                      className="p-1 text-neutral-400 hover:text-brand-pink"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* =======================================================================
            CENTER COLUMN: Question Editor (5 cols)
           ======================================================================= */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-brand-border p-6 sm:p-7 shadow-soft space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border/60">
            <h3 className="font-bold text-base text-brand-text flex items-center gap-2">
              <Sliders className="w-4 h-4 text-brand-brown" />
              <span>แก้ไขคำถามข้อที่ {selectedQuestionIndex + 1}</span>
            </h3>
            <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
              <input
                type="checkbox"
                checked={currentQuestion.required}
                onChange={(e) => handleUpdateCurrentQuestion('required', e.target.checked)}
                className="rounded text-brand-blue"
              />
              <span>จำเป็นต้องตอบ (Required)</span>
            </label>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              ข้อความคำถาม <span className="text-brand-pink">*</span>
            </label>
            <textarea
              rows={3}
              value={currentQuestion.questionText}
              onChange={(e) => handleUpdateCurrentQuestion('questionText', e.target.value)}
              className="w-full p-3 rounded-xl border border-brand-border bg-brand-warm-white focus:bg-white focus:border-brand-blue text-sm text-brand-text focus-visible:outline-none resize-none"
              placeholder="พิมพ์คำถามที่นี่..."
            />
          </div>

          {/* Question Type & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                รูปแบบคำถาม (Question Type)
              </label>
              <select
                value={currentQuestion.questionType}
                onChange={(e) => handleUpdateCurrentQuestion('questionType', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-warm-white text-xs text-brand-text focus:border-brand-blue focus-visible:outline-none"
              >
                <option value="single_choice">ตัวเลือกเดียว (Single Choice)</option>
                <option value="multiple_choice">หลายตัวเลือก (Multiple Choice)</option>
                <option value="yes_no">ใช่ / ไม่ใช่ (Yes / No)</option>
                <option value="rating_scale">ระดับคะแนน (Rating Scale 1-5)</option>
                <option value="text_input">ข้อความ (Text Input)</option>
                <option value="number_input">ตัวเลข (Number Input)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-brand-text mb-1">
                หมวดหมู่/Section
              </label>
              <input
                type="text"
                value={currentQuestion.section || ''}
                onChange={(e) => handleUpdateCurrentQuestion('section', e.target.value)}
                placeholder="เช่น การเคลื่อนไหว, สมาธิ"
                className="w-full px-3 py-2 rounded-xl border border-brand-border bg-brand-warm-white text-xs text-brand-text focus:border-brand-blue focus-visible:outline-none"
              />
            </div>
          </div>

          {/* Options & Scores (for single, multi, yes/no) */}
          {(currentQuestion.questionType === 'single_choice' || 
            currentQuestion.questionType === 'multiple_choice' || 
            currentQuestion.questionType === 'yes_no') && (
            <div className="pt-3 border-t border-brand-border/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-brand-text uppercase tracking-wider">
                  ตัวเลือกคำตอบ & คะแนน (Options & Scores)
                </span>
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="text-xs text-brand-brown font-semibold hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>เพิ่มตัวเลือก</span>
                </button>
              </div>

              <div className="space-y-2">
                {(currentQuestion.options || []).map((opt, optIdx) => (
                  <div key={optIdx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleUpdateOption(optIdx, 'text', e.target.value)}
                      placeholder={`ตัวเลือกที่ ${optIdx + 1}`}
                      className="flex-1 px-3 py-2 rounded-xl border border-brand-border text-xs focus:border-brand-blue focus-visible:outline-none"
                    />
                    <div className="flex items-center gap-1 w-24">
                      <span className="text-[10px] text-brand-text-muted">คะแนน:</span>
                      <input
                        type="number"
                        value={opt.score}
                        onChange={(e) => handleUpdateOption(optIdx, 'score', e.target.value)}
                        className="w-12 px-2 py-2 rounded-xl border border-brand-border text-xs text-center focus:border-brand-blue focus-visible:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeleteOption(optIdx)}
                      className="p-1.5 text-neutral-400 hover:text-brand-pink"
                      title="ลบตัวเลือกนี้"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* =======================================================================
            RIGHT COLUMN: Settings & Scoring Rules (4 cols)
           ======================================================================= */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-brand-border p-6 shadow-soft space-y-6">
          <div className="pb-3 border-b border-brand-border/60">
            <h3 className="font-bold text-base text-brand-text flex items-center gap-2">
              <Settings className="w-4 h-4 text-brand-brown" />
              <span>การตั้งค่า & เกณฑ์คะแนนผลลัพธ์</span>
            </h3>
          </div>

          {/* Assessment Meta Fields */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-brand-text mb-1">
                ชื่อแบบประเมิน <span className="text-brand-pink">*</span>
              </label>
              <input
                type="text"
                value={assessment.title}
                onChange={(e) => setAssessment({ ...assessment, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-brand-text mb-1">
                  ช่วงวัย
                </label>
                <input
                  type="text"
                  value={assessment.targetAge}
                  onChange={(e) => setAssessment({ ...assessment, targetAge: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-brand-text mb-1">
                  เวลาโดยประมาณ (นาที)
                </label>
                <input
                  type="number"
                  value={assessment.estimatedMinutes}
                  onChange={(e) => setAssessment({ ...assessment, estimatedMinutes: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-brand-text mb-1">
                คำอธิบายแบบประเมิน
              </label>
              <textarea
                rows={2}
                value={assessment.description}
                onChange={(e) => setAssessment({ ...assessment, description: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none resize-none"
              />
            </div>
          </div>

          {/* Result Thresholds & Interpretations */}
          <div className="pt-4 border-t border-brand-border/60 space-y-4">
            <h4 className="text-xs font-bold text-brand-text uppercase tracking-wider">
              เกณฑ์คะแนน & ระดับผลการประเมิน (3 ระดับ)
            </h4>

            {(assessment.scoringRules?.thresholds || []).map((t, tIdx) => (
              <div key={tIdx} className="bg-brand-warm-white p-3.5 rounded-2xl border border-brand-border space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-brand-brown">ระดับที่ {t.level}</span>
                  <div className="flex items-center gap-1">
                    <span>คะแนน:</span>
                    <input
                      type="number"
                      value={t.minScore}
                      onChange={(e) => handleUpdateThreshold(tIdx, 'minScore', e.target.value)}
                      className="w-10 px-1 py-0.5 rounded border border-brand-border text-center"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      value={t.maxScore}
                      onChange={(e) => handleUpdateThreshold(tIdx, 'maxScore', e.target.value)}
                      className="w-10 px-1 py-0.5 rounded border border-brand-border text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-brand-text-muted block">ข้อความ Badge</label>
                  <input
                    type="text"
                    value={t.badgeText}
                    onChange={(e) => handleUpdateThreshold(tIdx, 'badgeText', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-brand-border bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-brand-text-muted block">การแปลผล (Interpretation)</label>
                  <textarea
                    rows={2}
                    value={t.interpretation}
                    onChange={(e) => handleUpdateThreshold(tIdx, 'interpretation', e.target.value)}
                    className="w-full p-2 rounded-lg border border-brand-border bg-white text-xs resize-none"
                  />
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* Interactive Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-simple">
          <div className="bg-white rounded-3xl border border-brand-border shadow-soft-xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[85vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-cream"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6 pb-4 border-b border-brand-border">
              <Badge variant="blue" className="mb-2">พรีวิวแบบประเมินสำหรับผู้ปกครอง</Badge>
              <h2 className="text-xl sm:text-2xl font-bold text-brand-text">{assessment.title}</h2>
              <p className="text-xs text-brand-text-muted mt-1">ช่วงวัย: {assessment.targetAge}</p>
            </div>

            <div className="space-y-6">
              {assessment.questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-brand-warm-white border border-brand-border">
                  <div className="text-xs text-brand-brown font-semibold mb-1">
                    ข้อที่ {idx + 1} {q.section && `• ${q.section}`}
                  </div>
                  <h4 className="font-bold text-brand-text text-sm sm:text-base mb-3">
                    {q.questionText}
                  </h4>
                  <div className="space-y-2">
                    {(q.options || []).map((opt, oIdx) => (
                      <div key={oIdx} className="p-2.5 rounded-xl bg-white border border-brand-border text-xs flex justify-between items-center">
                        <span>{opt.text}</span>
                        <span className="text-brand-brown font-mono font-bold">({opt.score} คะแนน)</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-brand-border flex justify-end">
              <Button variant="primary" size="md" onClick={() => setPreviewOpen(false)}>
                ปิดหน้าต่างพรีวิว
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
