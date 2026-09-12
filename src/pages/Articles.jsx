import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, User, Tag, ArrowRight } from 'lucide-react';
import { db } from '../utils/db';
import { t, updateMeta } from '../utils/helpers';

export default function Articles({ lang, clinicSettings }) {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateMeta(
      t(lang, 'บทความคลังความรู้พัฒนาการเด็กและกิจกรรมบำบัด | บ้านฮักดี พะเยา', 'Child Development & Occupational Therapy Articles | Hug Dee Home Phayao'),
      t(lang, 'อ่านบทความคำแนะนำพัฒนาการเด็กแรกเกิด สมาธิสั้น การจับเขียนดินสอ การประมวลผลประสาทสัมผัส และเคล็ดลับการเลี้ยงลูกเชิงบวกที่ทำได้ง่าย ๆ ที่บ้าน', 'Access our library of health tips, fine motor activities, and positive parenting guidelines.'),
      '/articles'
    );

    async function loadArticles() {
      try {
        const data = await db.getArticles();
        setArticles(data);
        setFilteredArticles(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadArticles();
  }, [lang, clinicSettings]);

  // Filter and search logic
  useEffect(() => {
    let result = articles;

    // Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(a => {
        const cat = lang === 'en' ? a.category_en : a.category_th;
        return cat === selectedCategory;
      });
    }

    // Filter by Search Term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(a => {
        const title = lang === 'en' ? a.title_en : a.title_th;
        const excerpt = lang === 'en' ? a.excerpt_en : a.excerpt_th;
        return (
          title.toLowerCase().includes(term) ||
          excerpt.toLowerCase().includes(term)
        );
      });
    }

    setFilteredArticles(result);
  }, [searchTerm, selectedCategory, articles, lang]);

  // Extract unique categories based on current language
  const categories = ['All', ...new Set(articles.map(a => lang === 'en' ? a.category_en : a.category_th).filter(Boolean))];

  return (
    <div className="bg-clinicBg py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <span className="text-xs font-bold bg-primary/10 text-primary-dark px-3 py-1 rounded-full uppercase tracking-wider">
            📚 {t(lang, 'คลังความรู้เพื่อผู้ปกครอง', 'Knowledge Hub for Parents')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-clinicText mt-3 text-center">
            {t(lang, 'บทความและสาระน่ารู้', 'Articles & Knowledge Center')}
          </h1>
          <p className="text-sm sm:text-base text-clinicMuted mt-3 text-center">
            {t(lang, 'รวบรวมเคล็ดลับ เทคนิคการกระตุ้นประสาทสัมผัส และความเข้าใจธรรมชาติเด็กเลี้ยงง่ายขึ้นที่บ้าน', 'Tips, sensory exercises, and positive parenting guidelines written by therapists.')}
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-10 max-w-6xl mx-auto">
          {/* Search Input */}
          <div className="relative w-full md:max-w-sm">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-clinicMuted" />
            </span>
            <input
              type="text"
              placeholder={t(lang, 'ค้นหาหัวข้อบทความ...', 'Search article title...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full rounded-2xl border border-primary/15 bg-white text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
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
                {cat === 'All' ? t(lang, 'ทั้งหมด', 'All Articles') : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles List Content */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 max-w-md mx-auto">
            <span className="text-4xl">📚</span>
            <h3 className="font-bold text-clinicText mt-4">{t(lang, 'ไม่พบหัวข้อที่ท่านค้นหา', 'No articles found')}</h3>
            <p className="text-xs text-clinicMuted mt-1">{t(lang, 'กรุณาลองป้อนคำค้นหาอื่น หรือเปลี่ยนหมวดหมู่ตัวกรองดูนะครับ', 'Please try typing other keywords or clearing the category filter.')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden border border-primary/5 hover:border-primary/20 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Cover Image */}
                <Link to={`/articles/${article.slug}`} className="block aspect-[16/10] overflow-hidden bg-[#ECE7DE] relative image-warm-overlay">
                  <img
                    src={article.cover_image_url || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=600'}
                    alt={t(lang, article.title_th, article.title_en)}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Category tag */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xxs font-bold text-primary-dark border border-primary/10">
                    {t(lang, article.category_th, article.category_en)}
                  </span>
                </Link>

                {/* Text Context */}
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex gap-4 text-xxs text-clinicMuted">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-primary" />
                        {article.published_date}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-primary" />
                        {article.author || t(lang, 'นักกิจกรรมบำบัด', 'Therapist')}
                      </span>
                    </div>
                    
                    <Link to={`/articles/${article.slug}`}>
                      <h3 className="font-bold text-clinicText text-base sm:text-lg leading-snug group-hover:text-primary transition-colors line-clamp-2">
                        {t(lang, article.title_th, article.title_en)}
                      </h3>
                    </Link>
                    
                    <p className="text-xs text-clinicMuted line-clamp-3 leading-relaxed">
                      {t(lang, article.excerpt_th, article.excerpt_en)}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-primary/10">
                    <Link
                      to={`/articles/${article.slug}`}
                      className="text-xs font-bold text-primary-dark group-hover:text-primary flex items-center gap-1.5"
                    >
                      {t(lang, 'อ่านบทความตัวเต็ม', 'Read full article')}
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
