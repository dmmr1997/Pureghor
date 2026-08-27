import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Phone,
  MapPin,
  User,
  ShoppingBag,
  ArrowLeft,
  CheckCircle2,
  Tag,
  AlertCircle,
} from 'lucide-react';
import { api } from '../../services/api';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    deliveryZone,
    setDeliveryZone,
    shippingFee,
    appliedCoupon,
    couponDiscount,
    cartTotal,
    storeSettings,
    language,
    setCurrentView,
    clearCart,
    addToast,
    applyCouponCode,
    removeCoupon,
  } = useStore();

  const { customerUser, customerLogin } = useAuth();

  const [name, setName] = useState(customerUser?.name || '');
  const [phone, setPhone] = useState(customerUser?.phone || '');
  const [address, setAddress] = useState(customerUser?.address || '');
  const [district, setDistrict] = useState(customerUser?.district || 'Dhaka');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [trxId, setTrxId] = useState('');
  const [inputCoupon, setInputCoupon] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmedData, setOrderConfirmedData] = useState<any | null>(null);

  if (cart.length === 0 && !orderConfirmedData) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
          <ShoppingBag size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          {language === 'bn' ? 'আপনার কার্ট বর্তমানে খালি' : 'Your cart is empty'}
        </h3>
        <p className="text-xs text-gray-500">
          {language === 'bn'
            ? 'অর্ডার করতে অনুগ্রহ করে কিছু পণ্য কার্টে যোগ করুন।'
            : 'Please add some products to your cart before proceeding to checkout.'}
        </p>
        <button
          onClick={() => setCurrentView('catalog')}
          className="bg-[#004d1a] hover:bg-[#003612] text-white px-6 py-2.5 rounded-md font-semibold text-xs sm:text-sm cursor-pointer shadow-xs"
        >
          {language === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Browse Catalog'}
        </button>
      </div>
    );
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      addToast(language === 'bn' ? 'দয়া করে আপনার নাম লিখুন' : 'Please enter your name', 'error');
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, '').length < 11) {
      addToast(
        language === 'bn'
          ? 'দয়া করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন'
          : 'Please enter a valid 11-digit mobile number',
        'error'
      );
      return;
    }
    if (!address.trim()) {
      addToast(
        language === 'bn' ? 'দেলিভারির জন্য আপনার সম্পূর্ণ ঠিকানা লিখুন' : 'Please enter delivery address',
        'error'
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          address: address.trim(),
          district,
          city: deliveryZone === 'inside_dhaka' ? 'Dhaka' : district,
        },
        items: cart.map(item => ({
          productId: item.productId,
          variantId: item.variantId,
          nameBn: item.nameBn,
          nameEn: item.nameEn,
          price: item.price,
          quantity: item.quantity,
          weight: item.weight,
          image: item.image,
          sku: item.sku,
        })),
        subtotal: cartSubtotal,
        discount: couponDiscount,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        shippingFee,
        total: cartTotal,
        paymentMethod,
        paymentTransactionId: trxId || undefined,
        notes,
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        setOrderConfirmedData(res.order);
        customerLogin(phone.trim(), name.trim());
        clearCart();
        addToast(
          language === 'bn'
            ? 'আপনার অর্ডার সফলভাবে গ্রহণ করা হয়েছে!'
            : 'Order confirmed successfully!',
          'success'
        );
      }
    } catch (e: any) {
      addToast(e.message || 'অর্ডার করতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {orderConfirmedData ? (
        /* Enhanced Order Success Receipt View */
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 space-y-5 shadow-sm">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-[#004d1a] rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              {language === 'bn' ? 'অভিনন্দন! আপনার অর্ডারটি নিশ্চিত হয়েছে' : 'Thank You! Order Confirmed'}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {language === 'bn'
                ? `অর্ডার নম্বর #${orderConfirmedData.orderNumber} এর বিস্তারিত রসিদ নিচে দেওয়া হলো:`
                : `Invoice details for order #${orderConfirmedData.orderNumber} are below:`}
            </p>
          </div>

          {/* Printable Invoice Receipt Card */}
          <div className="bg-slate-50 border border-emerald-500/30 rounded-xl p-4 sm:p-6 space-y-4 text-xs">
            {/* Header Strip */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-gray-400">অর্ডার ইনভয়েস নম্বর</span>
                <div className="font-extrabold text-base sm:text-lg text-[#004d1a] tracking-wider">
                  #{orderConfirmedData.orderNumber}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-gray-400 font-medium">অর্ডারের তারিখ</span>
                <div className="font-semibold text-gray-700">
                  {new Date(orderConfirmedData.createdAt).toLocaleDateString('bn-BD', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-white p-3.5 rounded-lg border border-gray-200/80">
              <div>
                <span className="text-gray-400 text-[10px] block">গ্রাহকের নাম:</span>
                <span className="font-bold text-gray-800 text-sm">{orderConfirmedData.customer?.name}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] block">মোবাইল নম্বর:</span>
                <span className="font-bold text-gray-800 text-sm">{orderConfirmedData.customer?.phone}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-gray-400 text-[10px] block">ডেলিভারি ঠিকানা:</span>
                <span className="font-semibold text-gray-700 leading-tight">
                  {orderConfirmedData.customer?.address}, {orderConfirmedData.customer?.district}
                </span>
              </div>
            </div>

            {/* Items Summary */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">অর্ডারকৃত পণ্যসমূহ:</span>
              {orderConfirmedData.items?.map((it: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between bg-white p-2.5 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-2.5">
                    {it.image && (
                      <img
                        src={it.image}
                        alt={it.nameEn}
                        className="w-10 h-10 object-contain rounded bg-slate-50 border p-0.5"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/images/products/pureghor_blackseed_honey_1787810945841.jpg';
                        }}
                      />
                    )}
                    <div>
                      <h5 className="font-bold text-gray-900 text-xs">{it.nameBn || it.nameEn}</h5>
                      <span className="text-[10px] text-gray-500 font-medium">
                        {it.weight || ''} × {it.quantity} টি (প্রতি পিস ৳{it.price})
                      </span>
                    </div>
                  </div>
                  <span className="font-extrabold text-gray-900">৳{it.price * it.quantity}</span>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div className="space-y-1.5 pt-2 border-t border-gray-200 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>পণ্যের উপমোট (Subtotal):</span>
                <span>৳{orderConfirmedData.subtotal}</span>
              </div>
              {orderConfirmedData.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>কুপন ছাড় (Discount):</span>
                  <span>-৳{orderConfirmedData.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span>{orderConfirmedData.shippingFee === 0 ? 'ফ্রি (Free)' : `৳${orderConfirmedData.shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-[#004d1a] pt-2 border-t border-gray-300">
                <span>সর্বমোট প্রদেয় (Cash on Delivery):</span>
                <span>৳{orderConfirmedData.total}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow"
            >
              <span>🖨️ রসিদ প্রিন্ট করুন</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('track-order')}
              className="bg-[#004d1a] hover:bg-[#003612] text-white font-bold py-3 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow"
            >
              <span>🚚 অর্ডার ট্র্যাক করুন</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg text-xs flex items-center justify-center cursor-pointer transition-colors"
            >
              <span>হোমপেজে ফিরে যান</span>
            </button>
          </div>
        </div>
      ) : (
        /* Checkout 2-Column Form */
        <div>
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={() => setCurrentView('catalog')}
              className="p-1.5 hover:bg-gray-100 rounded text-gray-600 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {language === 'bn' ? 'চেকআউট ও অর্ডার সম্পন্নকরণ' : 'Checkout & Confirm Order'}
            </h1>
          </div>

          <form onSubmit={handleOrderSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Col: Customer Shipping Form (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Shipping Details Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <User size={18} className="text-[#004d1a]" />
                  <span>{language === 'bn' ? '১. আপনার ডেলিভারি তথ্য' : '1. Delivery Details'}</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {language === 'bn' ? 'সম্পূর্ণ নাম *' : 'Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={language === 'bn' ? 'আপনার নাম লিখুন' : 'Enter your name'}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#004d1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {language === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Phone Number (11 digits) *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#004d1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {language === 'bn' ? 'সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা/উপজেলা) *' : 'Detailed Delivery Address *'}
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder={language === 'bn' ? 'বাসা/ফ্ল্যাট নং, রোড, থানা, জেলা উল্লেখ করুন' : 'House, Road, Area, District'}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#004d1a]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {language === 'bn' ? 'ডেলিভারি এলাকা *' : 'Delivery Zone *'}
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setDeliveryZone('inside_dhaka')}
                        className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                          deliveryZone === 'inside_dhaka'
                            ? 'border-[#004d1a] bg-emerald-50 text-[#004d1a] font-bold ring-1 ring-[#004d1a]'
                            : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="font-semibold">{language === 'bn' ? 'ঢাকার ভিতরে' : 'Inside Dhaka'}</div>
                        <div className="text-[11px] text-gray-500">৳{storeSettings.deliveryChargeInsideDhaka} (২৪-৪৮ ঘণ্টা)</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setDeliveryZone('outside_dhaka')}
                        className={`p-3 rounded-lg border text-left text-xs transition-colors cursor-pointer ${
                          deliveryZone === 'outside_dhaka'
                            ? 'border-[#004d1a] bg-emerald-50 text-[#004d1a] font-bold ring-1 ring-[#004d1a]'
                            : 'border-gray-200 text-gray-700'
                        }`}
                      >
                        <div className="font-semibold">{language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</div>
                        <div className="text-[11px] text-gray-500">৳{storeSettings.deliveryChargeOutsideDhaka} (২-৩ দিন)</div>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {language === 'bn' ? 'অর্ডার সম্পর্কিত বিশেষ নোট (ঐচ্ছিক)' : 'Order Notes (optional)'}
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder={language === 'bn' ? 'যেমন: বিকেলে ডেলিভারি করবেন' : 'Special delivery instructions'}
                      className="w-full px-3.5 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Methods Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <CreditCard size={18} className="text-[#004d1a]" />
                  <span>{language === 'bn' ? '২. পেমেন্ট পদ্ধতি নির্বাচন করুন' : '2. Payment Method'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#004d1a] bg-emerald-50 text-[#004d1a] font-bold ring-1 ring-[#004d1a]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="font-bold text-sm">{language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</div>
                    <div className="text-[11px] text-gray-500 mt-1">পণ্য হাতে পেয়ে মূল্য পরিশোধ</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-3.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      paymentMethod === 'bkash'
                        ? 'border-[#cc3366] bg-pink-50 text-[#cc3366] font-bold ring-1 ring-[#cc3366]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="font-bold text-sm">বিকাশ (bKash)</div>
                    <div className="text-[11px] text-gray-500 mt-1">সেন্ড মানি পেমেন্ট</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-3.5 rounded-lg border text-left text-xs transition-all cursor-pointer ${
                      paymentMethod === 'nagad'
                        ? 'border-amber-600 bg-amber-50 text-amber-800 font-bold ring-1 ring-amber-600'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <div className="font-bold text-sm">নগদ (Nagad)</div>
                    <div className="text-[11px] text-gray-500 mt-1">সেন্ড মানি পেমেন্ট</div>
                  </button>
                </div>

                {paymentMethod !== 'cod' && (
                  <div className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-2">
                    <p className="font-bold text-gray-900">
                      {paymentMethod === 'bkash'
                        ? `bKash Personal Number: ${storeSettings.bkashNumber}`
                        : `Nagad Personal Number: ${storeSettings.nagadNumber}`}
                    </p>
                    <p className="text-gray-600">
                      উক্ত নম্বরে মোট ৳{cartTotal} টাকা Send Money করার পর নিচের ঘরে TrxID লিখুন।
                    </p>
                    <input
                      type="text"
                      value={trxId}
                      onChange={e => setTrxId(e.target.value)}
                      placeholder="TrxID (যেমন: 9J7X...)"
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs bg-white focus:outline-none"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Order Summary & Review (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 space-y-4 shadow-xs">
                <h3 className="text-base font-bold text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
                  <ShoppingBag size={18} className="text-[#004d1a]" />
                  <span>{language === 'bn' ? '৩. আপনার অর্ডার সারসংক্ষেপ' : '3. Order Summary'}</span>
                </h3>

                {/* Items List */}
                <div className="space-y-3 max-h-64 overflow-y-auto divide-y divide-gray-100 pr-1">
                  {cart.map(item => (
                    <div key={`${item.productId}-${item.variantId || 'std'}`} className="pt-3 first:pt-0 flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.nameEn}
                        className="w-12 h-12 rounded object-contain bg-gray-50 border border-gray-200 p-0.5 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-xs text-gray-800 truncate">
                          {language === 'bn' ? item.nameBn : item.nameEn}
                        </h4>
                        <div className="text-[11px] text-gray-500">
                          <span>{item.weight}</span> • <span>{item.quantity} x ৳{item.price}</span>
                        </div>
                      </div>
                      <div className="text-right font-bold text-xs text-gray-900">
                        ৳{item.price * item.quantity}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Coupon Box */}
                <div className="pt-2 border-t border-gray-100">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 text-emerald-900 p-2.5 rounded-lg text-xs">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Tag size={14} className="text-[#004d1a]" />
                        <span>কুপন ({appliedCoupon.code}): -৳{couponDiscount}</span>
                      </div>
                      <button onClick={removeCoupon} className="text-rose-600 font-bold hover:underline cursor-pointer">
                        মুছুন
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputCoupon}
                        onChange={e => setInputCoupon(e.target.value)}
                        placeholder={language === 'bn' ? 'কুপন কোড (যেমন: PURE10)' : 'Coupon code (e.g. PURE10)'}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs uppercase focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (inputCoupon) applyCouponCode(inputCoupon);
                        }}
                        className="bg-gray-800 hover:bg-black text-white px-3.5 py-1.5 rounded text-xs font-semibold cursor-pointer"
                      >
                        প্রয়োগ
                      </button>
                    </div>
                  )}
                </div>

                {/* Total Calculations */}
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-xs text-gray-700 border border-gray-200">
                  <div className="flex justify-between">
                    <span>{language === 'bn' ? 'পণ্যের মোট মূল্য:' : 'Subtotal:'}</span>
                    <span className="font-semibold">৳{cartSubtotal}</span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>{language === 'bn' ? 'কুপন ছাড়:' : 'Coupon Discount:'}</span>
                      <span>-৳{couponDiscount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Shipping:'}</span>
                    <span className="font-semibold">{shippingFee === 0 ? 'ফ্রি' : `৳${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between text-base font-extrabold text-[#004d1a] pt-2 border-t border-gray-200">
                    <span>{language === 'bn' ? 'সর্বমোট পরিশোধযোগ্য:' : 'Grand Total:'}</span>
                    <span>৳{cartTotal}</span>
                  </div>
                </div>

                {/* Submit Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#004d1a] hover:bg-[#003612] disabled:bg-gray-400 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>অর্ডার কনফার্ম হচ্ছে...</span>
                  ) : (
                    <>
                      <ShieldCheck size={20} />
                      <span>{language === 'bn' ? 'অর্ডার কনফার্ম করুন (Confirm Order)' : 'Confirm Order'}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
