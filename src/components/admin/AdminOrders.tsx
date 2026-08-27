import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Filter, Eye, Printer, Phone, Calendar, ArrowUpDown } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { api } from '../../services/api';
import { OrderStatusBadge, PaymentStatusBadge } from '../common/Badge';
import { AdminOrderModal } from './AdminOrderModal';
import { AdminInvoiceModal } from './AdminInvoiceModal';

interface AdminOrdersProps {
  selectedOrderProp?: Order | null;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({ selectedOrderProp }) => {
  const { addToast } = useStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeOrder, setActiveOrder] = useState<Order | null>(selectedOrderProp || null);
  const [invoiceOrder, setInvoiceOrder] = useState<Order | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(!!selectedOrderProp);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getOrders({
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      setOrders(res.orders);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleQuickStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, { orderStatus: status });
      addToast('অর্ডারের স্ট্যাটাস সফলভাবে পরিবর্তিত হয়েছে', 'success');
      fetchOrders();
    } catch (e) {
      addToast('আপডেট করা যায়নি', 'error');
    }
  };

  const statusTabs: { id: string; labelBn: string; count?: number }[] = [
    { id: 'all', labelBn: 'সকল অর্ডার' },
    { id: 'pending', labelBn: 'পেন্ডিং (Pending)' },
    { id: 'confirmed', labelBn: 'কনফার্মড' },
    { id: 'processing', labelBn: 'প্রসেসিং' },
    { id: 'shipped', labelBn: 'শিপড (কুরিয়ার)' },
    { id: 'delivered', labelBn: 'ডেলিভার্ড' },
    { id: 'cancelled', labelBn: 'বাতিল' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">অর্ডার ও ইনভয়েস ব্যবস্থাপনা (Orders)</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          গ্রাহকদের অর্ডারের বিবরণ দেখুন, স্ট্যাটাস পরিবর্তন করুন এবং সরাসরি ইনভয়েস প্রিন্ট করুন।
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {statusTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === tab.id
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {tab.labelBn}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="অর্ডার নম্বর (KB-XXX), গ্রাহকের নাম বা মোবাইল নম্বর দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer"
        >
          অনুসন্ধান
        </button>
      </form>

      {/* Orders Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="p-3.5">অর্ডার নম্বর</th>
                <th className="p-3.5">তারিখ</th>
                <th className="p-3.5">গ্রাহকের নাম ও ফোন</th>
                <th className="p-3.5">ঠিকানা</th>
                <th className="p-3.5">পণ্য সংখ্যা</th>
                <th className="p-3.5">মোট মূল্য</th>
                <th className="p-3.5">পেমেন্ট</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    অর্ডার লোড হচ্ছে...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    কোনো অর্ডার পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                orders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3.5 font-bold text-emerald-400 font-mono">{order.orderNumber}</td>
                    <td className="p-3.5 text-slate-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                    </td>
                    <td className="p-3.5">
                      <p className="font-semibold text-slate-200">{order.customer.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono">{order.customer.phone}</p>
                    </td>
                    <td className="p-3.5 max-w-[160px] truncate text-slate-300" title={order.customer.address}>
                      {order.customer.address}
                    </td>
                    <td className="p-3.5 text-slate-300 font-medium">{order.items.length} টি</td>
                    <td className="p-3.5 font-bold text-slate-100">৳{order.total}</td>
                    <td className="p-3.5">
                      <span className="uppercase font-medium text-[11px] block">{order.paymentMethod}</span>
                      <PaymentStatusBadge status={order.paymentStatus} lang="bn" />
                    </td>
                    <td className="p-3.5">
                      <select
                        value={order.orderStatus}
                        onChange={e => handleQuickStatus(order.id, e.target.value)}
                        className="bg-slate-900 border border-slate-700 text-[11px] rounded px-2 py-1 text-slate-200 font-semibold focus:outline-none cursor-pointer"
                      >
                        <option value="pending">পেন্ডিং</option>
                        <option value="confirmed">কনফার্মড</option>
                        <option value="processing">প্রসেসিং</option>
                        <option value="packed">প্যাকড</option>
                        <option value="shipped">শিপড</option>
                        <option value="delivered">ডেলিভার্ড</option>
                        <option value="cancelled">বাতিল</option>
                      </select>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setActiveOrder(order);
                          setIsOrderModalOpen(true);
                        }}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-200 transition-colors cursor-pointer"
                        title="View Details"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => {
                          setInvoiceOrder(order);
                          setIsInvoiceModalOpen(true);
                        }}
                        className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 rounded border border-emerald-500/30 transition-colors cursor-pointer"
                        title="Print Invoice"
                      >
                        <Printer size={14} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      <AdminOrderModal
        order={activeOrder}
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        onRefresh={fetchOrders}
        onOpenInvoice={order => {
          setInvoiceOrder(order);
          setIsInvoiceModalOpen(true);
        }}
      />

      {/* Printable Invoice Modal */}
      <AdminInvoiceModal
        order={invoiceOrder}
        isOpen={isInvoiceModalOpen}
        onClose={() => setIsInvoiceModalOpen(false)}
      />
    </div>
  );
};
