import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, Category, CartItem, StoreSettings, Coupon, ProductVariant } from '../types';
import { api } from '../services/api';
import { initialSettings } from '../data/initialData';

export type Language = 'bn' | 'en';
export type DeliveryZone = 'inside_dhaka' | 'outside_dhaka';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface StoreContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  // Navigation & View
  currentView: string;
  setCurrentView: (view: string) => void;
  selectedCategory: string | null;
  setSelectedCategory: (categoryId: string | null) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;
  selectedProductSlug: string | null;
  setSelectedProductSlug: (slug: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  // Catalog Data
  products: Product[];
  categories: Category[];
  storeSettings: StoreSettings;
  loading: boolean;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, variant?: ProductVariant, quantity?: number, openDrawer?: boolean) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, variantId: string | undefined, newQty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  // Checkout & Coupons
  deliveryZone: DeliveryZone;
  setDeliveryZone: (zone: DeliveryZone) => void;
  shippingFee: number;
  appliedCoupon: Coupon | null;
  couponDiscount: number;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  cartTotal: number;
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  // Modals
  quickOrderProduct: Product | null;
  setQuickOrderProduct: (product: Product | null) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;
  // Toasts
  toasts: ToastMessage[];
  addToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  // Helpers
  formatPrice: (amount: number) => string;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('kb_lang') as Language) || 'bn';
  });

  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(initialSettings);
  const [loading, setLoading] = useState<boolean>(true);

  // Cart state persisted to localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('kb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [deliveryZone, setDeliveryZone] = useState<DeliveryZone>('inside_dhaka');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponDiscount, setCouponDiscount] = useState<number>(0);

  // Wishlist persisted
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kb_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals
  const [quickOrderProduct, setQuickOrderProduct] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('kb_lang', lang);
  };

  // Fetch initial data
  const refreshProducts = async () => {
    try {
      const data = await api.getProducts({ status: 'all' });
      setProducts(data.products);
    } catch (e) {
      console.error('Failed to load products', e);
    }
  };

  const refreshCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };

  const refreshSettings = async () => {
    try {
      const data = await api.getSettings();
      setStoreSettings(data);
    } catch (e) {
      console.error('Failed to load settings', e);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([refreshProducts(), refreshCategories(), refreshSettings()]);
      setLoading(false);
    };
    loadAll();
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem('kb_cart', JSON.stringify(cart));
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    localStorage.setItem('kb_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const shippingFee =
    cartSubtotal >= storeSettings.freeDeliveryThreshold
      ? 0
      : deliveryZone === 'inside_dhaka'
      ? storeSettings.deliveryChargeInsideDhaka
      : storeSettings.deliveryChargeOutsideDhaka;

  const cartTotal = Math.max(0, cartSubtotal - couponDiscount + shippingFee);

  const addToCart = (
    product: Product,
    variant?: ProductVariant,
    quantity = 1,
    openDrawer = true
  ) => {
    const selectedVariant = variant || (product.variants && product.variants.length > 0 ? product.variants[0] : undefined);
    const price = selectedVariant ? selectedVariant.price : product.price;
    const compareAtPrice = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;
    const weight = selectedVariant ? selectedVariant.weight : product.weight;
    const sku = selectedVariant ? selectedVariant.sku : product.sku;
    const maxStock = selectedVariant ? selectedVariant.stock : product.stock;

    if (maxStock <= 0) {
      addToast(language === 'bn' ? 'দুঃখিত, পণ্যটি বর্তমানে স্টকে নেই!' : 'Sorry, product is currently out of stock!', 'error');
      return;
    }

    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.productId === product.id && item.variantId === selectedVariant?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > maxStock) {
          addToast(
            language === 'bn'
              ? `স্টকে সর্বোচ্চ ${maxStock}টি পণ্য রয়েছে`
              : `Only ${maxStock} items available in stock`,
            'info'
          );
          updated[existingIndex].quantity = maxStock;
        } else {
          updated[existingIndex].quantity = newQty;
          addToast(
            language === 'bn'
              ? `"${product.nameBn}" কার্টে যোগ করা হয়েছে`
              : `"${product.nameEn}" added to cart`,
            'success'
          );
        }
        return updated;
      } else {
        const newItem: CartItem = {
          productId: product.id,
          variantId: selectedVariant?.id,
          nameBn: product.nameBn,
          nameEn: product.nameEn,
          price,
          compareAtPrice,
          quantity: Math.min(quantity, maxStock),
          weight,
          image: product.mainImage || (product.images && product.images[0]) || '',
          maxStock,
          sku,
        };
        addToast(
          language === 'bn'
            ? `"${product.nameBn}" কার্টে সফলভাবে যোগ করা হয়েছে`
            : `"${product.nameEn}" added to cart successfully`,
          'success'
        );
        return [...prev, newItem];
      }
    });

    if (openDrawer) {
      setIsCartDrawerOpen(true);
    }
  };

  const removeFromCart = (productId: string, variantId?: string) => {
    setCart(prev => prev.filter(item => !(item.productId === productId && item.variantId === variantId)));
    addToast(language === 'bn' ? 'পণ্যটি কার্ট থেকে সরানো হয়েছে' : 'Item removed from cart', 'info');
  };

  const updateQuantity = (productId: string, variantId: string | undefined, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(productId, variantId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.productId === productId && item.variantId === variantId) {
          if (newQty > item.maxStock) {
            addToast(
              language === 'bn'
                ? `সর্বোচ্চ স্টক ${item.maxStock}টি উপলব্ধ`
                : `Maximum available stock is ${item.maxStock}`,
              'info'
            );
            return { ...item, quantity: item.maxStock };
          }
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponDiscount(0);
  };

  const applyCouponCode = async (code: string): Promise<boolean> => {
    try {
      const res = await api.validateCoupon(code, cartSubtotal);
      if (res.valid && res.coupon) {
        setAppliedCoupon(res.coupon);
        setCouponDiscount(res.discount);
        addToast(res.message, 'success');
        return true;
      }
      return false;
    } catch (err: any) {
      addToast(err.message || (language === 'bn' ? 'কুপন প্রয়োগ ব্যর্থ হয়েছে' : 'Failed to apply coupon'), 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    addToast(language === 'bn' ? 'কুপন বাতিল করা হয়েছে' : 'Coupon removed', 'info');
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        addToast(language === 'bn' ? 'উইশলিস্ট থেকে সরানো হয়েছে' : 'Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast(language === 'bn' ? 'উইশলিস্টে যুক্ত করা হয়েছে' : 'Added to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const formatPrice = (amount: number) => {
    return `${storeSettings.currencySymbol || '৳'}${amount.toLocaleString('en-US')}`;
  };

  return (
    <StoreContext.Provider
      value={{
        language,
        setLanguage,
        currentView,
        setCurrentView,
        selectedCategory,
        setSelectedCategory,
        selectedCategorySlug: selectedCategory,
        setSelectedCategorySlug: setSelectedCategory,
        selectedProductSlug,
        setSelectedProductSlug,
        searchQuery,
        setSearchQuery,
        products,
        categories,
        storeSettings,
        loading,
        refreshProducts,
        refreshCategories,
        refreshSettings,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        deliveryZone,
        setDeliveryZone,
        shippingFee,
        appliedCoupon,
        couponDiscount,
        applyCouponCode,
        removeCoupon,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        quickOrderProduct,
        setQuickOrderProduct,
        quickViewProduct,
        setQuickViewProduct,
        toasts,
        addToast,
        removeToast,
        formatPrice,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
