import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { wishlist, products, language, setCurrentView } = useStore();

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <Heart size={26} className="text-[#cc3366] fill-[#cc3366]" />
            <span>{language === 'bn' ? 'আমার উইশলিস্ট ও প্রিয় পণ্য' : 'My Wishlist & Favorites'}</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            {language === 'bn'
              ? `মোট ${wishlistedProducts.length}টি পণ্য উইশলিস্টে যুক্ত আছে।`
              : `${wishlistedProducts.length} items saved in your wishlist.`}
          </p>
        </div>

        <button
          onClick={() => setCurrentView('catalog')}
          className="text-xs sm:text-sm font-semibold text-[#004d1a] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{language === 'bn' ? 'আরো পণ্য দেখুন' : 'Browse More'}</span>
          <ArrowRight size={14} />
        </button>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200 p-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-pink-50 text-[#cc3366] flex items-center justify-center mx-auto">
            <Heart size={32} />
          </div>
          <h3 className="text-base font-bold text-gray-800">
            {language === 'bn' ? 'আপনার উইশলিস্ট বর্তমানে খালি' : 'Your wishlist is empty'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {language === 'bn'
              ? 'পণ্য পছন্দের তালিকায় রাখতে পণ্যের ওপর থাকা হার্ট আইকনে ক্লিক করুন।'
              : 'Click the heart icon on any product card to save it for later.'}
          </p>
          <button
            onClick={() => setCurrentView('catalog')}
            className="bg-[#004d1a] text-white px-5 py-2 rounded text-xs font-semibold mt-2 cursor-pointer"
          >
            {language === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Start Exploring'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlistedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
