import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, ZoomIn } from 'lucide-react';
import { db } from '../utils/db';
import { t, updateMeta } from '../utils/helpers';

export default function Gallery({ lang, clinicSettings }) {
  const [gallery, setGallery] = useState([]);
  const [filteredGallery, setFilteredGallery] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeImage, setActiveImage] = useState(null); // For lightbox
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateMeta(
      t(lang, 'รูปภาพบรรยากาศคลินิกและของเล่นกิจกรรมบำบัด | บ้านฮักดี พะเยา', 'Clinic Environment & Therapy Tools Gallery | Hug Dee Home Phayao'),
      t(lang, 'เปิดชมรูปภาพภายในคลินิก ห้องกระตุ้นพัฒนาการเด็ก ห้องฝึกกิจกรรมบำบัด อุปกรณ์ฝึกสมาธิกล้ามเนื้อ และของเล่นเสริมพัฒนาการที่ได้มาตรฐาน', 'Take a virtual tour of our kids occupational therapy rooms, sensory playground, and learning resources.'),
      '/gallery'
    );

    async function loadGallery() {
      try {
        const data = await db.getGallery();
        setGallery(data);
        setFilteredGallery(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadGallery();
  }, [lang, clinicSettings]);

  // Filter gallery items by category
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredGallery(gallery);
    } else {
      setFilteredGallery(gallery.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, gallery]);

  // Unique categories defined by requirements
  const categories = [
    'All',
    'บรรยากาศคลินิก',
    'ห้องกิจกรรม',
    'กิจกรรมบำบัด',
    'กิจกรรมสำหรับเด็ก',
    'อุปกรณ์และสื่อ',
    'บรรยากาศการให้บริการ'
  ];

  return (
    <div className="bg-clinicBg py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
          <span className="text-xs font-bold bg-primary/10 text-primary-dark px-3 py-1 rounded-full uppercase tracking-wider">
            📸 {t(lang, 'อัลบั้มภาพคลินิก', 'Virtual Tour')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-clinicText mt-3">
            {t(lang, 'บรรยากาศและกิจกรรม', 'Clinic Gallery')}
          </h1>
          <p className="text-sm sm:text-base text-clinicMuted mt-3">
            {t(lang, 'รูปภาพห้องฝึกกิจกรรม อุปกรณ์ และของเล่นเสริมพัฒนาการที่สะอาดและปลอดภัยสำหรับลูกน้อย', 'Clean, modern, and child-safe therapy rooms and sensory equipment.')}
          </p>
        </div>

        {/* Category Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none max-w-6xl mx-auto justify-start md:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white border border-primary/10 text-clinicText hover:bg-primary/5'
              }`}
            >
              {cat === 'All' ? t(lang, 'ทั้งหมด', 'All Album') : t(lang, cat, cat)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredGallery.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 max-w-md mx-auto">
            <ImageIcon className="w-12 h-12 text-primary/30 mx-auto mb-4" />
            <h3 className="font-bold text-clinicText">{t(lang, 'ไม่พบคลังภาพในหมวดหมู่นี้', 'No images found')}</h3>
            <p className="text-xs text-clinicMuted mt-1">{t(lang, 'แอดมินกำลังจัดหมวดหมู่และอัปโหลดภาพเพิ่มเติมเร็ว ๆ นี้ครับ', 'We are preparing new photo tours. Please visit again later.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {filteredGallery.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveImage(item)}
                className="bg-white rounded-3xl overflow-hidden border border-primary/5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left flex flex-col group relative"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#ECE7DE] relative">
                  <img
                    src={item.image_url}
                    alt={t(lang, item.caption_th, item.caption_en) || item.category}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Zoom Overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <div className="bg-white/95 p-3 rounded-full shadow-md text-primary">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Caption Footer */}
                {item.caption_th && (
                  <div className="p-5 border-t border-primary/5">
                    <p className="text-xs text-clinicMuted line-clamp-1 leading-relaxed">
                      {t(lang, item.caption_th, item.caption_en)}
                    </p>
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Lightbox Modal Popup */}
        {activeImage && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col justify-center items-center p-4 sm:p-6 md:p-8 animate-soft-scale">
            
            {/* Top Close Button bar */}
            <div className="w-full max-w-4xl flex justify-end mb-4">
              <button
                onClick={() => setActiveImage(null)}
                className="flex items-center gap-1 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-all"
                title={t(lang, 'ปิดหน้าต่าง', 'Close')}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* High-res Image box */}
            <div className="relative max-w-4xl max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
              <img
                src={activeImage.image_url}
                alt={t(lang, activeImage.caption_th, activeImage.caption_en)}
                className="w-full h-full object-contain max-h-[70vh]"
              />
            </div>

            {/* Caption & Category text info */}
            <div className="w-full max-w-4xl mt-6 text-center text-white space-y-2">
              <span className="inline-block bg-primary text-white text-xxs font-bold px-3 py-1 rounded-full uppercase">
                {t(lang, activeImage.category, activeImage.category)}
              </span>
              {activeImage.caption_th && (
                <p className="text-sm sm:text-base text-white/95 leading-relaxed max-w-2xl mx-auto">
                  {t(lang, activeImage.caption_th, activeImage.caption_en)}
                </p>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
