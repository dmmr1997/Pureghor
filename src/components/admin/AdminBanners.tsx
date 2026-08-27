import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Image, Plus, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { BannerSlide } from '../../types';
import { api } from '../../services/api';

export const AdminBanners: React.FC = () => {
  const { addToast } = useStore();
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [subtitleBn, setSubtitleBn] = useState('');
  const [badgeTextBn, setBadgeTextBn] = useState('');
  const [image, setImage] = useState('');
  const [bgGradient, setBgGradient] = useState('from-[#004d1a] via-[#004317] to-[#00280d]');
  const [buttonTextBn, setButtonTextBn] = useState('এখনই অর্ডার করুন');
  const [linkUrl, setLinkUrl] = useState('/catalog');
  const [isSaving, setIsSaving] = useState(false);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await api.getBanners();
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

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleBn.trim() || !image.trim()) return;

    try {
      setIsSaving(true);
      await api.createBanner({
        titleBn: titleBn.trim(),
        titleEn: titleEn.trim() || titleBn.trim(),
        subtitleBn: subtitleBn.trim() || undefined,
        badgeTextBn: badgeTextBn.trim() || undefined,
        image: image.trim(),
        bgGradient,
        buttonTextBn,
        linkUrl,
        isActive: true,
      });

      addToast('ব্যানার স্লাইডার সফলভাবে তৈরি হয়েছে!', 'success');
      await fetchBanners();
      setIsModalOpen(false);
      setTitleBn('');
    } catch (e: any) {
      addToast(e.message || 'ব্যানার সংরক্ষণ ব্যর্থ', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('আপনি কি এই ব্যানারটি মুছে ফেলতে চান?')) {
      try {
        await api.deleteBanner(id);
        addToast('ব্যানার মুছে ফেলা হয়েছে', 'info');
        await fetchBanners();
      } catch (e) {
        addToast('মুছে ফেলা সম্ভব হয়নি', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">হিরো ব্যানার ও স্লাইডার (Banners)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            হোমপেজের মূল ক্যারোসেল ব্যানার স্লাইডগুলো নিয়ন্ত্রণ করুন।
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>নতুন ব্যানার যোগ</span>
        </button>
      </div>

      {/* Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banners.map(b => (
          <div key={b.id} className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between">
            <div className="p-4 flex gap-4">
              <img
                src={b.image}
                alt={b.titleEn}
                className="w-24 h-24 rounded-lg object-contain bg-slate-900 border border-slate-700 p-1 shrink-0"
              />
              <div className="min-w-0 space-y-1">
                {b.badgeTextBn && (
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded">
                    {b.badgeTextBn}
                  </span>
                )}
                <h4 className="font-bold text-sm text-slate-100 line-clamp-1">{b.titleBn}</h4>
                <p className="text-xs text-slate-400 line-clamp-2">{b.subtitleBn}</p>
                <p className="text-[11px] text-emerald-400 font-semibold">{b.buttonTextBn} → {b.linkUrl}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 border-t border-slate-700/60 flex justify-end">
              <button
                onClick={() => handleDelete(b.id)}
                className="p-1.5 bg-slate-700 hover:bg-rose-900/60 text-rose-400 rounded transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Trash2 size={14} />
                <span>মুছে ফেলুন</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 text-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100">নতুন ব্যানার স্লাইড তৈরি</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">ব্যানার শিরোনাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={titleBn}
                  onChange={e => setTitleBn(e.target.value)}
                  placeholder="যেমন: ১০০% খাঁটি গাওয়া ঘি ও প্রাকৃতিক মধু"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">সাবটাইটেল / বিবরণ (বাংলা)</label>
                <textarea
                  rows={2}
                  value={subtitleBn}
                  onChange={e => setSubtitleBn(e.target.value)}
                  placeholder="প্রাকৃতিক উপাদান ও সুস্বাস্থ্যের নিশ্চয়তা..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">হাইলাইট ব্যাজ (ঐচ্ছিক)</label>
                <input
                  type="text"
                  value={badgeTextBn}
                  onChange={e => setBadgeTextBn(e.target.value)}
                  placeholder="যেমন: সিজনাল অফার ২০% ছাড়"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">ছবির URL *</label>
                <input
                  type="url"
                  required
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
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
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
