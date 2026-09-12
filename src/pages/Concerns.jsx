import { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, AlertCircle, Phone, ArrowRight, CheckCircle2, Circle, Loader } from 'lucide-react';
import Swal from 'sweetalert2';
import { db } from '../utils/db';
import { t, updateMeta } from '../utils/helpers';

export default function Concerns({ lang, clinicSettings }) {
  const [concernsList, setConcernsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [checkedIds, setCheckedIds] = useState([]);

  const lineLink = `https://line.me/R/ti/p/%40${String(clinicSettings?.line_id || 'hugdeehome').replace('@', '')}`;
  const phoneLink = `tel:${clinicSettings?.phone || '094-675-3557'}`;

  // Load assessments dynamically from CMS database
  const loadAssessments = async () => {
    setLoading(true);
    try {
      const data = await db.getAssessments(false); // active only
      setConcernsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssessments();
    updateMeta(
      t(lang, 'แบบประเมินพัฒนาการเด็กเบื้องต้น | บ้านฮักดี พะเยา', 'Pediatric Initial Screening Form | Hug Dee Home Phayao'),
      t(lang, 'โปรแกรมทำแบบประเมินพฤติกรรมพัฒนาการเด็กเบื้องต้น วิเคราะห์ทักษะกล้ามเนื้อ สมาธิ และระบบสัมผัส พร้อมข้อแนะนำการสังเกตจากนักวิชาชีพ', 'Complete our interactive child milestone screening form to analyze motor, focus, and sensory skills.'),
      '/concerns'
    );
  }, [lang]);

  // Toggle checkbox state
  const handleToggleCheck = (id, e) => {
    e.stopPropagation(); // prevent setting selectedConcern if clicked icon
    setCheckedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Perform screening analysis
  const handleAnalyzeResults = () => {
    const count = checkedIds.length;
    if (count === 0) {
      Swal.fire({
        icon: 'info',
        title: 'ยังไม่ได้เลือกหัวข้อ',
        text: t(lang, 'กรุณาเลือกอาการพฤติกรรมที่ท่านกำลังกังวลด้านซ้ายอย่างน้อย 1 หัวข้อ เพื่อรับการวิเคราะห์ผลลัพธ์เบื้องต้นครับ', 'Please select at least 1 behavior concern from the list to analyze results.'),
        confirmButtonColor: '#C8A97E',
        confirmButtonText: 'ตกลง'
      });
      return;
    }

    let alertTitle = '';
    let alertText = '';
    let alertIcon = 'info'; // info, success, warning

    if (count === 1) {
      alertTitle = 'ผลการประเมินเบื้องต้น (พบนัยยะ 1 ด้าน)';
      alertIcon = 'info';
      alertText = t(
        lang,
        'พัฒนาการเด็กโดยรวมอยู่ในเกณฑ์ปกติ แต่อาจมีบางจุดเกี่ยวกับประสาทรับรู้หรือทักษะเฉพาะจุดที่ส่งเสริมเพิ่มเติมให้ดียิ่งขึ้นได้ที่บ้านครับ แนะนำแอดไลน์เพื่อคุยปรึกษาแนวทางฝึกเบื้องต้นได้ฟรีครับ',
        'Overall development appears age-appropriate, but minor fine-tuning or sensory exercises at home may help. Feel free to consult us on LINE for mild support tips.'
      );
    } else if (count >= 2 && count <= 4) {
      alertTitle = `ผลการประเมินเบื้องต้น (พบนัยยะ ${count} ด้าน)`;
      alertIcon = 'warning';
      alertText = t(
        lang,
        `พฤติกรรมของบุตรหลานเริ่มส่งสัญญาณความกังวลอ่อน ๆ รวมทั้งหมด ${count} ด้าน แนะนำเหมาะสมแก่การพาเข้ามานัดหมายตรวจ 'ประเมินพัฒนาการเด็กโดยตรง' (Intake Assessment) กับนักกิจกรรมบำบัดรักษาวิชาชีพเพื่อความแม่นยำและเริ่มกระตุ้นเสริมทักษะอย่างตรงจุดครับ`,
        `Child behavior triggers mild signals in ${count} areas. It is recommended to schedule a formal 'Intake Assessment' with our licensed occupational therapists to craft a targeted support plan.`
      );
    } else {
      alertTitle = `ผลการประเมินเบื้องต้น (พบนัยยะส่งเสริมระดับสูง ${count} ด้าน)`;
      alertIcon = 'warning';
      alertText = t(
        lang,
        `พบนัยยะอาการที่ขัดขวางการเรียนรู้และการปรับตัวตามวัยรวมทั้งหมด ${count} ด้าน แนะนำเป็นอย่างยิ่งว่าผู้ปกครองควรทำนัดหมายพาน้องเข้าประเมินพัฒนาการอย่างละเอียดรอบด้านกับนักบำบัดคลินิกโดยตรง เพื่อวางแผนกิจกรรมบำบัดรักษาแต่เนิ่น ๆ ครับ`,
        `Sensory and motor issues observed in ${count} areas. We highly suggest booking an occupational therapy assessment to design early intervention plans before it affects academic performance.`
      );
    }

    // Determine target link: if user checked exactly 1 item and it has a custom cta_link, we can use it!
    // Otherwise fallback to global assessment_cta_link or lineLink.
    let customLink = clinicSettings?.assessment_cta_link || lineLink;
    if (count === 1) {
      const selectedItem = concernsList.find(item => item.id === checkedIds[0]);
      if (selectedItem?.cta_link) {
        customLink = selectedItem.cta_link;
      }
    }

    Swal.fire({
      icon: alertIcon,
      title: alertTitle,
      text: alertText,
      showCancelButton: true,
      confirmButtonText: clinicSettings?.assessment_cta_link || customLink !== lineLink
        ? t(lang, 'ลงทะเบียนจองคิวประเมิน', 'Register for Assessment')
        : t(lang, 'ปรึกษาผ่าน LINE ทันที', 'Consult on LINE'),
      cancelButtonText: t(lang, 'ปิดหน้าต่าง', 'Close'),
      confirmButtonColor: '#C8A97E',
      cancelButtonColor: '#6B7280',
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-xl px-5 py-3 font-bold',
        cancelButton: 'rounded-xl px-5 py-3 font-bold'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        window.open(customLink, '_blank');
      }
    });
  };

  // Determine current active detailed card link
  const currentDetailLink = selectedConcern?.cta_link || clinicSettings?.assessment_cta_link || lineLink;

  return (
    <div className="bg-clinicBg py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
          <span className="text-xs font-bold bg-primary/10 text-primary-dark px-3 py-1 rounded-full uppercase tracking-wider">
            📋 {t(lang, 'ประเมินพัฒนาการเด็กออนไลน์', 'Interactive Assessment Form')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-clinicText mt-3 text-center leading-[1.35] tracking-tight">
            {t(
              lang,
              clinicSettings?.assessment_title_th || 'แบบประเมินพัฒนาการเด็กเบื้องต้น',
              clinicSettings?.assessment_title_en || 'Pediatric Initial Screening'
            )}
          </h1>
          <p className="text-sm sm:text-base text-clinicMuted mt-3 text-center leading-[1.7]">
            {t(
              lang, 
              clinicSettings?.assessment_description_th || 'ทำแบบประเมินความพร้อมและพฤติกรรมเด็ก โดยทำเครื่องหมายติ๊กเลือกหัวข้อที่ท่านมีความกังวลเพื่อคำนวณและวิเคราะห์ผลลัพธ์', 
              clinicSettings?.assessment_description_en || 'Complete the form by checking behavior concerns to calculate initial screening suggestions.'
            )}
          </p>
        </div>

        {/* Banner Image */}
        {clinicSettings?.assessment_image_url && (
          <div className="w-full h-48 sm:h-64 md:h-80 rounded-3xl overflow-hidden shadow-sm border border-primary/5 bg-primary/5 mb-12">
            <img src={clinicSettings.assessment_image_url} alt="Assessment Banner" className="w-full h-full object-cover" />
          </div>
        )}

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : concernsList.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 max-w-md mx-auto">
            <HelpCircle className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <h3 className="font-bold text-clinicText">ยังไม่มีแบบประเมินที่เปิดใช้งาน</h3>
            <p className="text-xs text-clinicMuted mt-1">กรุณากลับมาตรวจสอบอีกครั้งในภายหลังครับ</p>
          </div>
        ) : (
          /* Layout Grid */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Grid of Concerns Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {concernsList.map((c) => {
                  const isChecked = checkedIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => setSelectedConcern(c)}
                      className={`p-6 rounded-3xl text-left border cursor-pointer transition-all flex flex-col justify-between min-h-[150px] relative ${
                        selectedConcern?.id === c.id
                          ? 'bg-primary/10 border-primary text-primary-dark shadow-sm'
                          : 'bg-white border-primary/5 hover:border-primary/20 text-clinicText'
                      }`}
                    >
                      {/* Checkbox toggle icon */}
                      <button
                        onClick={(e) => handleToggleCheck(c.id, e)}
                        className="absolute top-4 right-4 text-primary hover:scale-105 transition-transform"
                        title={isChecked ? t(lang, 'ยกเลิกการเลือก', 'Deselect') : t(lang, 'เลือกข้อนี้เพื่อประเมิน', 'Select')}
                      >
                        {isChecked ? (
                          <CheckCircle2 className="w-6 h-6 fill-primary text-white" />
                        ) : (
                          <Circle className="w-6 h-6 text-primary/30" />
                        )}
                      </button>

                      <div className="flex flex-col pr-6">
                        <h3 className="font-bold text-sm sm:text-base">{t(lang, c.title_th, c.title_en)}</h3>
                        <p className="text-xxs text-clinicMuted mt-2 line-clamp-2 leading-relaxed">{t(lang, c.short_th, c.short_en)}</p>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between w-full pt-2 border-t border-primary/5">
                        <span className="text-xxs font-bold text-primary-dark">{t(lang, 'อ่านข้อแนะนำ', 'View description')}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-primary" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Calculate Button */}
              <div className="bg-white p-4 rounded-3xl border border-primary/5 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-xs text-clinicMuted text-center sm:text-left">
                  <p className="font-bold text-clinicText">เลือกแล้ว {checkedIds.length} จาก {concernsList.length} หัวข้อ</p>
                  <p className="text-[10px] mt-0.5">ระบบจะวิเคราะห์ประมวลความล่าช้าพัฒนาการเบื้องต้น</p>
                </div>
                <button
                  onClick={handleAnalyzeResults}
                  className="w-full sm:w-auto bg-primary hover:bg-primary-dark text-white font-bold px-8 py-3.5 rounded-2xl shadow-md transition-all text-xs"
                >
                  ส่งผลตรวจวิเคราะห์เบื้องต้น
                </button>
              </div>
            </div>

            {/* Detailed Guidance Panel */}
            <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-3xl border border-primary/10 shadow-sm min-h-[350px] flex flex-col justify-between text-left">
              {selectedConcern ? (
                <div className="space-y-6 animate-fade-up">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-primary" />
                    <span className="text-xxs font-bold text-clinicGreen bg-clinicGreen/10 px-2.5 py-1 rounded-full uppercase">
                      {t(lang, 'แนวทางการสังเกตและส่งเสริม', 'Milestone Indicators')}
                    </span>
                  </div>
                  
                  {/* Detailed card banner if uploaded */}
                  {selectedConcern.image_url && (
                    <div className="w-full h-32 rounded-2xl overflow-hidden bg-primary/5 border border-primary/5">
                      <img src={selectedConcern.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}

                  <h2 className="font-extrabold text-clinicText text-xl sm:text-2xl leading-[1.35] tracking-tight">
                    {t(lang, selectedConcern.title_th, selectedConcern.title_en)}
                  </h2>
                  
                  {/* Content text formatted with linebreaks */}
                  <div className="text-xs sm:text-sm text-clinicMuted leading-[1.7] whitespace-pre-wrap">
                    {t(lang, selectedConcern.description_th, selectedConcern.description_en)}
                  </div>

                  <div className="bg-clinicBg p-4 rounded-2xl border border-primary/5 text-xxs text-clinicMuted">
                    ⚠️ {t(lang, 'ข้อมูลการคัดกรองเบื้องต้นนี้ มีวัตถุประสงค์เพื่อคลายความกังวลและชี้นำความเข้าใจพฤติกรรมในเด็กแต่ละคนอย่างสร้างสรรค์เท่านั้น ไม่สามารถนำไปอ้างอิงเป็นเกณฑ์ชี้ขาดทางการแพทย์หรือใช้ฟ้องร้องสิทธิได้ แนะนำควรพาเด็กเข้าทำการประเมินโดยตรงกับนักวิชาชีพคลินิกเพื่อเป้าหมายที่แน่นอนครับ', 'Disclaimer: This screening form represents initial guidance only. It is not a clinical or diagnostic checklist. We suggest consulting a certified occupational therapist.')}
                  </div>
                </div>
              ) : (
                <div className="flex-grow flex flex-col justify-center items-center text-center text-clinicMuted py-16">
                  <HelpCircle className="w-16 h-16 text-primary/20 mb-4" />
                  <h3 className="font-bold text-clinicText text-lg">{t(lang, 'ข้อมูลแนะนำพัฒนาการ', 'Milestone Details')}</h3>
                  <p className="text-xs mt-1 max-w-xs leading-relaxed">{t(lang, 'กดคลิกที่กล่องหัวข้อพฤติกรรมเพื่อแสดงคำอธิบายเพิ่มเติม หรือกดติ๊กถูกด้านบนขวาของแต่ละกล่องเพื่อนำคำถามเข้ารวมวิเคราะห์คำนวณผลประเมินพัฒนาการครับ', 'Click on a card to read tips, or check its top-right circle to include it in the developmental analysis calculations.')}</p>
                </div>
              )}

              <div className="mt-10 border-t border-primary/10 pt-6 flex flex-col sm:flex-row gap-3">
                <a
                  href={currentDetailLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow inline-flex justify-center items-center gap-2 bg-[#06C755] hover:bg-[#05b04b] text-white font-bold py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all text-xs sm:text-sm"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  {currentDetailLink !== lineLink
                    ? t(lang, 'ลงทะเบียนจองคิวประเมิน', 'Register for Assessment')
                    : t(lang, 'ปรึกษานักบำบัดทาง LINE', 'Consult via LINE')}
                </a>
                <a
                  href={phoneLink}
                  className="inline-flex justify-center items-center gap-2 border border-primary/20 hover:bg-primary/5 text-clinicText font-semibold py-3.5 px-5 rounded-xl transition-all text-xs sm:text-sm"
                >
                  <Phone className="w-4 h-4" />
                  {t(lang, 'โทรสายตรงคลินิก', 'Call Clinic')}
                </a>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
