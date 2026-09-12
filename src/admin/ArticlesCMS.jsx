import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, BookOpen, Eye, EyeOff, Calendar } from 'lucide-react';
import Swal from 'sweetalert2';
import { db } from '../utils/db';
import { t } from '../utils/helpers';

export default function ArticlesCMS({ lang }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title_th: '',
    title_en: '',
    slug: '',
    excerpt_th: '',
    excerpt_en: '',
    content_th: '',
    content_en: '',
    cover_image_url: '',
    category_th: 'ความรู้ทั่วไป',
    category_en: 'General Knowledge',
    author: 'นักกิจกรรมบำบัดวิชาชีพ',
    published_date: new Date().toISOString().split('T')[0],
    status: 'draft'
  });

  const loadArticles = async () => {
    setLoading(true);
    const data = await db.getArticles(true); // include drafts
    setArticles(data);
    setLoading(false);
  };

  useEffect(() => {
    loadArticles();
  }, []);

  // Slug generator helper
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u0e00-\u0e7f\s-]/g, '') // Keep English, Thai, and space/hyphen
      .replace(/\s+/g, '-') // Replace space with hyphen
      .replace(/-+/g, '-'); // Remove duplicate hyphens
  };

  const handleTitleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Auto-generate slug when title_en is edited and it's a new article
      if (name === 'title_en' && !editingId) {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title_th: '',
      title_en: '',
      slug: '',
      excerpt_th: '',
      excerpt_en: '',
      content_th: '',
      content_en: '',
      cover_image_url: '',
      category_th: 'ความรู้ทั่วไป',
      category_en: 'General Knowledge',
      author: 'นักกิจกรรมบำบัดวิชาชีพ',
      published_date: new Date().toISOString().split('T')[0],
      status: 'draft'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (article) => {
    setEditingId(article.id);
    setFormData({
      title_th: article.title_th || '',
      title_en: article.title_en || '',
      slug: article.slug || '',
      excerpt_th: article.excerpt_th || '',
      excerpt_en: article.excerpt_en || '',
      content_th: article.content_th || '',
      content_en: article.content_en || '',
      cover_image_url: article.cover_image_url || '',
      category_th: article.category_th || 'ความรู้ทั่วไป',
      category_en: article.category_en || 'General Knowledge',
      author: article.author || 'นักกิจกรรมบำบัดวิชาชีพ',
      published_date: article.published_date || new Date().toISOString().split('T')[0],
      status: article.status || 'draft'
    });
    setIsModalOpen(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, cover_image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: editingId ? 'กำลังบันทึกการแก้ไข...' : 'กำลังเผยแพร่บทความ...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      if (editingId) {
        await db.updateArticle(editingId, formData);
      } else {
        await db.createArticle(formData);
      }
      setIsModalOpen(false);
      loadArticles();
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: editingId ? 'แก้ไขข้อมูลบทความสำเร็จ' : 'สร้างรายการบทความสำเร็จ',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถจัดเก็บข้อมูลได้ กรุณาลองใหม่อีกครั้งครับ',
        confirmButtonColor: '#C8A97E'
      });
    }
  };

  const handleDeleteArticle = (id) => {
    Swal.fire({
      title: 'คุณต้องการลบบทความนี้หรือไม่?',
      text: 'เมื่อลบแล้วจะไม่สามารถเรียกคืนข้อมูลรายการนี้ได้อีก',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#F4C7C3',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'ใช่, ต้องการลบ',
      cancelButtonText: 'ยกเลิก',
      customClass: {
        confirmButton: 'bg-clinicPink-dark text-white rounded-xl font-bold px-6 py-3',
        cancelButton: 'bg-clinicMuted text-white rounded-xl font-bold px-6 py-3 ml-2'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'กำลังลบข้อมูล...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });
        
        try {
          await db.deleteArticle(id);
          loadArticles();
          Swal.close();
          Swal.fire({
            icon: 'success',
            title: 'ลบรายการเรียบร้อยแล้ว',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000
          });
        } catch (err) {
          console.error(err);
          Swal.fire({
            icon: 'error',
            title: 'ลบไม่สำเร็จ',
            text: 'เกิดข้อผิดพลาดทางเทคนิค กรุณาลองใหม่อีกครั้ง',
            confirmButtonColor: '#C8A97E'
          });
        }
      }
    });
  };

  return (
    <div className="p-8 space-y-8 text-left max-w-6xl">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-primary/10">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-clinicText">
            จัดการบทความและคลังความรู้
          </h1>
          <p className="text-xxs sm:text-xs text-clinicMuted">
            เขียนบทความใหม่ ปรับหมวดหมู่ความรู้ หรือร่างบทความค้างไว้เพื่อตรวจสอบก่อนเผยแพร่
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          เขียนบทความใหม่
        </button>
      </div>

      {/* Articles Table List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <h3 className="font-bold text-clinicText">ยังไม่มีบทความความรู้</h3>
          <p className="text-xs text-clinicMuted mt-1">กดปุ่มเขียนบทความใหม่ที่มุมขวาบนเพื่อเริ่มต้นเผยแพร่สาระดี ๆ ครับ</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-clinicBg/50 text-clinicText text-xs font-bold uppercase tracking-wider border-b border-primary/10">
                  <th className="p-4 sm:p-5">วันที่เผยแพร่</th>
                  <th className="p-4 sm:p-5">ภาพหน้าปก</th>
                  <th className="p-4 sm:p-5">ชื่อบทความ (ไทย)</th>
                  <th className="p-4 sm:p-5">หมวดหมู่</th>
                  <th className="p-4 sm:p-5">สถานะ</th>
                  <th className="p-4 sm:p-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-xs sm:text-sm text-clinicText">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-clinicBg/20 transition-colors">
                    <td className="p-4 sm:p-5 text-clinicMuted whitespace-nowrap">
                      {article.published_date}
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="w-12 h-9 rounded-lg overflow-hidden bg-clinicBg shrink-0 border border-primary/10">
                        {article.cover_image_url ? (
                          <img src={article.cover_image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-clinicMuted">No Cover</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 font-bold max-w-xs truncate">
                      {article.title_th}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="bg-primary/10 text-primary-dark px-2.5 py-0.5 rounded-full text-xxs font-bold">
                        {article.category_th}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xxs font-bold ${
                        article.status === 'published'
                          ? 'bg-clinicGreen/10 text-clinicGreen-dark'
                          : 'bg-primary/10 text-primary-dark'
                      }`}>
                        {article.status === 'published' ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Draft
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(article)}
                        className="p-2 rounded-lg bg-clinicBg hover:bg-primary/15 text-clinicText hover:text-primary-dark transition-all inline-flex"
                        title="แก้ไขบทความ"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        className="p-2 rounded-lg bg-clinicPink-light/20 hover:bg-clinicPink/60 text-clinicPink-dark hover:text-white transition-all inline-flex"
                        title="ลบบทความ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Modal Form Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white rounded-3xl border border-primary/10 shadow-2xl p-6 sm:p-8 w-full max-w-4xl text-left space-y-6 max-h-[90vh] overflow-y-auto animate-soft-scale">
            
            <div className="pb-4 border-b border-primary/10 flex justify-between items-center">
              <h2 className="text-lg sm:text-xl font-extrabold text-clinicText">
                {editingId ? 'แก้ไขข้อมูลบทความ' : 'เขียนบทความความรู้ใหม่'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">ชื่อบทความภาษาไทย</label>
                  <input
                    type="text"
                    name="title_th"
                    value={formData.title_th}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">ชื่อบทความภาษาอังกฤษ (English Title)</label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleTitleChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">Slug URL (ลิงก์เข้าถึง)</label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                  <p className="text-[9px] text-clinicMuted">แนะนำให้ใช้พิมพ์เล็กและเชื่อมด้วยเครื่องหมายลบ เช่น "pencil-grasp-tips"</p>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">ผู้เขียน (Author)</label>
                  <input
                    type="text"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">เรื่องย่อเกริ่นนำภาษาไทย</label>
                  <textarea
                    name="excerpt_th"
                    rows="2"
                    value={formData.excerpt_th}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">เรื่องย่อเกริ่นนำภาษาอังกฤษ</label>
                  <textarea
                    name="excerpt_en"
                    rows="2"
                    value={formData.excerpt_en}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">เนื้อหาบทความแบบละเอียด (ไทย) - รองรับ Markdown</label>
                  <textarea
                    name="content_th"
                    rows="8"
                    value={formData.content_th}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs font-mono text-clinicText focus:outline-none focus:border-primary shadow-sm"
                    placeholder="ป้อนเนื้อหา รองรับ ## หัวข้อ และ * รายการ..."
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">เนื้อหาบทความแบบละเอียด (English) - รองรับ Markdown</label>
                  <textarea
                    name="content_en"
                    rows="8"
                    value={formData.content_en}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs font-mono text-clinicText focus:outline-none focus:border-primary shadow-sm"
                    placeholder="Enter English content..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-clinicText block">รูปปกบทความ</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-clinicMuted w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">หมวดหมู่ภาษาไทย</label>
                  <input
                    type="text"
                    name="category_th"
                    value={formData.category_th}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">หมวดหมู่ภาษาอังกฤษ</label>
                  <input
                    type="text"
                    name="category_en"
                    value={formData.category_en}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">วันที่เผยแพร่</label>
                  <input
                    type="date"
                    name="published_date"
                    value={formData.published_date}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">สถานะการแสดงผล</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm bg-white"
                  >
                    <option value="draft">Draft (ฉบับร่าง ยังไม่เผยแพร่)</option>
                    <option value="published">Published (เผยแพร่ต่อสาธารณะ)</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-clinicBg hover:bg-primary/5 text-clinicText border border-primary/10 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark text-white font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-sm"
                >
                  บันทึกบทความ
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
