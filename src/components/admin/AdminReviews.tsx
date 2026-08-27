import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { MessageSquare, Star, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Review } from '../../types';
import { api } from '../../services/api';
import { StarRating } from '../common/StarRating';

export const AdminReviews: React.FC = () => {
  const { addToast } = useStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.getReviews();
      setReviews(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await api.updateReviewStatus(id, status);
      addToast(`রিভিউ ${status === 'approved' ? 'অনুমোদিত' : 'বাতিল'} হয়েছে`, 'success');
      fetchReviews();
    } catch (e) {
      addToast('আপডেট করা সম্ভব হয়নি', 'error');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">গ্রাহক রিভিউ মডারেশন (Reviews)</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          গ্রাহকদের মতামত ও রেটিং পর্যালোচনা করে অনুমোদন বা বাতিল করুন।
        </p>
      </div>

      {/* Reviews List */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="p-3.5">গ্রাহক</th>
                <th className="p-3.5">পণ্য ID</th>
                <th className="p-3.5">রেটিং</th>
                <th className="p-3.5">মন্তব্য</th>
                <th className="p-3.5">তারিখ</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    রিভিউ লোড হচ্ছে...
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    কোনো রিভিউ পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                reviews.map(rev => (
                  <tr key={rev.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3.5 font-semibold text-slate-200">{rev.customerName}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">{rev.productId}</td>
                    <td className="p-3.5">
                      <StarRating rating={rev.rating} size={12} />
                    </td>
                    <td className="p-3.5 max-w-sm truncate text-slate-300" title={rev.comment}>
                      {rev.comment}
                    </td>
                    <td className="p-3.5 text-slate-400">
                      {new Date(rev.createdAt).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          rev.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : rev.status === 'rejected'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {rev.status === 'approved' ? 'অনুমোদিত' : rev.status === 'rejected' ? 'বাতিল' : 'পেন্ডিং'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleToggleStatus(rev.id, 'approved')}
                          className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded transition-colors cursor-pointer"
                          title="Approve"
                        >
                          <CheckCircle size={14} />
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleToggleStatus(rev.id, 'rejected')}
                          className="p-1.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 rounded transition-colors cursor-pointer"
                          title="Reject"
                        >
                          <XCircle size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
