import { useState, useEffect } from 'react';
import { collection, query, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatCurrency } from '../../lib/utils';
import { ShoppingBag, TrendingUp, Users, DollarSign, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const data = [
  { name: 'السبت', sales: 4000, orders: 24 },
  { name: 'الأحد', sales: 3000, orders: 18 },
  { name: 'الاثنين', sales: 2000, orders: 15 },
  { name: 'الثلاثاء', sales: 2780, orders: 20 },
  { name: 'الأربعاء', sales: 1890, orders: 12 },
  { name: 'الخميس', sales: 2390, orders: 17 },
  { name: 'الجمعة', sales: 3490, orders: 22 },
];

export default function Overview() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    topProducts: [] as any[]
  });

  useEffect(() => {
    // In a real app, these would be calculated from Firestore collections
    setStats({
      totalSales: 125430,
      totalOrders: 450,
      totalUsers: 1200,
      topProducts: [
        { name: 'آيفون 15 برو', sales: 45, price: 5400 },
        { name: 'ساعة آبل الجيل التاسع', sales: 32, price: 1800 },
        { name: 'سماعات سوني WH-1000XM5', sales: 28, price: 1200 },
      ]
    });
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">نظرة عامة</h1>
        <p className="text-gray-500">مرحباً بك في لوحة تحكم سوقي. إليك أداء متجرك اليوم.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-orange-100 text-orange-500 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
              +12% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold">إجمالي المبيعات</p>
            <p className="text-2xl font-black">{formatCurrency(stats.totalSales)}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-blue-100 text-blue-500 rounded-2xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
              +8% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold">إجمالي الطلبات</p>
            <p className="text-2xl font-black">{stats.totalOrders} طلب</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-green-100 text-green-500 rounded-2xl">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-orange-500 text-xs font-bold bg-orange-50 px-2 py-1 rounded-full">
              +5% <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold">العملاء النشطون</p>
            <p className="text-2xl font-black">{stats.totalUsers} عميل</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div className="p-3 bg-purple-100 text-purple-500 rounded-2xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold">معدل التحويل</p>
            <p className="text-2xl font-black">3.2%</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold">تحليل المبيعات الأسبوعي</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="sales" fill="#f97316" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
          <h2 className="text-xl font-bold">الأكثر مبيعاً</h2>
          <div className="space-y-6">
            {stats.topProducts.map((p, i) => (
              <div key={i} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center font-bold text-gray-400 group-hover:text-orange-500 transition-colors">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{p.name}</h4>
                    <p className="text-xs text-gray-500">{p.sales} مبيعات</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-orange-500">{formatCurrency(p.price)}</span>
              </div>
            ))}
          </div>
          <button className="w-full py-3 rounded-2xl bg-gray-50 text-gray-600 font-bold hover:bg-gray-100 transition-all">عرض التقرير الكامل</button>
        </div>
      </div>
    </div>
  );
}
