import React, { useState, useEffect } from 'react';
import { useStore } from './context/StoreContext';
import { useAuth } from './context/AuthContext';

// Common Components
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { FloatingSupportWidget } from './components/common/FloatingSupportWidget';

// Storefront Components
import { HeroBanner } from './components/storefront/HeroBanner';
import { CategoryCarousel } from './components/storefront/CategoryCarousel';
import { SpecialDealsSection } from './components/storefront/SpecialDealsSection';
import { ProductGrid } from './components/storefront/ProductGrid';
import { ProductCard } from './components/storefront/ProductCard';
import { QuickOrderModal } from './components/storefront/QuickOrderModal';
import { QuickViewModal } from './components/storefront/QuickViewModal';
import { CartDrawer } from './components/storefront/CartDrawer';
import { ProductDetailView } from './components/storefront/ProductDetailView';
import { CheckoutView } from './components/storefront/CheckoutView';
import { OrderTrackingView } from './components/storefront/OrderTrackingView';
import { CustomerAccountView } from './components/storefront/CustomerAccountView';
import { WishlistView } from './components/storefront/WishlistView';

// Admin Components
import { AdminLayout, AdminTab } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminProducts } from './components/admin/AdminProducts';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminInventory } from './components/admin/AdminInventory';
import { AdminCategories } from './components/admin/AdminCategories';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminReviews } from './components/admin/AdminReviews';
import { AdminBanners } from './components/admin/AdminBanners';
import { AdminSettings } from './components/admin/AdminSettings';

// Icons & Types
import {
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  Home,
  ShoppingBag,
  Heart,
  User,
  SlidersHorizontal,
  ArrowUpDown,
  Lock,
  Sparkles,
} from 'lucide-react';
import { Order } from './types';

