import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatCurrency, handleFirestoreError, OperationType } from '../../lib/utils';
import { Plus, Search, MoreVertical, Trash2, Edit3, X, Image as ImageIcon, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SEED_PRODUCTS = [
  { name_ar: 'آيفون 15 برو - 256 جيجا', price: 5400, stock: 25, currency: 'SAR', categoryId: 'electronics', description_ar: 'أقوى آيفون على الإطلاق بمعالج A17 Pro وكاميرا متطورة.' },
  { name_ar: 'ساعة آبل الجيل التاسع', price: 1800, stock: 40, currency: 'SAR', categoryId: 'electronics', description_ar: 'ساعة ذكية متطورة تتبع صحتك ولياقتك بدقة.' },
  { name_ar: 'سماعات سوني WH-1000XM5', price: 1200, stock: 15, currency: 'SAR', categoryId: 'electronics', description_ar: 'أفضل تجربة لإلغاء الضوضاء في العالم.' },
  { name_ar: 'ماك بوك اير M3', price: 6200, stock: 10, currency: 'SAR', categoryId: 'electronics', description_ar: 'نحيف، سريع، وبطارية تدوم طوال اليوم.' },
  { name_ar: 'قهوة مختصة - إثيوبيا', price: 85, stock: 100, currency: 'SAR', categoryId: 'food', description_ar: 'حبوب قهوة كاملة محمصة بعناية.' },
];

export default function ProductsManager() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const initialForm = {
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: 0,
    currency: 'SAR',
    stock: 0,
    categoryId: 'general'
  };
  const [formData, setFormData] = useState(initialForm);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (product: any) => {
    setEditingId(product.id);
    setFormData({
      name_ar: product.name_ar || '',
      name_en: product.name_en || '',
      description_ar: product.description_ar || '',
      description_en: product.description_en || '',
      price: product.price || 0,
      currency: product.currency || 'SAR',
      stock: product.stock || 0,
      categoryId: product.categoryId || 'general'
    });
    setIsModalOpen(true);
  };

  const handleSeed = async () => {
    if (!confirm('سيتم إضافة مجموعة من المنتجات التجريبية للمتجر. هل أنت متأكد؟')) return;
    setSeeding(true);
    const path = 'products';
    try {
      const batch = writeBatch(db);
      SEED_PRODUCTS.forEach((product) => {
        const docRef = doc(collection(db, path));
        batch.set(docRef, {
          ...product,
          rating: 4.5,
          reviewsCount: Math.floor(Math.random() * 50),
          createdAt: new Date().toISOString()
        });
      });
      await batch.commit();
      fetchProducts();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, path);
    } finally {
      setSeeding(false);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    const path = 'products';
    try {
      const q = query(collection(db, path), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, path);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const path = editingId ? `products/${editingId}` : 'products';
    try {
      if (editingId) {
        await updateDoc(doc(db, 'products', editingId), {
          ...formData,
          updatedAt: new Date().toISOString()
        });
      } else {
        await addDoc(collection(db, 'products'), {
          ...formData,
          rating: 0,
          reviewsCount: 0,
          createdAt: new Date().toISOString()
        });
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      handleFirestoreError(err, editingId ? OperationType.UPDATE : OperationType.CREATE, path);
    }
  };

  const handleDelete = async (id: string) => {
    alert('بدء عملية حذف المنتج: ' + id);
    const path = `products/${id}`;
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'products', id));
      alert('تم الحذف من قاعدة البيانات، جاري تحديث القائمة...');
      await fetchProducts();
      alert('تم تحديث القائمة بنجاح');
    } catch (err: any) {
      alert('خطأ في الحذف: ' + err.message);
      handleFirestoreError(err, OperationType.DELETE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة المنتجات</h1>
          <p className="text-gray-500">لديك {products.length} منتج نشط في المتجر</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSeed}
            disabled={seeding}
            className="text-gray-500 hover:text-orange-500 font-bold flex items-center gap-2 px-4 py-3 rounded-2xl bg-gray-50 hover:bg-orange-50 transition-all disabled:opacity-50"
          >
            <Database className="w-5 h-5" />
            {seeding ? 'جاري الإضافة...' : 'إضافة منتجات تجريبية'}
          </button>
          <button 
            onClick={openAddModal}
            className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition-all"
          >
            <Plus className="w-5 h-5" />
            إضافة منتج جديد
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
          <div className="flex-grow relative">
            <input 
              type="text" 
              placeholder="البحث عن منتج..." 
              className="w-full bg-gray-50 border-none rounded-xl px-12 h-12"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 text-sm font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">المنتج</th>
                <th className="px-6 py-4">التصنيف</th>
                <th className="px-6 py-4">السعر</th>
                <th className="px-6 py-4">المخزون</th>
                <th className="px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                        {p.images?.[0] ? <img src={p.images[0]} className="w-full h-full object-cover" /> : <ImageIcon className="w-full h-full p-3 text-gray-400" />}
                      </div>
                      <span className="font-bold text-gray-900">{p.name_ar}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">{p.categoryId}</td>
                  <td className="px-6 py-4 font-black">{formatCurrency(p.price, p.currency)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${p.stock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {p.stock} قطعة
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </button>
                      <button 
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
                            await handleDelete(p.id);
                          }
                        }} 
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all cursor-pointer relative z-10 font-bold text-xs"
                        title="حذف المنتج"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 pointer-events-none" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative overflow-y-auto max-h-[90vh]"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-6 left-6 text-gray-400 hover:text-gray-900"
              >
                <X className="w-6 h-6" />
              </button>
              
              <h2 className="text-2xl font-bold mb-8">
                {editingId ? 'تعديل المنتج' : 'إضافة منتج جديد'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold">اسم المنتج (عربي)</label>
                    <input required type="text" value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl h-12 px-4 focus:ring-2 focus:ring-orange-500 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">اسم المنتج (English)</label>
                    <input type="text" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl h-12 px-4" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-bold">الوصف</label>
                    <textarea value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} className="w-full bg-gray-50 border-none rounded-2xl p-4 h-32" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">السعر</label>
                    <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-gray-50 border-none rounded-2xl h-12 px-4" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold">المخزون</label>
                    <input required type="number" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full bg-gray-50 border-none rounded-2xl h-12 px-4" />
                  </div>
                </div>
                
                <button type="submit" className="w-full bg-orange-500 text-white h-14 rounded-2xl font-bold text-lg hover:bg-orange-600 shadow-lg transition-all active:scale-95 mt-4">
                  {editingId ? 'تعديل بيانات المنتج' : 'حفظ المنتج في المتجر'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
