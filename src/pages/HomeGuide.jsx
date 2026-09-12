import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Tag, 
  Calendar, 
  User, 
  ArrowRight, 
  Sparkles,
  Bookmark
} from 'lucide-react';
import SectionHeading from '../components/common/SectionHeading';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import LoadingState from '../components/common/LoadingState';
import EmptyState from '../components/common/EmptyState';
import { storage } from '../services/storage';

export default function HomeGuide({ settings }) {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'ทั้งหมด',
    'พัฒนาการเด็ก',
    'EF และสมาธิ',
    'Sensory',
    'Fine Motor',
    'Gross Motor',
    'Visual Perception',
    'การเรียนรู้',
    'การเล่น',
    'กิจกรรมที่บ้าน'
  ];

  useEffect(() => {
    async function loadGuides() {
      try {
        const data = await storage.getHomeGuides();
        setGuides(data.filter(g => g.status === 'published'));
      } catch (err) {
        console.error('Failed to load home guides:', err);
      } finally {
        setLoading(false);
      }
    }
    loadGuides();
  }, []);

  const filteredGuides = guides.filter(guide => {
    const matchCategory = selectedCategory === 'ทั้งหมด' || guide.category === selectedCategory;
    const matchSearch = searchQuery.trim() === '' || 
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const featuredGuide = guides.find(g => g.isFeatured) || guides[0];

  return (
    <div className="py-12 md:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs md:text-sm font-semibold text-brand-brown tracking-wider uppercase px-3.5 py-1.5 rounded-full bg-brand-cream border border-brand-border mb-4 inline-block">
          คู่มือดูแลลูก & กิจกรรมที่บ้าน
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-text mb-4">
          คลังความรู้ส่งเสริมพัฒนาการ
        </h1>
        <p className="text-base sm:text-lg text-brand-text-muted leading-thai-relaxed">
          บทความและเทคนิคที่เข้าใจง่าย ออกแบบโดยนักกิจกรรมบำบัด เพื่อให้คุณพ่อคุณแม่นำไปปรับใช้ในชีวิตประจำวันได้อย่างมีความสุข
        </p>
      </div>

      {/* Search and Category Filter Bar */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหาบทความ เช่น EF, สมาธิ, การจับดินสอ, การเล่น..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-brand-border bg-white text-brand-text text-sm sm:text-base focus:border-brand-blue focus-visible:outline-none shadow-sm"
          />
        </div>

        {/* Category Filter Chips (Wrapped cleanly onto new lines) */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  active
                    ? 'bg-brand-brown text-white font-semibold shadow-sm'
                    : 'bg-white border border-brand-border text-brand-text hover:bg-brand-cream'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Guide Banner (if no search filter) */}
      {!searchQuery && selectedCategory === 'ทั้งหมด' && featuredGuide && (
        <div className="bg-brand-cream/80 border border-brand-border rounded-3xl p-7 sm:p-10 lg:p-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="yellow">บทความแนะนำ</Badge>
              <span className="text-xs text-brand-text-muted">{featuredGuide.publishedDate}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-text mb-3">
              <Link to={`/home-guide/${featuredGuide.slug}`} className="hover:text-brand-brown transition-colors">
                {featuredGuide.title}
              </Link>
            </h2>
            <p className="text-base text-brand-text-muted leading-thai-relaxed mb-6">
              {featuredGuide.excerpt}
            </p>
            <Button
              to={`/home-guide/${featuredGuide.slug}`}
              variant="primary"
              size="md"
              icon={ArrowRight}
              iconPosition="right"
              className="font-semibold"
            >
              อ่านบทความนี้
            </Button>
          </div>
        </div>
      )}

      {/* Guide Listings Grid */}
      {loading ? (
        <LoadingState message="กำลังโหลดบทความ..." />
      ) : filteredGuides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredGuides.map((guide) => (
            <Link
              key={guide.id}
              to={`/home-guide/${guide.slug}`}
              className="brand-card flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-brand-text-muted mb-3">
                  <Badge variant="yellow">{guide.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {guide.publishedDate}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-brand-text group-hover:text-brand-brown transition-colors mb-2.5 leading-snug line-clamp-2">
                  {guide.title}
                </h3>

                <p className="text-sm text-brand-text-muted leading-thai-relaxed line-clamp-3 mb-6">
                  {guide.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex items-center justify-between text-xs text-brand-brown font-semibold">
                <span>อ่านต่อฉบับเต็ม</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="ยังไม่มีบทความในหมวดหมู่นี้"
          description="ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่นเพื่อดูคู่มือสำหรับผู้ปกครอง"
          actionLabel="ดูบทความทั้งหมด"
          onAction={() => {
            setSelectedCategory('ทั้งหมด');
            setSearchQuery('');
          }}
        />
      )}

    </div>
  );
}
