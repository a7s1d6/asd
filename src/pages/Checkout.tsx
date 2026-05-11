import React, { useState } from 'react';
import { useCart } from '../lib/CartContext';
import { useAuth } from '../lib/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { formatCurrency } from '../lib/utils';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CreditCard, Truck, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    phone: '',
    address: '',
    city: '',
    paymentMethod: 'card'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const orderData = {
        userId: user?.uid,
        items: cart,
        totalAmount: total,
        currency: cart[0]?.currency || 'SAR',
        status: 'pending',
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        paymentMethod: formData.paymentMethod,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'orders'), orderData);
      setSuccess(true);
      clearCart();
      setTimeout(() => navigate('/'), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-32 space-y-8 max-w-lg mx-auto">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-32 h-32 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500"
        >
          <CheckCircle2 className="w-16 h-16" />
        </motion.div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">تم تسجيل طلبك بنجاح!</h1>
          <p className="text-gray-500 italic">شكراً لتسوقك معنا. سنقوم بمعالجة طلبك قريباً وإرسال تفاصيل التتبع إلى بريدك الإلكتروني.</p>
        </div>
        <p className="text-sm text-gray-400">سيتم توجيهك للرئيسية خلال ثوانٍ...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold text-gray-900">إتمام الطلب</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Checkout Form */}
        <div className="space-y-8 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Truck className="w-5 h-5 text-orange-500" />
            معلومات الشحن
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">الاسم الكامل</label>
                <input 
                  required
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 h-14"
                  placeholder="محمد علي"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">رقم الجوال</label>
                <input 
                  required
                  type="tel" 
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 h-14"
                  placeholder="05xxxxxxx"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">العنوان بالتفصيل</label>
                <input 
                  required
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 h-14"
                  placeholder="اسم الشارع، رقم المبنى..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">المدينة</label>
                <input 
                  required
                  type="text" 
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full bg-gray-50 border-none rounded-2xl px-6 h-14"
                  placeholder="الرياض"
                />
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-gray-50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-500" />
                طريقة الدفع
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-gray-50 bg-gray-50'}`}>
                  <input type="radio" name="payment" value="card" checked={formData.paymentMethod === 'card'} onChange={() => setFormData({...formData, paymentMethod: 'card'})} className="hidden" />
                  <CreditCard className="w-8 h-8" />
                  <span className="font-bold">بطاقة ائتمانية</span>
                </label>
                <label className={`flex flex-col items-center gap-2 p-6 rounded-2xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50' : 'border-gray-50 bg-gray-50'}`}>
                  <input type="radio" name="payment" value="cash" checked={formData.paymentMethod === 'cash'} onChange={() => setFormData({...formData, paymentMethod: 'cash'})} className="hidden" />
                  <Truck className="w-8 h-8" />
                  <span className="font-bold">الدفع عند الاستلام</span>
                </label>
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full h-16 bg-orange-500 text-white rounded-2xl font-bold text-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95 disabled:bg-gray-300"
            >
              {loading ? 'جاري تنفيذ الطلب...' : `تأكيد الطلب (${formatCurrency(total, cart[0]?.currency)})`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-xl space-y-6 sticky top-32">
            <h2 className="text-2xl font-bold border-b border-gray-800 pb-4">ملخص الطلب</h2>
            <div className="max-h-60 overflow-y-auto space-y-4 pr-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center gap-4">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-400">الكمية: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-orange-500">{formatCurrency(item.price * item.quantity, item.currency)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-800 pt-6 space-y-4">
              <div className="flex justify-between text-gray-400">
                <span>المجموع الفرعي</span>
                <span>{formatCurrency(total, cart[0]?.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>التوصيل</span>
                <span className="text-green-500 font-bold">مجاني</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-gray-800">
                <span className="text-xl font-bold">الإجمالي الكلي</span>
                <span className="text-3xl font-black text-orange-500">{formatCurrency(total, cart[0]?.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
