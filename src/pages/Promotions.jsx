import { useState, useEffect } from 'react';
import { Calendar, Tag, ArrowRight } from 'lucide-react';
import { db } from '../utils/db';
import { t, updateMeta } from '../utils/helpers';

export default function Promotions({ lang, clinicSettings }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);

  const lineLink = `https://line.me/R/ti/p/%40${String(clinicSettings?.line_id || 'hugdeehome').replace('@', '')}`;

  useEffect(() => {
    updateMeta(
      t(lang, 'โปรโมชั่นคอร์สกิจกรรมบำบัดและประเมินพัฒนาการเด็ก | บ้านฮักดี พะเยา', 'Special Promotions & Package Rates | Hug Dee Home Phayao'),
      t(lang, 'โปรโมชั่นพิเศษสำหรับการประเมินพัฒนาการแรกรับ คอร์สฝึกพัฒนาการกล้ามเนื้อและสมาธิรายเดือน ราคาประหยัดและสิทธิพิเศษเพื่อครอบครัว', 'Access seasonal rates, assessment packages, and monthly session promotions.'),
      '/promotions'
    );

    async function loadPromotions() {
      try {
        const data = await db.getPromotions();
        setPromotions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadPromotions();
  }, [lang, clinicSettings]);

  // Helper to check if a promotion is ending soon (within 7 days)
  const isEndingSoon = (endDateStr) => {
    if (!endDateStr) return false;
    const today = new Date();
    const end = new Date(endDateStr);
    const timeDiff = end.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff >= 0 && daysDiff <= 7;
  };

  return (
    <div className="bg-clinicBg py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-xs font-bold bg-clinicPink/30 text-clinicPink-dark px-3 py-1 rounded-full uppercase tracking-wider">
            🏷️ {t(lang, 'โปรโมชั่นพิเศษ', 'Special Offers')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-clinicText mt-3">
            {t(lang, 'โปรโมชั่นและสิทธิพิเศษ', 'Clinic Packages & Rates')}
          </h1>
          <p className="text-sm sm:text-base text-clinicMuted mt-3">
            {t(lang, 'ราคาพิเศษและแพ็กเกจส่งเสริมการฝึกทักษะรอบด้าน เพื่อช่วยลดภาระค่าใช้จ่ายครอบครัว', 'Affordable program plans and assessments tailored to support families.')}
          </p>
        </div>

        {/* Loading / Empty States */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : promotions.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 max-w-md mx-auto">
            <span className="text-4xl">🏷️</span>
            <h3 className="font-bold text-clinicText mt-4">{t(lang, 'ไม่มีโปรโมชั่นเปิดใช้งานขณะนี้', 'No active promotions')}</h3>
            <p className="text-xs text-clinicMuted mt-1">{t(lang, 'ขณะนี้ยังไม่มีโปรโมชั่นพิเศษหน้าเว็บ สามารถแชทสอบถามค่าบริการปกติได้ทาง LINE ครับ', 'No packages are open today. Please contact us on LINE for standard pricing tables.')}</p>
          </div>
        ) : (
          /* Promotions List Grid */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {promotions.map((promo) => {
              const endingSoon = isEndingSoon(promo.end_date);
              return (
                <div
                  key={promo.id}
                  className="bg-white rounded-3xl overflow-hidden border border-primary/5 hover:border-primary/20 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row group text-left"
                >
                  {/* Image Column */}
                  <div className="aspect-[4/3] sm:aspect-square sm:w-48 overflow-hidden bg-[#E9E3D6] relative shrink-0 image-warm-overlay">
                    <img
                      src={promo.image_url || 'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=600'}
                      alt={t(lang, promo.title_th, promo.title_en)}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                    
                    {/* Badge Overlay */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span className="bg-primary text-white text-xxs font-extrabold px-2.5 py-1 rounded-full uppercase shadow-sm">
                        {t(lang, 'โปรโมชั่น', 'Offer')}
                      </span>
                      {endingSoon && (
                        <span className="bg-clinicPink-dark text-white text-xxs font-extrabold px-2.5 py-1 rounded-full uppercase shadow-sm animate-pulse">
                          {t(lang, 'ใกล้หมดเขต', 'Ending Soon')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Text Column */}
                  <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
                    <div className="space-y-3">
                      <h3 className="font-bold text-clinicText text-lg leading-snug group-hover:text-primary transition-colors">
                        {t(lang, promo.title_th, promo.title_en)}
                      </h3>
                      <p className="text-xs text-clinicMuted leading-relaxed">
                        {t(lang, promo.description_th, promo.description_en)}
                      </p>
                      
                      {/* Price Section */}
                      <div className="flex items-baseline gap-2 pt-2">
                        {promo.promotion_price ? (
                          <>
                            <span className="text-2xl font-extrabold text-primary-dark">
                              ฿{parseFloat(promo.promotion_price).toLocaleString()}
                            </span>
                            {promo.original_price && (
                              <span className="text-xs text-clinicMuted line-through">
                                ฿{parseFloat(promo.original_price).toLocaleString()}
                              </span>
                            )}
                          </>
                        ) : (
                          promo.original_price && (
                            <span className="text-2xl font-extrabold text-clinicText">
                              ฿{parseFloat(promo.original_price).toLocaleString()}
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Footer Date & CTA */}
                    <div className="mt-6 pt-4 border-t border-primary/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {promo.end_date && (
                        <span className="text-xxs text-clinicMuted flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {t(lang, 'หมดเขต:', 'Expires:')} {promo.end_date}
                        </span>
                      )}
                      <a
                        href={lineLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex justify-center items-center gap-1.5 bg-primary hover:bg-primary-dark text-white font-bold px-4 py-2 rounded-xl transition-all text-xxs"
                      >
                        {t(lang, 'รับสิทธิ์ / สอบถาม', 'Claim Offer')}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
