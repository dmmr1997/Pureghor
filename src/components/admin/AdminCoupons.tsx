import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Tag, Plus, Trash2, CheckCircle, XCircle, X } from 'lucide-react';
import { Coupon } from '../../types';
import { api } from '../../services/api';

export const AdminCoupons: React.FC = () => {
  const { addToast } = useStore();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minOrderAmount, setMinOrderAmount] = useState<number>(500);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState<number>(300);
  const [expiryDate, setExpiryDate] = useState('2026-12-31');
  const [isSaving, setIsSaving] = useState(false);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.getCoupons();
      setCoupons(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    try {
      setIsSaving(true);
      await api.createCoupon({
        code: code.trim().toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        minOrderAmount: Number(minOrderAmount) || undefined,
        maxDiscountAmount: Number(maxDiscountAmount) || undefined,
        expiryDate,
        isActive: true,
      });

      addToast('নতুন কুপন কোড সফলভাবে তৈরি হয়েছে!', 'success');
      await fetchCoupons();
      setIsModalOpen(false);
      setCode('');
    } catch (e: any) {
      addToast(e.message || 'কুপন তৈরি করা যায়নি', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, cCode: string) => {
    if (confirm(`আপনি কি "${cCode}" কুপনটি মুছে ফেলতে চান?`)) {
      try {
        await api.deleteCoupon(id);
        addToast('কুপন মুছে ফেলা হয়েছে', 'info');
        await fetchCoupons();
      } catch (e) {
        addToast('মুছে ফেলা যায়নি', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">কুপন ও ডিসকাউন্ট (Coupons)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ডিসকাউন্ট কুপন তৈরি ও পরিচালনা করুন যা গ্রাহকরা চেকআউটে ব্যবহার করতে পারবে।
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>নতুন কুপন তৈরি</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="p-3.5">কুপন কোড</th>
                <th className="p-3.5">ডিসকাউন্ট ধরন</th>
                <th className="p-3.5">পরিমাণ</th>
                <th className="p-3.5">ন্যূনতম অর্ডার</th>
                <th className="p-3.5">সর্বোচ্চ ছাড়</th>
                <th className="p-3.5">মেয়াদ উত্তীর্ণের তারিখ</th>
                <th className="p-3.5">ব্যবহার সংখ্যা</th>
                <th className="p-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {coupons.map(c => (
                <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3.5 font-bold font-mono text-emerald-400 text-sm tracking-wider">
                    {c.code}
                  </td>
                  <td className="p-3.5 capitalize text-slate-300">
                    {c.discountType === 'percentage' ? 'শতাংশ (%)' : 'নির্দিষ্ট টাকা (৳)'}
                  </td>
                  <td className="p-3.5 font-extrabold text-slate-100">
                    {c.discountType === 'percentage' ? `${c.discountValue}%` : `৳${c.discountValue}`}
                  </td>
                  <td className="p-3.5 text-slate-400">৳{c.minOrderAmount || 0}</td>
                  <td className="p-3.5 text-slate-400">৳{c.maxDiscountAmount || '-'}</td>
                  <td className="p-3.5 text-slate-400 font-mono">{c.expiryDate}</td>
                  <td className="p-3.5 font-semibold text-slate-300">{c.usageCount || 0} বার</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.code)}
                      className="p-1.5 bg-slate-700 hover:bg-rose-900/60 text-rose-400 rounded transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-md w-full p-6 text-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100">নতুন কুপন কোড তৈরি</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">কুপন কোড (যেমন: EID20) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="PURE15"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ডিসকাউন্ট ধরন</label>
                  <select
                    value={discountType}
                    onChange={e => setDiscountType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none"
                  >
                    <option value="percentage">শতাংশ (%)</option>
                    <option value="fixed">নির্দিষ্ট টাকা (৳)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ছাড়ের মান *</label>
                  <input
                    type="number"
                    required
                    value={discountValue}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">ন্যূনতম অর্ডার (৳)</label>
                  <input
                    type="number"
                    value={minOrderAmount}
                    onChange={e => setMinOrderAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">সর্বোচ্চ ছাড় সীমা (৳)</label>
                  <input
                    type="number"
                    value={maxDiscountAmount}
                    onChange={e => setMaxDiscountAmount(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">মেয়াদ শেষ হওয়ার তারিখ</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100"
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
                  {isSaving ? 'তৈরি হচ্ছে...' : 'কুপন সেভ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
