import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { Sparkles, Flame, Award, Heart, ArrowRight, SlidersHorizontal, ArrowUpDown, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '../../types';

export const HomeProductShowcase: React.FC = () => {
  const {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    setSelectedCategorySlug,
    setCurrentView,
    language,
  } = useStore();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  // Filtered and sorted products for home showcase
  const displayedProducts = useMemo(() => {
    let list: Product[] = products.filter(p => p.status === 'active');

    if (activeTab === 'bestseller') {
      list = list.filter(p => p.isBestSeller || (p.reviewCount && p.reviewCount > 15));
    } else if (activeTab === 'deals') {
      list = list.filter(p => p.isSpecialDeal || (p.discountPercentage && p.discountPercentage > 0));
    } else if (activeTab === 'honey') {
      list = list.filter(p => p.categoryId === 'cat-1' || p.nameBn.includes('মধু') || p.nameBn.includes('হানি'));
    } else if (activeTab === 'oil') {
      list = list.filter(p => p.categoryId === 'cat-2' || p.nameBn.includes('তেল') || p.nameBn.includes('ঘি'));
    } else if (activeTab === 'nuts') {
      list = list.filter(p => p.categoryId === 'cat-3' || p.nameBn.includes('বাদাম') || p.nameBn.includes('আখরোট') || p.nameBn.includes('সিড'));
    }

    // Sort
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'discount') {
      list.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, activeTab, sortBy]);

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-6" id="pureghor-home-products">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e8f7d4] border border-[#a6e260] text-[#004d1a] text-xs font-black tracking-wide mb-1.5">
            <Sparkles size={13} className="stroke-[2.5]" />
            <span>{language === 'bn' ? '১০০% খাঁটি খাদ্য সম্ভার' : '100% Pure Food Collection'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {language === 'bn' ? 'আমাদের স্বাস্থ্যসম্মত প্রাকৃতিক পণ্যসমূহ' : 'Our Healthy Natural Products'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
            {language === 'bn'
              ? 'কেমিক্যালমুক্ত খাঁটি মধু, ঘানির সরিষার তেল, গাওয়া ঘি, প্রিমিয়াম বাদাম ও স্বাস্থ্যকর খাবার'
              : 'Directly sourced unadulterated organic food items delivered right to your doorstep.'}
          </p>
        </div>

        {/* View All Button */}
        <button
          onClick={() => {
            setSelectedCategorySlug('all');
            setCurrentView('catalog');
          }}
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-extrabold text-[#004d1a] hover:text-[#52b202] transition-colors cursor-pointer bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-xs hover:shadow-md"
        >
          <span>{language === 'bn' ? 'সকল পণ্য দেখুন' : 'View All Products'}</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Interactive Category & Curation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-gray-200/90 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'all'
                ? 'bg-[#004d1a] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Sparkles size={14} />
            <span>{language === 'bn' ? 'সকল পণ্য' : 'All Products'}</span>
            <span className="text-[10px] opacity-75">({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('bestseller')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'bestseller'
                ? 'bg-[#004d1a] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Award size={14} className="text-amber-400" />
            <span>{language === 'bn' ? 'বেস্ট সেলার' : 'Best Sellers'}</span>
          </button>

          <button
            onClick={() => setActiveTab('deals')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'deals'
                ? 'bg-[#cc3366] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Flame size={14} className="text-amber-300" />
            <span>{language === 'bn' ? 'স্পেশাল অফার' : 'Special Deals'}</span>
          </button>

          <button
            onClick={() => setActiveTab('honey')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'honey'
                ? 'bg-[#004d1a] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>🍯</span>
            <span>{language === 'bn' ? 'খাঁটি মধু ও হানি নাট' : 'Honey & Honey Nut'}</span>
          </button>

          <button
            onClick={() => setActiveTab('oil')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'oil'
                ? 'bg-[#004d1a] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>🫒</span>
            <span>{language === 'bn' ? 'ঘানির তেল ও ঘি' : 'Mustard Oil & Ghee'}</span>
          </button>

          <button
            onClick={() => setActiveTab('nuts')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'nuts'
                ? 'bg-[#004d1a] text-white shadow-sm'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <span>🥜</span>
            <span>{language === 'bn' ? 'বাদাম ও সিডস' : 'Nuts & Seeds'}</span>
          </button>
        </div>

        {/* Quick Sorting Dropdown */}
        <div className="flex items-center gap-1.5 shrink-0 px-2 border-t sm:border-t-0 sm:border-l border-gray-200 pt-2 sm:pt-0">
          <ArrowUpDown size={13} className="text-[#004d1a]" />
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs font-bold text-gray-800 bg-transparent focus:outline-none cursor-pointer"
          >
            <option value="default">{language === 'bn' ? 'ডিফল্ট সাজানো' : 'Default'}</option>
            <option value="price-asc">{language === 'bn' ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
            <option value="price-desc">{language === 'bn' ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
            <option value="discount">{language === 'bn' ? 'সর্বোচ্চ ছাড়' : 'Max Discount'}</option>
            <option value="rating">{language === 'bn' ? 'সর্বোচ্চ রেটিং' : 'Top Rated'}</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        {displayedProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Mini Feature Guarantee Strip */}
      <div className="bg-gradient-to-r from-[#e8f7d4] via-[#f7faf4] to-[#e8f7d4] border border-[#a6e260]/60 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-around gap-4 text-center">
        <div className="flex items-center gap-2 text-xs font-bold text-[#004d1a]">
          <ShieldCheck size={18} className="text-[#52b202]" />
          <span>১০০% ক্যাশ অন ডেলিভারি (পণ্য দেখে মূল্য পরিশোধ)</span>
        </div>
        <div className="hidden sm:block w-px h-4 bg-emerald-300" />
        <div className="flex items-center gap-2 text-xs font-bold text-[#004d1a]">
          <Truck size={18} className="text-[#52b202]" />
          <span>সারাদেশে হোম ডেলিভারি সুবিধা</span>
        </div>
        <div className="hidden sm:block w-px h-4 bg-emerald-300" />
        <div className="flex items-center gap-2 text-xs font-bold text-[#004d1a]">
          <CheckCircle2 size={18} className="text-[#52b202]" />
          <span>সরাসরি খামারি ও নিজস্ব তত্ত্বাবধানে প্রস্তুত</span>
        </div>
      </div>
    </section>
  );
};
