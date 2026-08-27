import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Firestore,
  writeBatch,
} from 'firebase/firestore';
import firebaseConfigData from '../../firebase-applet-config.json';
import {
  initialProducts,
  initialCategories,
  initialBanners,
  initialCoupons,
  initialSettings,
  initialOrders,
  initialReviews,
} from '../data/initialData';
import {
  Product,
  Category,
  Banner,
  Coupon,
  Order,
  StoreSettings,
  Review,
  CustomerUser,
} from '../types';

const firebaseConfig = {
  apiKey: firebaseConfigData.apiKey,
  authDomain: firebaseConfigData.authDomain,
  projectId: firebaseConfigData.projectId,
  storageBucket: firebaseConfigData.storageBucket,
  messagingSenderId: firebaseConfigData.messagingSenderId,
  appId: firebaseConfigData.appId,
};

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with specific Database ID
export const db: Firestore = firebaseConfigData.firestoreDatabaseId
  ? getFirestore(app, firebaseConfigData.firestoreDatabaseId)
  : getFirestore(app);

// Helper collection names
export const COLLECTIONS = {
  PRODUCTS: 'products',
  CATEGORIES: 'categories',
  BANNERS: 'banners',
  COUPONS: 'coupons',
  ORDERS: 'orders',
  REVIEWS: 'reviews',
  SETTINGS: 'settings',
  CUSTOMERS: 'customers',
};

// Helper to recursively remove undefined values so Firestore never throws
function cleanForFirestore<T>(obj: T): T {
  if (obj === null || obj === undefined) return null as any;
  if (Array.isArray(obj)) {
    return obj.map(item => cleanForFirestore(item)) as any;
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key of Object.keys(obj as any)) {
      const val = (obj as any)[key];
      if (val !== undefined) {
        cleaned[key] = cleanForFirestore(val);
      }
    }
    return cleaned;
  }
  return obj;
}

/**
 * Initialize Firestore database with seed data if it's currently empty
 */
let isSeeding = false;
export async function seedFirestoreIfEmpty(): Promise<boolean> {
  if (isSeeding) return false;
  try {
    isSeeding = true;
    const settingsDocRef = doc(db, COLLECTIONS.SETTINGS, 'store_config');
    const settingsSnap = await getDoc(settingsDocRef);

    if (!settingsSnap.exists()) {
      console.log('🌱 Seeding Firestore with initial PureGhor store catalog...');
      const batch = writeBatch(db);

      // 1. Settings
      batch.set(settingsDocRef, initialSettings);

      // 2. Categories
      for (const cat of initialCategories) {
        const catRef = doc(db, COLLECTIONS.CATEGORIES, cat.id);
        batch.set(catRef, cat);
      }

      // 3. Products
      for (const prod of initialProducts) {
        const prodRef = doc(db, COLLECTIONS.PRODUCTS, prod.id);
        batch.set(prodRef, prod);
      }

      // 4. Banners
      for (const ban of initialBanners) {
        const banRef = doc(db, COLLECTIONS.BANNERS, ban.id);
        batch.set(banRef, ban);
      }

      // 5. Coupons
      for (const coup of initialCoupons) {
        const coupRef = doc(db, COLLECTIONS.COUPONS, coup.id);
        batch.set(coupRef, coup);
      }

      // 6. Orders
      for (const ord of initialOrders) {
        const ordRef = doc(db, COLLECTIONS.ORDERS, ord.id);
        batch.set(ordRef, ord);
      }

      // 7. Reviews
      for (const rev of initialReviews) {
        const revRef = doc(db, COLLECTIONS.REVIEWS, rev.id);
        batch.set(revRef, rev);
      }

      await batch.commit();
      console.log('✅ Firestore seeded successfully with PureGhor data!');
      return true;
    }
    return false;
  } catch (error) {
    console.warn('Could not auto-seed Firestore (possibly permissions/network), using local fallback:', error);
    return false;
  } finally {
    isSeeding = false;
  }
}

