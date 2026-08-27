import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Filter, SlidersHorizontal, ArrowUpDown, Sparkles, X, LayoutGrid } from 'lucide-react';

interface ProductGridProps {
  title?: string;
  limit?: number;
  featuredOnly?: boolean;
  offersOnly?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  limit,
  featuredOnly = false,
  offersOnly = false,
}) => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    language,
    setCurrentView,
  } = useStore();

  const [sortBy, setSortBy] = useState<string>('default');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Status filter
    list = list.filter(p => p.status === 'active');

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      list = list.filter(p => p.categoryId === selectedCategory);
    }

    // Offers only
    if (offersOnly) {
      list = list.filter(p => p.isSpecialDeal || (p.discountPercentage && p.discountPercentage > 0));
    }

    // Featured only
    if (featuredOnly) {
      list = list.filter(p => p.isFeatured || p.isBestSeller);
    }

    // Price range
    list = list.filter(p => p.price >= minPrice && p.price <= maxPrice);

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        p =>
          p.nameBn.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          (p.categoryNameBn && p.categoryNameBn.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return limit ? list.slice(0, limit) : list;
  }, [products, selectedCategory, offersOnly, featuredOnly, minPrice, maxPrice, searchQuery, sortBy, limit]);

  const activeCategoryObj = categories.find(c => c.id === selectedCategory);

  return (
    <section className="max-w-7xl mx-auto px-4 py-6 sm:py-8" id="product-catalog-section">
      {/* Section Header with Clean Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <span>
              {title ||
                (activeCategoryObj
                  ? language === 'bn'
                    ? activeCategoryObj.nameBn
                    : activeCategoryObj.nameEn
                  : offersOnly
                  ? language === 'bn'
                    ? 'সকল স্পেশাল অফার'
                    : 'Special Discount Deals'
                  : language === 'bn'
                  ? 'আমাদের সকল অর্গানিক পণ্য'
                  : 'Our Organic Products')}
            </span>
            <span className="text-xs font-bold bg-emerald-100 text-[#004d1a] px-2.5 py-0.5 rounded-full">
              {filteredProducts.length} {language === 'bn' ? 'টি পণ্য' : 'items'}
            </span>
          </h2>
          {searchQuery && (
            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{language === 'bn' ? `খোঁজা হচ্ছে: "${searchQuery}"` : `Searching for: "${searchQuery}"`}</span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-rose-500 hover:underline inline-flex items-center text-xs ml-1 cursor-pointer font-semibold"
              >
                <X size={12} /> {language === 'bn' ? 'মুছুন' : 'Clear'}
              </button>
            </p>
          )}
        </div>

        {/* Action Controls: Filter & Sort */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="sm:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 bg-white shadow-xs"
          >
            <SlidersHorizontal size={14} className="text-[#004d1a]" />
            <span>{language === 'bn' ? 'প্রাইস ফিল্টার' : 'Price Filter'}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-xs text-gray-700 shadow-xs">
            <ArrowUpDown size={13} className="text-[#004d1a]" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer font-semibold text-gray-800"
            >
              <option value="default">{language === 'bn' ? 'ডিফল্ট সাজানো' : 'Default Sorting'}</option>
              <option value="price-asc">{language === 'bn' ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
              <option value="price-desc">{language === 'bn' ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
              <option value="rating">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Highest Rated'}</option>
              <option value="discount">{language === 'bn' ? 'সর্বোচ্চ ছাড়' : 'Biggest Discount'}</option>
              <option value="newest">{language === 'bn' ? 'নতুন কালেকশন' : 'Newest Arrivals'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Price Range Filter for Mobile / Desktop */}
      {showFilters && (
        <div className="mb-4 p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-gray-800">
              {language === 'bn' ? 'সর্বোচ্চ দাম:' : 'Max Price:'} ৳{maxPrice}
            </span>
            <input
              type="range"
              min="100"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={e => setMaxPrice(Number(e.target.value))}
              className="accent-[#004d1a] cursor-pointer"
            />
          </div>
          <button
            onClick={() => setMaxPrice(5000)}
            className="text-xs text-[#004d1a] font-bold hover:underline cursor-pointer"
          >
            {language === 'bn' ? 'রিসেট' : 'Reset'}
          </button>
        </div>
      )}

      {/* Category Pills Bar (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-5 scrollbar-none">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
            !selectedCategory
              ? 'bg-[#004d1a] text-white shadow-xs'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedCategory === cat.id
                ? 'bg-[#004d1a] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
          </button>
        ))}
      </div>

      {/* Product Cards Grid: Mobile-Friendly 2-Cols, Tablet 3-Cols, Desktop 4-Cols */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 p-8 space-y-3 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#004d1a] flex items-center justify-center mx-auto">
            <Sparkles size={26} />
          </div>
          <h3 className="text-base font-bold text-gray-900">
            {language === 'bn' ? 'কোনো পণ্য পাওয়া যায়নি' : 'No products found'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            {language === 'bn'
              ? 'অনুগ্রহ করে ভিন্ন কোনো ফিল্টার অথবা অন্য নামের কি-ওয়ার্ড দিয়ে খুঁজুন।'
              : 'Please try adjusting your filters or search keywords.'}
          </p>
          <button
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery('');
              setMinPrice(0);
              setMaxPrice(5000);
            }}
            className="bg-[#004d1a] hover:bg-[#52b202] text-white px-5 py-2.5 rounded-xl text-xs font-bold mt-2 cursor-pointer transition-colors shadow-xs"
          >
            {language === 'bn' ? 'সব ফিল্টার রিসেট করুন' : 'Reset All Filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
