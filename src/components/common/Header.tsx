import React, { useState } from 'react';
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
  ShieldCheck,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  LogOut,
  RotateCcw,
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

  const { isAdminLoggedIn, adminUser, adminLogout, customerUser, isCustomerLoggedIn } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedSearchCat, setSelectedSearchCat] = useState<string>('all');
  const [showAdminMenu, setShowAdminMenu] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSearchCat !== 'all') {
      setSelectedCategory(selectedSearchCat);
    }
    setCurrentView('catalog');
    setMobileMenuOpen(false);
  };

  const handleResetData = async () => {
    if (confirm('আপনি কি ডেমো ডাটা রিসেট করতে চান? (Are you sure you want to reset demo data?)')) {
      try {
        setIsResetting(true);
        await api.resetDatabase();
        await refreshProducts();
        addToast(language === 'bn' ? 'ডাটাবেজ সফলভাবে রিসেট হয়েছে!' : 'Database successfully reset to seed data!', 'success');
      } catch (e) {
        addToast('Reset failed', 'error');
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
      {/* Top Announcement Bar */}
      {storeSettings.announcementActive && (
        <div className="bg-[#0b4d2b] text-white text-xs py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
            <div className="flex items-center gap-2 overflow-hidden text-center sm:text-left">
              <span className="bg-[#cc3366] text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded text-white shrink-0">
                {language === 'bn' ? 'অফার' : 'OFFER'}
              </span>
              <p className="truncate text-[11px] sm:text-xs">
                {language === 'bn' ? storeSettings.announcementBn : storeSettings.announcementEn}
              </p>
            </div>

            <div className="flex items-center gap-3 text-[11px] sm:text-xs text-white/90 shrink-0">
              <button
                onClick={() => setCurrentView('track-order')}
                className="hover:text-amber-300 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Truck size={13} />
                <span>{language === 'bn' ? 'অর্ডার ট্র্যাক' : 'Track Order'}</span>
              </button>

              <span className="text-white/40">|</span>

              {/* Language Switcher */}
              <button
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="hover:text-amber-300 font-semibold transition-colors px-1 cursor-pointer"
              >
                {language === 'bn' ? 'English' : 'বাংলা'}
              </button>

              <span className="text-white/40">|</span>

              {/* Quick Admin Access */}
              <button
                onClick={() => setCurrentView(currentView === 'admin' ? 'home' : 'admin')}
                className={`flex items-center gap-1 font-semibold transition-colors px-1.5 py-0.5 rounded cursor-pointer ${
                  currentView === 'admin'
                    ? 'bg-amber-400 text-gray-900'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
              >
                <LayoutDashboard size={12} />
                <span>{currentView === 'admin' ? 'Store' : 'Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 md:gap-6">
          {/* Mobile Menu Trigger & Brand Logo */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-gray-700 hover:text-[#004d1a] rounded-md border border-gray-200"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* PureGhor Logo */}
            <div
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setCurrentView('home');
              }}
              className="flex items-center cursor-pointer group py-1"
            >
              <PureGhorLogo
                size="md"
                taglineText={language === 'bn' ? '১০০% বিশুদ্ধ অর্গানিক শপ' : '100% Pure Organic Store'}
              />
            </div>
          </div>

          {/* Search Box - Center Desktop */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-2xl items-center border-2 border-[#004d1a] rounded-md overflow-hidden bg-white shadow-sm"
          >
            {/* Category Dropdown inside Search */}
            <div className="relative border-r border-gray-200 bg-gray-50 text-gray-700 text-xs sm:text-sm font-medium">
              <select
                value={selectedSearchCat}
                onChange={e => setSelectedSearchCat(e.target.value)}
                className="appearance-none bg-transparent pl-3 pr-7 py-2 text-xs font-semibold focus:outline-none cursor-pointer"
              >
                <option value="all">{language === 'bn' ? 'সব দেখুন' : 'All Categories'}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {language === 'bn' ? cat.nameBn : cat.nameEn}
                  </option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={language === 'bn' ? 'প্রোডাক্ট খুঁজুন (মধু, ঘি, তেল, বাদাম...)' : 'Search products (Honey, Ghee, Oil...)'}
              className="flex-1 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none"
            />

            <button
              type="submit"
              className="bg-[#004d1a] hover:bg-[#01542e] text-white px-5 py-2 text-sm font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Search size={16} />
              <span>{language === 'bn' ? 'খুঁজুন' : 'Search'}</span>
            </button>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Wishlist Icon */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className="relative p-2 text-gray-700 hover:text-[#004d1a] transition-colors rounded-full hover:bg-gray-100 cursor-pointer hidden sm:flex items-center justify-center"
              title={language === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}
            >
              <Heart size={22} className={wishlist.length > 0 ? 'fill-[#cc3366] text-[#cc3366]' : ''} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#cc3366] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Icon */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 p-2 text-gray-700 hover:text-[#004d1a] transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
              title={language === 'bn' ? 'শপিং কার্ট' : 'Shopping Cart'}
            >
              <div className="relative">
                <ShoppingCart size={24} className="text-gray-800" />
                <span className="absolute -top-1.5 -right-2 bg-[#004d1a] text-white text-[11px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              </div>
            </button>

            {/* Account / Login */}
            <button
              onClick={() => setCurrentView('customer-account')}
              className="p-2 text-gray-700 hover:text-[#004d1a] transition-colors rounded-full hover:bg-gray-100 cursor-pointer flex items-center gap-1.5"
              title={language === 'bn' ? 'আমার একাউন্ট' : 'My Account'}
            >
              <User size={22} />
              {isCustomerLoggedIn && (
                <span className="text-xs font-semibold text-gray-700 hidden lg:inline max-w-[80px] truncate">
                  {customerUser?.name?.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Call to Order Button (as seen in screenshot) */}
            <a
              href={`tel:${storeSettings.phonePrimary.replace(/[^0-9+]/g, '')}`}
              className="bg-[#004d1a] hover:bg-[#0b4d2b] text-white px-3 sm:px-4 py-2 rounded-md font-semibold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm hover:shadow transition-all whitespace-nowrap cursor-pointer"
            >
              <PhoneCall size={16} className="text-amber-300 animate-bounce" />
              <span className="hidden xs:inline">{language === 'bn' ? 'কল করুন' : 'Call to Order'}</span>
            </a>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearch} className="mt-2.5 flex md:hidden items-center border border-[#004d1a] rounded-md overflow-hidden">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={language === 'bn' ? 'পণ্য খুঁজুন...' : 'Search products...'}
            className="flex-1 px-3 py-1.5 text-xs text-gray-800 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#004d1a] text-white px-3.5 py-1.5 text-xs font-medium flex items-center justify-center"
          >
            <Search size={14} />
          </button>
        </form>
      </div>

      {/* Main Categories Navigation Bar (Matching Screenshot Green Header Bar) */}
      <nav className="bg-[#004d1a] text-white border-t border-[#0b4d2b] hidden lg:block overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-xs xl:text-sm font-medium tracking-wide">
          <div className="flex items-center space-x-1 py-1">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setSearchQuery('');
                setCurrentView('home');
              }}
              className={`px-3 py-2 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'home' && !selectedCategory
                  ? 'bg-[#0b4d2b] text-amber-300 font-bold'
                  : 'hover:bg-[#01542e] text-white'
              }`}
            >
              {language === 'bn' ? 'হোমপেজ' : 'Homepage'}
            </button>

            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('offers');
              }}
              className={`px-3 py-2 rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                currentView === 'offers'
                  ? 'bg-[#0b4d2b] text-amber-300 font-bold'
                  : 'hover:bg-[#01542e] text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#cc3366] animate-pulse"></span>
              {language === 'bn' ? 'অফার ও ছাড়' : 'Offers & Deals'}
            </button>

            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentView('catalog');
              }}
              className={`px-3 py-2 rounded transition-colors whitespace-nowrap cursor-pointer ${
                currentView === 'catalog' && !selectedCategory
                  ? 'bg-[#0b4d2b] text-amber-300 font-bold'
                  : 'hover:bg-[#01542e] text-white'
              }`}
            >
              {language === 'bn' ? 'সকল পণ্য' : 'All Products'}
            </button>

            {/* Category tabs matching screenshot */}
            {categories.slice(0, 9).map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentView('catalog');
                }}
                className={`px-2.5 py-2 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#0b4d2b] text-amber-300 font-bold'
                    : 'hover:bg-[#01542e] text-white/90'
                }`}
              >
                {language === 'bn' ? cat.nameBn : cat.nameEn}
              </button>
            ))}
          </div>

          {/* Quick Hotline on Right */}
          <div className="flex items-center gap-2 text-white/90 shrink-0 text-xs py-1">
            <span className="font-semibold text-amber-300">হটলাইন: {storeSettings.phonePrimary}</span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 bg-[#004d1a] text-white flex items-center justify-between">
              <PureGhorLogo lightMode size="sm" taglineText={language === 'bn' ? '১০০% বিশুদ্ধ অর্গানিক' : '100% Pure Organic'} />
              <button onClick={() => setMobileMenuOpen(false)} className="p-1 hover:bg-white/10 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Nav list */}
            <div className="p-3 divide-y divide-gray-100 flex-1">
              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentView('home');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded font-semibold text-gray-800 hover:bg-gray-100"
                >
                  {language === 'bn' ? 'হোমপেজ' : 'Homepage'}
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentView('offers');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded font-semibold text-[#cc3366] hover:bg-pink-50 flex items-center justify-between"
                >
                  <span>{language === 'bn' ? 'বিশেষ অফার ও ছাড়' : 'Special Offers'}</span>
                  <span className="text-[10px] bg-[#cc3366] text-white px-1.5 py-0.5 rounded font-bold">HOT</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentView('catalog');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded font-semibold text-gray-800 hover:bg-gray-100"
                >
                  {language === 'bn' ? 'সকল পণ্য' : 'All Products'}
                </button>
              </div>

              <div className="py-2">
                <span className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Categories'}
                </span>
                <div className="mt-1 space-y-0.5">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setSelectedCategory(cat.id);
                        setCurrentView('catalog');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-[#004d1a]/10 hover:text-[#004d1a] flex items-center gap-2 font-medium"
                    >
                      <span>{cat.icon}</span>
                      <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-2 space-y-1">
                <button
                  onClick={() => {
                    setCurrentView('track-order');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Truck size={16} />
                  <span>{language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('customer-account');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                >
                  <User size={16} />
                  <span>{language === 'bn' ? 'আমার একাউন্ট' : 'My Account'}</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentView('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 rounded text-sm text-amber-700 bg-amber-50 hover:bg-amber-100 flex items-center gap-2 font-semibold"
                >
                  <LayoutDashboard size={16} />
                  <span>{language === 'bn' ? 'অ্যাডমিন প্যানেল' : 'Admin Panel'}</span>
                </button>
              </div>
            </div>

            {/* Call support footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <a
                href={`tel:${storeSettings.phonePrimary.replace(/[^0-9+]/g, '')}`}
                className="w-full bg-[#004d1a] text-white py-2.5 rounded text-center text-sm font-semibold flex items-center justify-center gap-2"
              >
                <PhoneCall size={16} />
                <span>{storeSettings.phonePrimary}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
