import React, { useState, useEffect, useRef } from 'react';
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
  Tag,
  Upload,
  Download,
  FileSpreadsheet,
  FileText,
  FileCode,
  Sparkles,
  Check,
  AlertCircle,
  RotateCcw,
  Heading2,
  Heading3,
  List,
  Bold
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';
import {
  downloadFile,
  autoFormatArticleContent,
  generateGuideCsvTemplate,
  exportGuidesToCsv,
  generateGuideMarkdownTemplate,
  exportGuideToMarkdown,
  exportGuidesToJson,
  parseImportedGuideData
} from '../services/homeGuideImportExport';
import { INITIAL_HOME_GUIDES } from '../services/seedData.js';

export default function HomeGuideCMS() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  
  const [editingGuide, setEditingGuide] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [contentTab, setContentTab] = useState('edit'); // 'edit' | 'preview'

  // Import / Export State
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importRawText, setImportRawText] = useState('');
  const [importFileName, setImportFileName] = useState('');
  const [importParsed, setImportParsed] = useState(null);
  const [importMode, setImportMode] = useState('append'); // 'append' | 'replace'
  const [autoFormatEnabled, setAutoFormatEnabled] = useState(true);
  const [importError, setImportError] = useState(null);
  const [importSuccess, setImportSuccess] = useState(null);
  const [activeImportTab, setActiveImportTab] = useState('file'); // 'file' | 'paste'
  const fileInputRef = useRef(null);

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

    const handleUpdate = () => {
      loadGuides();
    };
    window.addEventListener('hugdee_data_updated', handleUpdate);
    return () => window.removeEventListener('hugdee_data_updated', handleUpdate);
  }, []);

  const handleRestoreDefaults = async () => {
    setLoading(true);
    try {
      for (const g of INITIAL_HOME_GUIDES) {
        await storage.saveHomeGuide(g);
      }
      await loadGuides();
    } catch (err) {
      console.error('Error restoring default guides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingGuide('new');
    setContentTab('edit');
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
    setContentTab('edit');
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

  // --- Quick Markdown Formatting for Editor ---
  const handleFormatEditorContent = () => {
    if (!formData.content) return;
    const formatted = autoFormatArticleContent(formData.content);
    setFormData(prev => ({ ...prev, content: formatted }));
  };

  const handleInsertMarkdown = (prefix, placeholder = '', suffix = '') => {
    const textarea = document.getElementById('guide-content-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const current = formData.content || '';
    const selected = current.substring(start, end) || placeholder;
    const replacement = `${prefix}${selected}${suffix}`;
    const updated = current.substring(0, start) + replacement + current.substring(end);
    setFormData(prev => ({ ...prev, content: updated }));
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  // --- Import / Export Handlers ---
  const processImportContent = (text, fileName = '', autoFormat = autoFormatEnabled) => {
    setImportError(null);
    const trimmed = (text || '').trim();
    if (!trimmed) {
      setImportParsed(null);
      return;
    }

    const parsed = parseImportedGuideData(trimmed, fileName, autoFormat);
    if (parsed && parsed.data && parsed.data.length > 0) {
      setImportParsed(parsed);
      setImportMode('append');
    } else {
      setImportError('ไม่สามารถอ่านข้อมูลได้ กรุณาตรวจสอบว่าเป็นไฟล์ CSV, Markdown (.md) หรือ JSON ที่ถูกต้อง');
      setImportParsed(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
    setImportError(null);
    setImportSuccess(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setImportRawText(text);
      processImportContent(text, file.name, autoFormatEnabled);
    };
    reader.onerror = () => {
      setImportError('ไม่สามารถอ่านไฟล์ได้ กรุณาลองใหม่อีกครั้ง');
    };
    reader.readAsText(file, 'utf-8');
  };

  const handleToggleAutoFormat = (enabled) => {
    setAutoFormatEnabled(enabled);
    if (importRawText) {
      processImportContent(importRawText, importFileName, enabled);
    }
  };

  const handleApplyImport = async () => {
    if (!importParsed || !importParsed.data) return;
    setLoading(true);
    try {
      if (importMode === 'replace') {
        const newGuides = importParsed.data.map((g, idx) => ({
          ...g,
          id: g.id || `guide_${Date.now()}_${idx}`,
          displayOrder: idx + 1
        }));
        for (const g of newGuides) {
          await storage.saveHomeGuide(g);
        }
        setImportSuccess(`นำเข้าบทความสำเร็จ (${newGuides.length} บทความ)`);
      } else {
        for (const g of importParsed.data) {
          const newGuide = {
            ...g,
            id: `guide_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
          };
          await storage.saveHomeGuide(newGuide);
        }
        setImportSuccess(`เพิ่มบทความใหม่สำเร็จ (${importParsed.data.length} บทความ)`);
      }
      await loadGuides();
      setTimeout(() => {
        setImportModalOpen(false);
        setImportRawText('');
        setImportParsed(null);
        setImportFileName('');
        setImportSuccess(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }, 1200);
    } catch (err) {
      console.error('Error applying import:', err);
      setImportError('เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadCsvTemplate = () => {
    const csv = generateGuideCsvTemplate();
    downloadFile(csv, 'template_home_guides.csv', 'text/csv;charset=utf-8;');
  };

  const handleDownloadMdTemplate = () => {
    const md = generateGuideMarkdownTemplate();
    downloadFile(md, 'template_article.md', 'text/markdown;charset=utf-8;');
  };

  const handleExportAllCsv = () => {
    exportGuidesToCsv(guides);
  };

  const handleExportAllJson = () => {
    exportGuidesToJson(guides);
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
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="md"
            icon={Upload}
            onClick={() => setImportModalOpen(true)}
            className="border-brand-border hover:border-brand-brown text-brand-text"
          >
            นำเข้า (Import)
          </Button>

          <Button
            variant="outline"
            size="md"
            icon={Download}
            onClick={() => setExportModalOpen(true)}
            className="border-brand-border hover:border-brand-brown text-brand-text"
          >
            ส่งออก / Template
          </Button>

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
          {filtered.length === 0 ? (
            <div className="p-12 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-cream/60 flex items-center justify-center text-brand-brown">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-brand-text">
                  {guides.length === 0 ? 'ยังไม่มีบทความในระบบ' : 'ไม่พบบทความตามเงื่อนไขที่ค้นหา'}
                </h3>
                <p className="text-xs text-brand-text-muted mt-1 max-w-md mx-auto">
                  {guides.length === 0 
                    ? 'คุณสามารถเพิ่มบทความใหม่ นำเข้าจากไฟล์ Excel/Markdown หรือกู้คืนบทความมาตรฐาน'
                    : 'ลองเปลี่ยนหมวดหมู่หรือคำค้นหาใหม่'}
                </p>
              </div>
              {guides.length === 0 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    icon={Plus}
                    onClick={handleOpenCreate}
                  >
                    เพิ่มบทความใหม่
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    icon={RotateCcw}
                    onClick={handleRestoreDefaults}
                  >
                    กู้คืนบทความเริ่มต้น
                  </Button>
                </div>
              )}
            </div>
          ) : (
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
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => exportGuideToMarkdown(guide)}
                            className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-blue hover:bg-brand-soft-blue/30 transition-colors"
                            title="ส่งออกบทความนี้เป็นไฟล์ Markdown (.md)"
                          >
                            <Download className="w-4 h-4" />
                          </button>
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
          )}
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
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-brand-text">
                    เนื้อหาบทความ (รองรับ Markdown: ## หัวข้อ, * ข้อย่อย)
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleFormatEditorContent}
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-brand-soft-yellow/60 text-brand-brown hover:bg-brand-soft-yellow border border-brand-yellow/40 font-semibold transition-colors shadow-sm"
                      title="จัดรูปแบบหัวข้อและข้อย่อยให้อ่านง่าย สวยงามอัตโนมัติ"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                      <span>✨ จัดรูปแบบสวยงาม</span>
                    </button>
                    <div className="flex rounded-lg border border-brand-border p-0.5 bg-brand-cream/50">
                      <button
                        type="button"
                        onClick={() => setContentTab('edit')}
                        className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                          contentTab === 'edit'
                            ? 'bg-white text-brand-text font-bold shadow-sm'
                            : 'text-brand-text-muted hover:text-brand-text'
                        }`}
                      >
                        แก้ไข (Editor)
                      </button>
                      <button
                        type="button"
                        onClick={() => setContentTab('preview')}
                        className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                          contentTab === 'preview'
                            ? 'bg-white text-brand-text font-bold shadow-sm'
                            : 'text-brand-text-muted hover:text-brand-text'
                        }`}
                      >
                        ดูตัวอย่าง (Preview)
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Markdown Formatting Toolbar */}
                {contentTab === 'edit' && (
                  <div className="flex flex-wrap items-center gap-1.5 p-2 mb-2 bg-brand-cream/40 border border-brand-border/60 rounded-xl text-xs">
                    <span className="text-[11px] text-brand-text-muted font-medium px-1">แทรกด่วน:</span>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdown('## ', 'หัวข้อหลัก\n')}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-brand-soft-blue/30 border border-brand-border text-xs font-semibold text-brand-text transition-colors"
                      title="แทรกหัวข้อหลัก ##"
                    >
                      H2 หัวข้อ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdown('### ', 'หัวข้อย่อย\n')}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-brand-soft-blue/30 border border-brand-border text-xs font-semibold text-brand-text transition-colors"
                      title="แทรกหัวข้อย่อย ###"
                    >
                      H3 ข้อย่อย
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdown('**', 'ข้อความตัวหนา', '**')}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-brand-soft-blue/30 border border-brand-border text-xs font-bold text-brand-text transition-colors"
                      title="ทำตัวหนา **"
                    >
                      B ตัวหนา
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdown('* ', 'รายการหัวข้อย่อย\n')}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-brand-soft-blue/30 border border-brand-border text-xs text-brand-text transition-colors"
                      title="แทรกข้อย่อย *"
                    >
                      • รายการ
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertMarkdown('> ', 'ข้อความคำแนะนำสำคัญ\n')}
                      className="px-2 py-1 rounded-lg bg-white hover:bg-brand-soft-blue/30 border border-brand-border text-xs text-brand-text italic transition-colors"
                      title="แทรกบล็อกคำแนะนำ >"
                    >
                      " คำแนะนำ
                    </button>
                  </div>
                )}

                {contentTab === 'edit' ? (
                  <textarea
                    id="guide-content-textarea"
                    rows={8}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="เขียนเนื้อหาบทความที่นี่... (รองรับหัวข้อ ##, ข้อย่อย *, หรือกดปุ่ม ✨ จัดรูปแบบสวยงาม ได้ตลอดเวลา)"
                    className="w-full p-3.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none font-mono text-xs leading-relaxed"
                  />
                ) : (
                  <div className="w-full p-4 rounded-xl border border-brand-border bg-brand-warm-white min-h-[200px] max-h-[360px] overflow-y-auto text-brand-text">
                    {formData.content ? (
                      <div className="space-y-2">
                        {formData.content.split('\n').map((line, lidx) => {
                          const trimmed = line.trim();
                          if (trimmed.startsWith('### ')) {
                            return <h4 key={lidx} className="font-bold text-sm text-brand-brown mt-3 mb-1">{trimmed.replace(/^###\s+/, '')}</h4>;
                          }
                          if (trimmed.startsWith('## ')) {
                            return <h3 key={lidx} className="font-bold text-base text-brand-text mt-3 mb-1 pb-1 border-b border-brand-border/40">{trimmed.replace(/^##\s+/, '')}</h3>;
                          }
                          if (trimmed.startsWith('# ')) {
                            return <h2 key={lidx} className="font-bold text-lg text-brand-brown mt-3 mb-1">{trimmed.replace(/^#\s+/, '')}</h2>;
                          }
                          if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
                            return (
                              <li key={lidx} className="ml-4 text-xs text-brand-text-muted my-0.5 list-disc">
                                {trimmed.replace(/^[*|-]\s+/, '')}
                              </li>
                            );
                          }
                          if (trimmed.startsWith('> ')) {
                            return (
                              <blockquote key={lidx} className="border-l-4 border-brand-yellow pl-3 py-1 my-2 italic text-xs text-brand-brown bg-brand-soft-yellow/20 rounded-r">
                                {trimmed.replace(/^>\s+/, '')}
                              </blockquote>
                            );
                          }
                          if (!trimmed) {
                            return <div key={lidx} className="h-1.5" />;
                          }
                          return <p key={lidx} className="text-xs text-brand-text leading-relaxed">{trimmed}</p>;
                        })}
                      </div>
                    ) : (
                      <div className="text-xs text-brand-text-muted italic text-center py-8">
                        ยังไม่มีเนื้อหาสำหรับแสดงตัวอย่าง
                      </div>
                    )}
                  </div>
                )}
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

      {/* Export & Download Template Modal */}
      {exportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-simple">
          <div className="bg-white rounded-3xl border border-brand-border shadow-soft-xl max-w-xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setExportModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-brand-soft-yellow flex items-center justify-center text-amber-700">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-text">ส่งออก & ดาวน์โหลดแม่แบบ</h2>
                <p className="text-xs text-brand-text-muted">Export & Content Templates</p>
              </div>
            </div>

            <p className="text-xs text-brand-text-muted mb-6 leading-relaxed">
              เลือกดาวน์โหลดแม่แบบเปล่าสำหรับนำไปพิมพ์เนื้อหาบทความด้วยโปรแกรม Excel หรือ Word หรือส่งออกบทความทั้งหมดที่มีอยู่ในระบบ
            </p>

            <div className="space-y-5">
              {/* Templates */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted mb-3 flex items-center gap-1.5">
                  <span>📄 แม่แบบสำหรับกรอกเนื้อหาใหม่ (Templates)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl border border-brand-border/80 bg-brand-warm-white/60 hover:border-brand-blue/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2.5">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs text-brand-text mb-1">แม่แบบ Excel / CSV</h4>
                      <p className="text-[11px] text-brand-text-muted mb-3 leading-relaxed">
                        เปิดพิมพ์และแก้ไขใน Microsoft Excel พร้อมหัวตารางภาษาไทย และตัวอย่าง 2 บทความ
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadCsvTemplate}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลด .csv</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl border border-brand-border/80 bg-brand-warm-white/60 hover:border-brand-blue/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center mb-2.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <h4 className="font-bold text-xs text-brand-text mb-1">แม่แบบ Markdown (.md)</h4>
                      <p className="text-[11px] text-brand-text-muted mb-3 leading-relaxed">
                        เหมาะสำหรับพิมพ์เนื้อหาบทความเดี่ยวใน Text Editor, Word หรือคัดลอกมาวาง
                      </p>
                    </div>
                    <button
                      onClick={handleDownloadMdTemplate}
                      className="w-full py-2 px-3 rounded-xl bg-white hover:bg-blue-50 text-brand-blue border border-blue-200 text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ดาวน์โหลด .md</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Export Current Articles */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-muted mb-3 flex items-center gap-1.5">
                  <span>📦 ส่งออกบทความปัจจุบัน ({guides.length} บทความ)</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleExportAllCsv}
                    className="p-3.5 rounded-2xl border border-brand-border/80 bg-white hover:bg-brand-warm-white hover:border-brand-blue/50 text-left transition-all group flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
                      <FileSpreadsheet className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-brand-text">ส่งออกทั้งหมดเป็น CSV</div>
                      <div className="text-[11px] text-brand-text-muted">เปิดได้ใน Excel (UTF-8)</div>
                    </div>
                  </button>

                  <button
                    onClick={handleExportAllJson}
                    className="p-3.5 rounded-2xl border border-brand-border/80 bg-white hover:bg-brand-warm-white hover:border-brand-blue/50 text-left transition-all group flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-100 transition-colors">
                      <FileCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-brand-text">ส่งออกทั้งหมดเป็น JSON</div>
                      <div className="text-[11px] text-brand-text-muted">สำหรับสำรองข้อมูล (Backup)</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-brand-border/60 flex justify-end">
              <Button variant="ghost" size="md" onClick={() => setExportModalOpen(false)}>
                ปิดหน้าต่าง
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-simple">
          <div className="bg-white rounded-3xl border border-brand-border shadow-soft-xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => {
                setImportModalOpen(false);
                setImportParsed(null);
                setImportError(null);
              }}
              className="absolute top-5 right-5 text-neutral-400 hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-brand-soft-blue flex items-center justify-center text-brand-blue">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-brand-text">นำเข้าบทความ & คู่มือดูแลลูก</h2>
                <p className="text-xs text-brand-text-muted">Import Articles & Auto-Format</p>
              </div>
            </div>

            {/* Auto-Format Feature Highlight Banner */}
            <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-brand-soft-yellow/50 via-amber-50 to-brand-soft-blue/20 border border-brand-yellow/40 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-brand-text">✨ ระบบจัดรูปแบบอัตโนมัติ (Smart Auto-Format & Beautify)</span>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoFormatEnabled}
                      onChange={(e) => handleToggleAutoFormat(e.target.checked)}
                      className="rounded text-brand-blue"
                    />
                    <span className="text-xs font-semibold text-brand-text">เปิดใช้งาน</span>
                  </label>
                </div>
                <p className="text-[11px] text-brand-text-muted mt-0.5 leading-relaxed">
                  แปลงสัญลักษณ์จุด (•, ⁃, ▪, -, *), จัดระเบียบหัวข้อ H2/H3 และเว้นวรรคย่อหน้าให้อ่านง่าย สวยงาม ทันทีที่นำเข้า
                </p>
              </div>
            </div>

            {/* Import Mode Tabs: File vs Paste */}
            <div className="flex rounded-xl border border-brand-border p-1 bg-brand-cream/40 mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveImportTab('file')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors ${
                  activeImportTab === 'file'
                    ? 'bg-white text-brand-text shadow-sm'
                    : 'text-brand-text-muted hover:text-brand-text'
                }`}
              >
                📁 อัปโหลดไฟล์ (.csv / .md / .json / .txt)
              </button>
              <button
                type="button"
                onClick={() => setActiveImportTab('paste')}
                className={`flex-1 py-1.5 rounded-lg text-center transition-colors ${
                  activeImportTab === 'paste'
                    ? 'bg-white text-brand-text shadow-sm'
                    : 'text-brand-text-muted hover:text-brand-text'
                }`}
              >
                📋 วางข้อความโดยตรง (Direct Paste)
              </button>
            </div>

            {/* Tab 1: File Upload */}
            {activeImportTab === 'file' && (
              <div className="mb-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".csv,.json,.md,.markdown,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="guide-file-import"
                />
                <label
                  htmlFor="guide-file-import"
                  className="w-full flex flex-col items-center justify-center p-6 border-2 border-dashed border-brand-border hover:border-brand-blue rounded-2xl cursor-pointer bg-brand-warm-white/40 hover:bg-brand-soft-blue/10 transition-all text-center group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-cream group-hover:bg-brand-soft-blue/40 text-brand-blue flex items-center justify-center mb-2 transition-colors">
                    <Upload className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-brand-text mb-1">
                    คลิกเพื่อเลือกไฟล์ หรือลากไฟล์มาวางที่นี่
                  </span>
                  <span className="text-[11px] text-brand-text-muted">
                    รองรับไฟล์ Excel/CSV, Markdown (.md), JSON หรือ Plain text (.txt)
                  </span>
                  {importFileName && (
                    <div className="mt-3 px-3 py-1 rounded-full bg-brand-soft-blue text-brand-blue text-xs font-semibold flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{importFileName}</span>
                    </div>
                  )}
                </label>
              </div>
            )}

            {/* Tab 2: Paste Raw Text */}
            {activeImportTab === 'paste' && (
              <div className="mb-4">
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  วางข้อความเนื้อหาบทความ หรือโค้ด CSV / JSON ที่นี่:
                </label>
                <textarea
                  rows={6}
                  value={importRawText}
                  onChange={(e) => {
                    setImportRawText(e.target.value);
                    processImportContent(e.target.value, 'pasted-text.md', autoFormatEnabled);
                  }}
                  placeholder="วางเนื้อหาที่คัดลอกมาจาก Word, Google Docs, CSV หรือ Markdown ที่นี่..."
                  className="w-full p-3 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none font-mono text-xs leading-relaxed"
                />
              </div>
            )}

            {/* Status Messages */}
            {importError && (
              <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{importError}</span>
              </div>
            )}

            {importSuccess && (
              <div className="p-3 mb-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{importSuccess}</span>
              </div>
            )}

            {/* Parsed Preview Section */}
            {importParsed && importParsed.data && importParsed.data.length > 0 && (
              <div className="border border-brand-border rounded-2xl p-4 bg-brand-warm-white/40 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-brand-text">
                      ตัวอย่างข้อมูลที่พบ: {importParsed.data.length} บทความ
                    </span>
                    <Badge variant="blue" size="sm">
                      {importParsed.format.toUpperCase()}
                    </Badge>
                  </div>
                  {autoFormatEnabled && (
                    <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>จัดรูปแบบแล้ว</span>
                    </span>
                  )}
                </div>

                {/* Import Mode: Append vs Replace */}
                <div className="flex flex-wrap items-center gap-4 p-3 rounded-xl bg-white border border-brand-border/60 mb-3 text-xs">
                  <span className="text-brand-text-muted font-medium">รูปแบบการนำเข้า:</span>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-brand-text">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-brand-blue"
                    />
                    <span>เพิ่มเป็นบทความใหม่ (Append)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer font-semibold text-brand-pink">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-brand-pink"
                    />
                    <span>แทนที่ทั้งหมด (Replace All)</span>
                  </label>
                </div>

                {/* Preview Cards */}
                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {importParsed.data.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white border border-brand-border/60 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-brand-text line-clamp-1">
                          {idx + 1}. {item.title || '(ไม่มีชื่อบทความ)'}
                        </span>
                        <Badge variant="yellow" size="sm">{item.category || 'ทั่วไป'}</Badge>
                      </div>
                      {item.excerpt && (
                        <p className="text-[11px] text-brand-text-muted line-clamp-1 mb-1.5">
                          {item.excerpt}
                        </p>
                      )}
                      <div className="text-[11px] text-neutral-600 bg-brand-cream/30 p-2 rounded-lg font-mono line-clamp-2">
                        {item.content || '(ไม่มีเนื้อหา)'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-3 border-t border-brand-border/60 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownloadCsvTemplate}
                  className="text-xs text-brand-text-muted hover:text-brand-blue underline inline-flex items-center gap-1"
                >
                  <Download className="w-3 h-3" />
                  <span>โหลดแม่แบบ Excel (.csv)</span>
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setImportModalOpen(false);
                    setImportParsed(null);
                    setImportError(null);
                  }}
                >
                  ยกเลิก
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  icon={Check}
                  disabled={!importParsed || !importParsed.data || importParsed.data.length === 0}
                  onClick={handleApplyImport}
                >
                  ยืนยันนำเข้า {importParsed?.data?.length ? `(${importParsed.data.length} บทความ)` : ''}
                </Button>
              </div>
            </div>
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
