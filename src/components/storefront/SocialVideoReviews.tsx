import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Play, Star, CheckCircle, Video, Eye, ThumbsUp, Share2, Sparkles, X, ShoppingBag, MessageCircle, ExternalLink } from 'lucide-react';
import { Product } from '../../types';

interface VideoReviewItem {
  id: string;
  titleBn: string;
  titleEn: string;
  customerName: string;
  customerLocation: string;
  productName: string;
  productId?: string;
  rating: number;
  views: string;
  duration: string;
  thumbnailUrl: string;
  videoUrl: string;
  reviewTextBn: string;
  socialPlatform: 'facebook' | 'youtube' | 'instagram' | 'tiktok';
  date: string;
}

const VIDEO_REVIEWS: VideoReviewItem[] = [
  {
    id: 'vid-1',
    titleBn: 'সুন্দরবনের খাঁটি মধুর ঘনত্ব ও আসল স্বাদ টেস্ট রিভিউ',
    titleEn: 'Sundarbans Pure Honey Taste & Purity Test Review',
    customerName: 'ডাঃ তানভীর আহমেদ',
    customerLocation: 'উপশহর, সিলেট',
    productName: 'সুন্দরবনের খাঁটি কালোজিরা মধু',
    productId: 'prod-1',
    rating: 5,
    views: '১২.৫K ভিউজ',
    duration: '১:২৫ মিনিট',
    thumbnailUrl: '/images/products/pureghor_blackseed_honey_1787810945841.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    reviewTextBn: 'পিউর ঘরের কালোজিরা ফুলের মধু নেওয়ার পর ল্যাব টেস্টের মতো খাঁটি স্বাদ পেয়েছি। আমার পরিবারের নিয়মিত সকালের তালিকায় এখন এই মধুই থাকে। ১০০% খাঁটি!',
    socialPlatform: 'facebook',
    date: '৩ দিন আগে',
  },
  {
    id: 'vid-2',
    titleBn: 'প্রিমিয়াম হানি নাট কম্বো আনবক্সিং এবং কোয়ালিটি চেক',
    titleEn: 'Premium Honey Nut Combo Unboxing & Review',
    customerName: 'ফারহানা ইয়াসমিন',
    customerLocation: 'ধানমন্ডি, ঢাকা',
    productName: 'প্রিমিয়াম হানি নাট',
    productId: 'prod-2',
    rating: 5,
    views: '১৮.২K ভিউজ',
    duration: '২:১০ মিনিট',
    thumbnailUrl: '/images/products/pureghor_honey_nut_1787810965222.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    reviewTextBn: 'বাদামের ক্রাঞ্চিনেস আর খাঁটি মধুর কম্বিনেশন অসাধারণ। কোনো বাসি বাদাম ছিল না, একদম ফ্রেশ কাঁচের জারে সুরক্ষিত প্যাকেজিং ছিল।',
    socialPlatform: 'youtube',
    date: '১ সপ্তাহ আগে',
  },
  {
    id: 'vid-3',
    titleBn: 'কাঠের ঘানির সরিষার তেল ও খাঁটি গাওয়া ঘি এর রিভিউ',
    titleEn: 'Cold Pressed Mustard Oil & Gawa Ghee Honest Review',
    customerName: 'মাহমুদুল হাসান',
    customerLocation: 'বিশ্বনাথ, সিলেট',
    productName: 'কাঠের ঘানির সরিষার তেল',
    productId: 'prod-3',
    rating: 5,
    views: '৯.৪K ভিউজ',
    duration: '১:৪৫ মিনিট',
    thumbnailUrl: '/images/products/pureghor_blackseed_oil_1787810985248.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    reviewTextBn: 'ঘানির তেলের ঝাঁঝ এবং ঘি এর সুঘ্রাণ অসাধারণ। রান্নায় আলাদা একটা তৃপ্তি পাওয়া যায়। আল বোরাক শপিং সিটির শোরুম থেকেও আমি নিয়মিত নেই।',
    socialPlatform: 'facebook',
    date: '২ সপ্তাহ আগে',
  },
  {
    id: 'vid-4',
    titleBn: 'প্রিমিয়াম বাদাম কম্বো ও আস্ত আখরোট টেস্ট',
    titleEn: 'Nuts Combo & Walnuts Customer Feedback',
    customerName: 'ইশতিয়াক চৌধুরী',
    customerLocation: 'জালালাবাদ, সিলেট',
    productName: '৪-ইন-১ বাদাম কম্বো',
    productId: 'prod-4',
    rating: 5,
    views: '১৫.৮K ভিউজ',
    duration: '২:১৫ মিনিট',
    thumbnailUrl: '/images/products/pureghor_nuts_combo_1787811004501.jpg',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    reviewTextBn: 'বাদামগুলো খুবই প্রিমিয়াম কোয়ালিটির এবং সম্পূর্ণ তাজা। ডায়েটের জন্য প্রতিদিন সকালে খাচ্ছি, দারুণ এনার্জি পাওয়া যায়।',
    socialPlatform: 'instagram',
    date: '১০ দিন আগে',
  },
];

