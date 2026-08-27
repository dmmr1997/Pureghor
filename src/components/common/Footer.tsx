import React from 'react';
import { useStore } from '../../context/StoreContext';
import { PureGhorLogo } from './PureGhorLogo';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Headphones,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { language, storeSettings, setCurrentView, setSelectedCategory, categories } = useStore();

  return (
    <footer className="mt-16 bg-[#003612] text-white">
      {/* Benefit Guarantee Bar matching screenshot */}
      <div className="border-b border-emerald-900 bg-[#01542e]">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  {language === 'bn' ? 'খাঁটি অর্গানিক পণ্য' : '100% Pure Organic'}
                </h4>
                <p className="text-xs text-white/75 mt-0.5">
                  {language === 'bn' ? 'প্রাকৃতিক ও নিরাপদ উপাদান' : 'Natural & chemical free items'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <Truck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  {language === 'bn' ? 'দ্রুত ডেলিভারি' : 'Fast Delivery'}
                </h4>
                <p className="text-xs text-white/75 mt-0.5">
                  {language === 'bn' ? 'সারাদেশে দ্রুত পৌঁছে যায়' : 'Safe door-to-door shipping'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <CreditCard size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  {language === 'bn' ? 'নিরাপদ পেমেন্ট' : 'Secure Payment'}
                </h4>
                <p className="text-xs text-white/75 mt-0.5">
                  {language === 'bn' ? '১০০% সুরক্ষিত ক্যাশ ও অনলাইন' : 'COD and instant mobile money'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 shrink-0">
                <Headphones size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm sm:text-base">
                  {language === 'bn' ? 'সহজ সাপোর্ট' : 'Dedicated Support'}
                </h4>
                <p className="text-xs text-white/75 mt-0.5">
                  {language === 'bn' ? 'দ্রুত সহায়তা সবসময় প্রস্তুত' : 'Friendly customer care helpline'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4">
            <PureGhorLogo
              lightMode
              size="lg"
              taglineText={language === 'bn' ? '১০০% খাঁটি ও অর্গানিক পণ্যের ঘর' : '100% Pure & Organic Essentials'}
            />

            <p className="text-xs leading-relaxed text-white/80">
              {language === 'bn'
                ? 'ভেজালযুক্ত খাবারের ভিড়ে খাঁটি পণ্য পৌঁছে দিতে নিরলস কাজ করছে পিউর ঘর (PureGhor)। আমাদের সুন্দরবনের খাঁটি মধু, কাঠের ঘানির সরিষার তেল, খাঁটি গাওয়া ঘি ও যশোরের খেজুর গুড় সরাসরি উৎপাদক থেকে আপনার ঘরে পৌঁছে দেওয়া হয়।'
                : 'PureGhor is your trusted destination for 100% natural, unadulterated organic food items, wild honey, cold-pressed oils, pure cow ghee, and traditional sweets sourced directly from pristine regions of Bangladesh.'}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={storeSettings.facebookUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a
                href={storeSettings.youtubeUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="YouTube"
              >
                <Youtube size={16} />
              </a>
              <a
                href={storeSettings.instagramUrl || '#'}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div>
            <h3 className="text-base font-bold mb-4 pb-1 border-b border-white/20 inline-block">
              {language === 'bn' ? 'আমাদের পণ্যসমূহ' : 'Our Products'}
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setCurrentView('catalog');
                    }}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left"
                  >
                    <ArrowRight size={12} className="text-emerald-400" />
                    <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentView('catalog');
                  }}
                  className="hover:text-amber-300 font-semibold text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight size={12} />
                  <span>{language === 'bn' ? 'সব পণ্য দেখুন' : 'View All Products'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h3 className="text-base font-bold mb-4 pb-1 border-b border-white/20 inline-block">
              {language === 'bn' ? 'আমাদের গ্রাহক সেবা' : 'Customer Service'}
            </h3>
            <ul className="space-y-2 text-xs text-white/80">
              <li>
                <button
                  onClick={() => setCurrentView('customer-account')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight size={12} className="text-emerald-400" />
                  <span>{language === 'bn' ? 'আমার একাউন্ট' : 'My Account'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('track-order')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight size={12} className="text-emerald-400" />
                  <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Your Order'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('wishlist')}
                  className="hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowRight size={12} className="text-emerald-400" />
                  <span>{language === 'bn' ? 'উইশলিস্ট ও প্রিয় পণ্য' : 'Wishlist & Favorites'}</span>
                </button>
              </li>
              <li>
                <span className="text-white/60 flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-emerald-400" />
                  <span>{language === 'bn' ? 'রিটার্ন ও রিফান্ড পলিসি' : 'Return & Refund Policy'}</span>
                </span>
              </li>
              <li>
                <span className="text-white/60 flex items-center gap-1.5">
                  <ArrowRight size={12} className="text-emerald-400" />
                  <span>{language === 'bn' ? 'সচরাচর জিজ্ঞাস্য (FAQ)' : 'Frequently Asked Questions'}</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div>
            <h3 className="text-base font-bold mb-4 pb-1 border-b border-white/20 inline-block">
              {language === 'bn' ? 'যোগাযোগের সকল তথ্য' : 'Contact Information'}
            </h3>
            <div className="space-y-3 text-xs text-white/80">
              <div className="flex items-start gap-2.5">
                <MapPin size={16} className="text-amber-300 shrink-0 mt-0.5" />
                <span>{language === 'bn' ? storeSettings.addressBn : storeSettings.addressEn}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-amber-300 shrink-0" />
                <a href={`tel:${storeSettings.phonePrimary.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-300">
                  {storeSettings.phonePrimary}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone size={16} className="text-amber-300 shrink-0" />
                <a href={`tel:${storeSettings.phoneSecondary.replace(/[^0-9+]/g, '')}`} className="hover:text-amber-300">
                  {storeSettings.phoneSecondary}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail size={16} className="text-amber-300 shrink-0" />
                <a href={`mailto:${storeSettings.email}`} className="hover:text-amber-300">
                  {storeSettings.email}
                </a>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-white/10">
              <button
                onClick={() => setCurrentView('catalog')}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded text-xs transition-colors cursor-pointer"
              >
                {language === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Start Shopping'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar matching screenshot */}
      <div className="bg-[#00381d] text-center text-xs text-white/60 py-3.5 px-4 border-t border-white/5">
        <p>
          Copyright All Reserved 2026 | Made by <span className="text-amber-300 font-medium">Borbila</span>
        </p>
      </div>
    </footer>
  );
};
