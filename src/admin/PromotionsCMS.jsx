import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Tag, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { db } from '../utils/db';
import { t } from '../utils/helpers';

export default function PromotionsCMS({ lang }) {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title_th: '',
    title_en: '',
    description_th: '',
    description_en: '',
    original_price: '',
    promotion_price: '',
    image_url: '',
    start_date: '',
    end_date: '',
    cta_link: '#/contact',
    status: 'active'
  });

  const loadPromotions = async () => {
    setLoading(true);
    const data = await db.getPromotions(true); // include inactive
    setPromotions(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPromotions();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      title_th: '',
      title_en: '',
      description_th: '',
      description_en: '',
      original_price: '',
      promotion_price: '',
      image_url: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: '',
      cta_link: '#/contact',
      status: 'active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (promo) => {
    setEditingId(promo.id);
    setFormData({
      title_th: promo.title_th || '',
      title_en: promo.title_en || '',
      description_th: promo.description_th || '',
      description_en: promo.description_en || '',
      original_price: promo.original_price || '',
      promotion_price: promo.promotion_price || '',
      image_url: promo.image_url || '',
      start_date: promo.start_date || '',
      end_date: promo.end_date || '',
      cta_link: promo.cta_link || '#/contact',
      status: promo.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image_url: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    Swal.fire({
      title: editingId ? 'กำลังบันทึกการแก้ไข...' : 'กำลังสร้างโปรโมชั่นใหม่...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      if (editingId) {
        await db.updatePromotion(editingId, formData);
      } else {
        await db.createPromotion(formData);
      }
      setIsModalOpen(false);
      loadPromotions();
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: editingId ? 'แก้ไขโปรโมชั่นสำเร็จ' : 'สร้างโปรโมชั่นสำเร็จ',
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

  const handleDeletePromotion = (id) => {
    Swal.fire({
      title: 'คุณต้องการลบโปรโมชั่นนี้หรือไม่?',
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
          await db.deletePromotion(id);
          loadPromotions();
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
            จัดการโปรโมชั่นคลินิก
          </h1>
          <p className="text-xxs sm:text-xs text-clinicMuted">
            เพิ่มแพ็กเกจราคาพิเศษ กำหนดวันหมดเขต เพื่อกระตุ้นนัดหมายและการตัดสินใจของผู้ปกครอง
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          สร้างโปรโมชั่นใหม่
        </button>
      </div>

      {/* Promotions Table List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : promotions.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 max-w-md mx-auto">
          <Tag className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <h3 className="font-bold text-clinicText">ยังไม่มีรายการโปรโมชั่น</h3>
          <p className="text-xs text-clinicMuted mt-1">กดปุ่มสร้างโปรโมชั่นใหม่ที่มุมขวาบนเพื่อระบุราคาแพ็กเกจพิเศษครับ</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-clinicBg/50 text-clinicText text-xs font-bold uppercase tracking-wider border-b border-primary/10">
                  <th className="p-4 sm:p-5">ภาพ</th>
                  <th className="p-4 sm:p-5">หัวข้อโปรโมชั่น (ไทย)</th>
                  <th className="p-4 sm:p-5">ราคาเดิม</th>
                  <th className="p-4 sm:p-5">ราคาลด</th>
                  <th className="p-4 sm:p-5">หมดเขต</th>
                  <th className="p-4 sm:p-5">สถานะ</th>
                  <th className="p-4 sm:p-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-xs sm:text-sm text-clinicText">
                {promotions.map((promo) => (
                  <tr key={promo.id} className="hover:bg-clinicBg/20 transition-colors">
                    <td className="p-4 sm:p-5">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-clinicBg border border-primary/10 shrink-0">
                        {promo.image_url ? (
                          <img src={promo.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-clinicMuted">No Image</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 font-bold">
                      {promo.title_th}
                    </td>
                    <td className="p-4 sm:p-5 text-clinicMuted line-through">
                      {promo.original_price ? `฿${parseFloat(promo.original_price).toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-primary-dark">
                      {promo.promotion_price ? `฿${parseFloat(promo.promotion_price).toLocaleString()}` : '-'}
                    </td>
                    <td className="p-4 sm:p-5 text-clinicMuted whitespace-nowrap">
                      {promo.end_date || 'ไม่มีกำหนด'}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xxs font-bold ${
                        promo.status === 'active'
                          ? 'bg-clinicGreen/10 text-clinicGreen-dark'
                          : 'bg-clinicMuted/15 text-clinicMuted'
                      }`}>
                        {promo.status === 'active' ? (
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
                        onClick={() => handleOpenEditModal(promo)}
                        className="p-2 rounded-lg bg-clinicBg hover:bg-primary/15 text-clinicText hover:text-primary-dark transition-all inline-flex"
                        title="แก้ไขโปรโมชั่น"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeletePromotion(promo.id)}
                        className="p-2 rounded-lg bg-clinicPink-light/20 hover:bg-clinicPink/60 text-clinicPink-dark hover:text-white transition-all inline-flex"
                        title="ลบโปรโมชั่น"
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
                {editingId ? 'แก้ไขข้อมูลโปรโมชั่น' : 'สร้างโปรโมชั่นราคาพิเศษใหม่'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">หัวข้อโปรโมชั่นภาษาไทย</label>
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
                  <label className="text-xs font-bold text-clinicText block">หัวข้อโปรโมชั่นภาษาอังกฤษ</label>
                  <input
                    type="text"
                    name="title_en"
                    value={formData.title_en}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">รายละเอียดโปรโมชั่นภาษาไทย</label>
                  <textarea
                    name="description_th"
                    rows="3"
                    value={formData.description_th}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">รายละเอียดโปรโมชั่นภาษาอังกฤษ</label>
                  <textarea
                    name="description_en"
                    rows="3"
                    value={formData.description_en}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">ราคาปกติ (บาท)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="original_price"
                    value={formData.original_price}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">ราคาโปรโมชั่นพิเศษ</label>
                  <input
                    type="number"
                    step="0.01"
                    name="promotion_price"
                    value={formData.promotion_price}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">รูปโปรโมชั่น</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-clinicMuted w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">วันที่เริ่มต้นโปรโมชั่น</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">วันที่สิ้นสุดโปรโมชั่น</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">ลิงก์ปุ่มกด (CTA Link)</label>
                  <input
                    type="text"
                    name="cta_link"
                    value={formData.cta_link}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">สถานะการแสดงผล</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm bg-white"
                  >
                    <option value="active">Active (เปิดใช้งาน)</option>
                    <option value="inactive">Inactive (ปิดใช้งาน)</option>
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
                  บันทึกโปรโมชั่น
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