export function App() {
  const {
    currentView,
    setCurrentView,
    products,
    categories,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
    language,
    cartCount,
    setIsCartDrawerOpen,
    storeSettings,
  } = useStore();

  const { isAdminLoggedIn, adminLogin, adminUser } = useAuth();

  // Admin state
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [adminSelectedOrder, setAdminSelectedOrder] = useState<Order | null>(null);

  // Admin login form states
  const [adminEmail, setAdminEmail] = useState('admin@pureghor.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);

  // Catalog View Filter States
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'popular' | 'rating'>('default');
  const [priceRange, setPriceRange] = useState<number>(2000);
  const [onlyInStock, setOnlyInStock] = useState(false);

  // Scroll to top on view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView, selectedCategorySlug]);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError('');
    setIsAdminSubmitting(true);
    const success = await adminLogin(adminEmail, adminPassword);
    setIsAdminSubmitting(false);
    if (success) {
      setCurrentView('admin');
    } else {
      setAdminLoginError('ভুল ইমেইল বা পাসওয়ার্ড। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    }
  };

  // If in admin view but not authenticated, render Admin Login screen
  if (currentView === 'admin' && !isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100">
        <ToastContainer />
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 flex items-center justify-center mx-auto text-white shadow-lg">
              <Lock size={28} />
            </div>
            <h2 className="text-2xl font-black text-slate-100 tracking-tight">পিউর ঘর অ্যাডমিন প্যানেল</h2>
            <p className="text-xs text-slate-400">
              PureGhor Management Dashboard-এ প্রবেশ করতে লগইন করুন
            </p>
          </div>

          {adminLoginError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-lg text-xs font-semibold">
              {adminLoginError}
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">অ্যাডমিন ইমেইল (Email)</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">পাসওয়ার্ড (Password)</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isAdminSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg text-xs sm:text-sm transition-all cursor-pointer shadow-md"
            >
              {isAdminSubmitting ? 'প্রবেশ করা হচ্ছে...' : 'লগইন করুন (Admin Sign In)'}
            </button>
          </form>

          <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-bold text-emerald-400">ডেমো অ্যাডমিন তথ্য:</p>
            <p>Email: <span className="font-mono text-slate-200">admin@pureghor.com</span></p>
            <p>Password: <span className="font-mono text-slate-200">admin123</span></p>
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentView('home')}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              ← স্টোরফ্রন্টে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If in Admin view and authenticated, render full Admin layout
  if (currentView === 'admin' && isAdminLoggedIn) {
    return (
      <AdminLayout currentTab={adminTab} setCurrentTab={setAdminTab}>
        <ToastContainer />
        {adminTab === 'dashboard' && (
          <AdminDashboard
            onNavigateTab={setAdminTab}
            onViewOrder={order => {
              setAdminSelectedOrder(order);
              setAdminTab('orders');
            }}
          />
        )}
        {adminTab === 'products' && <AdminProducts />}
        {adminTab === 'orders' && <AdminOrders selectedOrderProp={adminSelectedOrder} />}
        {adminTab === 'inventory' && <AdminInventory />}
        {adminTab === 'categories' && <AdminCategories />}
        {adminTab === 'coupons' && <AdminCoupons />}
        {adminTab === 'customers' && <AdminCustomers />}
        {adminTab === 'reviews' && <AdminReviews />}
        {adminTab === 'banners' && <AdminBanners />}
        {adminTab === 'settings' && <AdminSettings />}
      </AdminLayout>
    );
  }

  // Filter products for Catalog View
  const getCatalogProducts = () => {
    let list = [...products];

    // Category filter
    if (selectedCategorySlug && selectedCategorySlug !== 'all') {
      const cat = categories.find(c => c.slug === selectedCategorySlug || c.id === selectedCategorySlug);
      if (cat) {
        list = list.filter(p => p.categoryId === cat.id);
      }
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        p =>
          p.nameBn.toLowerCase().includes(q) ||
          p.nameEn.toLowerCase().includes(q) ||
          p.descriptionBn?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q)
      );
    }

    // In-stock toggle
    if (onlyInStock) {
      list = list.filter(p => p.stock > 0);
    }

    // Price range
    list = list.filter(p => p.price <= priceRange);

    // Sorting
    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'popular') {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return list;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfbf9] text-gray-900 selection:bg-emerald-100 selection:text-[#004d1a]">
      {/* Global Toast Container */}
      <ToastContainer />

      {/* Slide Drawer Cart */}
      <CartDrawer />

      {/* 1-Click Fast Checkout Modal */}
      <QuickOrderModal />

      {/* Quick View Product Modal */}
      <QuickViewModal />

      {/* Storefront Header */}
      <Header />

      {/* Main Body Switcher */}
      <main className="flex-1 pb-16 md:pb-8">
        {/* VIEW: HOME */}
        {currentView === 'home' && (
          <div className="space-y-8 sm:space-y-12">
            {/* Hero Carousel */}
            <HeroBanner />

            {/* Circular Category Slider */}
            <div className="max-w-7xl mx-auto px-4">
              <CategoryCarousel />
            </div>

            {/* Special Deals / Flash Sale */}
            <SpecialDealsSection />

            {/* Featured Best Sellers Grid */}
            <section className="max-w-7xl mx-auto px-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                    {language === 'bn' ? 'আমাদের জনপ্রিয় সেরা পণ্যসমূহ' : 'Best Selling Organic Products'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {language === 'bn'
                      ? 'গ্রাহকদের সর্বাধিক পছন্দের শতভাগ খাঁটি খাদ্য সামগ্রী'
                      : 'Highest rated and most loved pure natural food items'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedCategorySlug('all');
                    setCurrentView('catalog');
                  }}
                  className="text-xs sm:text-sm font-bold text-[#004d1a] hover:underline cursor-pointer"
                >
                  {language === 'bn' ? 'সকল পণ্য দেখুন →' : 'View All Products →'}
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {products.slice(0, 8).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Categorized Showcase (Mustard Oil & Ghee & Honey Spotlight) */}
            {categories.slice(0, 3).map(cat => {
              const catProducts = products.filter(p => p.categoryId === cat.id);
              if (catProducts.length === 0) return null;
              return (
                <section key={cat.id} className="max-w-7xl mx-auto px-4 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">
                      {language === 'bn' ? cat.nameBn : cat.nameEn}
                    </h3>
                    <button
                      onClick={() => {
                        setSelectedCategorySlug(cat.slug);
                        setCurrentView('catalog');
                      }}
                      className="text-xs font-semibold text-[#004d1a] hover:underline cursor-pointer"
                    >
                      {language === 'bn' ? 'এই ক্যাটাগরির সব পণ্য →' : 'Explore Category →'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    {catProducts.slice(0, 4).map(prod => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                </section>
              );
            })}

            {/* Trust Badges & Guarantee Banner */}
            <section className="max-w-7xl mx-auto px-4">
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6 sm:p-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#004d1a] flex items-center justify-center">
                    <ShieldCheck size={24} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">১০০% খাঁটি ও নির্ভেজাল</h4>
                  <p className="text-[11px] text-gray-600">কোনো প্রকার প্রিজারভেটিভ বা রাসায়নিক নেই</p>
                </div>

                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#004d1a] flex items-center justify-center">
                    <Truck size={24} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">সারাদেশে হোম ডেলিভারি</h4>
                  <p className="text-[11px] text-gray-600">২৪ থেকে ৭২ ঘণ্টার মধ্যে দ্রুত ডেলিভারি</p>
                </div>

                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#004d1a] flex items-center justify-center">
                    <RotateCcw size={24} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">সহজ রিটার্ন পলিসি</h4>
                  <p className="text-[11px] text-gray-600">পছন্দ না হলে সাথে সাথে রিটার্নের সুযোগ</p>
                </div>

                <div className="space-y-2 flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#004d1a] flex items-center justify-center">
                    <Headphones size={24} />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">২৪/৭ কাস্টমার সাপোর্ট</h4>
                  <p className="text-[11px] text-gray-600">যে কোনো প্রয়োজনে সরাসরি ফোন করুন</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW: CATALOG (ALL PRODUCTS WITH SIDEBAR FILTERS) */}
        {currentView === 'catalog' && (
          <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900">
                {language === 'bn' ? 'সকল খাঁটি খাদ্য পণ্য সম্ভার' : 'All Pure Organic Products'}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {language === 'bn'
                  ? 'আপনার পছন্দের ক্যাটাগরি ও মূল্য অনুযায়ী ফিল্টার করে অর্ডার করুন।'
                  : 'Filter by category and price range to find pure natural products.'}
              </p>
            </div>

            {/* Catalog Grid with Sidebar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Sidebar Filter (3 cols) */}
              <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 p-5 space-y-6 shadow-xs sticky top-24">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                    <SlidersHorizontal size={16} className="text-[#004d1a]" />
                    <span>ফিল্টার (Filters)</span>
                  </h3>
                  <button
                    onClick={() => {
                      setSelectedCategorySlug('all');
                      setSearchQuery('');
                      setPriceRange(2000);
                      setOnlyInStock(false);
                      setSortBy('default');
                    }}
                    className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                  >
                    রিসেট
                  </button>
                </div>

                {/* Categories Filter */}
                <div className="space-y-2">
                  <span className="block font-bold text-xs text-gray-800">ক্যাটাগরি সমূহ</span>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedCategorySlug('all')}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        selectedCategorySlug === 'all' || !selectedCategorySlug
                          ? 'bg-[#004d1a] text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      সকল ক্যাটাগরি ({products.length})
                    </button>
                    {categories.map(cat => {
                      const count = products.filter(p => p.categoryId === cat.id).length;
                      const isSelected = selectedCategorySlug === cat.slug || selectedCategorySlug === cat.id;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategorySlug(cat.slug)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-[#004d1a] text-white font-bold'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <span>{cat.nameBn}</span>
                          <span className="text-[11px] opacity-80">({count})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Price Slider */}
                <div className="space-y-2 border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-800">সর্বোচ্চ মূল্য:</span>
                    <span className="font-extrabold text-[#004d1a]">৳{priceRange}</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={3000}
                    step={50}
                    value={priceRange}
                    onChange={e => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#004d1a] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400">
                    <span>৳১০০</span>
                    <span>৳৩০০০</span>
                  </div>
                </div>

                {/* In Stock Only Checkbox */}
                <div className="border-t border-gray-100 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={onlyInStock}
                      onChange={e => setOnlyInStock(e.target.checked)}
                      className="rounded text-[#004d1a] focus:ring-0 cursor-pointer"
                    />
                    <span>শুধুমাত্র স্টকে থাকা পণ্য</span>
                  </label>
                </div>
              </div>

              {/* Right Col: Product Grid & Sorting (9 cols) */}
              <div className="lg:col-span-9 space-y-4">
                {/* Sort dropdown and count bar */}
                <div className="bg-white rounded-xl border border-gray-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
                  <span className="font-semibold text-gray-700">
                    মোট <span className="text-[#004d1a] font-bold">{getCatalogProducts().length}</span> টি পণ্য পাওয়া গেছে
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 font-medium">সাজান:</span>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as any)}
                      className="border border-gray-300 rounded-lg px-2.5 py-1.5 bg-white text-gray-800 font-semibold focus:outline-none focus:border-[#004d1a] cursor-pointer"
                    >
                      <option value="default">সাধারণ ক্রম</option>
                      <option value="price-asc">মূল্য: কম থেকে বেশি</option>
                      <option value="price-desc">মূল্য: বেশি থেকে কম</option>
                      <option value="popular">সর্বাধিক জনপ্রিয়</option>
                      <option value="rating">সর্বোচ্চ রেটিং</option>
                    </select>
                  </div>
                </div>

                {/* Products Grid */}
                {getCatalogProducts().length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center space-y-3">
                    <p className="text-gray-500 text-sm">কোনো পণ্য খুঁজে পাওয়া যায়নি।</p>
                    <button
                      onClick={() => {
                        setSelectedCategorySlug('all');
                        setSearchQuery('');
                        setPriceRange(2000);
                      }}
                      className="bg-[#004d1a] text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer"
                    >
                      ফিল্টার ক্লিয়ার করুন
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {getCatalogProducts().map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: PRODUCT DETAILS */}
        {currentView === 'product-details' && <ProductDetailView />}

        {/* VIEW: CHECKOUT */}
        {currentView === 'checkout' && <CheckoutView />}

        {/* VIEW: TRACK ORDER */}
        {currentView === 'track-order' && <OrderTrackingView />}

        {/* VIEW: CUSTOMER ACCOUNT */}
        {currentView === 'account' && <CustomerAccountView />}

        {/* VIEW: WISHLIST */}
        {currentView === 'wishlist' && <WishlistView />}
      </main>

      {/* Storefront Footer */}
      <Footer />

      {/* Floating Order Helpline & WhatsApp Button */}
      <FloatingSupportWidget />

      {/* Mobile Sticky Navigation Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-2 flex items-center justify-between shadow-lg">
        <button
          onClick={() => setCurrentView('home')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold cursor-pointer ${
            currentView === 'home' ? 'text-[#004d1a]' : 'text-gray-500'
          }`}
        >
          <Home size={18} />
          <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategorySlug('all');
            setCurrentView('catalog');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold cursor-pointer ${
            currentView === 'catalog' ? 'text-[#004d1a]' : 'text-gray-500'
          }`}
        >
          <ShoppingBag size={18} />
          <span>{language === 'bn' ? 'শপ' : 'Shop'}</span>
        </button>

        {/* Cart Drawer Trigger */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="relative -top-3 bg-[#004d1a] text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
          aria-label="Open Cart"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-400 text-gray-900 text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
              {cartCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setCurrentView('wishlist')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold cursor-pointer ${
            currentView === 'wishlist' ? 'text-[#004d1a]' : 'text-gray-500'
          }`}
        >
          <Heart size={18} />
          <span>{language === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}</span>
        </button>

        <button
          onClick={() => setCurrentView('account')}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold cursor-pointer ${
            currentView === 'account' ? 'text-[#004d1a]' : 'text-gray-500'
          }`}
        >
          <User size={18} />
          <span>{language === 'bn' ? 'একাউন্ট' : 'Account'}</span>
        </button>
      </div>
    </div>
  );
}
export default App;
