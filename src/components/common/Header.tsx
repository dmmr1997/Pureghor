import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  ShoppingCart,
  Heart,
  PhoneCall,
  User,
  Menu,
  X,
  Truck,
  ChevronDown,
  LayoutDashboard,
  Sparkles,
  Flame,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { api } from '../../services/api';
import { PureGhorLogo } from './PureGhorLogo';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    currentView,
    setCurrentView,
    selectedCategory,
    setSelectedCategory,
    categories,
    cartCount,
    setIsCartDrawerOpen,
    wishlist,
    searchQuery,
    setSearchQuery,
    storeSettings,
    addToast,
    refreshProducts,
  } = useStore();

  const { isAdminLoggedIn, adminUser, customerUser, isCustomerLoggedIn } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentView('catalog');
    setMobileMenuOpen(false);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setCurrentView('catalog');
    setCategoryDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-gray-100 font-sans">
      {/* Top Announcement & Quick Contact Bar (Clean & Streamlined) */}
      <div className="bg-[#003612] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Announcement */}
          <div className="flex items-center gap-2 overflow-hidden text-left">
            <span className="bg-[#52b202] text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0">
              ১০০% বিশুদ্ধ
            </span>
            <p className="truncate text-[11px] sm:text-xs text-white/90 font-medium">
              {storeSettings.announcementBn || '🎉 পিউর ঘরে বিশেষ অফার চলছে! সারাদেশে দ্রুত হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা!'}
            </p>
          </div>

          {/* Quick Right Links */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-white/90 shrink-0">
            <button
              onClick={() => setCurrentView('track-order')}
              className="hover:text-[#52b202] transition-colors flex items-center gap-1 cursor-pointer font-medium"
            >
              <Truck size={13} className="text-[#52b202]" />
              <span>অর্ডার ট্র্যাক</span>
            </button>

            <span className="text-white/30 hidden sm:inline">|</span>

            {/* Admin Quick Switch */}
            <button
              onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
              className={`flex items-center gap-1 font-semibold transition-colors px-2 py-0.5 rounded cursor-pointer ${
                currentView === 'admin'
                  ? 'bg-amber-400 text-gray-900 font-bold'
                  : 'bg-white/10 hover:bg-white/20 text-white/80'
              }`}
            >
              <LayoutDashboard size={11} />
              <span>{currentView === 'admin' ? 'স্টোর' : 'অ্যাডমিন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#004d1a] rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              aria-label="মেনু খুলুন"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Logo */}
            <div
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setCurrentView('home');
              }}
              className="flex items-center cursor-pointer group py-0.5"
            >
              <PureGhorLogo
                size="md"
                taglineText={language === 'bn' ? '১০০% বিশুদ্ধ অর্গানিক শপ' : '100% Pure Organic Store'}
              />
            </div>
          </div>

          {/* Search Box - Desktop Center */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl items-center border-2 border-[#004d1a] focus-within:border-[#52b202] rounded-xl overflow-hidden bg-white shadow-xs transition-all"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn'
                  ? 'পণ্য খুঁজুন (যেমন: সুন্দরবনের মধু, গাওয়া ঘি, সরিষার তেল...)'
                  : 'Search products (e.g., Sundarban Honey, Pure Ghee...)'
              }
              className="flex-1 px-4 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 text-gray-400 hover:text-gray-600 mr-1"
              >
                <X size={15} />
              </button>
            )}
            <button
              type="submit"
              className="bg-[#004d1a] hover:bg-[#003612] text-white px-5 py-2.5 text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search size={16} />
              <span>{language === 'bn' ? 'খুঁজুন' : 'Search'}</span>
            </button>
          </form>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="relative p-2 text-gray-700 hover:text-[#004d1a] transition-colors rounded-full hover:bg-emerald-50 cursor-pointer hidden sm:flex items-center justify-center"
              title={language === 'bn' ? 'পছন্দের তালিকা' : 'Wishlist'}
              aria-label="Wishlist"
            >
              <Heart size={22} className={wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Button with Count */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-gray-800 hover:text-[#004d1a] transition-all rounded-xl hover:bg-emerald-50 cursor-pointer border border-transparent hover:border-emerald-200"
              title={language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
              aria-label="Cart"
            >
              <div className="relative">
                <ShoppingCart size={22} className="text-[#004d1a]" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#52b202] text-white text-[11px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center shadow-xs animate-scale">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-bold text-gray-700 hidden md:inline">
                {language === 'bn' ? 'কার্ট' : 'Cart'}
              </span>
            </button>

            {/* Account Profile */}
            <button
              onClick={() => setCurrentView('customer-account')}
              className="p-2 text-gray-700 hover:text-[#004d1a] transition-colors rounded-full hover:bg-emerald-50 cursor-pointer flex items-center gap-1"
              title={language === 'bn' ? 'আমার অ্যাকাউন্ট' : 'My Account'}
              aria-label="Account"
            >
              <User size={21} />
            </button>

            {/* Hotline Call Button */}
            <a
              href={`tel:${storeSettings.phonePrimary.replace(/[^0-9+]/g, '')}`}
              className="bg-[#004d1a] hover:bg-[#52b202] text-white px-3 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs hover:shadow transition-all whitespace-nowrap cursor-pointer"
            >
              <PhoneCall size={15} className="text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">{storeSettings.phonePrimary}</span>
              <span className="sm:hidden">{language === 'bn' ? 'কল' : 'Call'}</span>
            </a>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mt-2.5 flex md:hidden items-center border border-[#004d1a] rounded-lg overflow-hidden bg-white shadow-xs">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'পণ্য খুঁজুন (মধু, ঘি, তেল...)' : 'Search products...'}
            className="flex-1 px-3 py-2 text-xs text-gray-800 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#004d1a] text-white px-4 py-2 text-xs font-bold flex items-center justify-center"
          >
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* Clean & Streamlined Desktop Navigation Bar */}
      <nav className="bg-[#004d1a] text-white hidden lg:block border-t border-[#003612]/30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs xl:text-sm font-semibold">
          {/* Main Primary Links */}
          <div className="flex items-center space-x-1 py-1">
            {/* 1. All Categories Dropdown Menu */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                className="bg-[#52b202] hover:bg-[#449900] text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors cursor-pointer shadow-xs mr-2"
              >
                <Layers size={16} />
                <span>সকল ক্যাটাগরি</span>
                <ChevronDown size={14} className={`transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Clean Category Dropdown */}
              {categoryDropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-72 bg-white text-gray-800 rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 border-b border-gray-100 text-[11px] font-extrabold uppercase tracking-wider text-gray-400">
                    প্রধান ক্যাটাগরিসমূহ
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => handleCategorySelect(null)}
                      className="w-full px-3.5 py-2 text-left text-xs sm:text-sm font-semibold hover:bg-emerald-50 hover:text-[#004d1a] flex items-center justify-between cursor-pointer"
                    >
                      <span>সকল পণ্য দেখুন</span>
                      <ArrowRight size={14} className="text-gray-400" />
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategorySelect(cat.id)}
                        className={`w-full px-3.5 py-2 text-left text-xs sm:text-sm font-medium hover:bg-emerald-50 hover:text-[#004d1a] flex items-center justify-between cursor-pointer ${
                          selectedCategory === cat.id ? 'bg-emerald-50 text-[#004d1a] font-bold' : ''
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{cat.icon}</span>
                          <span>{cat.nameBn}</span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Homepage */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setCurrentView('home');
              }}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'home' && !selectedCategory
                  ? 'bg-white/20 text-white font-bold'
                  : 'hover:bg-white/10 text-white/90'
              }`}
            >
              হোমপেজ
            </button>

            {/* 3. All Products */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('catalog');
              }}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'catalog' && !selectedCategory
                  ? 'bg-white/20 text-white font-bold'
                  : 'hover:bg-white/10 text-white/90'
              }`}
            >
              সকল পণ্য
            </button>

            {/* 4. Special Hot Deals */}
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('offers');
              }}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'offers'
                  ? 'bg-white/20 text-amber-300 font-bold'
                  : 'hover:bg-white/10 text-amber-300 font-bold'
              }`}
            >
              <Flame size={14} className="text-amber-400 animate-bounce" />
              <span>হট অফার</span>
            </button>

            {/* 5. Order Tracking */}
            <button
              onClick={() => setCurrentView('track-order')}
              className={`px-3 py-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                currentView === 'track-order'
                  ? 'bg-white/20 text-white font-bold'
                  : 'hover:bg-white/10 text-white/90'
              }`}
            >
              <Truck size={14} />
              <span>অর্ডার ট্র্যাক</span>
            </button>
          </div>

          {/* Clean Right Notice: Free Shipping & Delivery Info */}
          <div className="flex items-center gap-3 text-white/90 text-xs py-1">
            <span className="text-[#a3d977] font-semibold flex items-center gap-1">
              <Truck size={14} /> সারা বাংলাদেশে ক্যাশ অন ডেলিভারি
            </span>
          </div>
        </div>
      </nav>

      {/* Clean Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Header */}
            <div className="p-4 bg-[#004d1a] text-white flex items-center justify-between">
              <PureGhorLogo lightMode size="sm" taglineText={language === 'bn' ? '১০০% বিশুদ্ধ অর্গানিক' : '100% Pure Organic'} />
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav Body */}
            <div className="p-4 space-y-4 flex-1">
              {/* Primary Shortcuts */}
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setCurrentView('home');
                    setSelectedCategory(null);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-between ${
                    currentView === 'home' ? 'bg-emerald-50 text-[#004d1a]' : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span>হোমপেজ</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentView('catalog');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-between ${
                    currentView === 'catalog' && !selectedCategory
                      ? 'bg-emerald-50 text-[#004d1a]'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span>সকল পণ্য</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentView('offers');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl font-bold text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5">
                    <Flame size={16} className="text-amber-600" />
                    <span>হট অফার ও ডিসকাউন্ট</span>
                  </span>
                  <span className="text-[10px] bg-rose-600 text-white font-extrabold px-1.5 py-0.5 rounded-full">
                    HOT
                  </span>
                </button>
              </div>

              {/* Categories Section */}
              <div className="pt-2 border-t border-gray-100">
                <span className="text-[11px] font-black text-gray-400 uppercase tracking-wider block mb-2 px-1">
                  জনপ্রিয় ক্যাটাগরি
                </span>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategorySelect(cat.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center justify-between ${
                        selectedCategory === cat.id
                          ? 'bg-emerald-50 text-[#004d1a] font-bold'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span>{cat.nameBn}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Account & Tracking */}
              <div className="pt-2 border-t border-gray-100 space-y-1">
                <button
                  onClick={() => {
                    setCurrentView('track-order');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                >
                  <Truck size={16} className="text-[#004d1a]" />
                  <span>অর্ডার ট্র্যাক করুন</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('customer-account');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 font-medium"
                >
                  <User size={16} className="text-[#004d1a]" />
                  <span>আমার একাউন্ট</span>
                </button>

                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2.5 rounded-lg text-xs sm:text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2 font-medium"
                >
                  <LayoutDashboard size={16} className="text-gray-400" />
                  <span>অ্যাডমিন প্যানেল</span>
                </button>
              </div>
            </div>

            {/* Mobile Footer Call Button */}
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <a
                href={`tel:${storeSettings.phonePrimary.replace(/[^0-9+]/g, '')}`}
                className="w-full bg-[#004d1a] hover:bg-[#52b202] text-white py-3 rounded-xl text-center text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <PhoneCall size={16} className="text-amber-300" />
                <span>{storeSettings.phonePrimary}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
