import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Settings, Save, ShieldCheck, Phone, CreditCard, Truck, Bell } from 'lucide-react';
import { api } from '../../services/api';
import { StoreSettings } from '../../types';

export const AdminSettings: React.FC = () => {
  const { storeSettings, refreshSettings, addToast } = useStore();

  const [settings, setSettings] = useState<StoreSettings>({ ...storeSettings });
  const [isSaving, setIsSaving] = useState(false);

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
