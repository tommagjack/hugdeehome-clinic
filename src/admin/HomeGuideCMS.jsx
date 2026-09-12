import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  Save, 
  X, 
  Search,
  Calendar,
  Tag
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function HomeGuideCMS() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  
  const [editingGuide, setEditingGuide] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'EF และสมาธิ',
    contentType: 'Article',
    excerpt: '',
    content: '',
    author: 'ทีมวิชาการ คลินิกพัฒนาการเด็กบ้านฮักดี',
    isFeatured: false,
    status: 'published'
  });

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

  const contentTypes = ['Article', 'Guide', 'Infographic', 'PDF'];

  const loadGuides = async () => {
    setLoading(true);
    try {
      const data = await storage.getHomeGuides();
      setGuides(data);
    } catch (err) {
      console.error('Error loading guides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGuides();
  }, []);

  const handleOpenCreate = () => {
    setEditingGuide('new');
    setFormData({
      title: '',
      slug: '',
      category: 'EF และสมาธิ',
      contentType: 'Article',
      excerpt: '',
      content: '',
      author: 'ทีมวิชาการ คลินิกพัฒนาการเด็กบ้านฮักดี',
      isFeatured: false,
      status: 'published'
    });
  };

  const handleOpenEdit = (guide) => {
    setEditingGuide(guide.id);
    setFormData(guide);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `guide-${Date.now()}`
    };
    if (editingGuide !== 'new') {
      payload.id = editingGuide;
    }
    await storage.saveHomeGuide(payload);
    setEditingGuide(null);
    loadGuides();
  };

  const handleTogglePublish = async (guide) => {
    const updated = {
      ...guide,
      status: guide.status === 'published' ? 'draft' : 'published'
    };
    await storage.saveHomeGuide(updated);
    loadGuides();
  };

  const handleToggleFeatured = async (guide) => {
    const updated = {
      ...guide,
      isFeatured: !guide.isFeatured
    };
    await storage.saveHomeGuide(updated);
    loadGuides();
  };

  const handleDelete = async () => {
    if (deletingId) {
      await storage.deleteHomeGuide(deletingId);
      setDeletingId(null);
      loadGuides();
    }
  };

  const filtered = guides.filter(g => {
    const matchCat = selectedCategory === 'ทั้งหมด' || g.category === selectedCategory;
    const matchSearch = search.trim() === '' || g.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">
            จัดการคู่มือดูแลลูก & บทความ (Home Guide CMS)
          </h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            เผยแพร่บทความความรู้ เทคนิคการเล่น และคำแนะนำสำหรับผู้ปกครอง
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenCreate}
          className="font-semibold shadow-sm"
        >
          เพิ่มบทความใหม่
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-brand-brown text-white font-semibold'
                  : 'bg-brand-warm-white text-brand-text hover:bg-brand-cream'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64 flex-shrink-0">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาชื่อบทความ..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-brand-border bg-brand-warm-white text-xs focus:bg-white focus:border-brand-blue focus-visible:outline-none"
          />
        </div>
      </div>

      {/* Articles Table */}
      {loading ? (
        <LoadingState message="กำลังโหลดบทความ..." />
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream/60 border-b border-brand-border text-xs uppercase tracking-wider text-brand-text font-semibold">
                <tr>
                  <th className="px-6 py-4">ลำดับ</th>
                  <th className="px-6 py-4">ชื่อบทความ</th>
                  <th className="px-6 py-4">หมวดหมู่</th>
                  <th className="px-6 py-4">วันที่เผยแพร่</th>
                  <th className="px-6 py-4">ปักหมุดแนะนำ</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filtered.map((guide, idx) => (
                  <tr key={guide.id} className="hover:bg-brand-warm-white/60 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-brand-text-muted">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4 max-w-xs">
                      <div className="font-bold text-brand-text line-clamp-1">{guide.title}</div>
                      <div className="text-xs text-brand-text-muted line-clamp-1">{guide.excerpt}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="yellow" size="sm">{guide.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-text-muted">
                      {guide.publishedDate}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleFeatured(guide)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          guide.isFeatured
                            ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                            : 'text-neutral-300 hover:text-amber-400'
                        }`}
                        title="คลิกเพื่อสลับสถานะแนะนำ"
                      >
                        <Star className={`w-4 h-4 ${guide.isFeatured ? 'fill-current' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(guide)}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          guide.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {guide.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{guide.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(guide)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-brown hover:bg-brand-cream transition-colors"
                          title="แก้ไข"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(guide.id)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-pink hover:bg-brand-pink/10 transition-colors"
                          title="ลบ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit / Create Article Modal */}
      {editingGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-simple">
          <div className="bg-white rounded-3xl border border-brand-border shadow-soft-xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setEditingGuide(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-brand-text mb-4">
              {editingGuide === 'new' ? 'เพิ่มบทความใหม่' : 'แก้ไขบทความ'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  หัวข้อบทความ <span className="text-brand-pink">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="เช่น เข้าใจ Executive Functions (EF) ผ่านการเล่น"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    หมวดหมู่บทความ
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                  >
                    {categories.filter(c => c !== 'ทั้งหมด').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    ผู้เขียน
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  คำอธิบายสั้น (Excerpt)
                </label>
                <textarea
                  rows={2}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="ข้อความสรุปเนื้อหาบทความ 1-2 บรรทัด..."
                  className="w-full px-3.5 py-2 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  เนื้อหาบทความ (รองรับ Markdown: ## หัวข้อย่อย, * รายการ)
                </label>
                <textarea
                  rows={8}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="เขียนเนื้อหาบทความที่นี่..."
                  className="w-full p-3.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none font-mono text-xs leading-relaxed"
                />
              </div>

              <div className="flex items-center gap-6 p-4 rounded-2xl bg-brand-warm-white border border-brand-border">
                <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-brand-blue"
                  />
                  <span>ปักหมุดเป็นบทความแนะนำ (Featured)</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-brand-text-muted">สถานะ:</span>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-2 py-1 rounded-lg border border-brand-border text-xs"
                  >
                    <option value="published">เผยแพร่</option>
                    <option value="draft">ฉบับร่าง</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" onClick={() => setEditingGuide(null)}>
                  ยกเลิก
                </Button>
                <Button type="submit" variant="primary" size="md" icon={Save}>
                  บันทึกบทความ
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="ยืนยันการลบบทความ"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบบทความนี้ออกจากระบบ?"
        confirmLabel="ลบบทความ"
        confirmVariant="pink"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
}
