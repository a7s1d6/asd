import { useEffect, useState } from 'react';
import { collection, query, limit, getDocs } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingBag, Star, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { handleFirestoreError, OperationType } from '../lib/utils';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const path = 'products';
      try {
        const q = query(collection(db, path), limit(8));
        const querySnapshot = await getDocs(q);
        const fetchedProducts = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(fetchedProducts);
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, path, auth);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative h-[500px] rounded-3xl overflow-hidden group">
        <img 
          src="https://picsum.photos/seed/souqi_hero/1920/1080" 
          alt="سوقي - المتجر الإلكتروني المتكامل" 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-black/70 to-transparent flex items-center px-12 text-white">
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-xl space-y-6"
          >
            <h1 className="text-5xl font-bold leading-tight">اكتشف أفضل المنتجات بأفضل الأسعار</h1>
            <p className="text-xl text-gray-200">سوقي يوفر لك كل ما تحتاجه في مكان واحد، مع شحن سريع ودفع آمن.</p>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-orange-500 hover:text-white transition-colors flex items-center gap-2">
              تسوق الآن <ArrowLeft className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold">المنتجات المميزة</h2>
            <p className="text-gray-500">اخترنا لك الأفضل من بين آلاف المنتجات</p>
          </div>
          <Link to="/products" className="text-orange-500 font-semibold hover:underline flex items-center gap-1">
            عرض الكل <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center space-y-4">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300" />
                <p className="text-xl text-gray-500">لا توجد منتجات حالياً. سنضيف المزيد قريباً!</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Benefits Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 p-12 bg-white rounded-3xl border border-gray-100">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto text-orange-500">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">شحن سريع</h3>
          <p className="text-gray-500">نصل إليك في أي مكان خلال 48 ساعة فقط.</p>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto text-blue-500">
            <Star className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">جودة مضمونة</h3>
          <p className="text-gray-500">جميع منتجاتنا تخضع لمعايير جودة عالية.</p>
        </div>
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto text-green-500">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold">دفع آمن</h3>
          <p className="text-gray-500">طرق دفع متعددة وآمنة تماماً لراحتك.</p>
        </div>
      </section>
    </div>
  );
}
