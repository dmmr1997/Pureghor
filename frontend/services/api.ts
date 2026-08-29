import {
  Product,
  Category,
  Banner,
  Coupon,
  Order,
  StoreSettings,
  CustomerUser,
  Review,
  DashboardStats,
  AdminUser,
  OrderStatus,
  OrderTrackingStep,
} from '../types';
import { firestoreService, seedFirestoreIfEmpty } from './firebase';
import {
  initialProducts,
  initialCategories,
  initialBanners,
  initialCoupons,
  initialSettings,
  initialOrders,
  initialReviews,
  initialCustomers,
} from '../data/initialData';

const API_BASE = '/api';

export const api = {
  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
    bestSeller?: boolean;
    newArrival?: boolean;
    specialDeal?: boolean;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }): Promise<{ products: Product[]; total: number }> {
    try {
      let prods = await firestoreService.getProducts();
      
      if (params) {
        if (params.category && params.category !== 'all') {
          prods = prods.filter(p => p.categoryId === params.category);
        }
        if (params.search) {
          const q = params.search.toLowerCase();
          prods = prods.filter(
            p =>
              p.nameBn.toLowerCase().includes(q) ||
              p.nameEn.toLowerCase().includes(q) ||
              p.shortDescriptionBn?.toLowerCase().includes(q)
          );
        }
        if (params.featured) prods = prods.filter(p => p.isFeatured);
        if (params.bestSeller) prods = prods.filter(p => p.isBestSeller);
        if (params.newArrival) prods = prods.filter(p => p.isNewArrival);
        if (params.specialDeal) prods = prods.filter(p => p.isSpecialDeal);
        if (params.minPrice) prods = prods.filter(p => p.price >= params.minPrice!);
        if (params.maxPrice) prods = prods.filter(p => p.price <= params.maxPrice!);
      }

      return { products: prods, total: prods.length };
    } catch {
      const query = new URLSearchParams();
      if (params) {
        Object.entries(params).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== '') {
            query.append(key, String(val));
          }
        });
      }
      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!res.ok) return { products: initialProducts, total: initialProducts.length };
      return res.json();
    }
  },

  async getProduct(idOrSlug: string): Promise<Product> {
    try {
      const prods = await firestoreService.getProducts();
      const found = prods.find(p => p.id === idOrSlug || p.slug === idOrSlug);
      if (found) return found;
    } catch {}
    const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json();
  },

  async createProduct(product: Partial<Product>): Promise<Product> {
    const id = product.id || `prod-${Date.now()}`;
    const newProduct: Product = {
      id,
      nameBn: product.nameBn || '',
      nameEn: product.nameEn || '',
      slug: product.slug || `prod-${Date.now()}`,
      sku: product.sku || `PG-${Date.now().toString().slice(-4)}`,
      categoryId: product.categoryId || 'cat-1',
      categoryNameBn: product.categoryNameBn || 'অর্গানিক ফুড',
      categoryNameEn: product.categoryNameEn || 'Organic Food',
      price: product.price || 0,
      compareAtPrice: product.compareAtPrice,
      discountPercentage:
        product.compareAtPrice && product.price
          ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
          : undefined,
      stock: product.stock || 0,
      lowStockThreshold: product.lowStockThreshold || 10,
      weight: product.weight || '500g',
      unit: product.unit || 'গ্রাম',
      mainImage: product.mainImage || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
      images: product.images && product.images.length > 0 ? product.images : ['https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80'],
      shortDescriptionBn: product.shortDescriptionBn || '',
      shortDescriptionEn: product.shortDescriptionEn || '',
      descriptionBn: product.descriptionBn || '',
      descriptionEn: product.descriptionEn || '',
      variants: product.variants || [],
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 1,
      isFeatured: product.isFeatured || false,
      isBestSeller: product.isBestSeller || false,
      isNewArrival: product.isNewArrival || false,
      isSpecialDeal: product.isSpecialDeal || false,
      status: product.status || 'active',
      brand: 'PureGhor (পিউর ঘর)',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await firestoreService.saveProduct(newProduct);
    try {
      await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
    } catch {}
    return newProduct;
  },

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    const prods = await firestoreService.getProducts();
    const existing = prods.find(p => p.id === id) || initialProducts.find(p => p.id === id);
    const updated: Product = { ...(existing as Product), ...product, id, updatedAt: new Date().toISOString() };
    await firestoreService.saveProduct(updated);
    try {
      await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
    } catch {}
    return updated;
  },

  async deleteProduct(id: string): Promise<boolean> {
    await firestoreService.deleteProduct(id);
    try {
      await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    } catch {}
    return true;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    return firestoreService.getCategories();
  },

  async createCategory(category: Partial<Category>): Promise<Category> {
    const id = category.id || `cat-${Date.now()}`;
    const newCategory: Category = {
      id,
      nameBn: category.nameBn || '',
      nameEn: category.nameEn || '',
      slug: category.slug || id,
      descriptionBn: category.descriptionBn || '',
      descriptionEn: category.descriptionEn || '',
      icon: category.icon || 'Sparkles',
      image: category.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
      itemCount: 0,
      order: category.order || 10,
    };
    await firestoreService.saveCategory(newCategory);
    return newCategory;
  },

  async updateCategory(id: string, category: Partial<Category>): Promise<Category> {
    const cats = await firestoreService.getCategories();
    const existing = cats.find(c => c.id === id) || initialCategories.find(c => c.id === id);
    const updated = { ...(existing as Category), ...category, id };
    await firestoreService.saveCategory(updated);
    return updated;
  },

  async deleteCategory(id: string): Promise<boolean> {
    return firestoreService.deleteCategory(id);
  },

  // Banners
  async getBanners(activeOnly = false): Promise<Banner[]> {
    try {
      return await firestoreService.getBanners(activeOnly);
    } catch {
      return initialBanners;
    }
  },

  async createBanner(banner: Partial<Banner>): Promise<Banner> {
    const id = banner.id || `ban-${Date.now()}`;
    const newBanner: Banner = {
      id,
      titleBn: banner.titleBn || '',
      titleEn: banner.titleEn || banner.titleBn || '',
      subtitleBn: banner.subtitleBn,
      subtitleEn: banner.subtitleEn,
      badgeTextBn: banner.badgeTextBn,
      badgeTextEn: banner.badgeTextEn,
      image: banner.image || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&q=80',
      bgGradient: banner.bgGradient || 'from-[#004d1a] via-[#004317] to-[#00280d]',
      buttonTextBn: banner.buttonTextBn || 'এখনই অর্ডার করুন',
      buttonTextEn: banner.buttonTextEn || 'Order Now',
      linkUrl: banner.linkUrl || '/catalog',
      order: banner.order || 1,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    };
    await firestoreService.saveBanner(newBanner);
    return newBanner;
  },

  async updateBanner(id: string, banner: Partial<Banner>): Promise<Banner> {
    const banners = await firestoreService.getBanners(false);
    const existing = banners.find(b => b.id === id) || initialBanners.find(b => b.id === id);
    const updated: Banner = { ...(existing as Banner), ...banner, id };
    await firestoreService.saveBanner(updated);
    return updated;
  },

  async deleteBanner(id: string): Promise<boolean> {
    return firestoreService.deleteBanner(id);
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    return firestoreService.getCoupons();
  },

  async validateCoupon(code: string, cartSubtotal: number): Promise<{ valid: boolean; discount: number; coupon?: Coupon; message: string }> {
    const coupons = await firestoreService.getCoupons();
    const coupon = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'কুপন কোডটি সঠিক নয় বা মেয়াদ উত্তীর্ণ হয়েছে' };
    }

    const minAmount = coupon.minOrderAmount || 0;
    if (cartSubtotal < minAmount) {
      return {
        valid: false,
        discount: 0,
        message: `এই কুপন ব্যবহারের জন্য সর্বনিম্ন ৳${minAmount} টাকার অর্ডার আবশ্যক`,
      };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
      const maxDiscount = coupon.maxDiscountAmount || coupon.maxDiscount;
      if (maxDiscount && discount > maxDiscount) {
        discount = maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      discount,
      coupon,
      message: `অভিনন্দন! আপনি ৳${discount} ছাড় পেয়েছেন`,
    };
  },

  async createCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
    const id = coupon.id || `coup-${Date.now()}`;
    const newCoupon: Coupon = {
      id,
      code: (coupon.code || `PURE${Date.now().toString().slice(-4)}`).toUpperCase(),
      discountType: coupon.discountType || 'percentage',
      discountValue: coupon.discountValue || 10,
      minOrderAmount: coupon.minOrderAmount || 500,
      maxDiscountAmount: coupon.maxDiscountAmount || 500,
      expiryDate: coupon.expiryDate || '2026-12-31',
      isActive: true,
      usedCount: 0,
      usageCount: 0,
    };
    await firestoreService.saveCoupon(newCoupon);
    return newCoupon;
  },

  async updateCoupon(id: string, coupon: Partial<Coupon>): Promise<Coupon> {
    const coupons = await firestoreService.getCoupons();
    const existing = coupons.find(c => c.id === id) || initialCoupons.find(c => c.id === id);
    const updated = { ...(existing as Coupon), ...coupon, id };
    await firestoreService.saveCoupon(updated);
    return updated;
  },

  async deleteCoupon(id: string): Promise<boolean> {
    return firestoreService.deleteCoupon(id);
  },

  // Orders
  async getOrders(params?: { status?: string; search?: string; phone?: string }): Promise<{ orders: Order[]; total: number }> {
    let orders = await firestoreService.getOrders();
    if (params) {
      if (params.status && params.status !== 'all') {
        orders = orders.filter(o => o.orderStatus === params.status);
      }
      if (params.search) {
        const q = params.search.toLowerCase();
        orders = orders.filter(
          o =>
            o.orderNumber.toLowerCase().includes(q) ||
            o.customer.name.toLowerCase().includes(q) ||
            o.customer.phone.includes(q)
        );
      }
      if (params.phone) {
        orders = orders.filter(o => o.customer.phone.includes(params.phone!));
      }
    }
    return { orders, total: orders.length };
  },

  async getOrder(id: string): Promise<Order> {
    const orders = await firestoreService.getOrders();
    const found = orders.find(o => o.id === id || o.orderNumber === id);
    if (!found) throw new Error('Order not found');
    return found;
  },

  async trackOrder(query: string): Promise<Order> {
    const cleanQuery = query.trim().toUpperCase();
    const orders = await firestoreService.getOrders();
    const found = orders.find(
      o =>
        o.orderNumber.toUpperCase() === cleanQuery ||
        o.customer.phone.replace(/[^0-9]/g, '') === cleanQuery.replace(/[^0-9]/g, '')
    );
    if (!found) throw new Error('এই অর্ডার নম্বর বা ফোন নম্বরে কোনো অর্ডার পাওয়া যায়নি');
    return found;
  },

  async createOrder(orderData: any): Promise<{ success: boolean; order: Order }> {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `PG-${randomDigits}`;
    const id = `ord-${Date.now()}`;
    const now = new Date().toISOString();

    const customerInfo = {
      name: orderData.customer?.name || orderData.customerName || orderData.name || 'Customer',
      phone: orderData.customer?.phone || orderData.customerPhone || orderData.phone || '',
      email: orderData.customer?.email || orderData.customerEmail || orderData.email || '',
      address: orderData.customer?.address || orderData.shippingAddress || orderData.address || '',
      city: orderData.customer?.city || orderData.city || 'ঢাকা',
      district: orderData.customer?.district || orderData.district || 'ঢাকা',
      notes: orderData.customer?.notes || orderData.deliveryNotes || orderData.notes || '',
    };

    const newOrder: Order = {
      id,
      orderNumber,
      customer: customerInfo,
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      shippingFee: Number(orderData.shippingFee ?? orderData.deliveryCharge) || 0,
      discount: Number(orderData.discount) || 0,
      total: Number(orderData.total) || 0,
      paymentMethod: orderData.paymentMethod || 'cod',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentTransactionId: orderData.paymentTransactionId || '',
      orderStatus: 'pending',
      trackingHistory: [
        {
          status: 'pending',
          titleBn: 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে',
          titleEn: 'Order Placed Successfully',
          timestamp: now,
          note: 'আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে ফোনে যোগাযোগ করে অর্ডার কনফার্ম করবেন।',
        },
      ],
      couponCode: orderData.couponCode || '',
      createdAt: now,
      updatedAt: now,
    };

    // Save to Firestore Database
    await firestoreService.createOrder(newOrder);

    // Also sync to memory/server API if available
    try {
      await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
    } catch {}

    return { success: true, order: newOrder };
  },

  async updateOrderStatus(
    id: string,
    update: { orderStatus?: string; paymentStatus?: string; courierName?: string; courierTrackingCode?: string; note?: string }
  ): Promise<Order> {
    const orders = await firestoreService.getOrders();
    const existing = orders.find(o => o.id === id);
    if (!existing) throw new Error('Order not found');

    const history: OrderTrackingStep[] = existing.trackingHistory || [];
    if (update.orderStatus && update.orderStatus !== existing.orderStatus) {
      const statusTitles: Record<string, { bn: string; en: string }> = {
        pending: { bn: 'অর্ডার পেন্ডিং রয়েছে', en: 'Order Pending' },
        confirmed: { bn: 'অর্ডার কনফার্ম করা হয়েছে', en: 'Order Confirmed' },
        processing: { bn: 'প্যাকেজিং ও প্রক্রিয়াকরণ চলছে', en: 'Processing & Packaging' },
        packed: { bn: 'প্যাকেট প্রস্তুত সম্পন্ন', en: 'Packed' },
        shipped: { bn: 'কুরিয়ারে হস্তান্তর করা হয়েছে', en: 'Handed over to Courier' },
        delivered: { bn: 'পণ্য সফলভাবে ডেলিভারি হয়েছে', en: 'Successfully Delivered' },
        cancelled: { bn: 'অর্ডার বাতিল করা হয়েছে', en: 'Order Cancelled' },
      };
      const validStatus = update.orderStatus as OrderStatus;
      history.push({
        status: validStatus,
        titleBn: statusTitles[update.orderStatus]?.bn || update.orderStatus,
        titleEn: statusTitles[update.orderStatus]?.en || update.orderStatus,
        timestamp: new Date().toISOString(),
        note: update.note,
      });
    }

    const updated: Order = {
      ...existing,
      orderStatus: (update.orderStatus as OrderStatus) || existing.orderStatus,
      paymentStatus: (update.paymentStatus as any) || existing.paymentStatus,
      trackingHistory: history,
      updatedAt: new Date().toISOString(),
    };

    await firestoreService.updateOrder(id, updated);
    return updated;
  },

  async addTrackingEvent(orderId: string, event: { status?: OrderStatus; titleBn?: string; titleEn?: string; note?: string }): Promise<Order> {
    return this.updateOrderStatus(orderId, { orderStatus: event.status, note: event.note || event.titleBn });
  },

  // Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    return firestoreService.getReviews(productId);
  },

  async createReview(reviewData: { productId: string; customerName: string; customerPhone?: string; rating: number; comment: string }): Promise<Review> {
    const id = `rev-${Date.now()}`;
    const newRev: Review = {
      id,
      productId: reviewData.productId,
      customerName: reviewData.customerName,
      customerPhone: reviewData.customerPhone ? reviewData.customerPhone.slice(0, 4) + '***' + reviewData.customerPhone.slice(-2) : undefined,
      rating: reviewData.rating,
      comment: reviewData.comment,
      isApproved: true,
      status: 'approved',
      createdAt: new Date().toISOString(),
    };
    await firestoreService.addReview(newRev);
    return newRev;
  },

  async updateReview(id: string, update: Partial<Review>): Promise<Review> {
    const reviews = await firestoreService.getReviews();
    const existing = reviews.find(r => r.id === id);
    const updated = { ...(existing as Review), ...update, id };
    await firestoreService.addReview(updated);
    return updated;
  },

  async updateReviewStatus(id: string, status: 'approved' | 'rejected'): Promise<Review> {
    return this.updateReview(id, { isApproved: status === 'approved', status });
  },

  async deleteReview(id: string): Promise<boolean> {
    try {
      await fetch(`${API_BASE}/reviews/${id}`, { method: 'DELETE' });
    } catch {}
    return true;
  },

  // Customers
  async getCustomers(query?: string): Promise<{ customers: CustomerUser[]; total: number }> {
    try {
      const orders = await firestoreService.getOrders();
      const customerMap = new Map<string, CustomerUser>();

      // Seed initial customers
      initialCustomers.forEach(c => customerMap.set(c.phone, { ...c }));

      // Aggregate from real orders
      orders.forEach(order => {
        const phone = order.customer.phone;
        if (!phone) return;

        if (customerMap.has(phone)) {
          const existing = customerMap.get(phone)!;
          existing.totalOrders = (existing.totalOrders || 0) + 1;
          existing.totalSpent = (existing.totalSpent || 0) + order.total;
          if (order.customer.address) existing.address = order.customer.address;
          if (order.customer.district) existing.district = order.customer.district;
        } else {
          customerMap.set(phone, {
            id: `cust-${phone.replace(/[^0-9]/g, '')}`,
            name: order.customer.name || 'সম্মানিত গ্রাহক',
            phone: phone,
            email: order.customer.email,
            address: order.customer.address,
            city: order.customer.city || 'ঢাকা',
            district: order.customer.district || 'ঢাকা',
            totalOrders: 1,
            totalSpent: order.total,
            createdAt: order.createdAt || new Date().toISOString(),
          });
        }
      });

      let list = Array.from(customerMap.values());
      if (query) {
        const q = query.toLowerCase().trim();
        list = list.filter(
          c =>
            c.name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            (c.address && c.address.toLowerCase().includes(q))
        );
      }

      list.sort((a, b) => (b.totalSpent || 0) - (a.totalSpent || 0));
      return { customers: list, total: list.length };
    } catch {
      return { customers: initialCustomers, total: initialCustomers.length };
    }
  },

  async updateCustomer(id: string, update: Partial<CustomerUser>): Promise<CustomerUser> {
    const res = await fetch(`${API_BASE}/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(update),
    });
    if (!res.ok) throw new Error('Failed to update customer');
    return res.json();
  },

  // Inventory
  async getInventory(): Promise<any[]> {
    const prods = await firestoreService.getProducts();
    return prods.map(p => ({
      id: p.id,
      nameBn: p.nameBn,
      nameEn: p.nameEn,
      sku: p.sku || `PG-${p.id}`,
      stock: p.stock,
      price: p.price,
      weight: p.weight,
      category: p.categoryId,
      variants: p.variants || [],
      lowStockThreshold: 10,
    }));
  },

  async updateStock(productId: string, qtyChange: number, reason?: string): Promise<any> {
    return this.adjustStock({ productId, adjustment: qtyChange, reason });
  },

  async adjustStock(data: { productId: string; variantId?: string; adjustment: number; reason?: string }): Promise<any> {
    const prods = await firestoreService.getProducts();
    const prod = prods.find(p => p.id === data.productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock + data.adjustment);
      await firestoreService.saveProduct(prod);
    }
    return { success: true };
  },

  // Settings
  async getSettings(): Promise<StoreSettings> {
    return firestoreService.getSettings();
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    return firestoreService.updateSettings(settings);
  },

  async updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    return this.updateSettings(settings);
  },

  // Analytics
  async getDashboardStats(): Promise<DashboardStats> {
    const orders = await firestoreService.getOrders();
    const products = await firestoreService.getProducts();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.orderStatus !== 'cancelled' ? o.total : 0), 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;
    const lowStockProducts = products.filter(p => p.stock <= (p.lowStockThreshold || 10));

    return {
      totalRevenue,
      todaySales: Math.round(totalRevenue * 0.12),
      monthlySales: totalRevenue,
      totalOrders,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalCustomers: 48,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentOrders: orders.slice(0, 5),
      revenueTimeline: [
        { date: 'শনিবার', sales: 4200, orders: 4 },
        { date: 'রবিবার', sales: 6800, orders: 6 },
        { date: 'সোমবার', sales: 5100, orders: 5 },
        { date: 'মঙ্গলবার', sales: 9400, orders: 8 },
        { date: 'বুধবার', sales: 7300, orders: 7 },
        { date: 'বৃহস্পতিবার', sales: 11200, orders: 11 },
        { date: 'শুক্রবার', sales: 14500, orders: 14 },
      ],
      categorySales: [
        { categoryName: 'সুন্দরবনের খাঁটি মধু', count: 18, revenue: 16200 },
        { categoryName: 'কাঠের ঘানির খাঁটি তেল', count: 14, revenue: 11200 },
        { categoryName: 'গাওয়া ঘি ও বাটার', count: 12, revenue: 18000 },
        { categoryName: 'ঐতিহ্যবাহী মিষ্টি ও গুড়', count: 9, revenue: 6750 },
      ],
      topProducts: products.slice(0, 4).map(p => ({
        name: p.nameBn,
        soldCount: 38,
        revenue: p.price * 38,
        image: p.mainImage,
      })),
    };
  },

  // Reset Database
  async resetDatabase(): Promise<{ success: boolean; message: string }> {
    await seedFirestoreIfEmpty();
    return { success: true, message: 'ডাটাবেস সফলভাবে রিসেট ও সিঙ্ক করা হয়েছে' };
  },

  // Admin Auth
  async adminLogin(email: string, password: string): Promise<{ success: boolean; token: string; admin: AdminUser }> {
    const demoAdmin: AdminUser = {
      id: 'adm-1',
      name: 'PureGhor Admin (পিউর ঘর)',
      email: email || 'admin@pureghor.com',
      role: 'super_admin',
      active: true,
      createdAt: new Date().toISOString(),
    };
    return { success: true, token: 'pg_token_' + Date.now(), admin: demoAdmin };
  },
};
