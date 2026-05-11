import { Store, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
      <div className="container mx-auto px-4 divide-y divide-gray-800">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 text-right">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-white">
              <Store className="w-8 h-8 text-orange-500" />
              <span>سوقي</span>
            </Link>
            <p className="leading-relaxed">
              وجهتكم الأولى للتسوق الإلكتروني في الشرق الأوسط. جودة، سرعة، وأمان في كل خطوة.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-orange-500 transition-colors"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="hover:text-orange-500 transition-colors"><Instagram className="w-6 h-6" /></a>
              <a href="#" className="hover:text-orange-500 transition-colors"><Twitter className="w-6 h-6" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">روابط سريعة</h4>
            <ul className="space-y-4">
              <li><Link to="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link to="/products" className="hover:text-white transition-colors">كل المنتجات</Link></li>
              <li><Link to="/categories" className="hover:text-white transition-colors">التصنيفات</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">من نحن</Link></li>
            </ul>
          </div>

          {/* Help */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">مركز المساعدة</h4>
            <ul className="space-y-4">
              <li><Link to="/faq" className="hover:text-white transition-colors">الأسئلة الشائعة</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">سياسة الشحن</Link></li>
              <li><Link to="/returns" className="hover:text-white transition-colors">سياسة الاسترجاع</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">اتصل بنا</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h4 className="text-white font-bold text-lg">تواصل معنا</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 justify-end">
                <span>support@souqi.com</span>
                <Mail className="w-5 h-5 text-orange-500" />
              </li>
              <li className="flex items-center gap-3 justify-end">
                <span>+966 500 000 000</span>
                <Phone className="w-5 h-5 text-orange-500" />
              </li>
              <li className="flex items-center gap-3 justify-end">
                <span>الرياض، المملكة العربية السعودية</span>
                <MapPin className="w-5 h-5 text-orange-500" />
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 متجر سوقي. جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-4">
            <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-6 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
