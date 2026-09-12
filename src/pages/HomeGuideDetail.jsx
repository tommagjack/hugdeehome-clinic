import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Bookmark, 
  ArrowRight,
  MessageCircle,
  Phone
} from 'lucide-react';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import Alert from '../components/common/Alert';
import { storage } from '../services/storage';

export default function HomeGuideDetail({ settings }) {
  const { slug } = useParams();
  const [guide, setGuide] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGuide() {
      try {
        const [targetGuide, allGuides] = await Promise.all([
          storage.getHomeGuideBySlug(slug),
          storage.getHomeGuides()
        ]);
        setGuide(targetGuide);
        if (targetGuide) {
          const others = allGuides.filter(g => g.id !== targetGuide.id && g.status === 'published').slice(0, 2);
          setRelated(others);
        }
      } catch (err) {
        console.error('Error loading article:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGuide();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-20 max-w-3xl mx-auto px-4">
        <LoadingState message="กำลังโหลดบทความ..." />
      </div>
    );
  }

  if (!guide) {
    return (
      <div className="py-20 max-w-lg mx-auto px-4 text-center">
        <Alert type="warning">ไม่พบบทความที่ต้องการ</Alert>
        <div className="mt-6">
          <Button to="/home-guide" variant="primary">
            กลับหน้าคลังความรู้
          </Button>
        </div>
      </div>
    );
  }

  const phone = settings?.phone || '094-675-3557';
  const lineUrl = settings?.lineUrl || 'https://line.me/R/ti/p/@hugdeehome';

  return (
    <article className="py-10 md:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Back Button */}
      <div>
        <Link 
          to="/home-guide" 
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-brand-text-muted hover:text-brand-brown transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>กลับหน้าคู่มือดูแลลูก</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant="yellow">{guide.category}</Badge>
          <span className="text-xs text-brand-text-muted flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {guide.publishedDate}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-brand-text leading-snug">
          {guide.title}
        </h1>

        {guide.author && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-brand-text-muted pt-2 border-t border-brand-border/60">
            <User className="w-4 h-4 text-brand-brown" />
            <span>เขียนโดย: <strong>{guide.author}</strong></span>
          </div>
        )}
      </header>

      {/* Lead Excerpt */}
      {guide.excerpt && (
        <div className="bg-brand-cream/60 p-6 rounded-2xl border-l-4 border-brand-brown text-base sm:text-lg text-brand-text leading-thai-relaxed italic">
          "{guide.excerpt}"
        </div>
      )}

      {/* Article Body Content */}
      <div className="prose prose-stone max-w-none text-brand-text text-base sm:text-lg leading-thai-relaxed space-y-6">
        {guide.content ? (
          guide.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={idx} className="text-2xl font-bold text-brand-text mt-8 mb-4">{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('### ')) {
              return <h3 key={idx} className="text-xl font-bold text-brand-text mt-6 mb-3">{paragraph.replace('### ', '')}</h3>;
            }
            if (paragraph.startsWith('* ') || paragraph.startsWith('- ')) {
              const items = paragraph.split('\n').map(i => i.replace(/^(\*|-)\s+/, ''));
              return (
                <ul key={idx} className="list-disc pl-6 space-y-2 text-brand-text-muted">
                  {items.map((it, iIdx) => <li key={iIdx}>{it}</li>)}
                </ul>
              );
            }
            return <p key={idx} className="text-brand-text-muted">{paragraph}</p>;
          })
        ) : (
          <p className="text-brand-text-muted">อยู่ระหว่างการจัดเตรียมเนื้อหาบทความฉบับเต็ม...</p>
        )}
      </div>

      {/* Sharing / Clinical Disclaimer */}
      <div className="bg-brand-soft-blue/30 p-5 rounded-2xl border border-brand-blue/30 text-xs text-brand-text-muted leading-relaxed">
        ข้อมูลในบทความนี้จัดทำขึ้นเพื่อให้ความรู้ความเข้าใจทั่วไปเกี่ยวกับพัฒนาการเด็กและกิจกรรมส่งเสริมในครอบครัว ไม่สามารถใช้ทดแทนการตรวจวินิจฉัยทางการแพทย์ หากท่านมีข้อสงสัยเกี่ยวกับพัฒนาการของลูก ควรปรึกษาผู้เชี่ยวชาญเพื่อรับคำแนะนำเฉพาะบุคคล
      </div>

      {/* Consultation Banner */}
      <div className="bg-brand-cream rounded-3xl p-8 border border-brand-border text-center space-y-4">
        <h3 className="text-lg sm:text-xl font-bold text-brand-text">
          ต้องการคำแนะนำเพิ่มเติมเกี่ยวกับพัฒนาการของลูก?
        </h3>
        <p className="text-sm text-brand-text-muted max-w-md mx-auto">
          ทีมนักกิจกรรมบำบัดบ้านฮักดียินดีให้คำปรึกษาเบื้องต้นผ่าน LINE หรือโทรศัพท์
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button href={lineUrl} variant="primary" size="md" icon={MessageCircle}>
            แอดไลน์คุยกับคลินิก
          </Button>
          <Button href={`tel:${phone}`} variant="outline" size="md" icon={Phone}>
            โทร {settings?.phoneFormatted || phone}
          </Button>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="pt-8 border-t border-brand-border/70 space-y-6">
          <h3 className="text-xl font-bold text-brand-text">
            บทความที่คุณอาจสนใจ
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {related.map(rel => (
              <Link
                key={rel.id}
                to={`/home-guide/${rel.slug}`}
                className="p-5 rounded-2xl bg-white border border-brand-border hover:border-brand-brown/40 transition-colors group flex flex-col justify-between"
              >
                <div>
                  <Badge variant="yellow" size="sm" className="mb-2">{rel.category}</Badge>
                  <h4 className="text-base font-bold text-brand-text group-hover:text-brand-brown transition-colors mb-2 line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-brand-text-muted line-clamp-2">{rel.excerpt}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-brand-border/40 text-xs text-brand-brown font-semibold flex items-center justify-between">
                  <span>อ่านบทความ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
