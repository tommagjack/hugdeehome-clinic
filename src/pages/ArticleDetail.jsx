import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Tag, ArrowLeft, ArrowRight } from 'lucide-react';
import { db } from '../utils/db';
import { t, updateMeta, injectStructuredData, getArticleSchema } from '../utils/helpers';

// A simple local markdown compiler to convert basic headings, lists, bold texts, and paragraphs to HTML elements safely.
const renderMarkdown = (text) => {
  if (!text) return '';
  const lines = text.split('\n');
  return lines.map((line, idx) => {
    // Headings
    if (line.startsWith('## ')) {
      return <h2 key={idx} className="text-xl sm:text-2xl font-bold text-clinicText mt-6 mb-4">{line.replace('## ', '')}</h2>;
    }
    if (line.startsWith('### ')) {
      return <h3 key={idx} className="text-lg sm:text-xl font-bold text-clinicText mt-4 mb-3">{line.replace('### ', '')}</h3>;
    }
    // Lists
    if (line.startsWith('* ') || line.startsWith('- ')) {
      return <li key={idx} className="ml-6 list-disc text-xs sm:text-sm text-clinicMuted mb-2">{line.substring(2)}</li>;
    }
    // Empty line
    if (line.trim() === '') {
      return <div key={idx} className="h-2"></div>;
    }
    // Default Paragraph (convert double asterisks for bolding)
    let content = line;
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push(line.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index} className="font-bold text-clinicText">{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < line.length) {
      parts.push(line.substring(lastIndex));
    }

    return <p key={idx} className="text-xs sm:text-sm text-clinicMuted leading-relaxed mb-4">{parts.length > 0 ? parts : content}</p>;
  });
};

export default function ArticleDetail({ lang, clinicSettings }) {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  const lineLink = `https://line.me/R/ti/p/%40${String(clinicSettings?.line_id || 'hugdeehome').replace('@', '')}`;

  useEffect(() => {
    async function loadArticle() {
      try {
        const data = await db.getArticleBySlug(slug);
        setArticle(data);
        
        if (data) {
          // SEO updates
          const title = t(lang, data.title_th, data.title_en);
          const desc = t(lang, data.excerpt_th, data.excerpt_en);
          updateMeta(`${title} | บ้านฮักดี`, desc, `/articles/${slug}`);
          
          // Inject Article Structured Data
          injectStructuredData('article', getArticleSchema(data));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();

    // Clear Article schema on exit
    return () => {
      const existing = document.getElementById('jsonld-article');
      if (existing) existing.remove();
    };
  }, [slug, lang, clinicSettings]);

  if (loading) {
    return (
      <div className="bg-clinicBg min-h-screen py-20 flex justify-center items-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="bg-clinicBg min-h-screen py-20 text-center flex flex-col justify-center items-center">
        <span className="text-4xl">📚</span>
        <h2 className="text-xl font-bold text-clinicText mt-4">{t(lang, 'ไม่พบบทความความรู้ที่คุณต้องการ', 'Article not found')}</h2>
        <p className="text-xs text-clinicMuted mt-1">{t(lang, 'บทความดังกล่าวอาจถูกถอดถอน หรือลิงก์การเชื่อมต่อผิดพลาด', 'The article link is incorrect or was deleted.')}</p>
        <Link to="/articles" className="mt-6 inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-2.5 rounded-xl text-xs">
          <ArrowLeft className="w-4 h-4" />
          {t(lang, 'กลับไปคลังความรู้', 'Back to Articles')}
        </Link>
      </div>
    );
  }

  const title = t(lang, article.title_th, article.title_en);
  const category = t(lang, article.category_th, article.category_en);
  const author = article.author || t(lang, 'นักกิจกรรมบำบัด', 'Therapist');
  const date = article.published_date;
  const content = t(lang, article.content_th, article.content_en);

  return (
    <div className="bg-clinicBg py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-left">
        
        {/* Back Button */}
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-xs font-bold text-clinicMuted hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          {t(lang, 'ย้อนกลับไปคลังความรู้', 'Back to Articles')}
        </Link>

        {/* Article Meta Header */}
        <div className="space-y-4 mb-8">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xxs font-bold bg-primary/10 text-primary-dark border border-primary/5 uppercase">
            {category}
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-clinicText leading-snug">
            {title}
          </h1>
          <div className="flex flex-wrap gap-4 text-xxs sm:text-xs text-clinicMuted pt-2">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-primary" />
              {author}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="aspect-[16/9] w-full rounded-3xl overflow-hidden bg-[#ECE7DE] border border-primary/5 shadow-sm mb-10 image-warm-overlay">
          <img
            src={article.cover_image_url || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200'}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-primary/5 shadow-sm mb-12">
          <div className="prose prose-stone max-w-none">
            {renderMarkdown(content)}
          </div>
        </div>

        {/* Article Footer Consult Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-[#F3EFE6] to-primary/5 rounded-3xl p-8 border border-primary/10 text-center flex flex-col items-center gap-4">
          <span className="text-2xl">🏡</span>
          <h3 className="font-bold text-clinicText text-base sm:text-lg">
            {t(lang, 'ต้องการประเมินพัฒนาการเด็ก หรือรับการปรึกษาเพิ่มเติม?', 'Need an assessment or have developmental questions?')}
          </h3>
          <p className="text-xs text-clinicMuted max-w-lg leading-relaxed">
            {t(lang,
              'หากสังเกตพบเห็นพฤติกรรมบางประการในบทความ หรือสงสัยว่าน้องอาจมีความกังวล สามารถแชทคุยปรึกษาแรกรับเบื้องต้นกับนักบำบัดทาง LINE ได้ตลอดเวลาครับ',
              'If you observe indicators discussed in this article or are worried about your child, message our team on LINE to book a free chat.'
            )}
          </p>
          <a
            href={lineLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center items-center gap-2 bg-[#06C755] hover:bg-[#05b04b] text-white font-bold px-8 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all text-xs"
          >
            {t(lang, 'ทัก LINE ปรึกษาคลิกที่นี่', 'Consult via LINE')}
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </div>
  );
}
