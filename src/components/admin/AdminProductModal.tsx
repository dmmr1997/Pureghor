import React, { useState, useEffect, useRef } from 'react';
import { Product, Category, ProductVariant } from '../../types';
import { X, Plus, Trash2, Image as ImageIcon, Sparkles, Upload, Check, AlertCircle, Eye } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface AdminProductModalProps {
  product: Product | null;
  categories: Category[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<void>;
}

// Preset verified high-resolution images for quick 1-click selection
const PRESET_PRODUCT_IMAGES = [
  {
    name: 'কালোজিরা ফুলের মধু',
    url: '/images/products/pureghor_blackseed_honey_1787810945841.jpg',
    category: 'মধু',
  },
  {
    name: 'প্রিমিয়াম হানি নাট',
    url: '/images/products/pureghor_honey_nut_1787810965222.jpg',
    category: 'হানি নাট',
  },
  {
    name: 'কোল্ড প্রেসড কালোজিরা তেল',
    url: '/images/products/pureghor_blackseed_oil_1787810985248.jpg',
    category: 'তেল',
  },
  {
    name: '৪-ইন-১ বাদাম কম্বো',
    url: '/images/products/pureghor_nuts_combo_1787811004501.jpg',
    category: 'বাদাম',
  },
  {
    name: 'কাঁচা আস্ত আখরোট',
    url: '/images/products/pureghor_walnuts_1787811030407.jpg',
    category: 'বাদাম',
  },
  {
    name: 'মচমচে চিংড়ি বালাচাও',
    url: '/images/products/pureghor_shrimp_balachao_1787811048807.jpg',
    category: 'বালাচাও',
  },
  {
    name: 'অসিম্যাক্স বেবি ওটস',
    url: '/images/products/pureghor_baby_oats_1787811068133.jpg',
    category: 'ওটস',
  },
  {
    name: 'কুয়েকার হোল গ্রেইন ওটস',
    url: '/images/products/pureghor_quaker_oats_1787811088089.jpg',
    category: 'ওটস',
  },
  {
    name: 'তাজা অর্গানিক আম',
    url: '/images/products/pureghor_fresh_mango_1787811114200.jpg',
    category: 'ফল',
  },
  {
    name: 'খাঁটি গাওয়া ঘি',
    url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=800&auto=format&fit=crop&q=80',
    category: 'ঘি',
  },
  {
    name: 'কাঠের ঘানির সরিষার তেল',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop&q=80',
    category: 'তেল',
  },
  {
    name: 'যশোরের খাঁটি খেজুর গুড়',
    url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=800&auto=format&fit=crop&q=80',
    category: 'গুড়',
  },
  {
    name: 'প্রিমিয়াম অর্গানিক সিয়া সিড',
    url: 'https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=800&auto=format&fit=crop&q=80',
    category: 'সিডস',
  },
];

export const AdminProductModal: React.FC<AdminProductModalProps> = ({
  product,
  categories,
  isOpen,
  onClose,
  onSave,
}) => {
  const { addToast } = useStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
  const [unit, setUnit] = useState('গ্রাম');
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
  const [showPresetGallery, setShowPresetGallery] = useState(false);

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
      setWeight(product.weight || '500g');
      setUnit(product.unit || 'গ্রাম');
      setMainImage(product.mainImage || '');
      setImagesText(product.images ? product.images.join('\n') : product.mainImage || '');
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
      setSku(`PG-${Math.floor(1000 + Math.random() * 9000)}`);
      setCategoryId(categories[0]?.id || 'cat-1');
      setPrice(650);
      setCompareAtPrice(850);
      setDiscountPercentage(24);
      setStock(30);
      setLowStockThreshold(5);
      setWeight('500 গ্রাম');
      setUnit('গ্রাম');
      setMainImage('/images/products/pureghor_blackseed_honey_1787810945841.jpg');
      setImagesText('/images/products/pureghor_blackseed_honey_1787810945841.jpg');
      setShortDescriptionBn('১০০% খাঁটি, প্রাকৃতিক ও স্বাস্থ্যসম্মত অর্গানিক পণ্য।');
      setShortDescriptionEn('100% natural, unadulterated organic product.');
      setDescriptionBn('প্রাকৃতিক উপায়ে প্রক্রিয়াজাত শতভাগ খাঁটি খাদ্য পণ্য। কোনো প্রকার ক্ষতিকারক কেমিক্যাল বা কৃত্রিম উপাদান মুক্ত।');
      setDescriptionEn('Processed through traditional methods ensuring supreme purity and hygiene.');
      setTag('অর্গানিক');
      setIsFeatured(true);
      setIsBestSeller(false);
      setIsNewArrival(true);
      setIsSpecialDeal(false);
      setStatus('active');
      setVariants([
        { id: `var-1-${Date.now()}`, weight: '500g', price: 650, compareAtPrice: 850, stock: 20, sku: `PG-500G` },
        { id: `var-2-${Date.now()}`, weight: '1kg', price: 1200, compareAtPrice: 1600, stock: 10, sku: `PG-1KG` },
      ]);
    }
  }, [product, categories, isOpen]);

  // Recalculate discount percentage when price or compare price changes
  const handlePriceChange = (val: number) => {
    setPrice(val);
    if (compareAtPrice > val && val > 0) {
      setDiscountPercentage(Math.round(((compareAtPrice - val) / compareAtPrice) * 100));
    } else {
      setDiscountPercentage(0);
    }
  };

  const handleComparePriceChange = (val: number) => {
    setCompareAtPrice(val);
    if (val > price && price > 0) {
      setDiscountPercentage(Math.round(((val - price) / val) * 100));
    } else {
      setDiscountPercentage(0);
    }
  };

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      addToast('ছবির সাইজ সর্বোচ্চ 5MB হতে পারে', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setMainImage(reader.result);
        setImagesText(prev => (prev ? `${reader.result}\n${prev}` : reader.result as string));
        addToast('ছবি সফলভাবে আপলোড হয়েছে', 'success');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: `var-${Date.now()}`,
        weight: '1kg',
        price: price ? price * 2 : 1000,
        compareAtPrice: compareAtPrice ? compareAtPrice * 2 : 1200,
        stock: 10,
        sku: `${sku || 'PG'}-V${variants.length + 1}`,
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
      addToast('পণ্যের বাংলা নাম অবশ্যই দিতে হবে', 'error');
      return;
    }

    if (!mainImage.trim()) {
      addToast('পণ্যের ছবি যুক্ত করুন', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const imagesList = imagesText
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const targetCategory = categories.find(c => c.id === categoryId) || categories[0];

      const payload: Partial<Product> = {
        nameBn: nameBn.trim(),
        nameEn: nameEn.trim() || nameBn.trim(),
        slug: slug.trim() || (nameEn ? nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `prod-${Date.now()}`),
        sku: sku.trim() || `PG-${Math.floor(1000 + Math.random() * 9000)}`,
        categoryId: targetCategory?.id || 'cat-1',
        categoryNameBn: targetCategory?.nameBn || 'অর্গানিক ফুড',
        categoryNameEn: targetCategory?.nameEn || 'Organic Food',
        brand: 'PureGhor (পিউর ঘর)',
        price: Number(price) || 0,
        compareAtPrice: Number(compareAtPrice) || undefined,
        discountPercentage: Number(discountPercentage) || undefined,
        stock: Number(stock) || 0,
        lowStockThreshold: Number(lowStockThreshold) || 5,
        weight: weight.trim() || '500 গ্রাম',
        unit: unit.trim() || 'গ্রাম',
        mainImage: mainImage.trim(),
        images: imagesList.length > 0 ? imagesList : [mainImage.trim()],
        shortDescriptionBn: shortDescriptionBn.trim(),
        shortDescriptionEn: shortDescriptionEn.trim(),
        descriptionBn: descriptionBn.trim(),
        descriptionEn: descriptionEn.trim(),
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
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[94vh] flex flex-col overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">
                {product ? 'পণ্য সম্পাদনা (Edit Product)' : 'নতুন পণ্য যোগ করুন (Add New Product)'}
              </h3>
              <p className="text-[11px] text-slate-400">তথ্য ও ছবি পরিবর্তন করলে সাথে সাথে ওয়েবসাইটে আপডেট হবে</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Basic Titles & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">পণ্যের নাম (বাংলা) *</label>
              <input
                type="text"
                required
                value={nameBn}
                onChange={e => setNameBn(e.target.value)}
                placeholder="যেমন: সুন্দরবনের খাঁটি কালোজিরা মধু"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Product Name (English)</label>
              <input
                type="text"
                value={nameEn}
                onChange={e => setNameEn(e.target.value)}
                placeholder="e.g. Pure Black Seed Honey"
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
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
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
                placeholder="PG-SKU-1001"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">স্ট্যাটাস</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none cursor-pointer"
              >
                <option value="active">Active (সক্রিয় - ওয়েবসাইটে দৃশ্যমান)</option>
                <option value="inactive">Inactive (নিষ্ক্রিয়)</option>
                <option value="draft">Draft (খসড়া)</option>
              </select>
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-200 text-sm flex items-center justify-between">
              <span>মূল্য ও স্টক পরিমাণ</span>
              {discountPercentage > 0 && (
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-bold">
                  {discountPercentage}% ছাড় প্রযোজ্য
                </span>
              )}
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">বিক্রয় মূল্য (৳) *</label>
                <input
                  type="number"
                  required
                  value={price || ''}
                  onChange={e => handlePriceChange(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-bold text-base text-emerald-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">পূর্বের মূল্য (Compare ৳)</label>
                <input
                  type="number"
                  value={compareAtPrice || ''}
                  onChange={e => handleComparePriceChange(Number(e.target.value))}
                  placeholder="যেমন: 850"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">স্টক পরিমাণ (Pcs) *</label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={e => setStock(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">ডিফল্ট ওজন / পরিমাণ</label>
                <input
                  type="text"
                  value={weight}
                  onChange={e => setWeight(e.target.value)}
                  placeholder="যেমন: 500 গ্রাম / ১ কেজি"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Product Image Section (Upload / Presets / URL) */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-200 text-sm flex items-center gap-2">
                  <ImageIcon size={16} className="text-emerald-400" />
                  <span>পণ্যের ছবি ব্যবস্থাপনা (Product Images)</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  ডিভাইস থেকে ছবি আপলোড করুন, প্রিসেট গ্যালারি থেকে সিলেক্ট করুন অথবা URL দিন
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPresetGallery(!showPresetGallery)}
                  className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Sparkles size={14} />
                  <span>{showPresetGallery ? 'গ্যালারি বন্ধ করুন' : 'প্রিসেট ছবি গ্যালারি'}</span>
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload size={14} />
                  <span>ছবি আপলোড (Upload)</span>
                </button>
              </div>
            </div>

            {/* Preset Gallery Picker */}
            {showPresetGallery && (
              <div className="p-3 bg-slate-900 border border-emerald-500/30 rounded-xl space-y-2">
                <p className="text-[11px] font-bold text-emerald-300">পিউর ঘরের আসল প্রিসেট ছবি (ক্লিক করে সিলেক্ট করুন):</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {PRESET_PRODUCT_IMAGES.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setMainImage(preset.url);
                        setImagesText(prev => (prev.includes(preset.url) ? prev : `${preset.url}\n${prev}`));
                        addToast(`"${preset.name}" ছবি সিলেক্ট করা হয়েছে`, 'info');
                      }}
                      className={`relative group cursor-pointer border rounded-lg p-1 transition-all flex flex-col items-center justify-between text-center bg-slate-950 ${
                        mainImage === preset.url
                          ? 'border-emerald-500 ring-2 ring-emerald-500/40'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-16 h-16 object-contain rounded bg-white/5 p-1"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/products/pureghor_blackseed_honey_1787810945841.jpg';
                        }}
                      />
                      <span className="text-[10px] text-slate-300 font-medium mt-1 truncate w-full">
                        {preset.name}
                      </span>
                      {mainImage === preset.url && (
                        <div className="absolute top-1 right-1 bg-emerald-500 text-white rounded-full p-0.5">
                          <Check size={10} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current Image Input and Live Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="md:col-span-2 space-y-2">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">মূল ছবির পাথ বা URL *</label>
                  <input
                    type="text"
                    required
                    value={mainImage}
                    onChange={e => setMainImage(e.target.value)}
                    placeholder="/images/products/... অথবা https://..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">অতিরিক্ত ছবির URL সমূহ (প্রতি লাইনে একটি)</label>
                  <textarea
                    rows={2}
                    value={imagesText}
                    onChange={e => setImagesText(e.target.value)}
                    placeholder="/images/products/pureghor_blackseed_honey_1787810945841.jpg"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Live Preview Box */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-slate-400 font-semibold mb-2">লাইভ ছবি প্রিভিউ</span>
                {mainImage ? (
                  <div className="w-24 h-24 rounded-lg bg-white p-1 border border-slate-700 flex items-center justify-center shadow-md">
                    <img
                      src={mainImage}
                      alt="Preview"
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/products/pureghor_blackseed_honey_1787810945841.jpg';
                      }}
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-slate-950 border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500">
                    <ImageIcon size={24} />
                    <span className="text-[9px] mt-1">কোনো ছবি নেই</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Variants Management */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-200 text-sm">ওজন / সাইজ ভ্যারিয়েন্ট (250g, 500g, 1kg)</h4>
                <p className="text-[11px] text-slate-400">কাস্টমার ড্রপডাউন বাটন থেকে আলাদা ওজন ও দাম পছন্দ করতে পারবে</p>
              </div>
              <button
                type="button"
                onClick={handleAddVariant}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-lg text-xs flex items-center gap-1 font-bold cursor-pointer transition-colors"
              >
                <Plus size={14} />
                <span>ভ্যারিয়েন্ট যোগ</span>
              </button>
            </div>

            <div className="space-y-2">
              {variants.map((v, i) => (
                <div key={v.id} className="flex flex-wrap sm:flex-nowrap items-center gap-2 bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex-1 min-w-[100px]">
                    <label className="block text-[10px] text-slate-400 mb-0.5">ওজন/প্যাক</label>
                    <input
                      type="text"
                      placeholder="500g"
                      value={v.weight}
                      onChange={e => handleVariantChange(v.id, 'weight', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-100 font-semibold"
                    />
                  </div>

                  <div className="w-24">
                    <label className="block text-[10px] text-slate-400 mb-0.5">মূল্য ৳</label>
                    <input
                      type="number"
                      placeholder="মূল্য ৳"
                      value={v.price || ''}
                      onChange={e => handleVariantChange(v.id, 'price', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-emerald-400 font-bold"
                    />
                  </div>

                  <div className="w-24">
                    <label className="block text-[10px] text-slate-400 mb-0.5">পূর্বমূল্য ৳</label>
                    <input
                      type="number"
                      placeholder="পূর্বমূল্য"
                      value={v.compareAtPrice || ''}
                      onChange={e => handleVariantChange(v.id, 'compareAtPrice', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-300"
                    />
                  </div>

                  <div className="w-20">
                    <label className="block text-[10px] text-slate-400 mb-0.5">স্টক</label>
                    <input
                      type="number"
                      placeholder="স্টক"
                      value={v.stock}
                      onChange={e => handleVariantChange(v.id, 'stock', Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded p-1.5 text-xs text-slate-100"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveVariant(v.id)}
                    className="text-rose-400 hover:text-rose-300 p-1.5 hover:bg-rose-500/10 rounded cursor-pointer mt-3 sm:mt-0"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Descriptions */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">সংক্ষিপ্ত বিবরণ (Short Description)</label>
              <textarea
                rows={2}
                value={shortDescriptionBn}
                onChange={e => setShortDescriptionBn(e.target.value)}
                placeholder="১-২ লাইনে পণ্যের মূল আকর্ষণ লিখুন..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">বিস্তারিত বিবরণ (Full Description & Benefits)</label>
              <textarea
                rows={4}
                value={descriptionBn}
                onChange={e => setDescriptionBn(e.target.value)}
                placeholder="পণ্যের গুণাগুণ, উপকারিতা ও ব্যবহারের নিয়ম লিখুন..."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Checkbox Toggles & Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={e => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-slate-300">ফিচার্ড পণ্য</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isBestSeller}
                onChange={e => setIsBestSeller(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-slate-300">বেস্ট সেলার</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isNewArrival}
                onChange={e => setIsNewArrival(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-slate-300">নতুন আগমন</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isSpecialDeal}
                onChange={e => setIsSpecialDeal(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <span className="font-semibold text-slate-300">স্পেশাল ছাড়</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all shadow-md hover:shadow-emerald-900/30 cursor-pointer flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>পণ্য সংরক্ষণ করুন</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
