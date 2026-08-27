import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react';
import { StarRating } from '../common/StarRating';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    setSelectedProductSlug,
    setCurrentView,
    setQuickOrderProduct,
    setQuickViewProduct,
    toggleWishlist,
    isInWishlist,
    addToCart,
  } = useStore();

  const isFavorited = isInWishlist(product.id);

  // Determine top badge text
  const badgeText =
    product.tag ||
    (product.discountPercentage ? `-${product.discountPercentage}%` : null) ||
    (product.isNewArrival ? (language === 'bn' ? 'নতুন' : 'NEW') : null);

  // Price range calculation
  const hasVariants = product.variants && product.variants.length > 1;
  const minPrice = product.price;
  const maxPrice = hasVariants ? Math.max(...product.variants!.map(v => v.price)) : product.price;

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-200 group relative">
      {/* Card Header Area with Image & Badges */}
      <div className="relative bg-gray-50/70 p-3 flex flex-col items-center justify-center overflow-hidden">
        {/* Top Badge Pill matching screenshot */}
        {badgeText && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-[#cc3366] text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-xs">
              {badgeText}
            </span>
          </div>
        )}

        {/* Wishlist Heart Icon (Top Right) */}
        <button
          onClick={e => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-xs transition-colors hover:bg-white cursor-pointer ${
            isFavorited ? 'text-[#cc3366]' : 'text-gray-400 hover:text-gray-700'
          }`}
          aria-label="Wishlist"
        >
          <Heart size={16} className={isFavorited ? 'fill-[#cc3366]' : ''} />
        </button>

        {/* Main Product Image */}
        <div
          onClick={() => {
            setSelectedProductSlug(product.slug);
            setCurrentView('product-details');
          }}
          className="w-full h-44 sm:h-48 flex items-center justify-center cursor-pointer p-2 relative"
        >
          <img
            src={product.mainImage}
            alt={product.nameEn}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Quick View Hover Action */}
        <div className="absolute inset-x-0 bottom-2 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={e => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="bg-gray-900/80 hover:bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow cursor-pointer"
          >
            <Eye size={13} />
            <span>{language === 'bn' ? 'একনজরে দেখুন' : 'Quick View'}</span>
          </button>
        </div>
      </div>

      {/* Card Body Area */}
      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Tag */}
          {product.categoryNameBn && (
            <span className="text-[11px] font-medium text-[#004d1a] block mb-1">
              {language === 'bn' ? product.categoryNameBn : product.categoryNameEn}
            </span>
          )}

          {/* Product Name */}
          <h3
            onClick={() => {
              setSelectedProductSlug(product.slug);
              setCurrentView('product-details');
            }}
            className="font-bold text-sm sm:text-base text-gray-800 hover:text-[#004d1a] transition-colors line-clamp-2 leading-snug cursor-pointer min-h-[2.5rem]"
            title={language === 'bn' ? product.nameBn : product.nameEn}
          >
            {language === 'bn' ? product.nameBn : product.nameEn}
          </h3>

          {/* Rating */}
          <div className="mt-1.5 flex items-center justify-between">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} showScore />
            <span className="text-[11px] text-gray-500">{product.weight}</span>
          </div>

          {/* Price Range Display (matching screenshot e.g. ৩০০৳ – ৯০০৳ or ৯০০৳ ২০০০৳) */}
          <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
            <span className="text-base sm:text-lg font-extrabold text-[#004d1a]">
              ৳{minPrice}
              {hasVariants && <span className="text-sm font-bold text-gray-600"> – ৳{maxPrice}</span>}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                ৳{product.compareAtPrice}
              </span>
            )}
          </div>
        </div>

        {/* Primary Action Button: "অর্ডার করুন" matching screenshot */}
        <div className="mt-3.5 pt-2 border-t border-gray-100 flex items-center gap-2">
          <button
            onClick={() => setQuickOrderProduct(product)}
            className="flex-1 bg-[#004d1a] hover:bg-[#003612] text-white py-2 px-3 rounded font-bold text-xs sm:text-sm transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <ShoppingBag size={15} />
            <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
          </button>

          <button
            onClick={() => addToCart(product)}
            className="p-2 border border-gray-200 text-gray-700 hover:text-[#004d1a] hover:border-[#004d1a] rounded transition-colors cursor-pointer"
            title={language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
          >
            <ShoppingBag size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
