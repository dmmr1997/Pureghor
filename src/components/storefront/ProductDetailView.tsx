import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  PhoneCall,
  ShoppingBag,
  Heart,
  Share2,
  Check,
  ChevronRight,
  User,
  MessageSquare,
} from 'lucide-react';
import { StarRating } from '../common/StarRating';
import { ProductCard } from './ProductCard';
import { api } from '../../services/api';
import { Product, ProductVariant, Review } from '../../types';

export const ProductDetailView: React.FC = () => {
  const {
    selectedProductSlug,
    products,
    language,
    storeSettings,
    addToCart,
    setQuickOrderProduct,
    toggleWishlist,
    isInWishlist,
    setCurrentView,
    addToast,
  } = useStore();

  const { customerUser } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'benefits' | 'howToUse' | 'reviews'>('desc');

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newRating, setNewRating] = useState(5);
  const [reviewerName, setReviewerName] = useState(customerUser?.name || '');
  const [reviewerPhone, setReviewerPhone] = useState(customerUser?.phone || '');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!selectedProductSlug) return;
    const found = products.find(p => p.slug === selectedProductSlug || p.id === selectedProductSlug);
    if (found) {
      setProduct(found);
      setSelectedImage(found.mainImage || (found.images && found.images[0]) || '');
      if (found.variants && found.variants.length > 0) {
        setSelectedVariant(found.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setQuantity(1);

      // Fetch reviews
      api.getReviews(found.id).then(setReviews).catch(console.error);
    }
  }, [selectedProductSlug, products]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">{language === 'bn' ? 'পণ্য লোড হচ্ছে...' : 'Loading product...'}</p>
      </div>
    );
  }

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const activeComparePrice = selectedVariant ? selectedVariant.compareAtPrice : product.compareAtPrice;
  const activeWeight = selectedVariant ? selectedVariant.weight : product.weight;
  const isFavorited = isInWishlist(product.id);

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !reviewComment.trim()) {
      addToast(language === 'bn' ? 'সবগুলো ঘর পূরণ করুন' : 'Please fill all fields', 'error');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const res = await api.createReview({
        productId: product.id,
        customerName: reviewerName.trim(),
        customerPhone: reviewerPhone.trim(),
        rating: newRating,
        comment: reviewComment.trim(),
      });
      setReviews([res, ...reviews]);
      setReviewComment('');
      addToast(language === 'bn' ? 'আপনার রিভিউ সফলভাবে যুক্ত হয়েছে!' : 'Review posted successfully!', 'success');
    } catch (e: any) {
      addToast(e.message || 'রিভিউ যুক্ত করা যায়নি', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      addToast(language === 'bn' ? 'প্রোডাক্ট লিংক কপি করা হয়েছে!' : 'Product link copied!', 'info');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8 space-y-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
        <button onClick={() => setCurrentView('home')} className="hover:text-[#004d1a] cursor-pointer">
          {language === 'bn' ? 'হোমপেজ' : 'Home'}
        </button>
        <ChevronRight size={12} />
        <button onClick={() => setCurrentView('catalog')} className="hover:text-[#004d1a] cursor-pointer">
          {language === 'bn' ? 'সকল পণ্য' : 'Products'}
        </button>
        <ChevronRight size={12} />
        <span className="font-semibold text-gray-800 line-clamp-1">{language === 'bn' ? product.nameBn : product.nameEn}</span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-xl border border-gray-200 p-4 sm:p-8 shadow-xs">
        {/* Left Col: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Display Image */}
          <div className="aspect-square bg-gray-50 rounded-lg border border-gray-200 overflow-hidden flex items-center justify-center p-4 relative group">
            <img
              src={selectedImage}
              alt={product.nameEn}
              className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/products/pureghor_blackseed_honey_1787810945841.jpg';
              }}
            />
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 bg-[#cc3366] text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-sm">
                -{product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-md border p-1 bg-gray-50 shrink-0 transition-all cursor-pointer ${
                    selectedImage === img
                      ? 'border-[#004d1a] ring-2 ring-[#004d1a]/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 text-center text-[11px] text-gray-600">
            <div className="p-2 bg-emerald-50/50 rounded-lg">
              <ShieldCheck size={18} className="text-[#004d1a] mx-auto mb-1" />
              <span>১০০% খাঁটি ও নির্ভেজাল</span>
            </div>
            <div className="p-2 bg-emerald-50/50 rounded-lg">
              <Truck size={18} className="text-[#004d1a] mx-auto mb-1" />
              <span>সারাদেশে ক্যাশ অন ডেলিভারি</span>
            </div>
            <div className="p-2 bg-emerald-50/50 rounded-lg">
              <RotateCcw size={18} className="text-[#004d1a] mx-auto mb-1" />
              <span>৭ দিনের সহজ রিটার্ন</span>
            </div>
          </div>
        </div>

        {/* Right Col: Product Information & Purchase Area (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category & SKU */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-semibold text-[#004d1a] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                {language === 'bn' ? product.categoryNameBn : product.categoryNameEn}
              </span>
              <span>SKU: {product.sku}</span>
            </div>

            {/* Product Title */}
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
              {language === 'bn' ? product.nameBn : product.nameEn}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 text-xs">
              <StarRating rating={product.rating} reviewCount={reviews.length || product.reviewCount} size={15} showScore />
              <span className="text-gray-300">|</span>
              <span className={`font-semibold ${product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                {product.stock > 0
                  ? language === 'bn'
                    ? `ইন স্টক (${product.stock} টি অবশিষ্ট)`
                    : `In Stock (${product.stock} available)`
                  : language === 'bn'
                  ? 'স্টক আউট'
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-baseline gap-3">
              <span className="text-2xl sm:text-4xl font-extrabold text-[#004d1a]">
                ৳{activePrice}
              </span>
              {activeComparePrice && activeComparePrice > activePrice && (
                <span className="text-base sm:text-lg text-gray-400 line-through">
                  ৳{activeComparePrice}
                </span>
              )}
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="text-xs font-bold text-[#cc3366] bg-pink-100 px-2 py-0.5 rounded">
                  {language === 'bn' ? `সাশ্রয় ৳${activeComparePrice ? activeComparePrice - activePrice : ''}` : 'Save Now'}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {language === 'bn' ? product.shortDescriptionBn : product.shortDescriptionEn}
            </p>

            {/* Variant Package Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-800">
                  {language === 'bn' ? 'সাইজ / পরিমাণ পছন্দ করুন:' : 'Select Size / Variant:'}
                </label>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {product.variants.map(variant => {
                    const isSelected = selectedVariant?.id === variant.id;
                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#004d1a] bg-[#004d1a] text-white font-bold shadow-sm'
                            : 'border-gray-200 hover:border-gray-400 bg-white text-gray-800'
                        }`}
                      >
                        <span className="font-semibold">{variant.weight}</span>
                        <span className="ml-2 opacity-80 text-xs">৳{variant.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Direct Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700">
                  {language === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-sm font-bold text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {/* 1-Click Fast Order Button */}
                <button
                  onClick={() => setQuickOrderProduct(product)}
                  className="bg-[#004d1a] hover:bg-[#003612] text-white font-bold py-3.5 px-6 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  <span>{language === 'bn' ? 'অর্ডার করুন (১ ক্লিকে)' : 'Order Now (1-Click)'}</span>
                </button>

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(product, selectedVariant || undefined, quantity)}
                  className="bg-[#0b4d2b]/10 hover:bg-[#0b4d2b]/20 text-[#004d1a] font-bold py-3.5 px-6 rounded-lg text-sm sm:text-base border border-[#004d1a]/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  <span>{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                </button>
              </div>

              {/* Secondary actions: Wishlist & Share */}
              <div className="flex items-center gap-4 pt-1 text-xs text-gray-600">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`flex items-center gap-1.5 hover:text-[#cc3366] transition-colors cursor-pointer ${
                    isFavorited ? 'text-[#cc3366] font-semibold' : ''
                  }`}
                >
                  <Heart size={16} className={isFavorited ? 'fill-[#cc3366]' : ''} />
                  <span>{isFavorited ? (language === 'bn' ? 'উইশলিস্টে যুক্ত' : 'Saved to Wishlist') : (language === 'bn' ? 'উইশলিস্টে রাখুন' : 'Add to Wishlist')}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-[#004d1a] transition-colors cursor-pointer"
                >
                  <Share2 size={16} />
                  <span>{language === 'bn' ? 'শেয়ার করুন' : 'Share'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Hotline Box */}
          <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <PhoneCall size={18} className="text-[#004d1a]" />
              <span>{language === 'bn' ? 'ফোনে অর্ডার করতে কল করুন:' : 'Order via phone hotline:'}</span>
            </div>
            <a
              href={`tel:${storeSettings.phonePrimary.replace(/[^0-9+]/g, '')}`}
              className="font-bold text-[#004d1a] hover:underline"
            >
              {storeSettings.phonePrimary}
            </a>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Health Benefits, How to Use, Reviews */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-8 shadow-xs">
        <div className="border-b border-gray-200 flex items-center gap-6 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-3 font-bold text-xs sm:text-sm tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'desc'
                ? 'text-[#004d1a] border-b-2 border-[#004d1a]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {language === 'bn' ? 'বিস্তারিত বিবরণ' : 'Description'}
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`pb-3 font-bold text-xs sm:text-sm tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'benefits'
                ? 'text-[#004d1a] border-b-2 border-[#004d1a]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {language === 'bn' ? 'উপকারিতা ও পুষ্টিগুণ' : 'Health Benefits'}
          </button>
          <button
            onClick={() => setActiveTab('howToUse')}
            className={`pb-3 font-bold text-xs sm:text-sm tracking-wide transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'howToUse'
                ? 'text-[#004d1a] border-b-2 border-[#004d1a]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {language === 'bn' ? 'ব্যবহার ও সেবনবিধি' : 'How to Consume'}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 font-bold text-xs sm:text-sm tracking-wide transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'text-[#004d1a] border-b-2 border-[#004d1a]'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span>{language === 'bn' ? 'গ্রাহকদের মতামত' : 'Customer Reviews'}</span>
            <span className="bg-emerald-100 text-[#004d1a] px-2 py-0.5 rounded-full text-xs font-bold">
              {reviews.length}
            </span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="pt-6">
          {activeTab === 'desc' && (
            <div className="prose max-w-none text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {language === 'bn' ? product.descriptionBn : product.descriptionEn}
            </div>
          )}

          {activeTab === 'benefits' && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm sm:text-base text-gray-900">
                {language === 'bn' ? 'কেন খাঁটি ভাইয়ের পণ্য গ্রহণ করবেন?' : 'Key Benefits & Nutrition'}
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-[#004d1a] shrink-0 mt-0.5" />
                  <span>কোনো ধরনের কেমিক্যাল, প্রিজারভেটিভ বা ক্ষতিকারক কৃত্রিম সুগন্ধি ছাড়া প্রস্তুত।</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-[#004d1a] shrink-0 mt-0.5" />
                  <span>ঐতিহ্যবাহী কাঠের ঘানি বা প্রাকৃতিক স্বাস্থ্যসম্মত উপায়ে সংগ্রহ ও ফিল্টারকৃত।</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-[#004d1a] shrink-0 mt-0.5" />
                  <span>প্রাকৃতিক ভিটামিন, অ্যান্টিঅক্সিডেন্ট এবং সক্রিয় খনিজ উপাদানে ভরপুর।</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-[#004d1a] shrink-0 mt-0.5" />
                  <span>রোগ প্রতিরোধ ক্ষমতা বৃদ্ধি এবং দীর্ঘস্থায়ী সুস্থতার জন্য আদর্শ।</span>
                </li>
              </ul>
            </div>
          )}

          {activeTab === 'howToUse' && (
            <div className="space-y-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
              <h4 className="font-bold text-sm sm:text-base text-gray-900">
                {language === 'bn' ? 'ব্যবহার ও সংরক্ষণ নিয়মাবলী' : 'Usage & Storage Guidelines'}
              </h4>
              <p>
                প্রতিদিন সকালে খালি পেটে অথবা খাদ্যতালিকার সাথে নির্ধারিত পরিমাণে সেবন করুন।
              </p>
              <p className="font-semibold text-[#004d1a]">
                সংরক্ষণ: সরাসরি সূর্যের আলো থেকে দূরে শুষ্ক ও ঠান্ডা স্থানে সংরক্ষণ করুন।
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Existing Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-gray-500 italic">
                    {language === 'bn' ? 'এখনো কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউ দিন!' : 'No reviews yet. Be the first to review!'}
                  </p>
                ) : (
                  reviews.map(rev => (
                    <div key={rev.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs sm:text-sm text-gray-900">{rev.customerName}</span>
                        <span className="text-[11px] text-gray-400">
                          {new Date(rev.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                      <StarRating rating={rev.rating} size={12} />
                      <p className="text-xs sm:text-sm text-gray-700 pt-1 leading-relaxed">{rev.comment}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Review Submission Form */}
              <form onSubmit={handleReviewSubmit} className="p-5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-3">
                <h5 className="font-bold text-sm text-gray-900">
                  {language === 'bn' ? 'আপনার মূল্যবান রিভিউ দিন' : 'Write a Review'}
                </h5>

                {/* Rating select */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-gray-700">রেটিং নির্বাচন:</span>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className="cursor-pointer"
                      >
                        <Star
                          size={18}
                          className={star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={reviewerName}
                    onChange={e => setReviewerName(e.target.value)}
                    placeholder={language === 'bn' ? 'আপনার নাম *' : 'Your Name *'}
                    className="px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:outline-none"
                  />
                  <input
                    type="tel"
                    value={reviewerPhone}
                    onChange={e => setReviewerPhone(e.target.value)}
                    placeholder={language === 'bn' ? 'মোবাইল নম্বর (ঐচ্ছিক)' : 'Mobile Phone (optional)'}
                    className="px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:outline-none"
                  />
                </div>

                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder={language === 'bn' ? 'পণ্যটি আপনার কেমন লেগেছে বিস্তারিত লিখুন...' : 'Write your detailed review...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-xs bg-white focus:outline-none"
                />

                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="bg-[#004d1a] hover:bg-[#003612] text-white px-5 py-2 rounded font-bold text-xs transition-colors cursor-pointer"
                >
                  {isSubmittingReview ? 'জমা হচ্ছে...' : language === 'bn' ? 'রিভিউ সাবমিট করুন' : 'Submit Review'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Related Products Carousel / Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-4 pt-4">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">
            {language === 'bn' ? 'সংশ্লিষ্ট অন্যান্য পণ্য' : 'Related Organic Products'}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedProducts.map(rel => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
