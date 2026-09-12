import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle,
  Clock,
  ShieldAlert
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Alert from '../components/common/Alert';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function AssessmentRunner({ settings }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    async function loadAssessment() {
      try {
        const asm = await storage.getAssessmentById(id);
        if (asm) {
          setAssessment(asm);
        } else {
          setErrorMsg('ไม่พบแบบประเมินที่ระบุ');
        }
      } catch (err) {
        console.error('Error loading assessment:', err);
        setErrorMsg('เกิดข้อผิดพลาดในการโหลดแบบประเมิน');
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 max-w-3xl mx-auto px-4">
        <LoadingState message="กำลังเตรียมแบบประเมิน..." />
      </div>
    );
  }

  if (errorMsg || !assessment) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center">
        <Alert type="warning">{errorMsg || 'ไม่พบแบบประเมิน'}</Alert>
        <div className="mt-6">
          <Button to="/assessment" variant="outline">
            กลับหน้ารวมแบบประเมิน
          </Button>
        </div>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQuestion = questions[currentIndex];
  const progressPercent = questions.length > 0 ? Math.round(((currentIndex + 1) / questions.length) * 100) : 0;

  // Handler for single choice and yes/no
  const handleSingleSelect = (optionIndex, score) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { optionIndex, score }
    }));
  };

  // Handler for multiple choice
  const handleMultiSelect = (optionIndex, score) => {
    const currentSelected = answers[currentQuestion.id]?.selected || [];
    const exists = currentSelected.includes(optionIndex);
    let updated;
    if (exists) {
      updated = currentSelected.filter(i => i !== optionIndex);
    } else {
      updated = [...currentSelected, optionIndex];
    }
    
    // Sum scores of selected options
    const totalScore = updated.reduce((sum, idx) => {
      return sum + (currentQuestion.options[idx]?.score || 0);
    }, 0);

    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { selected: updated, score: totalScore }
    }));
  };

  // Handler for rating scale (1 - 5)
  const handleRatingSelect = (ratingValue) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { value: ratingValue, score: ratingValue }
    }));
  };

  // Handler for text input
  const handleTextChange = (text) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { text, score: 0 }
    }));
  };

  // Can proceed to next question
  const isCurrentAnswered = () => {
    if (!currentQuestion) return false;
    if (!currentQuestion.required) return true;
    const ans = answers[currentQuestion.id];
    if (!ans) return false;
    if (currentQuestion.questionType === 'multiple_choice') {
      return ans.selected && ans.selected.length > 0;
    }
    if (currentQuestion.questionType === 'text_input') {
      return ans.text && ans.text.trim().length > 0;
    }
    return ans.score !== undefined || ans.value !== undefined || ans.optionIndex !== undefined;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    } else {
      // Calculate total score
      let totalScore = 0;
      Object.values(answers).forEach(ans => {
        if (ans && typeof ans.score === 'number') {
          totalScore += ans.score;
        }
      });

      // Save submission (anonymized) in storage
      sessionStorage.setItem(`hugdee_result_${assessment.id}`, JSON.stringify({
        assessmentId: assessment.id,
        assessmentTitle: assessment.title,
        score: totalScore,
        answers: answers,
        completedAt: new Date().toISOString()
      }));

      // Navigate to result view
      navigate(`/assessment/${assessment.id}/result`);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      window.scrollTo({ top: 120, behavior: 'smooth' });
    }
  };

  return (
    <div className="py-10 md:py-16 max-w-3xl mx-auto px-4 sm:px-6">
      
      {/* Top Meta Bar */}
      <div className="mb-6 flex items-center justify-between">
        <Link 
          to="/assessment" 
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-brand-text-muted hover:text-brand-brown transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ออกจากการประเมิน</span>
        </Link>
        <span className="text-xs sm:text-sm font-semibold text-brand-brown">
          ข้อที่ {currentIndex + 1} จาก {questions.length} ข้อ
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-brand-border/60 h-2.5 rounded-full overflow-hidden mb-8">
        <div 
          className="bg-brand-blue h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-3xl border border-brand-border shadow-soft p-6 sm:p-10 mb-8 animate-fade-in">
        
        {/* Section Header if available */}
        {currentQuestion.section && (
          <div className="mb-3">
            <span className="text-xs font-semibold text-brand-brown tracking-wider uppercase px-3 py-1 rounded-full bg-brand-cream border border-brand-border inline-block">
              {currentQuestion.section}
            </span>
          </div>
        )}

        <h2 className="text-xl sm:text-2xl font-bold text-brand-text mb-6 leading-snug">
          {currentQuestion.questionText}
        </h2>

        {/* Dynamic Question Renderers */}
        <div className="space-y-3">
          
          {/* 1. Single Choice & Yes/No */}
          {(currentQuestion.questionType === 'single_choice' || currentQuestion.questionType === 'yes_no') && (
            <div className="space-y-3">
              {(currentQuestion.options || []).map((opt, idx) => {
                const isSelected = answers[currentQuestion.id]?.optionIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSingleSelect(idx, opt.score || 0)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-brand-soft-blue border-brand-blue shadow-sm font-semibold text-brand-text'
                        : 'bg-brand-warm-white border-brand-border text-brand-text hover:bg-white hover:border-brand-brown/40'
                    }`}
                  >
                    <span className="text-sm sm:text-base leading-relaxed">{opt.text}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-brand-blue bg-brand-blue text-brand-text' : 'border-neutral-300'
                    }`}>
                      {isSelected && <div className="w-2 h-2 rounded-full bg-brand-text" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. Multiple Choice */}
          {currentQuestion.questionType === 'multiple_choice' && (
            <div className="space-y-3">
              {(currentQuestion.options || []).map((opt, idx) => {
                const isSelected = answers[currentQuestion.id]?.selected?.includes(idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleMultiSelect(idx, opt.score || 0)}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-4 ${
                      isSelected
                        ? 'bg-brand-soft-blue border-brand-blue shadow-sm font-semibold text-brand-text'
                        : 'bg-brand-warm-white border-brand-border text-brand-text hover:bg-white hover:border-brand-brown/40'
                    }`}
                  >
                    <span className="text-sm sm:text-base leading-relaxed">{opt.text}</span>
                    <div className={`w-5 h-5 rounded-lg border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-brand-blue bg-brand-blue text-brand-text' : 'border-neutral-300'
                    }`}>
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 3. Rating Scale (1 to 5) */}
          {currentQuestion.questionType === 'rating_scale' && (
            <div className="py-4">
              <div className="flex items-center justify-between text-xs text-brand-text-muted mb-3 px-1">
                <span>น้อยที่สุด / ไม่พบ</span>
                <span>มากที่สุด / บ่อยมาก</span>
              </div>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isSelected = answers[currentQuestion.id]?.value === val;
                  return (
                    <button
                      key={val}
                      onClick={() => handleRatingSelect(val)}
                      className={`h-14 sm:h-16 rounded-2xl border text-base sm:text-lg font-bold flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-brand-blue text-brand-text border-brand-blue shadow-sm scale-105'
                          : 'bg-brand-warm-white border-brand-border text-brand-text hover:bg-white'
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Text Input */}
          {currentQuestion.questionType === 'text_input' && (
            <div>
              <textarea
                value={answers[currentQuestion.id]?.text || ''}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="พิมพ์ข้อสังเกตเพิ่มเติมของท่านที่นี่..."
                rows={4}
                className="w-full p-4 rounded-2xl border border-brand-border bg-brand-warm-white focus:bg-white focus:border-brand-blue text-brand-text text-sm sm:text-base resize-none focus-visible:outline-none"
              />
            </div>
          )}

        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 pt-6 border-t border-brand-border/60 flex items-center justify-between gap-4">
          <Button
            variant="ghost"
            size="md"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            icon={ArrowLeft}
          >
            ข้อก่อนหน้า
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={handleNext}
            disabled={!isCurrentAnswered()}
            icon={currentIndex === questions.length - 1 ? CheckCircle2 : ArrowRight}
            iconPosition="right"
            className="font-semibold shadow-sm"
          >
            {currentIndex === questions.length - 1 ? 'ดูผลการประเมิน' : 'ข้อถัดไป'}
          </Button>
        </div>

      </div>

      {/* Gentle helper note */}
      <p className="text-center text-xs text-brand-text-muted">
        ตอบตามพฤติกรรมและความเป็นจริงที่พบเห็นในชีวิตประจำวันของเด็ก
      </p>

    </div>
  );
}
