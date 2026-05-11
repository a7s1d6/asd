import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Store, LogOut, Menu, X } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../lib/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-orange-500">
            <Store className="w-8 h-8" />
            <span>سوقي</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-grow max-w-md mx-8 relative">
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="w-full bg-gray-100 border-none rounded-full px-12 py-2 focus:ring-2 focus:ring-orange-500 transition-all"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-6">
            {isAdmin && (
              <Link to="/admin" className="text-gray-600 hover:text-orange-500 font-medium">لوحة التحكم</Link>
            )}
            <Link to="/cart" className="relative text-gray-600 hover:text-orange-500 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -top-2 -left-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">0</span>
            </Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-orange-500">
                  <User className="w-6 h-6" />
                  <span className="font-medium truncate max-w-[100px]">{user.displayName || 'حسابي'}</span>
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-orange-500 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-600 transition-colors">
                تسجيل الدخول
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-6 border-t border-gray-100 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="relative">
            <input 
              type="text" 
              placeholder="ابحث عن منتج..." 
              className="w-full bg-gray-100 border-none rounded-2xl px-12 py-3"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50">الرئيسية</Link>
            <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50 flex justify-between">
              <span>السلة</span>
              <span className="bg-orange-500 text-white px-2 rounded-full text-xs flex items-center">0</span>
            </Link>
            {isAdmin && <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50 text-orange-500">لوحة التحكم</Link>}
            {user ? (
              <>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="py-2 border-b border-gray-50">حسابي</Link>
                <button onClick={handleLogout} className="text-right py-2 text-red-500">تسجيل الخروج</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-orange-500 text-white py-3 rounded-2xl font-bold text-center">تسجيل الدخول</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
