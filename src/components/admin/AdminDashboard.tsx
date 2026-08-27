import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Users,
  Package,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { api } from '../../services/api';
import { DashboardStats, Order, Product } from '../../types';
import { OrderStatusBadge } from '../common/Badge';

interface AdminDashboardProps {
  onNavigateTab: (tab: any) => void;
  onViewOrder: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateTab,
  onViewOrder,
}) => {
  const { addToast } = useStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleQuickStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: newStatus });
      addToast('অর্ডারের স্ট্যাটাস সফলভাবে পরিবর্তন হয়েছে', 'success');
      fetchStats();
    } catch (e) {
      addToast('Status update failed', 'error');
    }
  };

  if (loading || !stats) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>ড্যাশবোর্ড তথ্য লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">স্টোর ড্যাশবোর্ড ওভারভিউ</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            দোকানের রিয়েল-টাইম বিক্রয়, স্টক ও অর্ডারের সার্বিক চিত্র
          </p>
        </div>

        <button
          onClick={fetchStats}
          className="self-start sm:self-auto text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 font-medium transition-colors cursor-pointer"
        >
          রিফ্রেশ করুন
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">সর্বমোট বিক্রয়</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-100">৳{stats.totalRevenue.toLocaleString()}</div>
            <span className="text-[11px] text-emerald-400 font-semibold">লাইফটাইম সেলস</span>
          </div>
        </div>

        {/* Today's Sales */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">আজকের বিক্রি</span>
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 flex items-center justify-center">
              <ShoppingBag size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-slate-100">৳{stats.todaySales.toLocaleString()}</div>
            <span className="text-[11px] text-sky-400 font-semibold">আজকের নতুন অর্ডার</span>
          </div>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onNavigateTab('orders')}
          className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between cursor-pointer hover:border-amber-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">অপেক্ষমাণ অর্ডার (Pending)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-amber-400">{stats.pendingOrders}</div>
            <span className="text-[11px] text-slate-400 font-medium">অনুমোদনের অপেক্ষায়</span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between cursor-pointer hover:border-rose-500/40 transition-colors"
        >
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">লো-স্টক অ্যালার্ট</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xl sm:text-2xl font-black text-rose-400">{stats.lowStockCount}</div>
            <span className="text-[11px] text-slate-400 font-medium">রি-স্টক প্রয়োজন</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-800/50 border border-slate-800 rounded-lg p-3">
          <span className="text-slate-400">মোট অর্ডার:</span>
          <p className="font-bold text-slate-200 text-sm mt-0.5">{stats.totalOrders} টি</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-800 rounded-lg p-3">
          <span className="text-slate-400">ডেলিভার্ড অর্ডার:</span>
          <p className="font-bold text-emerald-400 text-sm mt-0.5">{stats.completedOrders} টি</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-800 rounded-lg p-3">
          <span className="text-slate-400">মোট সক্রিয় পণ্য:</span>
          <p className="font-bold text-slate-200 text-sm mt-0.5">{stats.totalProducts} টি</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-800 rounded-lg p-3">
          <span className="text-slate-400">মোট গ্রাহক:</span>
          <p className="font-bold text-slate-200 text-sm mt-0.5">{stats.totalCustomers} জন</p>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <ShoppingBag size={16} className="text-emerald-400" />
            <span>সাম্প্রতিক অর্ডারসমূহ</span>
          </h3>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
          >
            <span>সব অর্ডার দেখুন</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="p-3.5">অর্ডার নম্বর</th>
                <th className="p-3.5">গ্রাহক</th>
                <th className="p-3.5">ফোন</th>
                <th className="p-3.5">মোট মূল্য</th>
                <th className="p-3.5">পেমেন্ট</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {stats.recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                  <td className="p-3.5 font-bold text-emerald-400">{order.orderNumber}</td>
                  <td className="p-3.5 font-medium text-slate-200">{order.customer.name}</td>
                  <td className="p-3.5 text-slate-400">{order.customer.phone}</td>
                  <td className="p-3.5 font-bold text-slate-100">৳{order.total}</td>
                  <td className="p-3.5 uppercase font-medium text-slate-300">{order.paymentMethod}</td>
                  <td className="p-3.5">
                    <select
                      value={order.orderStatus}
                      onChange={e => handleQuickStatusChange(order.id, e.target.value)}
                      className="bg-slate-900 border border-slate-700 text-[11px] rounded px-2 py-1 text-slate-200 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="pending">পেন্ডিং</option>
                      <option value="confirmed">কনফার্মড</option>
                      <option value="processing">প্রসেসিং</option>
                      <option value="shipped">শিপড</option>
                      <option value="delivered">ডেলিভার্ড</option>
                      <option value="cancelled">বাতিল</option>
                    </select>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => onViewOrder(order)}
                      className="text-xs bg-slate-700 hover:bg-slate-600 text-slate-200 px-2.5 py-1 rounded font-semibold cursor-pointer"
                    >
                      বিস্তারিত
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Grid: Low Stock Alert & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Watch */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <AlertTriangle size={16} className="text-rose-400" />
              <span>লো-স্টক পণ্য তালিকা</span>
            </h3>
            <button
              onClick={() => onNavigateTab('inventory')}
              className="text-xs text-rose-400 hover:underline font-semibold cursor-pointer"
            >
              স্টক ম্যানেজ
            </button>
          </div>

          <div className="space-y-3">
            {stats.lowStockProducts.length === 0 ? (
              <p className="text-xs text-emerald-400">সকল পণ্যের পর্যাপ্ত স্টক রয়েছে।</p>
            ) : (
              stats.lowStockProducts.slice(0, 4).map(prod => (
                <div key={prod.id} className="flex items-center justify-between text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={prod.mainImage} alt={prod.nameEn} className="w-8 h-8 rounded object-contain bg-white p-0.5 shrink-0" />
                    <span className="font-semibold text-slate-200 truncate">{prod.nameBn}</span>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-rose-400">{prod.stock} পিস বাকি</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
              <TrendingUp size={16} className="text-emerald-400" />
              <span>শীর্ষ বিক্রিত পণ্যসমূহ</span>
            </h3>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-emerald-400 hover:underline font-semibold cursor-pointer"
            >
              সব পণ্য
            </button>
          </div>

          <div className="space-y-3">
            {stats.topProducts.map((p, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={p.image} alt={p.name} className="w-8 h-8 rounded object-contain bg-white p-0.5 shrink-0" />
                  <span className="font-semibold text-slate-200 truncate">{p.name}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-emerald-400">{p.soldCount} টি বিক্রি</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
