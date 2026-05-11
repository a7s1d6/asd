import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { doc, getDoc, collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { formatCurrency } from '../lib/utils';
import { useCart } from '../lib/CartContext';
import { motion } from 'motion/react';
import { Star, ShoppingBag, ArrowRight, ShieldCheck, Truck, RefreshCcw } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetails = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
          
          // Fetch reviews
          const reviewsRef = collection(db, 'products', id, 'reviews');
          const q = query(reviewsRef, orderBy('createdAt', 'desc'));
          const reviewsSnap = await getDocs(q);
          setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="h-96 flex items-center justify-center">جاري التحميل...</div>;
  if (!product) return <div className="text-center py-20">المنتج غير موجود.</div>;

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl overflow-hidden aspect-square border border-gray-100"
        >
          <img 
            src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/1200/1200`} 
            alt={product.name_ar} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>

        {/* Product Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.name_ar}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-lg font-bold text-gray-900 mr-1">{product.rating || '0.0'}</span>
              </div>
              <span className="text-gray-400">({reviews.length} تقييم)</span>
              <span className={`px-4 py-1 rounded-full text-sm font-bold ${product.stock > 0 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                {product.stock > 0 ? 'متوفر في المخزون' : 'نفذ من المخزون'}
              </span>
            </div>
            <div className="text-4xl font-black text-orange-500">
              {formatCurrency(product.price, product.currency)}
            </div>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed whitespace-pre-wrap">
            {product.description_ar}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={() => {
                addToCart({
                  id: product.id,
                  name: product.name_ar,
                  price: product.price,
                  image: product.images?.[0] || `https://picsum.photos/seed/${product.id}/200/200`,
                  currency: product.currency,
                  quantity: 1
                });
                navigate('/cart');
              }}
              className="flex-grow flex items-center justify-center gap-3 bg-orange-500 text-white h-16 rounded-2xl font-bold text-xl hover:bg-orange-600 transition-all shadow-lg active:scale-95"
            >
              <ShoppingBag className="w-6 h-6" />
              أضف إلى السلة
            </button>
            <button className="bg-orange-50 text-orange-500 px-6 rounded-2xl hover:bg-orange-100 transition-colors">
              <Truck className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center gap-2 text-center">
              <ShieldCheck className="w-6 h-6 text-gray-400" />
              <span className="text-sm font-bold">أمان مضمون</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center gap-2 text-center">
              <Truck className="w-6 h-6 text-gray-400" />
              <span className="text-sm font-bold">شحن سريع</span>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl flex flex-col items-center gap-2 text-center">
              <RefreshCcw className="w-6 h-6 text-gray-400" />
              <span className="text-sm font-bold">استرجاع سهل</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="bg-white p-12 rounded-3xl border border-gray-100 space-y-8">
        <h2 className="text-2xl font-bold">آراء العملاء ({reviews.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="p-6 bg-gray-50 rounded-2xl space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{review.userName}</h4>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString('ar-SA')}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full">لا توجد تقييمات لهذا المنتج حتى الآن.</p>
          )}
        </div>
      </section>
    </div>
  );
}
