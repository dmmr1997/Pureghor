import React, { useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CategoryCarousel: React.FC = () => {
  const { categories, language, setSelectedCategory, setCurrentView, selectedCategory } = useStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* Section Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
          {language === 'bn' ? 'প্রোডাক্ট ক্যাটাগরি' : 'Product Categories'}
        </h2>
        <div className="w-16 h-1 bg-[#004d1a] mx-auto mt-2 rounded-full" />
      </div>

      {/* Categories Horizontal Carousel with Arrow Navigation */}
      <div className="relative group">
        {/* Left Arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#004d1a] text-white flex items-center justify-center shadow-md hover:bg-[#003612] transition-colors cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Scroll Container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <div
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentView('catalog');
                }}
                className={`shrink-0 w-36 sm:w-44 bg-white rounded-lg border transition-all duration-200 p-3 flex flex-col items-center justify-between text-center cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                  isSelected ? 'border-[#004d1a] ring-2 ring-[#004d1a]/20 bg-emerald-50/40' : 'border-gray-200 hover:border-[#004d1a]/60'
                }`}
              >
                {/* Category Image Area */}
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center mb-2.5">
                  <img
                    src={cat.imageUrl || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=300&auto=format&fit=crop&q=80'}
                    alt={cat.nameEn}
                    className="w-full h-full object-contain p-1 transform group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>

                {/* Category Label */}
                <span className="text-xs sm:text-sm font-semibold text-gray-800 line-clamp-1">
                  {language === 'bn' ? cat.nameBn : cat.nameEn}
                </span>

                {/* Items Badge */}
                {cat.itemCount !== undefined && cat.itemCount > 0 && (
                  <span className="text-[11px] text-gray-400 font-medium mt-0.5">
                    {language === 'bn' ? `${cat.itemCount} টি পণ্য` : `${cat.itemCount} items`}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-[#004d1a] text-white flex items-center justify-center shadow-md hover:bg-[#003612] transition-colors cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
};
