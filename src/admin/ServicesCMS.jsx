import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  Save, 
  X,
  Clock,
  Layers
} from 'lucide-react';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import LoadingState from '../components/common/LoadingState';
import { storage } from '../services/storage';

export default function ServicesCMS() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  
  // Edit / Create Modal State
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'กิจกรรมบำบัด',
    shortDescription: '',
    description: '',
    targetAge: '',
    suitableFor: '',
    benefits: '',
    duration: '50 นาที',
    price: '',
    showPrice: false,
    status: 'published'
  });

  // Delete Dialog State
  const [deletingId, setDeletingId] = useState(null);

  const categories = [
    'ทั้งหมด',
    'การประเมินพัฒนาการ',
    'กิจกรรมบำบัด',
    'Sensory Integration',
    'สมาธิและ Executive Functions',
    'ทักษะการเรียนรู้',
    'ทักษะชีวิตประจำวัน'
  ];

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await storage.getServices();
      setServices(data);
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenCreate = () => {
    setEditingService('new');
    setFormData({
      title: '',
      slug: '',
      category: 'กิจกรรมบำบัด',
      shortDescription: '',
      description: '',
      targetAge: 'แรกเกิด – 12 ปี',
      suitableFor: '',
      benefits: '',
      duration: '50 นาที',
      price: '',
      showPrice: false,
      status: 'published'
    });
  };

  const handleOpenEdit = (service) => {
    setEditingService(service.id);
    setFormData({
      ...service,
      price: service.price !== null && service.price !== undefined ? service.price : ''
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const servicePayload = {
      ...formData,
      price: formData.showPrice && formData.price ? Number(formData.price) : null,
      slug: formData.slug || formData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `service-${Date.now()}`
    };

    if (editingService !== 'new') {
      servicePayload.id = editingService;
    }

    await storage.saveService(servicePayload);
    setEditingService(null);
    loadServices();
  };

  const handleTogglePublish = async (service) => {
    const updated = {
      ...service,
      status: service.status === 'published' ? 'draft' : 'published'
    };
    await storage.saveService(updated);
    loadServices();
  };

  const handleDelete = async () => {
    if (deletingId) {
      await storage.deleteService(deletingId);
      setDeletingId(null);
      loadServices();
    }
  };

  const filtered = services.filter(s => {
    const matchCat = selectedCategory === 'ทั้งหมด' || s.category === selectedCategory;
    const matchSearch = search.trim() === '' || s.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text">จัดการบริการ (Services CMS)</h1>
          <p className="text-xs sm:text-sm text-brand-text-muted">
            เพิ่ม แก้ไข ลบ จัดการการเผยแพร่ และข้อมูลบริการของคลินิก
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenCreate}
          className="font-semibold shadow-sm"
        >
          เพิ่มบริการใหม่
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
            placeholder="ค้นหาชื่อบริการ..."
            className="w-full pl-9 pr-4 py-1.5 rounded-xl border border-brand-border bg-brand-warm-white text-xs focus:bg-white focus:border-brand-blue focus-visible:outline-none"
          />
        </div>
      </div>

      {/* Services Table */}
      {loading ? (
        <LoadingState message="กำลังโหลดรายการบริการ..." />
      ) : (
        <div className="bg-white rounded-3xl border border-brand-border shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-cream/60 border-b border-brand-border text-xs uppercase tracking-wider text-brand-text font-semibold">
                <tr>
                  <th className="px-6 py-4">ลำดับ</th>
                  <th className="px-6 py-4">ชื่อบริการ</th>
                  <th className="px-6 py-4">หมวดหมู่</th>
                  <th className="px-6 py-4">ช่วงวัย & เวลา</th>
                  <th className="px-6 py-4">ราคา</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border/60">
                {filtered.map((service, idx) => (
                  <tr key={service.id} className="hover:bg-brand-warm-white/60 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-brand-text-muted">
                      {idx + 1}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-brand-text">{service.title}</div>
                      <div className="text-xs text-brand-text-muted line-clamp-1">{service.shortDescription}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="blue" size="sm">{service.category}</Badge>
                    </td>
                    <td className="px-6 py-4 text-xs text-brand-text-muted">
                      <div>{service.targetAge}</div>
                      <div>{service.duration}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {service.showPrice && service.price ? (
                        <span className="font-semibold text-brand-brown">฿{service.price.toLocaleString()}</span>
                      ) : (
                        <span className="text-neutral-400">ปิดแสดงราคา</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleTogglePublish(service)}
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border transition-colors ${
                          service.status === 'published'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                      >
                        {service.status === 'published' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        <span>{service.status === 'published' ? 'เผยแพร่' : 'ฉบับร่าง'}</span>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(service)}
                          className="p-1.5 rounded-lg text-neutral-500 hover:text-brand-brown hover:bg-brand-cream transition-colors"
                          title="แก้ไข"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingId(service.id)}
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

      {/* Service Create/Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-simple">
          <div className="bg-white rounded-3xl border border-brand-border shadow-soft-xl max-w-2xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto animate-fade-in">
            <button
              onClick={() => setEditingService(null)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-brand-text p-1.5 rounded-xl hover:bg-brand-cream transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-brand-text mb-4">
              {editingService === 'new' ? 'เพิ่มบริการใหม่' : 'แก้ไขบริการ'}
            </h2>

            <form onSubmit={handleSave} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    ชื่อบริการ <span className="text-brand-pink">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="เช่น กิจกรรมบำบัด"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    หมวดหมู่บริการ <span className="text-brand-pink">*</span>
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  คำอธิบายสั้น (Short Description)
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="ข้อความสรุป 1-2 บรรทัดสำหรับแสดงบนการ์ด"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  รายละเอียดบริการฉบับเต็ม (Full Description)
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="อธิบายขั้นตอน กิจกรรม และรายละเอียดของบริการ..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    ช่วงวัยเป้าหมาย (Target Age)
                  </label>
                  <input
                    type="text"
                    value={formData.targetAge}
                    onChange={(e) => setFormData({ ...formData, targetAge: e.target.value })}
                    placeholder="เช่น แรกเกิด – 12 ปี"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    ระยะเวลาต่อครั้ง (Duration)
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="เช่น 50 – 60 นาที"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    เหมาะสำหรับ (Suitable For)
                  </label>
                  <input
                    type="text"
                    value={formData.suitableFor}
                    onChange={(e) => setFormData({ ...formData, suitableFor: e.target.value })}
                    placeholder="เช่น เด็กที่ไวต่อสัมผัส หรือมีสมาธิสั้น"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-brand-text mb-1">
                    ประโยชน์ที่ได้รับ (Benefits)
                  </label>
                  <input
                    type="text"
                    value={formData.benefits}
                    onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
                    placeholder="เช่น ช่วยเพิ่มความมั่นใจในการทำกิจวัตร"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                  />
                </div>
              </div>

              {/* Price toggle (per requirement: price can be toggled, do NOT invent price if none) */}
              <div className="p-4 rounded-2xl bg-brand-warm-white border border-brand-border space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-brand-text block text-xs">เปิด/ปิดการแสดงราคา</span>
                    <span className="text-[11px] text-brand-text-muted">หากไม่มีข้อมูลราคาที่แน่นอน แนะนำให้ปิดไว้</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showPrice}
                      onChange={(e) => setFormData({ ...formData, showPrice: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                  </label>
                </div>

                {formData.showPrice && (
                  <div>
                    <label className="block text-xs font-semibold text-brand-text mb-1">
                      ราคา (บาท)
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="เช่น 800"
                      className="w-full px-3.5 py-2 rounded-xl border border-brand-border bg-white focus:border-brand-blue focus-visible:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="block text-xs font-semibold text-brand-text mb-1">
                  สถานะการเผยแพร่
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-brand-border focus:border-brand-blue focus-visible:outline-none"
                >
                  <option value="published">เผยแพร่ทันที (Published)</option>
                  <option value="draft">บันทึกเป็นฉบับร่าง (Draft)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-brand-border/60 flex items-center justify-end gap-3">
                <Button variant="ghost" size="md" onClick={() => setEditingService(null)}>
                  ยกเลิก
                </Button>
                <Button type="submit" variant="primary" size="md" icon={Save}>
                  บันทึกข้อมูล
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingId)}
        title="ยืนยันการลบบริการ"
        message="คุณแน่ใจหรือไม่ว่าต้องการลบบริการนี้ออกจากระบบ? บริการนี้จะไม่ปรากฏบนหน้าเว็บไซต์อีกต่อไป"
        confirmLabel="ลบบริการ"
        confirmVariant="pink"
        onConfirm={handleDelete}
        onCancel={() => setDeletingId(null)}
      />

    </div>
  );
}
