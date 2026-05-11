import { Link } from 'react-router-dom';
import { useCart } from '../lib/CartContext';
import { formatCurrency } from '../lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, total, itemCount } = useCart();

  if (cart.length === 0) {
    return (
      <div className="text-center py-32 space-y-8">
        <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-300">
          <ShoppingBag className="w-16 h-16" />
        </div>
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">سلة التسوق فارغة</h1>
          <p className="text-gray-500 max-w-sm mx-auto italic">يبدو أنك لم تضف أي منتجات إلى سلتك بعد. ابدأ التسوق الآن واكتشف أفضل العروض!</p>
        </div>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-orange-500 text-white px-8 py-3 rounded-full font-bold hover:bg-orange-600 transition-all shadow-lg active:scale-95"
        >
          ابدأ التسوق <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <h1 className="text-3xl font-bold">سلة التسوق ({itemCount})</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <motion.div 
              layout
              key={item.id} 
              className="bg-white p-6 rounded-3xl border border-gray-100 flex gap-6 items-center shadow-sm"
            >
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-24 h-24 rounded-2xl object-cover bg-gray-50"
                referrerPolicy="no-referrer"
              />
              <div className="flex-grow space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-xl font-black text-orange-500">
                  {formatCurrency(item.price, item.currency)}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center bg-gray-50 rounded-xl px-2 py-1 border border-gray-100">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 text-gray-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 text-gray-600 hover:bg-white rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl space-y-6 sticky top-32">
            <h2 className="text-2xl font-bold border-b border-gray-50 pb-4">ملخص الطلب</h2>
            
            <div className="space-y-4 pt-2">
              <div className="flex justify-between text-gray-600">
                <span>إجمالي المنتجات ({itemCount})</span>
                <span>{formatCurrency(total, cart[0]?.currency)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>رسوم التوصيل</span>
                <span className="text-green-600 font-bold">مجاناً</span>
              </div>
              <div className="border-t border-gray-50 pt-6 flex justify-between items-end">
                <span className="text-xl font-bold">الإجمالي الكلي</span>
                <span className="text-3xl font-black text-orange-500">{formatCurrency(total, cart[0]?.currency)}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="كوبون الخصم" 
                  className="flex-grow bg-gray-50 border-none rounded-2xl px-6 h-14"
                />
                <button className="bg-gray-900 text-white px-6 rounded-2xl font-bold hover:bg-black transition-colors">تطبيق</button>
              </div>
              <Link 
                to="/checkout" 
                className="w-full h-16 bg-orange-500 text-white flex items-center justify-center rounded-2xl font-bold text-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95"
              >
                إتمام الطلب
              </Link>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-400">تطبيق الشروط والأحكام وجميع الأسعار شاملة ضريبة القيمة المضافة.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
