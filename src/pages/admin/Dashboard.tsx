import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Tag, 
  BarChart3, 
  Settings,
  PlusCircle
} from 'lucide-react';
import { cn } from '../../lib/utils';
import ProductsManager from './Products';
import OrdersManager from './Orders';
import Overview from './Overview';

const sidebarItems = [
  { icon: LayoutDashboard, label: 'نظرة عامة', path: '/admin' },
  { icon: Package, label: 'المنتجات', path: '/admin/products' },
  { icon: ShoppingCart, label: 'الطلبات', path: '/admin/orders' },
  { icon: Users, label: 'العملاء', path: '/admin/customers' },
  { icon: Tag, label: 'كوبونات الخصم', path: '/admin/coupons' },
  { icon: BarChart3, label: 'التقارير', path: '/admin/reports' },
  { icon: Settings, label: 'الإعدادات', path: '/admin/settings' },
];

export default function AdminDashboard() {
  const location = useLocation();

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="w-64 space-y-2 hidden md:block">
        <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm space-y-1">
          {sidebarItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link 
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-2xl font-bold transition-all",
                  isActive 
                    ? "bg-orange-500 text-white shadow-lg shadow-orange-200" 
                    : "text-gray-500 hover:bg-orange-50 hover:text-orange-500"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="bg-gray-900 text-white p-6 rounded-3xl space-y-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-gray-400">تحليل الأداء</h4>
            <p className="text-2xl font-black text-orange-500">+25%</p>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">أداء المتجر في تحسن ملحوظ مقارنة بالأسبوع الماضي.</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-grow space-y-8">
        <Routes>
          <Route index element={<Overview />} />
          <Route path="products" element={<ProductsManager />} />
          <Route path="orders" element={<OrdersManager />} />
          <Route path="*" element={<div className="text-center py-20 text-gray-400">هذه الصفحة قيد التطوير...</div>} />
        </Routes>
      </div>
    </div>
  );
}
