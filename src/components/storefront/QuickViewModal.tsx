import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, ShoppingBag, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { StarRating } from '../common/StarRating';
import { ProductVariant } from '../../types';

export const QuickViewModal: React.FC = () => {
  const {
    quickViewProduct,
    setQuickViewProduct,
    setQuickOrderProduct,
    setSelectedProductSlug,
    setCurrentView,
    addToCart,
    toggleWishlist,
    isInWishlist,
    language,
  } = useStore();

  const product = quickViewProduct;
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const isFavorited = isInWishlist(product.id);
  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeComparePrice = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
          {/* Product Image */}
          <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 flex items-center justify-center p-4">
            <img
              src={product.mainImage}
              alt={product.nameEn}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/pureghor_blackseed_honey_1787810945841.jpg';
              }}
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#004d1a] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {language === 'bn' ? product.categoryNameBn : product.categoryNameEn}
              </span>

              <h3 className="font-bold text-lg text-gray-900 leading-snug">
                {language === 'bn' ? product.nameBn : product.nameEn}
              </h3>

              <StarRating rating={product.rating} reviewCount={product.reviewCount} size={13} showScore />

              <div className="flex items-baseline gap-2 pt-1">
                <span className="text-xl font-extrabold text-[#004d1a]">৳{activePrice}</span>
                {activeComparePrice && activeComparePrice > activePrice && (
                  <span className="text-xs text-gray-400 line-through">৳{activeComparePrice}</span>
                )}
              </div>

              <p className="text-xs text-gray-600 line-clamp-3">
                {language === 'bn' ? product.shortDescriptionBn : product.shortDescriptionEn}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="pt-1">
                  <span className="text-xs font-bold text-gray-700 block mb-1">প্যাকেজ / ওজন:</span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {product.variants.map(v => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`px-2.5 py-1 rounded text-xs transition-all cursor-pointer ${
                          selectedVariant?.id === v.id
                            ? 'bg-[#004d1a] text-white font-bold'
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        {v.weight}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2.5 pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setQuickViewProduct(null);
                    setQuickOrderProduct(product);
                  }}
                  className="flex-1 bg-[#004d1a] hover:bg-[#003612] text-white font-bold py-2.5 px-3 rounded-lg text-xs sm:text-sm flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <ShoppingBag size={16} />
                  <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
                </button>

                <button
                  onClick={() => addToCart(product, selectedVariant || undefined, quantity)}
                  className="p-2.5 border border-gray-300 hover:bg-gray-100 rounded-lg text-gray-700 cursor-pointer"
                  title="Add to Cart"
                >
                  <ShoppingBag size={16} />
                </button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`p-2.5 border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer ${
                    isFavorited ? 'text-[#cc3366]' : 'text-gray-700'
                  }`}
                  title="Wishlist"
                >
                  <Heart size={16} className={isFavorited ? 'fill-[#cc3366]' : ''} />
                </button>
              </div>

              <button
                onClick={() => {
                  setSelectedProductSlug(product.slug);
                  setQuickViewProduct(null);
                  setCurrentView('product-details');
                }}
                className="w-full text-center text-xs text-[#004d1a] font-bold hover:underline flex items-center justify-center gap-1 cursor-pointer pt-1"
              >
                <span>{language === 'bn' ? 'সম্পূর্ণ বিবরণ ও রিভিউ দেখুন' : 'View Full Details & Reviews'}</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
