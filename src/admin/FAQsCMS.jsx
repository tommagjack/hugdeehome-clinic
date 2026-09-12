import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, HelpCircle, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { db } from '../utils/db';
import { t } from '../utils/helpers';

export default function FAQsCMS({ lang }) {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    question_th: '',
    question_en: '',
    answer_th: '',
    answer_en: '',
    category: 'ข้อมูลทั่วไป',
    display_order: 0,
    status: 'active'
  });

  const categories = ['ข้อมูลทั่วไป', 'ขั้นตอนการรับบริการ', 'การเตรียมตัว', 'ค่าธรรมเนียม'];

  const loadFAQs = async () => {
    setLoading(true);
    const data = await db.getFAQs(true); // include inactive
    setFaqs(data);
    setLoading(false);
  };

  useEffect(() => {
    loadFAQs();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      question_th: '',
      question_en: '',
      answer_th: '',
      answer_en: '',
      category: 'ข้อมูลทั่วไป',
      display_order: faqs.length + 1,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (faq) => {
    setEditingId(faq.id);
    setFormData({
      question_th: faq.question_th || '',
      question_en: faq.question_en || '',
      answer_th: faq.answer_th || '',
      answer_en: faq.answer_en || '',
      category: faq.category || 'ข้อมูลทั่วไป',
      display_order: faq.display_order || 0,
      status: faq.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: editingId ? 'กำลังบันทึกการแก้ไข...' : 'กำลังบันทึกคำถามใหม่...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      if (editingId) {
        await db.updateFAQ(editingId, formData);
      } else {
        await db.createFAQ(formData);
      }
      setIsModalOpen(false);
      loadFAQs();
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: editingId ? 'แก้ไขคำถามพบบ่อยสำเร็จ' : 'สร้างคำถามพบบ่อยสำเร็จ',
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

  const handleDeleteFAQ = (id) => {
    Swal.fire({
      title: 'คุณต้องการลบคำถามนี้หรือไม่?',
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
          await db.deleteFAQ(id);
          loadFAQs();
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
            จัดการคำถามที่พบบ่อย (FAQs)
          </h1>
          <p className="text-xxs sm:text-xs text-clinicMuted">
            เพิ่มคำชี้แจงเพื่อแก้ไขความกังวลผู้ปกครองก่อนพาเด็กเข้าตรวจจริง เช่น เรื่องเวลา ค่าใช้จ่าย และผู้ปกครองเข้าร่วมห้องฝึก
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          เพิ่มข้อซักถามใหม่
        </button>
      </div>

      {/* FAQs Table List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : faqs.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 max-w-md mx-auto">
          <HelpCircle className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <h3 className="font-bold text-clinicText">ยังไม่มีคำถามบันทึกใน FAQ</h3>
          <p className="text-xs text-clinicMuted mt-1">กดปุ่มเพิ่มข้อซักถามใหม่ด้านบนเพื่อเขียนคำถามคำตอบเริ่มต้นกระตุ้นบริการครับ</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-clinicBg/50 text-clinicText text-xs font-bold uppercase tracking-wider border-b border-primary/10">
                  <th className="p-4 sm:p-5">ลำดับ</th>
                  <th className="p-4 sm:p-5">คำถาม (ไทย)</th>
                  <th className="p-4 sm:p-5">คำถาม (English)</th>
                  <th className="p-4 sm:p-5">หมวดหมู่</th>
                  <th className="p-4 sm:p-5">สถานะ</th>
                  <th className="p-4 sm:p-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-xs sm:text-sm text-clinicText">
                {faqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-clinicBg/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-clinicMuted">
                      {faq.display_order}
                    </td>
                    <td className="p-4 sm:p-5 font-bold max-w-xs truncate">
                      {faq.question_th}
                    </td>
                    <td className="p-4 sm:p-5 text-clinicMuted max-w-xs truncate">
                      {faq.question_en}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className="bg-primary/10 text-primary-dark px-2.5 py-0.5 rounded-full text-xxs font-bold">
                        {faq.category}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xxs font-bold ${
                        faq.status === 'active'
                          ? 'bg-clinicGreen/10 text-clinicGreen-dark'
                          : 'bg-clinicMuted/15 text-clinicMuted'
                      }`}>
                        {faq.status === 'active' ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 sm:p-5 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                      <button
                        onClick={() => handleOpenEditModal(faq)}
                        className="p-2 rounded-lg bg-clinicBg hover:bg-primary/15 text-clinicText hover:text-primary-dark transition-all inline-flex"
                        title="แก้ไขคำถาม"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="p-2 rounded-lg bg-clinicPink-light/20 hover:bg-clinicPink/60 text-clinicPink-dark hover:text-white transition-all inline-flex"
                        title="ลบคำถาม"
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
          <div className="bg-white rounded-3xl border border-primary/10 shadow-2xl p-6 sm:p-8 w-full max-w-2xl text-left space-y-6 max-h-[90vh] overflow-y-auto animate-soft-scale">
            
            <div className="pb-4 border-b border-primary/10">
              <h2 className="text-lg sm:text-xl font-extrabold text-clinicText">
                {editingId ? 'แก้ไขคำถามพบบ่อย' : 'เพิ่มข้อคำถามพบบ่อยใหม่'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">คำถามภาษาไทย</label>
                  <input
                    type="text"
                    name="question_th"
                    value={formData.question_th}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">คำถามภาษาอังกฤษ</label>
                  <input
                    type="text"
                    name="question_en"
                    value={formData.question_en}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-clinicText block">คำตอบคำอธิบายภาษาไทย</label>
                <textarea
                  name="answer_th"
                  rows="3"
                  value={formData.answer_th}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-clinicText block">คำตอบคำอธิบายภาษาอังกฤษ</label>
                <textarea
                  name="answer_en"
                  rows="3"
                  value={formData.answer_en}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">เลือกหมวดหมู่คำถาม</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm bg-white"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">ลำดับการแสดงผล</label>
                  <input
                    type="number"
                    name="display_order"
                    value={formData.display_order}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">สถานะ</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm bg-white"
                  >
                    <option value="active">Active (แสดง)</option>
                    <option value="inactive">Inactive (ซ่อน)</option>
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
                  บันทึกข้อมูล
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
