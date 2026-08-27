import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Image as ImageIcon, Plus, Trash2, Edit3, CheckCircle2, XCircle, X, Upload, Sparkles, Eye, Save } from 'lucide-react';
import { BannerSlide } from '../../types';
import { api } from '../../services/api';

const PRESET_BANNER_IMAGES = [
  {
    name: 'পিউর ঘর শোরুম ও কাউন্টার',
    url: '/hero-pureghor-store.jpg',
  },
  {
    name: 'খাঁটি মধু ও হানি নাট কম্বো',
    url: '/images/products/pureghor_honey_nut_1787810965222.jpg',
  },
  {
    name: 'কালোজিরা তেল ও অর্গানিক সিডস',
    url: '/images/products/pureghor_blackseed_oil_1787810985248.jpg',
  },
  {
    name: 'কাঠের ঘানির সরিষার তেল',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: 'গাওয়া ঘি ও ঐতিহ্যবাহী গুড়',
    url: 'https://images.unsplash.com/photo-1631451095765-2c91616fc9e6?w=1200&auto=format&fit=crop&q=80',
  },
  {
    name: '৪-ইন-১ প্রিমিয়াম বাদাম মিক্স',
    url: '/images/products/pureghor_nuts_combo_1787811004501.jpg',
  },
];

