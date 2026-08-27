import React, { useState, useEffect } from 'react';
import { Product, Category, ProductVariant } from '../../types';
import { X, Plus, Trash2, Image, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminProductModalProps {
  product: Product | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const { addToast } = useStore();

  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [compareAtPrice, setCompareAtPrice] = useState<number>(0);
  const [discountPercentage, setDiscountPercentage] = useState<number>(0);
  const [stock, setStock] = useState<number>(10);
  const [lowStockThreshold, setLowStockThreshold] = useState<number>(5);
  const [weight, setWeight] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [imagesText, setImagesText] = useState('');
  const [shortDescriptionBn, setShortDescriptionBn] = useState('');
  const [shortDescriptionEn, setShortDescriptionEn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [tag, setTag] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isSpecialDeal, setIsSpecialDeal] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive' | 'draft'>('active');
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setNameBn(product.nameBn || '');
      setNameEn(product.nameEn || '');
      setSlug(product.slug || '');
      setSku(product.sku || '');
      setCategoryId(product.categoryId || (categories[0]?.id || ''));
      setPrice(product.price || 0);
      setCompareAtPrice(product.compareAtPrice || 0);
      setDiscountPercentage(product.discountPercentage || 0);
      setStock(product.stock || 0);
      setLowStockThreshold(product.lowStockThreshold || 5);
      setWeight(product.weight || '');
      setMainImage(product.mainImage || '');
      setImagesText(product.images ? product.images.join('\n') : product.mainImage);
      setShortDescriptionBn(product.shortDescriptionBn || '');
      setShortDescriptionEn(product.shortDescriptionEn || '');
      setDescriptionBn(product.descriptionBn || '');
      setDescriptionEn(product.descriptionEn || '');
      setTag(product.tag || '');
      setIsFeatured(!!product.isFeatured);
      setIsBestSeller(!!product.isBestSeller);
      setIsNewArrival(!!product.isNewArrival);
      setIsSpecialDeal(!!product.isSpecialDeal);
      setStatus(product.status || 'active');
      setVariants(product.variants ? JSON.parse(JSON.stringify(product.variants)) : []);
    } else {
      // New product defaults
      setNameBn('');
      setNameEn('');
      setSlug('');
      setSku(`KB-SKU-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategoryId(categories[0]?.id || '');
      setPrice(500);
      setCompareAtPrice(600);
      setDiscountPercentage(15);
      setStock(20);
      setLowStockThreshold(5);
      setWeight('500g');
      setMainImage('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80');
      setImagesText('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80');
      setShortDescriptionBn('১০০% খাঁটি ও স্বাস্থ্যকর প্রাকৃতিক উপাদান।');
      setShortDescriptionEn('100% pure, unadulterated organic product.');
      setDescriptionBn('প্রাকৃতিক উপায়ে প্রক্রিয়াজাত শতভাগ খাঁটি ও স্বাস্থ্যকর খাদ্য পণ্য।');
      setDescriptionEn('Processed through traditional methods ensuring supreme purity.');
      setTag('অর্গানিক');
      setIsFeatured(false);
      setIsBestSeller(false);
      setIsNewArrival(true);
      setIsSpecialDeal(false);
      setStatus('active');
      setVariants([
        { id: `var-1-${Date.now()}`, weight: '250g', price: 300, compareAtPrice: 350, stock: 15, sku: 'KB-250G' },
        { id: `var-2-${Date.now()}`, weight: '500g', price: 550, compareAtPrice: 650, stock: 20, sku: 'KB-500G' },
        { id: `var-3-${Date.now()}`, weight: '1kg', price: 1000, compareAtPrice: 1200, stock: 10, sku: 'KB-1KG' },
      ]);
    }
  }, [product, categories, isOpen]);

  if (!isOpen) return null;

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: `var-${Date.now()}`,
        weight: '1kg',
        price: 900,
        compareAtPrice: 1100,
        stock: 10,
        sku: `${sku}-V${variants.length + 1}`,
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    setVariants(variants.filter(v => v.id !== id));
  };

  const handleVariantChange = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(
      variants.map(v => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim()) {
      addToast('পণ্যের বাংলা নাম দিন', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const imagesList = imagesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const payload: Partial<Product> = {
        nameBn: nameBn.trim(),
        nameEn: nameEn.trim() || nameBn.trim(),
        slug: slug.trim() || (nameEn ? nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prod-${Date.now()}`),
        sku: sku.trim(),
        categoryId,
        price: Number(price),
        compareAtPrice: Number(compareAtPrice) || undefined,
        discountPercentage: Number(discountPercentage) || undefined,
        stock: Number(stock),
        lowStockThreshold: Number(lowStockThreshold),
        weight: weight.trim(),
        mainImage: mainImage.trim() || (imagesList[0] || ''),
        images: imagesList.length > 0 ? imagesList : [mainImage],
        shortDescriptionBn,
        shortDescriptionEn,
        descriptionBn,
        descriptionEn,
        tag: tag.trim() || undefined,
        isFeatured,
        isBestSeller,
        isNewArrival,
        isSpecialDeal,
        status,
        variants,
      };

      await onSave(payload);
      onClose();
    } catch (e: any) {
      addToast(e.message || 'পণ্য সংরক্ষণ করা সম্ভব হয়নি', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-400" />
            <span>{product ? 'পণ্য সম্পাদনা (Edit Product)' : 'নতুন পণ্য যোগ করুন (Add New Product)'}</span>
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Basic Titles & Slug */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">পণ্যের নাম (বাংলা) *</label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={e => setNameBn(e.target.value)}
                placeholder="যেমন: সুন্দরবনের খাঁটি খলিসা মধু"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Product Name (English)</label>
              <input
                type="text"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                placeholder="e.g. Pure Sundarban Honey"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">ক্যাটাগরি *</label>
              <select
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.nameBn} ({c.nameEn})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">SKU কোড</label>
              <input
                type="text"
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">স্ট্যাটাস</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="active">Active (সক্রিয়)</option>
                <option value="inactive">Inactive (নিষ্ক্রিয়)</option>
                <option value="draft">Draft (খসড়া)</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-200 text-sm">মূল্য ও স্টক পরিমাণ</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">বিক্রয় মূল্য (৳) *</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">পূর্বের মূল্য / Compare (৳)</label>
                <input
                  type="number"
                  value={compareAtPrice}
                  onChange={e => setCompareAtPrice(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">স্টক পরিমাণ (Pcs) *</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={e => setStock(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold text-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">লো-স্টক সীমা (Alert)</label>
                <input
                  type="number"
                  value={lowStockThreshold}
                  onChange={e => setLowStockThreshold(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Variants Management */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-slate-200 text-sm">ওজন / সাইজ ভ্যারিয়েন্ট (250g, 500g, 1kg)</h4>
              <button
                type="button"
                onClick={handleAddVariant}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded text-xs flex items-center gap-1 font-semibold cursor-pointer"
              >
                <Plus size={14} />
                <span>ভ্যারিয়েন্ট যোগ</span>
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={v.id} className="flex items-center gap-2 bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <input
                    type="text"
                    placeholder="ওজন (500g)"
                    value={v.weight}
                    onChange={e => handleVariantChange(v.id, 'weight', e.target.value)}
                    className="w-24 bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-100"
                  />
                  <input
                    type="number"
                    placeholder="মূল্য ৳"
                    value={v.price}
                    onChange={e => handleVariantChange(v.id, 'price', Number(e.target.value))}
                    className="w-24 bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-100 font-bold"
                  />
                  <input
                    type="number"
                    placeholder="পূর্বমূল্য"
                    value={v.compareAtPrice || ''}
                    onChange={e => handleVariantChange(v.id, 'compareAtPrice', Number(e.target.value))}
                    className="w-24 bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-100"
                  />
                  <input
                    type="number"
                    placeholder="স্টক"
                    value={v.stock}
                    onChange={e => handleVariantChange(v.id, 'stock', Number(e.target.value))}
                    className="w-20 bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(v.id)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Product Images & Description */}
          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">মূল ছবির URL (Main Image) *</label>
              <input
                type="url"
                required
                value={mainImage}
                onChange={e => setMainImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">অতিরিক্ত ছবির URL সমূহ (প্রতি লাইনে একটি)</label>
              <textarea
                rows={2}
                value={imagesText}
                onChange={e => setImagesText(e.target.value)}
                placeholder="https://..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">সংক্ষিপ্ত বিবরণ (Short Description)</label>
              <textarea
                rows={2}
                value={shortDescriptionBn}
                onChange={e => setShortDescriptionBn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">বিস্তারিত বিবরণ (Full Description)</label>
              <textarea
                rows={4}
                value={descriptionBn}
                onChange={e => setDescriptionBn(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Checkbox Toggles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span className="font-semibold text-slate-300">ফিচার্ড পণ্য</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={e => setIsBestSeller(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span className="font-semibold text-slate-300">বেস্ট সেলার</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={e => setIsNewArrival(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span className="font-semibold text-slate-300">নতুন আগমন</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSpecialDeal}
                onChange={e => setIsSpecialDeal(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-0"
              />
              <span className="font-semibold text-slate-300">স্পেশাল ছাড়</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors cursor-pointer"
            >
              {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'পণ্য সংরক্ষণ করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
