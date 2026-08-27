import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star, Zap, Check } from 'lucide-react';
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

  // Price calculation
  const hasVariants = product.variants && product.variants.length > 1;
  const minPrice = product.price;
  const maxPrice = hasVariants ? Math.max(...product.variants!.map(v => v.price)) : product.price;

  const isInStock = product.stock > 0;

  return (
    <article
      itemScope
      itemType="https://schema.org/Product"
      className="bg-white rounded-xl sm:rounded-2xl border border-gray-200/90 overflow-hidden flex flex-col justify-between hover:shadow-md hover:border-[#004d1a]/30 transition-all duration-200 group relative"
    >
      {/* Hidden SEO Schema Properties */}
      <meta itemProp="name" content={product.nameBn + ' - ' + product.nameEn} />
      <meta itemProp="image" content={product.mainImage} />
      <meta itemProp="description" content={product.shortDescriptionBn || product.descriptionBn || 'PureGhor Organic Food'} />
      <div itemProp="offers" itemScope itemType="https://schema.org/Offer" className="hidden">
        <meta itemProp="price" content={String(product.price)} />
        <meta itemProp="priceCurrency" content="BDT" />
        <meta itemProp="availability" content={isInStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
      </div>

      {/* Card Header Area with Image, Badges & Quick View */}
      <div className="relative bg-gradient-to-b from-gray-50/80 to-emerald-50/20 p-2 sm:p-3 flex flex-col items-center justify-center overflow-hidden">
        {/* Top Badge Pill */}
        {badgeText && (
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-[#cc3366] text-white text-[10px] sm:text-xs font-black uppercase px-2 py-0.5 rounded-md shadow-xs flex items-center gap-0.5">
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
          className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center shadow-xs transition-transform active:scale-90 hover:bg-white cursor-pointer ${
            isFavorited ? 'text-[#cc3366]' : 'text-gray-400 hover:text-gray-700'
          }`}
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart size={15} className={isFavorited ? 'fill-[#cc3366]' : ''} />
        </button>

        {/* Product Image Click Target */}
        <div
          onClick={() => {
            setSelectedProductSlug(product.slug);
            setCurrentView('product-details');
          }}
          className="w-full h-36 sm:h-44 md:h-48 flex items-center justify-center cursor-pointer p-1.5 relative"
        >
          <img
            src={product.mainImage}
            alt={`PureGhor - ${product.nameBn} (${product.nameEn})`}
            title={`${product.nameBn} - ১০০% বিশুদ্ধ অর্গানিক`}
            loading="lazy"
            decoding="async"
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/products/pureghor_blackseed_honey_1787810945841.jpg';
            }}
          />
        </div>

        {/* Quick View Desktop Hover Action */}
        <div className="absolute inset-x-0 bottom-2 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={e => {
              e.stopPropagation();
              setQuickViewProduct(product);
            }}
            className="bg-[#003612]/90 hover:bg-[#004d1a] text-white text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-md cursor-pointer transition-colors"
          >
            <Eye size={13} />
            <span>{language === 'bn' ? 'একনজরে' : 'Quick View'}</span>
          </button>
        </div>
      </div>

      {/* Card Body Area */}
      <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Stock Indicators */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-gray-500 mb-1">
            <span className="font-semibold text-[#004d1a] truncate max-w-[65%]">
              {language === 'bn' ? product.categoryNameBn : product.categoryNameEn}
            </span>
            <span className="text-gray-400 font-medium shrink-0">
              {product.weight}
            </span>
          </div>

          {/* Product Name (H3 for SEO Hierarchy) */}
          <h3
            onClick={() => {
              setSelectedProductSlug(product.slug);
              setCurrentView('product-details');
            }}
            className="font-bold text-xs sm:text-sm md:text-base text-gray-900 hover:text-[#004d1a] transition-colors line-clamp-2 leading-snug cursor-pointer min-h-[2.2rem] sm:min-h-[2.6rem]"
            title={`${product.nameBn} (${product.nameEn})`}
          >
            {language === 'bn' ? product.nameBn : product.nameEn}
          </h3>

          {/* Rating */}
          <div className="mt-1 flex items-center justify-between">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} size={11} showScore />
            {isInStock ? (
              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                {language === 'bn' ? 'স্টকে আছে' : 'In Stock'}
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                {language === 'bn' ? 'স্টক আউট' : 'Out of Stock'}
              </span>
            )}
          </div>

          {/* Price Range Display */}
          <div className="mt-2 flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base md:text-lg font-black text-[#004d1a]">
              ৳{minPrice}
              {hasVariants && <span className="text-xs font-bold text-gray-600"> – ৳{maxPrice}</span>}
            </span>
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                ৳{product.compareAtPrice}
              </span>
            )}
          </div>
        </div>

        {/* Primary Action Buttons (Mobile-Optimized Touch Targets) */}
        <div className="mt-2.5 sm:mt-3 pt-2 border-t border-gray-100 flex items-center gap-1.5">
          {/* Quick Buy Now Button */}
          <button
            onClick={() => setQuickOrderProduct(product)}
            className="flex-1 bg-[#004d1a] hover:bg-[#52b202] active:bg-[#003612] text-white py-2 sm:py-2.5 px-2 sm:px-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95"
          >
            <Zap size={14} className="text-amber-300 shrink-0" />
            <span className="truncate">{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
          </button>

          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(product)}
            className="p-2 sm:p-2.5 border border-gray-200 hover:border-[#004d1a] text-gray-700 hover:text-[#004d1a] hover:bg-emerald-50 rounded-lg sm:rounded-xl transition-all cursor-pointer shrink-0"
            title={language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}
            aria-label="Add to cart"
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};