export const AdminBanners: React.FC = () => {
  const { addToast, storeSettings, refreshSettings } = useStore();
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);

  // Hero Section Settings State
  const [heroImage, setHeroImage] = useState(storeSettings?.heroBackgroundImage || '/hero-pureghor-store.jpg');
  const [isSavingHero, setIsSavingHero] = useState(false);

  // Form State
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitleBn, setSubtitleBn] = useState('');
  const [badgeTextBn, setBadgeTextBn] = useState('');
  const [image, setImage] = useState('');
  const [bgGradient, setBgGradient] = useState('from-[#004d1a] via-[#004317] to-[#00280d]');
  const [buttonTextBn, setButtonTextBn] = useState('এখনই অর্ডার করুন');
  const [linkUrl, setLinkUrl] = useState('/catalog');
  const [isActive, setIsActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.getBanners(false);
      setBanners(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (storeSettings?.heroBackgroundImage) {
      setHeroImage(storeSettings.heroBackgroundImage);
    }
  }, [storeSettings]);

  const handleSaveHeroBackground = async () => {
    try {
      setIsSavingHero(true);
      await api.updateSettings({ heroBackgroundImage: heroImage.trim() });
      await refreshSettings();
      addToast('হোমপেজ হিরো সেকশন ব্যাকগ্রাউন্ড সফলভাবে আপডেট ও সংরক্ষিত হয়েছে!', 'success');
    } catch (e: any) {
      addToast(e.message || 'হিরো ব্যাকগ্রাউন্ড সংরক্ষণ করা যায়নি', 'error');
    } finally {
      setIsSavingHero(false);
    }
  };

  const handleOpenModal = (banner?: BannerSlide) => {
    if (banner) {
      setEditingBanner(banner);
      setTitleBn(banner.titleBn);
      setTitleEn(banner.titleEn || banner.titleBn);
      setSubtitleBn(banner.subtitleBn || '');
      setBadgeTextBn(banner.badgeTextBn || '');
      setImage(banner.image);
      setBgGradient(banner.bgGradient || 'from-[#004d1a] via-[#004317] to-[#00280d]');
      setButtonTextBn(banner.buttonTextBn || 'এখনই অর্ডার করুন');
      setLinkUrl(banner.linkUrl || '/catalog');
      setIsActive(banner.isActive !== undefined ? banner.isActive : true);
    } else {
      setEditingBanner(null);
      setTitleBn('');
      setTitleEn('');
      setSubtitleBn('');
      setBadgeTextBn('');
      setImage('/hero-pureghor-store.jpg');
      setBgGradient('from-[#004d1a] via-[#004317] to-[#00280d]');
      setButtonTextBn('এখনই অর্ডার করুন');
      setLinkUrl('/catalog');
      setIsActive(true);
    }
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() || !image.trim()) {
      addToast('অনুগ্রহ করে ব্যানার শিরোনাম ও ছবি প্রদান করুন', 'error');
      return;
    }

    try {
      setIsSaving(true);
      const payload: Partial<BannerSlide> = {
        titleBn: titleBn.trim(),
        titleEn: titleEn.trim() || titleBn.trim(),
        subtitleBn: subtitleBn.trim() || undefined,
        badgeTextBn: badgeTextBn.trim() || undefined,
        image: image.trim(),
        bgGradient,
        buttonTextBn,
        linkUrl,
        isActive,
      };

      if (editingBanner) {
        await api.updateBanner(editingBanner.id, payload);
        addToast('ব্যানার সফলভাবে আপডেট করা হয়েছে!', 'success');
      } else {
        await api.createBanner(payload);
        addToast('নতুন ব্যানার স্লাইডার সফলভাবে তৈরি হয়েছে!', 'success');
      }

      await fetchBanners();
      setIsModalOpen(false);
    } catch (e: any) {
      addToast(e.message || 'ব্যানার সংরক্ষণ ব্যর্থ', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (banner: BannerSlide) => {
    try {
      await api.updateBanner(banner.id, { isActive: !banner.isActive });
      addToast(`ব্যানার ${!banner.isActive ? 'সক্রিয়' : 'নিষ্ক্রিয়'} করা হয়েছে`, 'info');
      await fetchBanners();
    } catch (e) {
      addToast('স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি', 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`আপনি কি "${title}" ব্যানারটি মুছে ফেলতে চান?`)) {
      try {
        await api.deleteBanner(id);
        addToast('ব্যানার মুছে ফেলা হয়েছে', 'info');
        await fetchBanners();
      } catch (e) {
        addToast('মুছে ফেলা সম্ভব হয়নি', 'error');
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'hero' | 'modal') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (target === 'hero') {
          setHeroImage(result);
          addToast('হিরো ব্যাকগ্রাউন্ড ছবি লোড হয়েছে! সংরক্ষণ করতে "হিরো ছবি সেভ করুন" বাটনে চাপুন।', 'success');
        } else {
          setImage(result);
          addToast('ব্যানার ছবি সফলভাবে যুক্ত হয়েছে!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ImageIcon className="text-emerald-400" size={24} />
            <span>ব্যানার ও হিরো সেকশন ব্যবস্থাপনা (Banners & Hero)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            হোমপেজের মূল হিরো ব্যাকগ্রাউন্ড ইমেজ ও স্লাইডার ব্যানারসমূহ সরাসরি নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto shadow-md"
        >
          <Plus size={16} />
          <span>নতুন স্লাইডার ব্যানার যোগ</span>
        </button>
      </div>

      {/* SECTION 1: Main Home Hero Background Setting */}
      <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>হোমপেজ হিরো সেকশনের মূল ব্যাকগ্রাউন্ড ছবি (Main Hero Background)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              এই ছবিটি হোমপেজের একেবারে শীর্ষে মূল কাউন্টার ও গ্রিনারি ব্যাকগ্রাউন্ড হিসেবে দেখানো হবে।
            </p>
          </div>
          <button
            onClick={handleSaveHeroBackground}
            disabled={isSavingHero}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2.5 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-md self-start sm:self-auto"
          >
            <Save size={15} />
            <span>{isSavingHero ? 'সংরক্ষণ হচ্ছে...' : 'হিরো ছবি সেভ করুন'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Live Preview Box */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 mb-2">লাইভ প্রিভিউ (Live Preview):</label>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shadow-inner">
              <img
                src={heroImage}
                alt="Hero Preview"
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/hero-pureghor-store.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#004d1a]/80 via-transparent to-transparent pointer-events-none p-3 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-emerald-300">পিউর ঘর শোরুম ও কাউন্টার</span>
              </div>
            </div>
          </div>

          {/* Upload & URL Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                ছবির লিঙ্ক বা URL (Google Drive / ImgBB / সরাসরি লিঙ্ক):
              </label>
              <input
                type="text"
                value={heroImage}
                onChange={e => setHeroImage(e.target.value)}
                placeholder="https://... অথবা নিচের আপলোড বাটন চাপুন"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => heroFileInputRef.current?.click()}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Upload size={15} />
                <span>কম্পিউটার/মোবাইল থেকে সরাসরি ছবি আপলোড</span>
              </button>
              <input
                ref={heroFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => handleFileUpload(e, 'hero')}
              />

              <button
                type="button"
                onClick={() => setHeroImage('/hero-pureghor-store.jpg')}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                ডিফল্ট কাউন্টার ছবি রিস্টোর
              </button>
            </div>

            {/* Quick Presets */}
            <div>
              <span className="text-[11px] text-slate-400 block mb-1.5 font-semibold">১-ক্লিক দ্রুত গ্যালারি থেকে সিলেক্ট করুন:</span>
              <div className="flex flex-wrap gap-2">
                {PRESET_BANNER_IMAGES.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setHeroImage(preset.url);
                      addToast(`"${preset.name}" সিলেক্ট হয়েছে! সেভ করতে ভুলবেন না।`, 'info');
                    }}
                    className={`text-[11px] px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer ${
                      heroImage === preset.url
                        ? 'bg-emerald-600/30 border-emerald-400 text-emerald-200 font-bold'
                        : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Promo Sliders Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-100">প্রোমো স্লাইডার ও অফার ব্যানারসমূহ (Promo Sliders)</h2>
            <p className="text-xs text-slate-400">
              হোমপেজে ঘূর্ণায়মান স্লাইডারের ব্যানারগুলো সক্রিয়/নিষ্ক্রিয় করুন অথবা নতুন অফার যোগ করুন।
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            মোট {banners.length} টি ব্যানার
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500 bg-slate-900 rounded-xl">
            ব্যানার লোড হচ্ছে...
          </div>
        ) : banners.length === 0 ? (
          <div className="p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <p>বর্তমানে কোনো স্লাইডার ব্যানার নেই।</p>
            <button
              onClick={() => handleOpenModal()}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs"
            >
              প্রথম ব্যানার যোগ করুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {banners.map(b => (
              <div
                key={b.id}
                className={`bg-slate-900/90 border rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between transition-all ${
                  b.isActive ? 'border-slate-700/80' : 'border-slate-800 opacity-60'
                }`}
              >
                <div className="p-5 flex gap-4">
                  <div className="w-28 h-28 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0 relative">
                    <img
                      src={b.image}
                      alt={b.titleEn}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/hero-pureghor-store.jpg';
                      }}
                    />
                    <span className={`absolute top-1 right-1 text-[9px] font-black px-1.5 py-0.5 rounded ${
                      b.isActive ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'
                    }`}>
                      {b.isActive ? 'সক্রিয়' : 'বন্ধ'}
                    </span>
                  </div>

                  <div className="min-w-0 space-y-1.5 flex-1">
                    {b.badgeTextBn && (
                      <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                        {b.badgeTextBn}
                      </span>
                    )}
                    <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{b.titleBn}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{b.subtitleBn || 'কোনো বিবরণ নেই'}</p>
                    <p className="text-[11px] text-emerald-400 font-semibold pt-1">
                      {b.buttonTextBn} → <span className="font-mono text-slate-400">{b.linkUrl}</span>
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleStatus(b)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      b.isActive
                        ? 'text-amber-400 hover:bg-amber-500/10'
                        : 'text-emerald-400 hover:bg-emerald-500/10'
                    }`}
                  >
                    {b.isActive ? 'নিষ্ক্রিয় করুন' : 'সক্রিয় করুন'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(b)}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      <Edit3 size={14} />
                      <span>এডিট</span>
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.titleBn)}
                      className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
                    >
                      <Trash2 size={14} />
                      <span>মুছুন</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Banner Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 text-slate-200 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
                <Sparkles size={18} className="text-emerald-400" />
                <span>{editingBanner ? 'ব্যানার স্লাইডার সম্পাদনা' : 'নতুন ব্যানার স্লাইড তৈরি'}</span>
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200 cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">ব্যানার শিরোনাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={e => setTitleBn(e.target.value)}
                  placeholder="যেমন: ১০০% খাঁটি গাওয়া ঘি ও প্রাকৃতিক সুন্দরবনের মধু"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">হাইলাইট ব্যাজ (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={badgeTextBn}
                    onChange={e => setBadgeTextBn(e.target.value)}
                    placeholder="যেমন: সিজনাল অফার ২০% ছাড়"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">বাটন টেক্সট</label>
                  <input
                    type="text"
                    value={buttonTextBn}
                    onChange={e => setButtonTextBn(e.target.value)}
                    placeholder="এখনই অর্ডার করুন"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">সাবটাইটেল / সংক্ষিপ্ত বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  value={subtitleBn}
                  onChange={e => setSubtitleBn(e.target.value)}
                  placeholder="সম্পূর্ণ কেমিক্যাল ও প্রিজারভেটিভ মুক্ত খাঁটি পণ্যের সমাহার..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              {/* Image selection */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <label className="block font-semibold text-slate-300">ব্যানার ছবি (URL বা ডিভাইস থেকে আপলোড) *</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="https://... অথবা পাশের বোতামে চাপুন"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none font-mono text-[11px]"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Upload size={14} />
                    <span>আপলোড</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleFileUpload(e, 'modal')}
                  />
                </div>

                {/* Preset image quick click */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_BANNER_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImage(preset.url)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={e => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-0 bg-slate-950 border-slate-700"
                  />
                  <span className="font-semibold text-slate-300">ব্যানারটি সক্রিয় রাখুন</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors cursor-pointer shadow-md"
                  >
                    {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
