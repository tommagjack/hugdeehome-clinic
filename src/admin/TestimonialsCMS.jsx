import { useState, useEffect } from 'react';
import { Pencil, Trash2, Plus, Heart, Eye, EyeOff } from 'lucide-react';
import Swal from 'sweetalert2';
import { db } from '../utils/db';
import { t } from '../utils/helpers';

export default function TestimonialsCMS({ lang }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name_th: '',
    name_en: '',
    content_th: '',
    content_en: '',
    image_url: '',
    status: 'active',
    display_order: 0
  });

  const loadTestimonials = async () => {
    setLoading(true);
    const data = await db.getTestimonials(true); // include inactive
    setTestimonials(data);
    setLoading(false);
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({
      name_th: '',
      name_en: '',
      content_th: '',
      content_en: '',
      image_url: '',
      status: 'active',
      display_order: testimonials.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      name_th: item.name_th || '',
      name_en: item.name_en || '',
      content_th: item.content_th || '',
      content_en: item.content_en || '',
      image_url: item.image_url || '',
      status: item.status || 'active',
      display_order: item.display_order || 0
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
      title: editingId ? 'กำลังบันทึกการแก้ไข...' : 'กำลังสร้างรีวิวใหม่...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      if (editingId) {
        await db.updateTestimonial(editingId, formData);
      } else {
        await db.createTestimonial(formData);
      }
      setIsModalOpen(false);
      loadTestimonials();
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: editingId ? 'แก้ไขข้อมูลรีวิวสำเร็จ' : 'สร้างรายการรีวิวสำเร็จ',
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

  const handleDeleteTestimonial = (id) => {
    Swal.fire({
      title: 'คุณต้องการลบรีวิวนี้หรือไม่?',
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
          await db.deleteTestimonial(id);
          loadTestimonials();
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
            จัดการเสียงจากผู้ปกครอง (Testimonials)
          </h1>
          <p className="text-xxs sm:text-xs text-clinicMuted">
            เพิ่มความมั่นใจให้ผู้ปกครองรายใหม่ ด้วยการแสดงความคิดเห็น ความก้าวหน้า และเรื่องราวความประทับใจจริง
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary hover:bg-primary-dark text-white font-bold px-5 py-3 rounded-2xl flex items-center justify-center gap-2 text-xs sm:text-sm shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          เขียนรีวิวใหม่
        </button>
      </div>

      {/* Testimonials Table List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-primary/5 max-w-md mx-auto">
          <Heart className="w-12 h-12 text-primary/30 mx-auto mb-4" />
          <h3 className="font-bold text-clinicText">ยังไม่มีประวัติรีวิว</h3>
          <p className="text-xs text-clinicMuted mt-1">กดปุ่มเขียนรีวิวใหม่ด้านบนเพื่อเพิ่มคำนิยมจากผู้ปกครองจริงได้เลยครับ</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-primary/5 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-clinicBg/50 text-clinicText text-xs font-bold uppercase tracking-wider border-b border-primary/10">
                  <th className="p-4 sm:p-5">ลำดับ</th>
                  <th className="p-4 sm:p-5">ผู้รีวิว (Avatar)</th>
                  <th className="p-4 sm:p-5">ชื่อผู้ปกครอง (ไทย)</th>
                  <th className="p-4 sm:p-5">เนื้อหาคำนิยมบางส่วน</th>
                  <th className="p-4 sm:p-5">สถานะ</th>
                  <th className="p-4 sm:p-5 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/5 text-xs sm:text-sm text-clinicText">
                {testimonials.map((item) => (
                  <tr key={item.id} className="hover:bg-clinicBg/20 transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-clinicMuted">
                      {item.display_order}
                    </td>
                    <td className="p-4 sm:p-5">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-clinicBg border border-primary/10 shrink-0">
                        {item.image_url ? (
                          <img src={item.image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-clinicMuted">Avatar</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4 sm:p-5 font-bold">
                      {item.name_th}
                    </td>
                    <td className="p-4 sm:p-5 text-clinicMuted max-w-xs truncate">
                      {item.content_th}
                    </td>
                    <td className="p-4 sm:p-5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xxs font-bold ${
                        item.status === 'active'
                          ? 'bg-clinicGreen/10 text-clinicGreen-dark'
                          : 'bg-clinicMuted/15 text-clinicMuted'
                      }`}>
                        {item.status === 'active' ? (
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
                        onClick={() => handleOpenEditModal(item)}
                        className="p-2 rounded-lg bg-clinicBg hover:bg-primary/15 text-clinicText hover:text-primary-dark transition-all inline-flex"
                        title="แก้ไขรีวิว"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(item.id)}
                        className="p-2 rounded-lg bg-clinicPink-light/20 hover:bg-clinicPink/60 text-clinicPink-dark hover:text-white transition-all inline-flex"
                        title="ลบรีวิว"
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
                {editingId ? 'แก้ไขคำนิยมรีวิว' : 'เพิ่มรีวิวผู้ปกครองใหม่'}
              </h2>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">ชื่อผู้แสดงความคิดเห็น (ไทย)</label>
                  <input
                    type="text"
                    name="name_th"
                    value={formData.name_th}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                    placeholder="เช่น คุณแม่น้องปันปัน"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">ชื่อผู้แสดงความคิดเห็น (English)</label>
                  <input
                    type="text"
                    name="name_en"
                    value={formData.name_en}
                    onChange={handleInputChange}
                    required
                    className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-clinicText block">ข้อความคำนิยมภาษาไทย</label>
                <textarea
                  name="content_th"
                  rows="4"
                  value={formData.content_th}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-clinicText block">ข้อความคำนิยมภาษาอังกฤษ</label>
                <textarea
                  name="content_en"
                  rows="4"
                  value={formData.content_en}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-xl border border-primary/15 p-3 text-xs sm:text-sm text-clinicText focus:outline-none focus:border-primary shadow-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-clinicText block">รูปโปรไฟล์ผู้ปกครอง</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-clinicMuted w-full"
                  />
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
                  บันทึกคำนิยม
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