// Direct Firestore Database Operations
export const firestoreService = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.PRODUCTS));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
      }
      // If empty, trigger auto seed
      await seedFirestoreIfEmpty();
      return initialProducts;
    } catch (err) {
      console.warn('Firestore getProducts error, falling back to mock:', err);
      return initialProducts;
    }
  },

  async saveProduct(product: Product): Promise<Product> {
    try {
      const prodRef = doc(db, COLLECTIONS.PRODUCTS, product.id);
      await setDoc(prodRef, product, { merge: true });
      return product;
    } catch (err) {
      console.warn('Firestore saveProduct error:', err);
      return product;
    }
  },

  async deleteProduct(productId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, productId));
      return true;
    } catch (err) {
      console.warn('Firestore deleteProduct error:', err);
      return false;
    }
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
      if (!snap.empty) {
        const cats = snap.docs.map(d => ({ ...d.data(), id: d.id } as Category));
        return cats.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
      await seedFirestoreIfEmpty();
      return initialCategories;
    } catch (err) {
      return initialCategories;
    }
  },

  async saveCategory(category: Category): Promise<Category> {
    try {
      const catRef = doc(db, COLLECTIONS.CATEGORIES, category.id);
      await setDoc(catRef, category, { merge: true });
      return category;
    } catch (err) {
      return category;
    }
  },

  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, categoryId));
      return true;
    } catch (err) {
      return false;
    }
  },

  // Orders
  async getOrders(): Promise<Order[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ORDERS));
      if (!snap.empty) {
        const orders = snap.docs.map(d => ({ ...d.data(), id: d.id } as Order));
        return orders.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      }
      return initialOrders;
    } catch (err) {
      return initialOrders;
    }
  },

  async createOrder(order: Order): Promise<Order> {
    try {
      const cleaned = cleanForFirestore(order);
      const ordRef = doc(db, COLLECTIONS.ORDERS, order.id);
      await setDoc(ordRef, cleaned);
      return order;
    } catch (err) {
      console.error('Failed to create order in Firestore:', err);
      return order;
    }
  },

  async updateOrder(orderId: string, updates: Partial<Order>): Promise<Order | null> {
    try {
      const cleaned = cleanForFirestore(updates);
      const ordRef = doc(db, COLLECTIONS.ORDERS, orderId);
      await updateDoc(ordRef, cleaned);
      const snap = await getDoc(ordRef);
      return snap.exists() ? ({ ...snap.data(), id: snap.id } as Order) : null;
    } catch (err) {
      console.warn('Firestore updateOrder error:', err);
      return null;
    }
  },

  // Coupons
  async getCoupons(): Promise<Coupon[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.COUPONS));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as Coupon));
      }
      return initialCoupons;
    } catch (err) {
      return initialCoupons;
    }
  },

  async saveCoupon(coupon: Coupon): Promise<Coupon> {
    try {
      const coupRef = doc(db, COLLECTIONS.COUPONS, coupon.id);
      await setDoc(coupRef, coupon, { merge: true });
      return coupon;
    } catch (err) {
      return coupon;
    }
  },

  async deleteCoupon(couponId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.COUPONS, couponId));
      return true;
    } catch (err) {
      return false;
    }
  },

  // Banners
  async getBanners(activeOnly = true): Promise<Banner[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.BANNERS));
      if (!snap.empty) {
        let list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Banner));
        if (activeOnly) {
          list = list.filter(b => b.isActive);
        }
        return list.sort((a, b) => (a.order || 0) - (b.order || 0));
      }
      await seedFirestoreIfEmpty();
      return activeOnly ? initialBanners.filter(b => b.isActive) : initialBanners;
    } catch (err) {
      console.warn('Firestore getBanners error, falling back:', err);
      return activeOnly ? initialBanners.filter(b => b.isActive) : initialBanners;
    }
  },

  async saveBanner(banner: Banner): Promise<Banner> {
    try {
      const banRef = doc(db, COLLECTIONS.BANNERS, banner.id);
      await setDoc(banRef, banner, { merge: true });
      return banner;
    } catch (err) {
      console.warn('Firestore saveBanner error:', err);
      return banner;
    }
  },

  async deleteBanner(bannerId: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.BANNERS, bannerId));
      return true;
    } catch (err) {
      return false;
    }
  },

  // Store Settings
  async getSettings(): Promise<StoreSettings> {
    try {
      const snap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'store_config'));
      if (snap.exists()) {
        return snap.data() as StoreSettings;
      }
      return initialSettings;
    } catch (err) {
      return initialSettings;
    }
  },

  async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    try {
      const settingsRef = doc(db, COLLECTIONS.SETTINGS, 'store_config');
      await setDoc(settingsRef, settings, { merge: true });
      const snap = await getDoc(settingsRef);
      return snap.data() as StoreSettings;
    } catch (err) {
      return { ...initialSettings, ...settings };
    }
  },

  // Reviews
  async getReviews(productId?: string): Promise<Review[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.REVIEWS));
      let reviews = snap.docs.map(d => ({ ...d.data(), id: d.id } as Review));
      if (productId) {
        reviews = reviews.filter(r => r.productId === productId);
      }
      return reviews.length > 0 ? reviews : initialReviews.filter(r => !productId || r.productId === productId);
    } catch (err) {
      return initialReviews.filter(r => !productId || r.productId === productId);
    }
  },

  async addReview(review: Review): Promise<Review> {
    try {
      const revRef = doc(db, COLLECTIONS.REVIEWS, review.id);
      await setDoc(revRef, review);
      return review;
    } catch (err) {
      return review;
    }
  },

  // Customers
  async getCustomers(): Promise<CustomerUser[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CUSTOMERS));
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), id: d.id } as CustomerUser));
      }
      return [];
    } catch (err) {
      return [];
    }
  },
};
