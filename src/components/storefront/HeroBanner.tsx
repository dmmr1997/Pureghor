import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';
import { Banner } from '../../types';

export const HeroBanner: React.FC = () => {
  const { language, setCurrentView, setSelectedCategory } = useStore();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const data = await api.getBanners(true);
        if (data && data.length > 0) {
          setBanners(data);
        }
      } catch (e) {
        console.error('Failed to load banners', e);
      }
    };
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const currentBanner = banners[currentIndex];

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Main Hero Card (Lush Green Organic Showcase matching screenshot) */}
        <div className="lg:col-span-8 bg-[#003612] rounded-xl overflow-hidden shadow-sm relative min-h-[300px] sm:min-h-[360px] flex flex-col justify-between p-6 sm:p-10 text-white">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#00381d] via-[#004d1a]/90 to-transparent z-0" />

          {/* Decorative Fresh Ingredients Graphic on Right */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 sm:w-3/5 opacity-80 sm:opacity-95 z-0 pointer-events-none overflow-hidden">
            <img
              src={
                currentBanner?.imageUrl ||
                'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=900&auto=format&fit=crop&q=80'
              }
              alt="Organic Food"
              className="w-full h-full object-cover object-center transform scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#003612] via-transparent to-transparent" />
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-md space-y-4">
            {/* Guarantee Tag */}
            <div className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-xs border border-white/20 px-3 py-1 rounded-full text-xs font-semibold text-amber-300">
              <ShieldCheck size={14} />
              <span>
                {currentBanner
                  ? language === 'bn'
                    ? currentBanner.badgeBn
                    : currentBanner.badgeEn
                  : language === 'bn'
                  ? '১০০% খাঁটি ও অর্গানিক গ্যারান্টি'
                  : '100% Pure & Organic Guarantee'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-sm">
              {currentBanner
                ? language === 'bn'
                  ? currentBanner.titleBn
                  : currentBanner.titleEn
                : language === 'bn'
                ? 'প্রকৃতির বিশুদ্ধতায় প্রতিদিনের সুস্থতা'
                : 'Pure Natural Goodness for Daily Vitality'}
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-normal">
              {currentBanner
                ? language === 'bn'
                  ? currentBanner.subtitleBn
                  : currentBanner.subtitleEn
                : language === 'bn'
                ? 'কেমিক্যালমুক্ত অর্গানিক খাবার, খাঁটি স্বাদ ও স্বাস্থ্যকর জীবনের বিশ্বস্ত ঠিকানা।'
                : 'Chemical-free organic foods, authentic tastes, and your trusted home for healthy living.'}
            </p>

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={() => {
                  if (currentBanner?.targetCategory) {
                    setSelectedCategory(currentBanner.targetCategory);
                  }
                  setCurrentView('catalog');
                }}
                className="bg-white hover:bg-amber-400 text-[#003612] hover:text-black font-bold px-6 py-2.5 rounded-md text-sm sm:text-base transition-all duration-200 shadow hover:shadow-md inline-flex items-center gap-2 cursor-pointer"
              >
                <ShoppingBag size={18} />
                <span>
                  {currentBanner
                    ? language === 'bn'
                      ? currentBanner.buttonTextBn
                      : currentBanner.buttonTextEn
                    : language === 'bn'
                    ? 'এখনই কিনুন'
                    : 'Shop Now'}
                </span>
              </button>
            </div>
          </div>

          {/* Carousel Navigation Dots */}
          {banners.length > 1 && (
            <div className="relative z-10 flex items-center justify-between pt-4">
              <div className="flex items-center gap-1.5">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentIndex === i ? 'w-6 bg-amber-400' : 'w-2 bg-white/40'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentIndex(prev => (prev === 0 ? banners.length - 1 : prev - 1))}
                  className="w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setCurrentIndex(prev => (prev + 1) % banners.length)}
                  className="w-7 h-7 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center transition-colors cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Side Promo Card (Matching Screenshot "100% ORGANIC FOOD - Feel Winter Wonders") */}
        <div className="lg:col-span-4 bg-gradient-to-br from-[#0b4d2b] to-[#004d1a] rounded-xl overflow-hidden shadow-sm relative min-h-[220px] lg:min-h-[360px] flex flex-col justify-between p-6 text-white group">
          <img
            src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80"
            alt="Organic Vegetables"
            className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-40 group-hover:scale-105 transition-transform duration-500"
          />

          <div className="relative z-10 space-y-2">
            <span className="bg-amber-400 text-gray-900 text-[11px] font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">
              {language === 'bn' ? 'শীতকালীন স্পেশাল' : 'SPECIAL SEASON'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight uppercase">
              100% <br />
              <span className="text-amber-300">ORGANIC</span> <br />
              FOOD
            </h3>
            <p className="text-xs text-white/90">
              {language === 'bn' ? 'প্রকৃতির খাঁটি স্বাদে শীতের অনন্য আমেজ' : 'Feel Winter Wonders with Pure Taste'}
            </p>
          </div>

          <div className="relative z-10 pt-4">
            <button
              onClick={() => {
                setSelectedCategory('cat-4');
                setCurrentView('catalog');
              }}
              className="bg-white hover:bg-amber-300 text-gray-900 text-xs font-extrabold uppercase px-5 py-2 rounded tracking-wider shadow transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'অর্ডার করুন' : 'ORDER NOW'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