export const SocialVideoReviews: React.FC = () => {
  const { language, products, setSelectedProductForQuickOrder, setIsQuickOrderOpen } = useStore();
  const [selectedVideo, setSelectedVideo] = useState<VideoReviewItem | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'facebook' | 'youtube'>('all');

  const filteredVideos = activeTab === 'all' 
    ? VIDEO_REVIEWS 
    : VIDEO_REVIEWS.filter(v => v.socialPlatform === activeTab);

  const handleOrderRelatedProduct = (productId?: string) => {
    if (!productId) return;
    const targetProduct = products.find(p => p.id === productId) || products[0];
    if (targetProduct) {
      setSelectedProductForQuickOrder(targetProduct);
      setIsQuickOrderOpen(true);
      setSelectedVideo(null);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12 space-y-6" id="pureghor-video-reviews">
      {/* Header with Title & Social Badges */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-gray-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300/60 text-[#004d1a] text-xs font-black tracking-wide mb-2">
            <Video size={13} className="stroke-[2.5]" />
            <span>{language === 'bn' ? 'ভিডিও রিভিউ ও কাস্টমার প্রতিক্রিয়া' : 'Video Reviews & Testimonials'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            {language === 'bn' ? 'গ্রাহকদের লাইভ ভিডিও অভিজ্ঞতা' : 'Customer Video Reviews & Unboxing'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-medium mt-1">
            {language === 'bn'
              ? 'আমাদের ১০০% খাঁটি পণ্যের মান ও স্বাদ নিয়ে সম্মানিত ক্রেতাদের নিজস্ব অভিজ্ঞতা ও রিভিউ দেখুন।'
              : 'Watch real customer unboxing, lab tests, and live honest reviews of PureGhor products.'}
          </p>
        </div>

        {/* Filter Tabs & Social Links */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#004d1a] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {language === 'bn' ? 'সকল ভিডিও' : 'All Videos'}
          </button>
          <button
            onClick={() => setActiveTab('facebook')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'facebook'
                ? 'bg-[#1877f2] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>ফেসবুক রিলস</span>
          </button>
          <button
            onClick={() => setActiveTab('youtube')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'youtube'
                ? 'bg-[#ff0000] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>ইউটিউব শর্টস</span>
          </button>
        </div>
      </div>

      {/* Video Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredVideos.map((video) => (
          <div
            key={video.id}
            onClick={() => setSelectedVideo(video)}
            className="group bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1"
          >
            {/* Thumbnail Box with Play Badge & Duration */}
            <div className="relative aspect-4/3 sm:aspect-square bg-slate-900 overflow-hidden flex items-center justify-center">
              <img
                src={video.thumbnailUrl}
                alt={video.titleBn}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/products/pureghor_blackseed_honey_1787810945841.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

              {/* Glowing Play Icon Center */}
              <div className="absolute w-12 h-12 rounded-full bg-[#004d1a]/90 group-hover:bg-[#52b202] text-white flex items-center justify-center shadow-lg transition-transform duration-300 transform group-hover:scale-115">
                <Play size={20} className="fill-white translate-x-0.5" />
              </div>

              {/* Top Platform & Duration Badges */}
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                <span className="bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Video size={10} className="text-emerald-400" />
                  {video.duration}
                </span>
              </div>

              <div className="absolute top-2.5 right-2.5">
                <span className="bg-[#004d1a] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-xs">
                  {video.views}
                </span>
              </div>

              {/* Bottom Customer Info Overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <span className="text-emerald-300">{video.customerName}</span>
                  <CheckCircle size={12} className="text-emerald-400 fill-emerald-400/20" />
                </div>
                <p className="text-[10px] text-gray-300 truncate">{video.customerLocation}</p>
              </div>
            </div>

            {/* Video Card Content */}
            <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
              <div>
                {/* Rating & Product Tag */}
                <div className="flex items-center justify-between gap-1 text-xs mb-1">
                  <div className="flex items-center text-amber-400">
                    {[...Array(video.rating)].map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-[#004d1a] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 truncate max-w-[130px]">
                    {video.productName}
                  </span>
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-gray-900 leading-snug line-clamp-2 group-hover:text-[#004d1a] transition-colors">
                  {video.titleBn}
                </h3>

                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 italic">
                  "{video.reviewTextBn}"
                </p>
              </div>

              {/* Watch Video Button */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#004d1a]">
                <span className="flex items-center gap-1 group-hover:underline">
                  <Play size={12} className="fill-[#004d1a]" />
                  <span>ভিডিওটি দেখুন</span>
                </span>
                <span className="text-[10px] text-gray-400 font-normal">{video.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Social Proof & Channel Follow Banner */}
      <div className="bg-gradient-to-r from-[#004d1a] to-[#002f10] text-white rounded-2xl p-5 sm:p-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-lg border border-emerald-800/40">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-emerald-800/60 px-3 py-1 rounded-full text-xs font-bold text-emerald-300">
            <Sparkles size={13} />
            <span>সোশ্যাল মিডিয়ায় যুক্ত থাকুন</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black">
            পিউর ঘরের আসল ভিডিও, আনবক্সিং ও অফার আপডেট সবার আগে পেতে
          </h3>
          <p className="text-xs text-emerald-100 max-w-xl">
            আমাদের অফিসিয়াল ফেসবুক পেজ ও ইউটিউব চ্যানেলে নিয়মিত খাটি খাবারের ভিডিও, মধু সংগ্রহ এবং গ্রাহকদের রিভিউ প্রকাশ করা হয়।
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#1877f2] hover:bg-[#1566d3] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>ফেসবুক পেজ ভিজিট</span>
            <ExternalLink size={13} />
          </a>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#ff0000] hover:bg-[#cc0000] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <span>ইউটিউব চ্যানেল</span>
            <ExternalLink size={13} />
          </a>

          <a
            href="https://wa.me/8801754991822"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#25d366] hover:bg-[#20b858] text-white px-4 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all cursor-pointer"
          >
            <MessageCircle size={14} />
            <span>ভিডিও চেয়ে হোয়াটসঅ্যাপ</span>
          </a>
        </div>
      </div>

      {/* Interactive Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
          <div className="relative bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden text-slate-100 flex flex-col">
            {/* Modal Header */}
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <h4 className="font-bold text-xs sm:text-sm text-slate-200 line-clamp-1">
                  {selectedVideo.titleBn}
                </h4>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="p-1 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                poster={selectedVideo.thumbnailUrl}
                className="w-full h-full object-contain"
              >
                আপনার ব্রাউজার ভিডিওটি চালাতে পারছে না।
              </video>
            </div>

            {/* Video Details & Quick Order Callout */}
            <div className="p-4 sm:p-5 space-y-4 bg-slate-950">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm sm:text-base">
                      {selectedVideo.customerName}
                    </span>
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle size={10} /> ভেরিফাইড ক্রেতা
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedVideo.customerLocation} • {selectedVideo.views}</p>
                </div>

                <div className="flex items-center text-amber-400 gap-1">
                  {[...Array(selectedVideo.rating)].map((_, i) => (
                    <Star key={i} size={15} className="fill-amber-400" />
                  ))}
                  <span className="text-xs font-bold text-slate-300 ml-1">৫.০ / ৫.০ রেটিং</span>
                </div>
              </div>

              {/* Review Text */}
              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs sm:text-sm text-slate-200 italic leading-relaxed">
                "{selectedVideo.reviewTextBn}"
              </div>

              {/* Order Related Product Call to Action Button */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <span className="text-xs text-slate-400 hidden sm:inline">
                  ভিডিওতে দেখানো পণ্য: <strong className="text-emerald-400">{selectedVideo.productName}</strong>
                </span>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="flex-1 sm:flex-none px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>

                  <button
                    onClick={() => handleOrderRelatedProduct(selectedVideo.productId)}
                    className="flex-1 sm:flex-none px-5 py-2 bg-[#52b202] hover:bg-[#439601] text-white rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                  >
                    <ShoppingBag size={16} />
                    <span>এই পণ্যটি ১-ক্লিকে অর্ডার করুন</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
