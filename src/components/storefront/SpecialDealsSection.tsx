import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ArrowRight, Eye, Zap } from 'lucide-react';

export const SpecialDealsSection: React.FC = () => {
  const { products, language, setSelectedProductSlug, setCurrentView, setQuickOrderProduct } = useStore();

  const dealProducts = products
    .filter(p => p.isSpecialDeal || (p.discountPercentage && p.discountPercentage > 0))
    .slice(0, 6);

  if (dealProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-6 bg-[#004d1a] rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>{language === 'bn' ? 'বিশেষ মূল্য ছাড়' : 'Special Discount Offers'}</span>
            <span className="text-xs bg-[#cc3366] text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
              HOT
            </span>
          </h2>
        </div>

        <button
          onClick={() => setCurrentView('offers')}
          className="text-xs sm:text-sm font-semibold text-[#004d1a] hover:text-[#003612] flex items-center gap-1 cursor-pointer"
        >
          <span>{language === 'bn' ? 'সকল অফার' : 'All Offers'}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {/* 2x3 Grid matching screenshot layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dealProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-lg border border-gray-200 p-3.5 flex items-center gap-3.5 hover:shadow-md transition-shadow group relative overflow-hidden"
          >
            {/* Product Thumbnail */}
            <div
              onClick={() => {
                setSelectedProductSlug(product.slug);
                setCurrentView('product-details');
              }}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-md bg-gray-50 overflow-hidden shrink-0 border border-gray-100 flex items-center justify-center cursor-pointer relative"
            >
              <img
                src={product.mainImage}
                alt={product.nameEn}
                className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="absolute top-1 left-1 bg-[#cc3366] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                  -{product.discountPercentage}%
                </span>
              )}
            </div>

            {/* Info & Action */}
            <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
              <div>
                <h3
                  onClick={() => {
                    setSelectedProductSlug(product.slug);
                    setCurrentView('product-details');
                  }}
                  className="font-bold text-xs sm:text-sm text-gray-800 hover:text-[#004d1a] transition-colors line-clamp-1 cursor-pointer"
                  title={language === 'bn' ? product.nameBn : product.nameEn}
                >
                  {language === 'bn' ? product.nameBn : product.nameEn}
                </h3>

                {/* Price Display */}
                <div className="mt-1 flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-sm sm:text-base font-extrabold text-[#004d1a]">
                    ৳{product.price}
                    {product.variants && product.variants.length > 1 && (
                      <span className="text-xs font-semibold text-gray-500">
                        {' '}– ৳{Math.max(...product.variants.map(v => v.price))}
                      </span>
                    )}
                  </span>
                  {product.compareAtPrice && product.compareAtPrice > product.price && (
                    <span className="text-xs text-gray-400 line-through">
                      ৳{product.compareAtPrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Button: "পণ্য দেখুন" matching screenshot */}
              <div className="mt-3">
                <button
                  onClick={() => setQuickOrderProduct(product)}
                  className="w-full bg-[#004d1a] hover:bg-[#003612] text-white py-1.5 px-3 rounded font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <span>{language === 'bn' ? 'পণ্য দেখুন' : 'View Product'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
