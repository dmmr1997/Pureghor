import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ArrowRight, Zap, Flame, ShoppingBag } from 'lucide-react';

export const SpecialDealsSection: React.FC = () => {
  const { products, language, setSelectedProductSlug, setCurrentView, setQuickOrderProduct } = useStore();

  const dealProducts = products
    .filter(p => p.isSpecialDeal || (p.discountPercentage && p.discountPercentage > 0))
    .slice(0, 6);

  if (dealProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8" id="pureghor-special-deals">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-6 sm:h-7 bg-[#004d1a] rounded-full" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>{language === 'bn' ? 'বিশেষ ছাড় ও অফার' : 'Special Discount Offers'}</span>
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs bg-[#cc3366] text-white px-2.5 py-0.5 rounded-full font-black animate-pulse">
              <Flame size={12} /> HOT
            </span>
          </h2>
        </div>

        <button
          onClick={() => setCurrentView('offers')}
          className="text-xs sm:text-sm font-bold text-[#004d1a] hover:text-[#52b202] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <span>{language === 'bn' ? 'সকল অফার দেখুন' : 'All Offers'}</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Grid: 1 col on mobile, 2 cols on tablet, 3 cols on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {dealProducts.map(product => (
          <article
            key={product.id}
            itemScope
            itemType="https://schema.org/Product"
            className="bg-white rounded-xl sm:rounded-2xl border border-emerald-900/10 p-3 sm:p-3.5 flex items-center gap-3.5 hover:shadow-md hover:border-[#004d1a]/30 transition-all group relative overflow-hidden"
          >
            <meta itemProp="name" content={product.nameBn} />
            <meta itemProp="image" content={product.mainImage} />
            
            {/* Product Thumbnail with discount badge */}
            <div
              onClick={() => {
                setSelectedProductSlug(product.slug);
                setCurrentView('product-details');
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gray-50/80 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center cursor-pointer relative"
            >
              <img
                src={product.mainImage}
                alt={`PureGhor - ${product.nameBn}`}
                title={product.nameBn}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/products/pureghor_blackseed_honey_1787810945841.jpg';
                }}
              />
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="absolute top-1.5 left-1.5 bg-[#cc3366] text-white text-[10px] font-black px-1.5 py-0.5 rounded-md shadow-xs">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Info & Action */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
              <div>
                <span className="text-[10px] font-semibold text-[#004d1a] block truncate">
                  {language === 'bn' ? product.categoryNameBn : product.categoryNameEn}
                </span>

                <h3
                  onClick={() => {
                    setSelectedProductSlug(product.slug);
                    setCurrentView('product-details');
                  }}
                  className="font-bold text-xs sm:text-sm text-gray-900 hover:text-[#004d1a] transition-colors line-clamp-1 cursor-pointer mt-0.5"
                  title={language === 'bn' ? product.nameBn : product.nameEn}
                >
                  {language === 'bn' ? product.nameBn : product.nameEn}
                </h3>

                {/* Price Display */}
                <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm sm:text-base font-black text-[#004d1a]">
                    ৳{product.price}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-[11px] sm:text-xs text-gray-400 line-through">
                      ৳{product.compareAtPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-2">
                <button
                  onClick={() => setQuickOrderProduct(product)}
                  className="w-full bg-[#004d1a] hover:bg-[#52b202] active:bg-[#003612] text-white py-1.5 sm:py-2 px-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Zap size={13} className="text-amber-300" />
                  <span>{language === 'bn' ? 'অর্ডার করুন' : 'Order Now'}</span>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
