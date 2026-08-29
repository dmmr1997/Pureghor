import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Save, ShieldCheck, Phone, CreditCard, Truck, Bell, Upload, Loader2 } from 'lucide-react';
import { api } from '../../services/api';
import { StoreSettings } from '../../types';
import { uploadImage } from '../../services/imageUpload';

export const AdminSettings: React.FC = () => {
  const { storeSettings, refreshSettings, addToast } = useStore();

  const [settings, setSettings] = useState<StoreSettings>({ ...storeSettings });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);

  const handleChange = (field: keyof StoreSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.updateStoreSettings(settings);
      addToast('দোকানের সেটিংস সফলভাবে আপডেট হয়েছে!', 'success');
      await refreshSettings();
    } catch (e: any) {
      addToast(e.message || 'সেটিংস সেভ করা সম্ভব হয়নি', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">দোকানের সার্বিক সেটিংস (Store Settings)</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          দোকানের নাম, হটলাইন নম্বর, বিকাশ/নগদ পেমেন্ট অ্যাকাউন্ট এবং ডেলিভারি চার্জ নির্ধারণ করুন।
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Branding & Contact */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-slate-700/80 pb-2">
            <Settings size={16} className="text-emerald-400" />
            <span>১. সাধারণ ও যোগাযোগের তথ্য</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">দোকানের নাম (বাংলা) *</label>
              <input
                type="text"
                required
                value={settings.storeNameBn}
                onChange={e => handleChange('storeNameBn', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Store Name (English) *</label>
              <input
                type="text"
                required
                value={settings.storeNameEn}
                onChange={e => handleChange('storeNameEn', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">প্রধান হটলাইন নম্বর *</label>
              <input
                type="text"
                required
                value={settings.phonePrimary}
                onChange={e => handleChange('phonePrimary', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">বিকল্প ফোন নম্বর</label>
              <input
                type="text"
                value={settings.phoneSecondary || ''}
                onChange={e => handleChange('phoneSecondary', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">অফিসিয়াল ইমেইল</label>
              <input
                type="email"
                value={settings.email}
                onChange={e => handleChange('email', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">দোকান / ফার্মের ঠিকানা</label>
            <input
              type="text"
              value={settings.addressBn}
              onChange={e => handleChange('addressBn', e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
            />
          </div>

          {/* Hero Banner Background Image */}
          <div className="pt-2 border-t border-slate-700/60">
            <label className="block font-semibold text-slate-300 mb-1">
              হিরো সেকশন ব্যাকগ্রাউন্ড ইমেজ (URL বা আপলোড)
            </label>
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <input
                type="text"
                value={settings.heroBackgroundImage || ''}
                onChange={e => handleChange('heroBackgroundImage', e.target.value)}
                placeholder="ইমেজ URL অথবা Google Drive সরাসরি লিঙ্ক বা নিচের বোতাম দিয়ে আপলোড করুন"
                className="flex-1 w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none font-mono text-xs"
              />
              <label className={`font-bold px-4 py-2.5 rounded-lg text-xs cursor-pointer shrink-0 transition-colors flex items-center gap-1.5 ${
                isUploadingHero ? 'bg-slate-700 text-slate-400' : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}>
                {isUploadingHero ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />}
                <span>{isUploadingHero ? 'আপলোড হচ্ছে...' : 'ছবি আপলোড করুন'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploadingHero}
                  className="hidden"
                  onChange={async e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      try {
                        setIsUploadingHero(true);
                        const url = await uploadImage(file);
                        handleChange('heroBackgroundImage', url);
                        addToast('হিরো ব্যাকগ্রাউন্ড ছবি লোড হয়েছে! এবার নিচের সংরক্ষণ বাটনে ক্লিক করুন।', 'success');
                      } catch (err: any) {
                        addToast(err.message || 'ছবি আপলোড ব্যর্থ হয়েছে', 'error');
                      } finally {
                        setIsUploadingHero(false);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </label>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              * আপনি যেকোনো ইমেজ ফাইল সরাসরি আপলোড করতে পারেন অথবা Google Drive / ImgBB বা যেকোনো ইমেজ লিংক এখানে পেস্ট করতে পারেন।
            </p>
          </div>
        </div>

        {/* Shipping & Delivery */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-slate-700/80 pb-2">
            <Truck size={16} className="text-emerald-400" />
            <span>২. ডেলিভারি চার্জ ও ফ্রি শিপিং থ্রেশহোল্ড</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">ঢাকার ভিতরে ডেলিভারি চার্জ (৳) *</label>
              <input
                type="number"
                required
                value={settings.deliveryChargeInsideDhaka}
                onChange={e => handleChange('deliveryChargeInsideDhaka', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">ঢাকার বাইরে ডেলিভারি চার্জ (৳) *</label>
              <input
                type="number"
                required
                value={settings.deliveryChargeOutsideDhaka}
                onChange={e => handleChange('deliveryChargeOutsideDhaka', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-bold focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">ফ্রি ডেলিভারি ন্যূনতম কেনাকাটা (৳)</label>
              <input
                type="number"
                value={settings.freeDeliveryThreshold}
                onChange={e => handleChange('freeDeliveryThreshold', Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-emerald-400 font-bold focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Accounts */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-slate-700/80 pb-2">
            <CreditCard size={16} className="text-emerald-400" />
            <span>৩. মোবাইল ব্যাংকিং পেমেন্ট নম্বর</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">বিকাশ পার্সোনাল নম্বর (bKash)</label>
              <input
                type="text"
                value={settings.bkashNumber}
                onChange={e => handleChange('bkashNumber', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">নগদ পার্সোনাল নম্বর (Nagad)</label>
              <input
                type="text"
                value={settings.nagadNumber}
                onChange={e => handleChange('nagadNumber', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Announcement Header Message */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2 border-b border-slate-700/80 pb-2">
            <Bell size={16} className="text-emerald-400" />
            <span>৪. শীর্ষ নোটিস ও ঘোষণা বার (Announcement Bar)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">ঘোষণা টেক্সট (বাংলা)</label>
              <input
                type="text"
                value={settings.announcementTextBn}
                onChange={e => handleChange('announcementTextBn', e.target.value)}
                placeholder="যেমন: সারাদেশে ক্যাশ অন ডেলিভারি এবং ১৫০০ টাকার অর্ডারে ফ্রি শিপিং!"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Announcement Text (English)</label>
              <input
                type="text"
                value={settings.announcementTextEn}
                onChange={e => handleChange('announcementTextEn', e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Reset / Restore Demo Data */}
        <div className="bg-rose-950/20 border border-rose-900/40 rounded-xl p-5 space-y-3">
          <h3 className="font-bold text-sm text-rose-300 flex items-center gap-2">
            <ShieldCheck size={16} className="text-rose-400" />
            <span>৫. ডাটাবেস রিস্টোর ও প্রাথমিক পণ্য ডাটা সিঙ্ক (Reset / Seed)</span>
          </h3>
          <p className="text-xs text-slate-400">
            যদি কোনো কারণে প্রোডাক্ট ক্যাটালগ বা ব্যানার রিসেট করার প্রয়োজন হয়, তবে নিচের বোতামটি চাপুন।
          </p>
          <button
            type="button"
            onClick={async () => {
              if (confirm('আপনি কি ডাটাবেস প্রাথমিক ডেমো পণ্যে রিস্টোর করতে চান?')) {
                try {
                  await api.resetDatabase();
                  await refreshSettings();
                  addToast('ডাটাবেস সফলভাবে রিসেট ও সিঙ্ক করা হয়েছে!', 'success');
                  window.location.reload();
                } catch (e) {
                  addToast('রিসেট করা সম্ভব হয়নি', 'error');
                }
              }
            }}
            className="bg-rose-900/50 hover:bg-rose-900/80 text-rose-200 border border-rose-700/60 px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            ডিফল্ট ডাটাবেস ও প্রোডাক্ট রিস্টোর করুন
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl text-sm flex items-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            <Save size={18} />
            <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সকল সেটিংস সংরক্ষণ করুন'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
