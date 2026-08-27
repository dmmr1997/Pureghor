import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Leaf, Sprout, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { language, setCurrentView, setSelectedCategory } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 pt-4 sm:pt-6">
      <div
        id="pureghor-hero-banner"
        className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-emerald-900/10 bg-[#f7faf4] min-h-[480px] sm:min-h-[520px] md:min-h-[560px] lg:min-h-[600px] flex items-center"
      >
        {/* Background Store & Interior Image on the Right */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/hero-pureghor-store.jpg"
            alt="PureGhor Organic Store Counter"
            className="w-full h-full object-cover object-right md:object-center"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/products/pureghor_hero_bg_1787810122640.jpg';
            }}
          />
          {/* Seamless Gradient Fade to blend cleanly with Left Typography */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f7faf4] via-[#f7faf4]/95 via-35% md:via-48% to-transparent lg:to-transparent/10" />
          {/* Subtle top/bottom edge soft vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10" />
        </div>

        {/* Decorative Floating Leaves (Matching the screenshot artwork) */}
        <div className="absolute -left-4 top-6 w-20 h-20 opacity-80 pointer-events-none z-10 animate-pulse-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-[#52b202] drop-shadow-md">
            <path d="M10,80 C30,30 70,20 90,10 C80,50 60,80 10,80 Z" />
          </svg>
        </div>

        <div className="absolute left-1/4 -top-3 w-12 h-12 opacity-60 pointer-events-none z-10 rotate-45">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-[#004d1a]">
            <path d="M10,80 C30,30 70,20 90,10 C80,50 60,80 10,80 Z" />
          </svg>
        </div>

        <div className="absolute left-6 bottom-16 w-16 h-16 opacity-70 pointer-events-none z-10 -rotate-12">
          <svg viewBox="0 0 100 100" className="w-full h-full fill-[#52b202] drop-shadow-sm">
            <path d="M10,80 C30,30 70,20 90,10 C80,50 60,80 10,80 Z" />
          </svg>
        </div>

        {/* Left Side Content & Typography */}
        <div className="relative z-10 w-full max-w-2xl px-6 sm:px-10 md:px-14 py-10 sm:py-14 space-y-6 sm:space-y-7">
          {/* Pill Badge: ১০০% প্রাকৃতিক ও বিশুদ্ধ */}
          <div className="inline-flex items-center gap-2 bg-[#e8f7d4] border border-[#a6e260] px-4 py-1.5 rounded-full shadow-xs">
            <div className="w-5 h-5 rounded-full bg-[#52b202] flex items-center justify-center text-white">
              <Leaf size={12} className="stroke-[2.5]" />
            </div>
            <span className="text-xs sm:text-sm font-extrabold text-[#004d1a] tracking-wide">
              {language === 'bn' ? '১০০% প্রাকৃতিক ও বিশুদ্ধ' : '100% Natural & Pure'}
            </span>
          </div>

          {/* Main Title: বিশুদ্ধ খাবার, সুস্থ জীবনের সাথী */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black leading-[1.18] text-[#004d1a] tracking-tight">
              {language === 'bn' ? (
                <>
                  বিশুদ্ধ খাবার, <br />
                  <span className="text-[#004d1a]">সুস্থ জীবনের সাথী</span>
                </>
              ) : (
                <>
                  Pure Food, <br />
                  <span className="text-[#004d1a]">Healthy Life Partner</span>
                </>
              )}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm sm:text-base md:text-lg text-gray-700 font-medium leading-relaxed max-w-xl">
            {language === 'bn' ? (
              <>
                আপনার সুস্থ জীবনযাপনের জন্য বেছে নিন <br className="hidden sm:inline" />
                ১০০% প্রাকৃতিক, অর্গানিক ও ভরসাযোগ্য পণ্য।
              </>
            ) : (
              'Choose 100% natural, certified organic, and trustworthy foods for your healthy living.'
            )}
          </p>

          {/* CTA Action Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 pt-1">
            <button
              id="hero-order-now-btn"
              onClick={() => {
                setSelectedCategory('all');
                setCurrentView('catalog');
              }}
              className="bg-[#004d1a] hover:bg-[#52b202] text-white font-black px-7 py-3.5 rounded-xl text-sm sm:text-base flex items-center gap-2.5 shadow-md hover:shadow-xl transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
            >
              <ShoppingBag size={19} />
              <span>{language === 'bn' ? 'এখনই অর্ডার করুন' : 'Order Now'}</span>
              <ArrowRight size={17} />
            </button>

            <button
              id="hero-explore-products-btn"
              onClick={() => {
                const el = document.getElementById('pureghor-category-section');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                } else {
                  setCurrentView('catalog');
                }
              }}
              className="bg-white/80 hover:bg-white text-[#004d1a] border-2 border-[#004d1a]/20 hover:border-[#004d1a] font-bold px-6 py-3.5 rounded-xl text-sm sm:text-base transition-all duration-200 shadow-xs cursor-pointer"
            >
              <span>{language === 'bn' ? 'পণ্যসমূহ দেখুন' : 'Explore Items'}</span>
            </button>
          </div>

          {/* 3 Quality & Trust Badges (Exact design from the screenshot) */}
          <div className="pt-4 border-t border-emerald-900/10 flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6">
            {/* Feature 1: ১০০% প্রাকৃতিক */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#52b202] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Leaf size={20} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#004d1a] leading-tight">
                  {language === 'bn' ? '১০০% প্রাকৃতিক' : '100% Natural'}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-600 font-medium">
                  {language === 'bn' ? 'নিরাপদ ও বিশুদ্ধ' : 'Safe & Pure'}
                </p>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="hidden sm:block w-px h-8 bg-emerald-900/15" />

            {/* Feature 2: অর্গানিক পণ্য */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#52b202] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sprout size={20} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#004d1a] leading-tight">
                  {language === 'bn' ? 'অর্গানিক পণ্য' : 'Organic Product'}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-600 font-medium">
                  {language === 'bn' ? 'রাসায়নিকমুক্ত' : 'Chemical Free'}
                </p>
              </div>
            </div>

            {/* Vertical Separator */}
            <div className="hidden sm:block w-px h-8 bg-emerald-900/15" />

            {/* Feature 3: বিশ্বস্ত মান */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#52b202] text-white flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck size={20} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-extrabold text-[#004d1a] leading-tight">
                  {language === 'bn' ? 'বিশ্বস্ত মান' : 'Trusted Quality'}
                </h4>
                <p className="text-[11px] sm:text-xs text-gray-600 font-medium">
                  {language === 'bn' ? 'ল্যাব টেস্টেড' : 'Lab Tested'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
