export type Language = 'bn' | 'en';

export type Customer = CustomerUser;
export type BannerSlide = Banner;

export interface ProductVariant {
  id: string;
  nameBn?: string;
  nameEn?: string;
  weight: string; // e.g. "250 gm", "500 gm", "1 kg", "2 kg", "200 ml", "500 ml", "1 Liter", "1 pc"
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  sku: string;
  categoryId: string;
  categoryNameBn?: string;
  categoryNameEn?: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  discountPercentage?: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  mainImage: string;
  weight: string;
  unit?: string;
  shortDescriptionBn: string;
  shortDescriptionEn: string;
  descriptionBn: string;
  descriptionEn: string;
  specifications?: { keyBn: string; keyEn: string; valueBn: string; valueEn: string }[];
  variants: ProductVariant[];
  tag?: string;
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isSpecialDeal: boolean;
  rating: number;
  reviewCount: number;
  status: 'active' | 'draft' | 'archived' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  nameBn: string;
  nameEn: string;
  slug: string;
  icon?: string;
  imageUrl?: string;
  image?: string;
  descriptionBn?: string;
  descriptionEn?: string;
  isFeatured?: boolean;
  order?: number;
  itemCount?: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  nameBn: string;
  nameEn: string;
  price: number;
  compareAtPrice?: number;
  quantity: number;
  weight: string;
  image: string;
  maxStock: number;
  sku: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'packed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'online_card';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface OrderItem {
  productId: string;
  variantId?: string;
  nameBn: string;
  nameEn: string;
  price: number;
  quantity: number;
  weight: string;
  image: string;
  sku: string;
  total: number;
}

export interface OrderTrackingStep {
  status: OrderStatus;
  titleBn: string;
  titleEn: string;
  timestamp: string;
  note?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. KB-10492
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    district: string;
    notes?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentTransactionId?: string;
  orderStatus: OrderStatus;
  trackingHistory: OrderTrackingStep[];
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit?: number;
  usedCount?: number;
  usageCount?: number;
  isActive: boolean;
  descriptionBn?: string;
  descriptionEn?: string;
}

export interface Review {
  id: string;
  productId: string;
  customerName: string;
  customerPhone?: string;
  rating: number;
  comment: string;
  isApproved?: boolean;
  status?: 'approved' | 'rejected' | 'pending';
  createdAt: string;
}

export interface Banner {
  id: string;
  titleBn: string;
  titleEn: string;
  subtitleBn?: string;
  subtitleEn?: string;
  badgeBn?: string;
  badgeEn?: string;
  badgeTextBn?: string;
  imageUrl?: string;
  image?: string;
  bgGradient?: string;
  buttonTextBn?: string;
  buttonTextEn?: string;
  targetCategory?: string;
  link?: string;
  linkUrl?: string;
  isActive: boolean;
  order?: number;
}

export interface StoreSettings {
  storeNameBn: string;
  storeNameEn: string;
  taglineBn?: string;
  taglineEn?: string;
  phonePrimary: string;
  phoneSecondary?: string;
  email: string;
  addressBn: string;
  addressEn?: string;
  deliveryChargeInsideDhaka: number;
  deliveryChargeOutsideDhaka: number;
  freeDeliveryThreshold: number;
  announcementBn?: string;
  announcementEn?: string;
  announcementTextBn?: string;
  announcementTextEn?: string;
  announcementActive?: boolean;
  currencySymbol?: string;
  bkashNumber?: string;
  nagadNumber?: string;
  heroBackgroundImage?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}

export type AdminRole = 'super_admin' | 'admin' | 'staff';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar?: string;
  active: boolean;
  createdAt: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  district?: string;
  city?: string;
  ordersCount?: number;
  totalOrders?: number;
  totalSpent?: number;
  status?: 'active' | 'blocked';
  createdAt: string;
}

export interface DashboardStats {
  totalRevenue: number;
  todaySales: number;
  monthlySales: number;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockCount: number;
  recentOrders: Order[];
  revenueTimeline: { date: string; sales: number; orders: number }[];
  categorySales: { categoryName: string; count: number; revenue: number }[];
  topProducts: { name: string; soldCount: number; revenue: number; image: string }[];
  lowStockProducts: Product[];
}
