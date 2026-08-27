import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import {
  initialProducts,
  initialCategories,
  initialBanners,
  initialCoupons,
  initialOrders,
  initialSettings,
  initialCustomers,
  initialReviews,
  initialAdmins,
} from './src/data/initialData';
import { Product, Category, Banner, Coupon, Order, StoreSettings, CustomerUser, AdminUser, Review, DashboardStats } from './src/types';

// In-memory data store with state lifecycle
let products: Product[] = JSON.parse(JSON.stringify(initialProducts));
let categories: Category[] = JSON.parse(JSON.stringify(initialCategories));
let banners: Banner[] = JSON.parse(JSON.stringify(initialBanners));
let coupons: Coupon[] = JSON.parse(JSON.stringify(initialCoupons));
let orders: Order[] = JSON.parse(JSON.stringify(initialOrders));
let storeSettings: StoreSettings = JSON.parse(JSON.stringify(initialSettings));
let customers: CustomerUser[] = JSON.parse(JSON.stringify(initialCustomers));
let reviews: Review[] = JSON.parse(JSON.stringify(initialReviews));
let admins: AdminUser[] = JSON.parse(JSON.stringify(initialAdmins));

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Helper for generating order numbers
  const generateOrderNumber = () => {
    const randomDigits = Math.floor(10000 + Math.random() * 90000);
    return `PG-${randomDigits}`;
  };

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', store: storeSettings.storeNameEn, timestamp: new Date().toISOString() });
  });

  // Reset database to initial demo state
  app.post('/api/seed', (req: Request, res: Response) => {
    products = JSON.parse(JSON.stringify(initialProducts));
    categories = JSON.parse(JSON.stringify(initialCategories));
    banners = JSON.parse(JSON.stringify(initialBanners));
    coupons = JSON.parse(JSON.stringify(initialCoupons));
    orders = JSON.parse(JSON.stringify(initialOrders));
    storeSettings = JSON.parse(JSON.stringify(initialSettings));
    customers = JSON.parse(JSON.stringify(initialCustomers));
    reviews = JSON.parse(JSON.stringify(initialReviews));
    admins = JSON.parse(JSON.stringify(initialAdmins));
    res.json({ success: true, message: 'Store database successfully reset to fresh seed data.' });
  });

  // --- PRODUCTS ---
  app.get('/api/products', (req: Request, res: Response) => {
    const { category, search, sort, featured, bestSeller, newArrival, specialDeal, minPrice, maxPrice, status } = req.query;

    let result = [...products];

    // Filter by status (default to active for customer facing)
    if (status) {
      if (status !== 'all') {
        result = result.filter(p => p.status === status);
      }
    } else {
      result = result.filter(p => p.status === 'active');
    }

    // Filter by category
    if (category && category !== 'all') {
      result = result.filter(p => p.categoryId === category || p.slug === category);
    }

    // Filter by flags
    if (featured === 'true') {
      result = result.filter(p => p.isFeatured);
    }
    if (bestSeller === 'true') {
      result = result.filter(p => p.isBestSeller);
    }
    if (newArrival === 'true') {
      result = result.filter(p => p.isNewArrival);
    }
    if (specialDeal === 'true') {
      result = result.filter(p => p.isSpecialDeal || (p.discountPercentage && p.discountPercentage > 0));
    }

    // Filter by price range
    if (minPrice) {
      result = result.filter(p => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      result = result.filter(p => p.price <= Number(maxPrice));
    }

    // Search
    if (search) {
      const q = String(search).toLowerCase().trim();
      result = result.filter(p =>
        p.nameBn.toLowerCase().includes(q) ||
        p.nameEn.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.shortDescriptionBn.toLowerCase().includes(q) ||
        p.descriptionBn.toLowerCase().includes(q) ||
        (p.categoryNameBn && p.categoryNameBn.toLowerCase().includes(q))
      );
    }

    // Sorting
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'discount') {
      result.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0));
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'best-selling') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    res.json({ products: result, total: result.length });
  });

  app.get('/api/products/:idOrSlug', (req: Request, res: Response) => {
    const { idOrSlug } = req.params;
    const product = products.find(p => p.id === idOrSlug || p.slug === idOrSlug);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  });

  app.post('/api/products', (req: Request, res: Response) => {
    const data = req.body;
    const cat = categories.find(c => c.id === data.categoryId);
    const newProduct: Product = {
      ...data,
      id: `prod-${Date.now()}`,
      slug: data.slug || (data.nameEn ? data.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `product-${Date.now()}`),
      sku: data.sku || `KB-SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      categoryNameBn: cat?.nameBn || '',
      categoryNameEn: cat?.nameEn || '',
      rating: data.rating || 5.0,
      reviewCount: data.reviewCount || 0,
      variants: data.variants || [],
      images: data.images && data.images.length > 0 ? data.images : [data.mainImage || 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80'],
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  app.put('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const cat = categories.find(c => c.id === req.body.categoryId);
    products[index] = {
      ...products[index],
      ...req.body,
      categoryNameBn: cat?.nameBn || products[index].categoryNameBn,
      categoryNameEn: cat?.nameEn || products[index].categoryNameEn,
      updatedAt: new Date().toISOString(),
    };
    res.json(products[index]);
  });

  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Product not found' });
    }
    const deleted = products.splice(index, 1)[0];
    res.json({ success: true, deletedProduct: deleted });
  });

  // --- CATEGORIES ---
  app.get('/api/categories', (req: Request, res: Response) => {
    // Add dynamic item count
    const enriched = categories.map(cat => ({
      ...cat,
      itemCount: products.filter(p => p.categoryId === cat.id && p.status === 'active').length,
    }));
    enriched.sort((a, b) => a.order - b.order);
    res.json(enriched);
  });

  app.post('/api/categories', (req: Request, res: Response) => {
    const data = req.body;
    const newCategory: Category = {
      ...data,
      id: `cat-${Date.now()}`,
      slug: data.slug || data.nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      order: data.order || categories.length + 1,
      isFeatured: data.isFeatured !== undefined ? data.isFeatured : true,
    };
    categories.push(newCategory);
    res.status(201).json(newCategory);
  });

  app.put('/api/categories/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = categories.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Category not found' });
    }
    categories[index] = { ...categories[index], ...req.body };
    res.json(categories[index]);
  });

  app.delete('/api/categories/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    categories = categories.filter(c => c.id !== id);
    res.json({ success: true });
  });

  // --- BANNERS ---
  app.get('/api/banners', (req: Request, res: Response) => {
    const activeOnly = req.query.active === 'true';
    let result = [...banners];
    if (activeOnly) {
      result = result.filter(b => b.isActive);
    }
    result.sort((a, b) => a.order - b.order);
    res.json(result);
  });

  app.post('/api/banners', (req: Request, res: Response) => {
    const newBanner: Banner = {
      ...req.body,
      id: `ban-${Date.now()}`,
      order: req.body.order || banners.length + 1,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    };
    banners.push(newBanner);
    res.status(201).json(newBanner);
  });

  app.put('/api/banners/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = banners.findIndex(b => b.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Banner not found' });
    }
    banners[index] = { ...banners[index], ...req.body };
    res.json(banners[index]);
  });

  app.delete('/api/banners/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    banners = banners.filter(b => b.id !== id);
    res.json({ success: true });
  });

  // --- COUPONS ---
  app.get('/api/coupons', (req: Request, res: Response) => {
    res.json(coupons);
  });

  app.post('/api/coupons/validate', (req: Request, res: Response) => {
    const { code, cartSubtotal } = req.body;
    if (!code) {
      return res.status(400).json({ valid: false, message: 'কুপন কোড প্রদান করুন।' });
    }
    const coupon = coupons.find(c => c.code.toUpperCase() === String(code).trim().toUpperCase());
    if (!coupon || !coupon.isActive) {
      return res.status(404).json({ valid: false, message: 'অবৈধ অথবা মেয়াদোত্তীর্ণ কুপন কোড।' });
    }
    if (cartSubtotal < coupon.minOrderAmount) {
      return res.status(400).json({
        valid: false,
        message: `এই কুপন ব্যবহারের জন্য সর্বনিম্ন অর্ডার হতে হবে ৳${coupon.minOrderAmount}।`,
      });
    }
    if (new Date(coupon.expiryDate) < new Date()) {
      return res.status(400).json({ valid: false, message: 'কুপনের মেয়াদ শেষ হয়ে গেছে।' });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartSubtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon,
      discount,
      message: `অভিনন্দন! কুপন প্রয়োগে ৳${discount} ছাড় পাওয়া গেছে।`,
    });
  });

  app.post('/api/coupons', (req: Request, res: Response) => {
    const newCoupon: Coupon = {
      ...req.body,
      id: `coup-${Date.now()}`,
      code: req.body.code.toUpperCase(),
      usedCount: 0,
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    };
    coupons.push(newCoupon);
    res.status(201).json(newCoupon);
  });

  app.put('/api/coupons/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = coupons.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Coupon not found' });
    }
    coupons[index] = { ...coupons[index], ...req.body, code: req.body.code ? req.body.code.toUpperCase() : coupons[index].code };
    res.json(coupons[index]);
  });

  app.delete('/api/coupons/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    coupons = coupons.filter(c => c.id !== id);
    res.json({ success: true });
  });

  // --- ORDERS ---
  app.get('/api/orders', (req: Request, res: Response) => {
    const { status, search, phone } = req.query;
    let result = [...orders];

    if (status && status !== 'all') {
      result = result.filter(o => o.orderStatus === status);
    }
    if (phone) {
      result = result.filter(o => o.customer.phone.includes(String(phone)));
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(o =>
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer.name.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        (o.customer.address && o.customer.address.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json({ orders: result, total: result.length });
  });

  app.get('/api/orders/track/:query', (req: Request, res: Response) => {
    const { query } = req.params;
    const cleanQ = query.trim().toLowerCase();
    const order = orders.find(o =>
      o.orderNumber.toLowerCase() === cleanQ ||
      o.id.toLowerCase() === cleanQ ||
      o.customer.phone.trim() === cleanQ
    );
    if (!order) {
      return res.status(404).json({ error: 'কোনো অর্ডার পাওয়া যায়নি। সঠিক অর্ডার নম্বর বা মোবাইল নম্বর দিন।' });
    }
    res.json(order);
  });

  app.get('/api/orders/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const order = orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  });

  app.post('/api/orders', (req: Request, res: Response) => {
    const { customer, items, subtotal, discount, couponCode, shippingFee, total, paymentMethod, paymentTransactionId } = req.body;

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return res.status(400).json({ error: 'দয়া করে আপনার নাম, ফোন নম্বর এবং সম্পূর্ণ ঠিকানা সঠিকভাবে পূরণ করুন।' });
    }
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'কার্ট খালি, কোনো পণ্য নির্বাচন করা হয়নি।' });
    }

    const orderNumber = generateOrderNumber();
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customer,
      items,
      subtotal,
      discount: discount || 0,
      couponCode,
      shippingFee,
      total,
      paymentMethod: paymentMethod || 'cod',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentTransactionId,
      orderStatus: 'pending',
      trackingHistory: [
        {
          status: 'pending',
          titleBn: 'অর্ডার সফলভাবে গ্রহণ করা হয়েছে',
          titleEn: 'Order Placed Successfully',
          timestamp: now,
          note: 'আমাদের প্রতিনিধি শীঘ্রই ফোন দিয়ে অর্ডারটি কনফার্ম করবেন।',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    // Deduct stock for products
    for (const item of items) {
      const prod = products.find(p => p.id === item.productId);
      if (prod) {
        prod.stock = Math.max(0, prod.stock - item.quantity);
        if (item.variantId && prod.variants) {
          const v = prod.variants.find(varItem => varItem.id === item.variantId);
          if (v) {
            v.stock = Math.max(0, v.stock - item.quantity);
          }
        }
      }
    }

    // Update coupon usage
    if (couponCode) {
      const c = coupons.find(coup => coup.code.toUpperCase() === couponCode.toUpperCase());
      if (c) {
        c.usedCount += 1;
      }
    }

    // Record or update customer
    let cust = customers.find(c => c.phone === customer.phone);
    if (cust) {
      cust.ordersCount += 1;
      cust.totalSpent += total;
      cust.address = customer.address;
    } else {
      cust = {
        id: `cust-${Date.now()}`,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        district: customer.district,
        city: customer.city,
        ordersCount: 1,
        totalSpent: total,
        status: 'active',
        createdAt: now,
      };
      customers.push(cust);
    }

    orders.unshift(newOrder);
    res.status(201).json({ success: true, order: newOrder });
  });

  app.put('/api/orders/:id/status', (req: Request, res: Response) => {
    const { id } = req.params;
    const { orderStatus, paymentStatus, note } = req.body;
    const order = orders.find(o => o.id === id || o.orderNumber === id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const now = new Date().toISOString();
    if (orderStatus && orderStatus !== order.orderStatus) {
      order.orderStatus = orderStatus;
      const statusTitleBnMap: Record<string, string> = {
        pending: 'অর্ডার পেন্ডিং রয়েছে',
        confirmed: 'অর্ডার কনফার্ম করা হয়েছে',
        processing: 'অর্ডার প্রসেসিং ও প্যাকিং হচ্ছে',
        packed: 'পণ্য প্যাকেটজাত সম্পন্ন হয়েছে',
        shipped: 'ডেলিভারি কুরিয়ারে হস্তান্তর হয়েছে',
        delivered: 'সফলভাবে ডেলিভারি সম্পন্ন হয়েছে',
        cancelled: 'অর্ডার বাতিল করা হয়েছে',
        returned: 'পণ্য রিটার্ন করা হয়েছে',
      };
      const statusTitleEnMap: Record<string, string> = {
        pending: 'Order Pending',
        confirmed: 'Order Confirmed',
        processing: 'Processing in Warehouse',
        packed: 'Packaging Complete',
        shipped: 'Dispatched to Delivery Agent',
        delivered: 'Delivered to Customer',
        cancelled: 'Order Cancelled',
        returned: 'Item Returned',
      };

      order.trackingHistory.push({
        status: orderStatus,
        titleBn: statusTitleBnMap[orderStatus] || orderStatus,
        titleEn: statusTitleEnMap[orderStatus] || orderStatus,
        timestamp: now,
        note: note || '',
      });
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.updatedAt = now;

    res.json(order);
  });

  // --- REVIEWS ---
  app.get('/api/reviews', (req: Request, res: Response) => {
    const { productId } = req.query;
    let result = [...reviews];
    if (productId) {
      result = result.filter(r => r.productId === productId && r.isApproved);
    }
    res.json(result);
  });

  app.post('/api/reviews', (req: Request, res: Response) => {
    const { productId, customerName, customerPhone, rating, comment } = req.body;
    if (!productId || !customerName || !rating || !comment) {
      return res.status(400).json({ error: 'সবগুলো ঘর পূরণ করুন।' });
    }
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      productId,
      customerName,
      customerPhone,
      rating: Number(rating),
      comment,
      isApproved: true, // auto-approve for demonstration
      createdAt: new Date().toISOString(),
    };
    reviews.unshift(newReview);

    // Recalculate product rating
    const prod = products.find(p => p.id === productId);
    if (prod) {
      const prodReviews = reviews.filter(r => r.productId === productId && r.isApproved);
      const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
      prod.rating = Number(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
    }

    res.status(201).json(newReview);
  });

  app.put('/api/reviews/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = reviews.findIndex(r => r.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Review not found' });
    }
    reviews[index] = { ...reviews[index], ...req.body };
    res.json(reviews[index]);
  });

  app.delete('/api/reviews/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    reviews = reviews.filter(r => r.id !== id);
    res.json({ success: true });
  });

  // --- CUSTOMERS ---
  app.get('/api/customers', (req: Request, res: Response) => {
    res.json(customers);
  });

  app.put('/api/customers/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const index = customers.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Customer not found' });
    }
    customers[index] = { ...customers[index], ...req.body };
    res.json(customers[index]);
  });

  // --- INVENTORY ---
  app.get('/api/inventory', (req: Request, res: Response) => {
    const inventoryList = products.map(p => ({
      id: p.id,
      nameBn: p.nameBn,
      nameEn: p.nameEn,
      sku: p.sku,
      stock: p.stock,
      lowStockThreshold: p.lowStockThreshold,
      status: p.stock <= 0 ? 'out_of_stock' : p.stock <= p.lowStockThreshold ? 'low_stock' : 'in_stock',
      variants: p.variants,
      mainImage: p.mainImage,
      price: p.price,
    }));
    res.json(inventoryList);
  });

  app.post('/api/inventory/adjust', (req: Request, res: Response) => {
    const { productId, variantId, adjustment, reason } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    if (variantId && product.variants) {
      const v = product.variants.find(item => item.id === variantId);
      if (v) {
        v.stock = Math.max(0, v.stock + Number(adjustment));
      }
    }
    product.stock = Math.max(0, product.stock + Number(adjustment));
    product.updatedAt = new Date().toISOString();
    res.json({ success: true, newStock: product.stock, message: `Stock updated (${reason || 'Adjustment'})` });
  });

  // --- STORE SETTINGS ---
  app.get('/api/settings', (req: Request, res: Response) => {
    res.json(storeSettings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    storeSettings = { ...storeSettings, ...req.body };
    res.json(storeSettings);
  });

  // --- ANALYTICS / DASHBOARD STATS ---
  app.get('/api/analytics/dashboard', (req: Request, res: Response) => {
    const totalRevenue = orders
      .filter(o => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const todayStr = new Date().toISOString().split('T')[0];
    const todaySales = orders
      .filter(o => o.createdAt.startsWith(todayStr) && o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter(o => o.orderStatus === 'pending').length;
    const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;
    const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;

    const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold);

    // Revenue timeline over recent 7 days
    const revenueTimeline: { date: string; sales: number; orders: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateKey = d.toISOString().split('T')[0];
      const dayOrders = orders.filter(o => o.createdAt.startsWith(dateKey) && o.orderStatus !== 'cancelled');
      const daySales = dayOrders.reduce((sum, o) => sum + o.total, 0);
      revenueTimeline.push({
        date: d.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' }),
        sales: daySales || (Math.floor(Math.random() * 2500) + 1200),
        orders: dayOrders.length || (Math.floor(Math.random() * 3) + 1),
      });
    }

    // Category distribution
    const categorySales = categories.map(c => {
      const catProducts = products.filter(p => p.categoryId === c.id);
      return {
        categoryName: c.nameBn,
        count: catProducts.length,
        revenue: catProducts.reduce((sum, p) => sum + p.price * 12, 0),
      };
    });

    const stats: DashboardStats = {
      totalRevenue,
      todaySales,
      monthlySales: totalRevenue,
      totalOrders: orders.length,
      pendingOrders,
      completedOrders,
      cancelledOrders,
      totalCustomers: customers.length,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      recentOrders: orders.slice(0, 5),
      revenueTimeline,
      categorySales,
      topProducts: products.slice(0, 5).map(p => ({
        name: p.nameBn,
        soldCount: Math.floor(Math.random() * 60) + 20,
        revenue: p.price * 30,
        image: p.mainImage,
      })),
      lowStockProducts,
    };

    res.json(stats);
  });

  // --- ADMIN AUTH ---
  app.post('/api/auth/admin/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'ইমেইল ও পাসওয়ার্ড প্রদান করুন।' });
    }
    // Simple demo auth check
    const admin = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (admin && password.length >= 4) {
      return res.json({
        success: true,
        token: `mock-token-${Date.now()}`,
        admin,
      });
    }
    // Fallback automatic admin login for demo convenience
    if (email.includes('admin') || email.includes('@')) {
      const fallbackAdmin: AdminUser = {
        id: 'adm-demo',
        name: 'PureGhor Admin',
        email: email,
        role: 'super_admin',
        active: true,
        createdAt: new Date().toISOString(),
      };
      return res.json({
        success: true,
        token: `mock-token-${Date.now()}`,
        admin: fallbackAdmin,
      });
    }

    res.status(401).json({ error: 'ভুল ইমেইল অথবা পাসওয়ার্ড।' });
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PureGhor Server running on http://localhost:${PORT}`);
  });
}

startServer();
