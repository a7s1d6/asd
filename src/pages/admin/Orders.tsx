import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { formatCurrency, handleFirestoreError, OperationType } from '../../lib/utils';
import { Search, Eye, CheckCircle2, Truck, XCircle, Clock, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function OrdersManager() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'orders', auth);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      fetchOrders();
    } catch (err: any) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`, auth);
    }
  };

  const handleDelete = async (orderId: string) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      await fetchOrders();
    } catch (err: any) {
      alert('خطأ في الحذف: ' + err.message);
      handleFirestoreError(err, OperationType.DELETE, `orders/${orderId}`, auth);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered': return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> تم التوصيل</span>;
      case 'shipped': return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Truck className="w-3 h-3" /> تم الشحن</span>;
      case 'pending': return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><Clock className="w-3 h-3" /> قيد الانتظار</span>;
      case 'cancelled': return <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3" /> ملغي</span>;
      default: return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">غير معروف</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">إدارة الطلبات</h1>
        <p className="text-gray-500">إجمالي الطلبات المستلمة: {orders.length} طلب</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex items-center gap-4">
          <div className="flex-grow relative">
            <input 
              type="text" 
              placeholder="البحث برقم الطلب أو اسم العميل..." 
              className="w-full bg-gray-50 border-none rounded-xl px-12 h-12"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 text-gray-500 text-sm font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">رقم الطلب</th>
                <th className="px-6 py-4">العميل</th>
                <th className="px-6 py-4">التاريخ</th>
                <th className="px-6 py-4">الإجمالي</th>
                <th className="px-6 py-4">الحالة</th>
                <th className="px-6 py-4">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4 font-mono text-sm">#{order.id.slice(0, 8)}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold">{order.shippingAddress?.fullName}</div>
                    <div className="text-xs text-gray-400">{order.shippingAddress?.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                  </td>
                  <td className="px-6 py-4 font-black">{formatCurrency(order.totalAmount, order.currency)}</td>
                  <td className="px-6 py-4">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-orange-500 transition-colors"><Eye className="w-5 h-5" /></button>
                      <button 
                        type="button"
                        onClick={async (e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (confirm('هل أنت متأكد من حذف هذا الطلب؟')) {
                            await handleDelete(order.id);
                          }
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all cursor-pointer relative z-10 font-bold text-xs"
                        title="حذف الطلب"
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4 pointer-events-none" />
                        <span>حذف</span>
                      </button>
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="bg-transparent border-none text-xs font-bold text-gray-400 hover:text-gray-900 cursor-pointer focus:ring-0"
                      >
                        <option value="pending">تغيير الحالة</option>
                        <option value="processing">قيد المعالجة</option>
                        <option value="shipped">تم الشحن</option>
                        <option value="delivered">تم التوصيل</option>
                        <option value="cancelled">إلغاء</option>
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
