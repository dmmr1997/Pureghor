import React, { useState } from 'react';
import { Order, OrderStatus, PaymentStatus } from '../../types';
import { X, Printer, Phone, MapPin, CheckCircle, Clock, Truck, ShieldCheck, Send } from 'lucide-react';
import { api } from '../../services/api';
import { useStore } from '../../context/StoreContext';
import { OrderStatusBadge, PaymentStatusBadge } from '../common/Badge';

interface AdminOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
  onOpenInvoice: (order: Order) => void;
}

export const AdminOrderModal: React.FC<AdminOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onRefresh,
  onOpenInvoice,
}) => {
  const { addToast } = useStore();

  const [orderStatus, setOrderStatus] = useState<OrderStatus>(order?.orderStatus || 'pending');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(order?.paymentStatus || 'unpaid');
  const [courierName, setCourierName] = useState(order?.courierName || 'Steadfast');
  const [courierTrackingCode, setCourierTrackingCode] = useState(order?.courierTrackingCode || '');
  const [newTimelineTitleBn, setNewTimelineTitleBn] = useState('');
  const [newTimelineNote, setNewTimelineNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !order) return null;

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      await api.updateOrderStatus(order.id, {
        orderStatus,
        paymentStatus,
        courierName,
        courierTrackingCode,
      });

      if (newTimelineTitleBn.trim()) {
        await api.addTrackingEvent(order.id, {
          titleBn: newTimelineTitleBn.trim(),
          titleEn: newTimelineTitleBn.trim(),
          note: newTimelineNote.trim() || undefined,
        });
      }

      addToast('অর্ডারের তথ্য সফলভাবে আপডেট হয়েছে', 'success');
      onRefresh();
      onClose();
    } catch (e: any) {
      addToast(e.message || 'আপডেট করা সম্ভব হয়নি', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-base text-slate-100">
              অর্ডার বিবরণ #{order.orderNumber}
            </h3>
            <OrderStatusBadge status={order.orderStatus} lang="bn" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenInvoice(order)}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer size={14} />
              <span>ইনভয়েস প্রিন্ট</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 cursor-pointer">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* Customer info & Quick Communication */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div>
              <h4 className="font-bold text-slate-200 text-sm mb-2">গ্রাহকের তথ্য</h4>
              <p className="font-semibold text-emerald-400 text-base">{order.customer.name}</p>
              <p className="text-slate-300 mt-1 font-mono text-sm">{order.customer.phone}</p>
              <p className="text-slate-400 mt-1 leading-relaxed">{order.customer.address}</p>
              <p className="text-slate-500 text-[11px] mt-1">জেলা: {order.customer.district || 'ঢাকা'}</p>
            </div>

            <div className="space-y-3 md:border-l md:border-slate-800 md:pl-4">
              <h4 className="font-bold text-slate-200 text-sm">যোগাযোগ ও কল</h4>
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${order.customer.phone}`}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 p-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
                >
                  <Phone size={14} className="text-emerald-400" />
                  <span>সরাসরি কল দিন</span>
                </a>
                <a
                  href={`https://wa.me/88${order.customer.phone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 p-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold transition-colors"
                >
                  <span>হোয়াটসঅ্যাপ মেসেজ</span>
                </a>
              </div>
              {order.notes && (
                <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                  <span className="text-slate-400 text-[11px] block font-semibold">গ্রাহকের নোট:</span>
                  <p className="text-slate-300 italic">{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Status & Courier Controls */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-200 text-sm">অর্ডার ও কুরিয়ার স্ট্যাটাস নিয়ন্ত্রণ</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-400 mb-1">অর্ডার স্ট্যাটাস</label>
                <select
                  value={orderStatus}
                  onChange={e => setOrderStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="pending">পেন্ডিং (Pending)</option>
                  <option value="confirmed">কনফার্মড (Confirmed)</option>
                  <option value="processing">প্রসেসিং (Processing)</option>
                  <option value="packed">প্যাকড (Packed)</option>
                  <option value="shipped">শিপড (Shipped)</option>
                  <option value="delivered">ডেলিভার্ড (Delivered)</option>
                  <option value="cancelled">বাতিল (Cancelled)</option>
                  <option value="refunded">রিফান্ড (Refunded)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">পেমেন্ট স্ট্যাটাস</label>
                <select
                  value={paymentStatus}
                  onChange={e => setPaymentStatus(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="unpaid">বাকি (Unpaid)</option>
                  <option value="paid">পরিশোধিত (Paid)</option>
                  <option value="partially_paid">আংশিক পরিশোধ</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">কুরিয়ারের নাম</label>
                <select
                  value={courierName}
                  onChange={e => setCourierName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="Steadfast">Steadfast Courier</option>
                  <option value="Pathao">Pathao Courier</option>
                  <option value="RedX">RedX Delivery</option>
                  <option value="Paperfly">Paperfly</option>
                  <option value="Sundarban">Sundarban Courier</option>
                  <option value="SA Paribahan">SA Paribahan</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-400 mb-1">কুরিয়ার ট্র্যাকিং কোড</label>
                <input
                  type="text"
                  value={courierTrackingCode}
                  onChange={e => setCourierTrackingCode(e.target.value)}
                  placeholder="যেমন: STF-98231"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Add Live Tracking Event */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-200 text-sm">নতুন ট্র্যাকিং আপডেট পোস্ট করুন</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={newTimelineTitleBn}
                onChange={e => setNewTimelineTitleBn(e.target.value)}
                placeholder="যেমন: পার্সেলটি সুন্দরবন কুরিয়ারে বুকিং করা হয়েছে"
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none text-xs"
              />
              <input
                type="text"
                value={newTimelineNote}
                onChange={e => setNewTimelineNote(e.target.value)}
                placeholder="অতিরিক্ত মন্তব্য (ঐচ্ছিক)"
                className="bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none text-xs"
              />
            </div>
          </div>

          {/* Order Items Table */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
            <h4 className="font-bold text-slate-200 text-sm">অর্ডারকৃত পণ্যের তালিকা</h4>
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
                <tr>
                  <th className="p-2.5">পণ্য</th>
                  <th className="p-2.5">ওজন</th>
                  <th className="p-2.5">একক মূল্য</th>
                  <th className="p-2.5 text-center">পরিমাণ</th>
                  <th className="p-2.5 text-right">মোট</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 flex items-center gap-2">
                      <img src={item.image} alt={item.nameEn} className="w-8 h-8 rounded object-contain bg-white p-0.5" />
                      <span className="font-semibold text-slate-200">{item.nameBn}</span>
                    </td>
                    <td className="p-2.5 text-slate-400">{item.weight}</td>
                    <td className="p-2.5 font-medium">৳{item.price}</td>
                    <td className="p-2.5 text-center font-bold text-slate-100">{item.quantity}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-400">৳{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Calculations Summary */}
            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <div className="w-64 space-y-1 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>সাবটোটাল:</span>
                  <span className="font-semibold text-slate-200">৳{order.subtotal}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>কুপন ছাড় ({order.couponCode}):</span>
                    <span>-৳{order.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>ডেলিভারি ফি:</span>
                  <span className="font-semibold text-slate-200">৳{order.shippingFee}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-emerald-400 pt-1 border-t border-slate-700">
                  <span>সর্বমোট বিল:</span>
                  <span>৳{order.total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
            >
              বন্ধ করুন
            </button>
            <button
              type="button"
              onClick={handleUpdate}
              disabled={isUpdating}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors cursor-pointer"
            >
              {isUpdating ? 'আপডেট হচ্ছে...' : 'পরিবর্তন সংরক্ষণ করুন'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
