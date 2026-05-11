import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Heart } from 'lucide-react';
import { formatCurrency } from '../lib/utils';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: {
    id: string;
    name_ar: string;
    price: number;
    currency: string;
    images?: string[];
    rating?: number;
    reviewsCount?: number;
    categoryId?: string;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative"
    >
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
        <img 
          src={product.images?.[0] || `https://picsum.photos/seed/${product.id}/600/600`} 
          alt={product.name_ar}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <button className="absolute top-4 left-4 bg-white/80 backdrop-blur-md p-2 rounded-full text-gray-400 hover:text-red-500 transition-colors">
          <Heart className="w-5 h-5" />
        </button>
      </Link>
      
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start gap-2">
          <Link to={`/product/${product.id}`} className="block flex-grow">
            <h3 className="font-bold text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2 min-h-[3rem]">
              {product.name_ar}
            </h3>
          </Link>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex items-center text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm font-bold text-gray-700 mr-1">{product.rating || '4.5'}</span>
          </div>
          <span className="text-xs text-gray-400">({product.reviewsCount || '0'})</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xl font-black text-gray-900">
            {formatCurrency(product.price, product.currency)}
          </span>
          <button className="bg-orange-50 text-orange-500 p-2 rounded-2xl hover:bg-orange-500 hover:text-white transition-all transform active:scale-95">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
