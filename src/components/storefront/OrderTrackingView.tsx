import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  RotateCcw,
  Printer,
  ArrowRight,
  ShieldCheck,
  Phone,
  MapPin,
} from 'lucide-react';
import { api } from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { OrderStatusBadge, PaymentStatusBadge } from '../common/Badge';

export const OrderTrackingView: React.FC = () => {
  const { language, setCurrentView, addToast } = useStore();
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      addToast(language === 'bn' ? 'অর্ডার নম্বর বা মোবাইল নম্বর দিন' : 'Please enter order ID or phone', 'error');
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const res = await api.trackOrder(query.trim());
      setOrder(res);
    } catch (e: any) {
      setOrder(null);
      addToast(e.message || 'অর্ডার পাওয়া যায়নি', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Status timeline steps
  const steps: { status: OrderStatus; labelBn: string; labelEn: string }[] = [
    { status: 'pending', labelBn: 'অর্ডার গৃহিত', labelEn: 'Placed' },
    { status: 'confirmed', labelBn: 'কনফার্মড', labelEn: 'Confirmed' },
    { status: 'processing', labelBn: 'প্রসেসিং', labelEn: 'Processing' },
    { status: 'shipped', labelBn: 'ডেলিভারিতে হস্তান্তর', labelEn: 'Shipped' },
    { status: 'delivered', labelBn: 'ডেলিভার্ড সম্পন্ন', labelEn: 'Delivered' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 0;
      case 'confirmed': return 1;
      case 'processing': return 2;
      case 'packed': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Tracker Heading */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#004d1a] flex items-center justify-center mx-auto">
          <Truck size={24} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {language === 'bn' ? 'লাইভ অর্ডার ট্র্যাকিং' : 'Live Order Tracking'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto">
          {language === 'bn'
            ? 'আপনার অর্ডার নম্বর (যেমন: KB-98234) অথবা অর্ডারে ব্যবহৃত ১১ ডিজিটের মোবাইল নম্বর দিন।'
            : 'Enter your order ID (e.g. KB-98234) or your 11-digit phone number.'}
        </p>
      </div>

      {/* Search Input Box */}
      <form
        onSubmit={handleTrack}
        className="max-w-xl mx-auto flex items-center border-2 border-[#004d1a] rounded-xl overflow-hidden shadow-sm bg-white"
      >
        <div className="pl-4 text-gray-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={language === 'bn' ? 'অর্ডার নম্বর বা মোবাইল নম্বর (যেমন: KB-10291)' : 'Order ID or Phone Number'}
          className="flex-1 px-3 py-3 text-xs sm:text-sm focus:outline-none text-gray-800"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#004d1a] hover:bg-[#003612] disabled:bg-gray-400 text-white px-6 py-3 font-bold text-xs sm:text-sm transition-colors cursor-pointer"
        >
          {loading ? 'খোঁজা হচ্ছে...' : language === 'bn' ? 'ট্র্যাক করুন' : 'Track'}
        </button>
      </form>

      {/* Search Result View */}
      {order ? (
        <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-8 shadow-xs">
          {/* Order Header Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
            <div>
              <span className="text-xs text-gray-500">{language === 'bn' ? 'অর্ডার নম্বর' : 'Order Number'}</span>
              <h2 className="text-xl sm:text-2xl font-black text-[#004d1a]">{order.orderNumber}</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <OrderStatusBadge status={order.orderStatus} lang={language} />
              <PaymentStatusBadge status={order.paymentStatus} lang={language} />
              <button
                onClick={handlePrint}
                className="p-2 border border-gray-200 hover:bg-gray-100 rounded-lg text-gray-700 transition-colors text-xs flex items-center gap-1 cursor-pointer"
                title="Print Receipt"
              >
                <Printer size={16} />
                <span className="hidden sm:inline">{language === 'bn' ? 'প্রিন্ট রসিদ' : 'Print Invoice'}</span>
              </button>
            </div>
          </div>

          {/* Stepper Progress Bar */}
          <div className="py-4">
            <div className="relative flex items-center justify-between">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-0" />
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#004d1a] transition-all duration-500 -z-0"
                style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, idx) => {
                const isPassed = idx <= currentStepIdx;
                const isCurrent = idx === currentStepIdx;
                return (
                  <div key={step.status} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        isPassed
                          ? 'bg-[#004d1a] text-white ring-4 ring-emerald-100'
                          : 'bg-white border-2 border-gray-300 text-gray-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 size={16} /> : idx + 1}
                    </div>
                    <span
                      className={`text-[11px] sm:text-xs mt-2 font-semibold text-center whitespace-nowrap ${
                        isCurrent ? 'text-[#004d1a]' : isPassed ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    >
                      {language === 'bn' ? step.labelBn : step.labelEn}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tracking History Log */}
          {order.trackingHistory && order.trackingHistory.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
              <h4 className="font-bold text-xs sm:text-sm text-gray-900 flex items-center gap-2">
                <Clock size={16} className="text-[#004d1a]" />
                <span>{language === 'bn' ? 'ট্র্যাকিং আপডেট লগ' : 'Tracking Activity Log'}</span>
              </h4>
              <div className="space-y-2 divide-y divide-gray-200/60">
                {order.trackingHistory.map((item, idx) => (
                  <div key={idx} className="pt-2 first:pt-0 flex items-start justify-between text-xs">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {language === 'bn' ? item.titleBn : item.titleEn}
                      </p>
                      {item.note && <p className="text-gray-500 text-[11px] mt-0.5">{item.note}</p>}
                    </div>
                    <span className="text-[11px] text-gray-400 shrink-0 ml-2">
                      {new Date(item.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Details & Customer Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
            {/* Customer info */}
            <div className="space-y-2 text-xs text-gray-700">
              <h5 className="font-bold text-sm text-gray-900">{language === 'bn' ? 'ডেলিভারি তথ্য' : 'Delivery Details'}</h5>
              <p><span className="text-gray-500">নাম:</span> {order.customer.name}</p>
              <p><span className="text-gray-500">ফোন:</span> {order.customer.phone}</p>
              <p><span className="text-gray-500">ঠিকানা:</span> {order.customer.address}</p>
              <p><span className="text-gray-500">পেমেন্ট:</span> <span className="font-semibold uppercase">{order.paymentMethod}</span></p>
            </div>

            {/* Price calculation */}
            <div className="space-y-2 text-xs text-gray-700 bg-gray-50 p-4 rounded-xl">
              <h5 className="font-bold text-sm text-gray-900">{language === 'bn' ? 'বিলিং বিবরণ' : 'Billing Breakdown'}</h5>
              <div className="flex justify-between">
                <span>সাবটোটাল:</span>
                <span>৳{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>ছাড় ({order.couponCode}):</span>
                  <span>-৳{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>ডেলিভারি ফি:</span>
                <span>৳{order.shippingFee}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#004d1a] pt-1 border-t border-gray-200">
                <span>সর্বমোট:</span>
                <span>৳{order.total}</span>
              </div>
            </div>
          </div>

          {/* Ordered items */}
          <div className="space-y-3 pt-2">
            <h5 className="font-bold text-sm text-gray-900">{language === 'bn' ? 'অর্ডারকৃত পণ্যসমূহ' : 'Ordered Items'}</h5>
            <div className="divide-y divide-gray-100">
              {order.items.map((item, i) => (
                <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.nameEn} className="w-10 h-10 object-contain rounded bg-gray-50 p-0.5 border" />
                    <div>
                      <p className="font-semibold text-gray-800">{language === 'bn' ? item.nameBn : item.nameEn}</p>
                      <p className="text-gray-400 text-[11px]">{item.weight} • {item.quantity} পিস</p>
                    </div>
                  </div>
                  <span className="font-bold text-gray-900">৳{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : searched && !loading ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 p-8 space-y-3">
          <XCircle size={36} className="text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-gray-800">
            {language === 'bn' ? 'কোনো অর্ডার পাওয়া যায়নি' : 'No Order Found'}
          </h3>
          <p className="text-xs text-gray-500">
            {language === 'bn'
              ? 'অনুগ্রহ করে সঠিক অর্ডার নম্বর বা যে ফোন নম্বর দিয়ে অর্ডার করেছেন তা দিন।'
              : 'Please verify the order ID or the phone number used during checkout.'}
          </p>
        </div>
      ) : null}
    </div>
  );
};
