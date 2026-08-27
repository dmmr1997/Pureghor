import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { X, CheckCircle2, ShieldCheck, Truck, Phone, MapPin, User, Tag, ShoppingBag } from 'lucide-react';
import { api } from '../../services/api';
import { ProductVariant } from '../../types';

export const QuickOrderModal: React.FC = () => {
  const {
    quickOrderProduct,
    setQuickOrderProduct,
    language,
    storeSettings,
    addToast,
    setCurrentView,
  } = useStore();

  const { customerUser, customerLogin } = useAuth();

  const product = quickOrderProduct;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [deliveryArea, setDeliveryArea] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [appliedCouponName, setAppliedCouponName] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [trxId, setTrxId] = useState('');
  const [customerNote, setCustomerNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any | null>(null);

  useEffect(() => {
    if (product) {
      if (product.variants && product.variants.length > 0) {
        setSelectedVariant(product.variants[0]);
      } else {
        setSelectedVariant(null);
      }
      setQuantity(1);
      setCouponCode('');
      setCouponDiscount(0);
      setAppliedCouponName('');
      setOrderSuccessData(null);

      if (customerUser) {
        setName(customerUser.name || '');
        setPhone(customerUser.phone || '');
        setAddress(customerUser.address || '');
      }
    }
  }, [product, customerUser]);

  if (!product) return null;

  const activePrice = selectedVariant ? selectedVariant.price : product.price;
  const itemSubtotal = activePrice * quantity;

  const shippingFee =
    itemSubtotal >= storeSettings.freeDeliveryThreshold
      ? 0
      : deliveryArea === 'inside_dhaka'
      ? storeSettings.deliveryChargeInsideDhaka
      : storeSettings.deliveryChargeOutsideDhaka;

  const grandTotal = Math.max(0, itemSubtotal - couponDiscount + shippingFee);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await api.validateCoupon(couponCode, itemSubtotal);
      if (res.valid) {
        setCouponDiscount(res.discount);
        setAppliedCouponName(res.coupon?.code || couponCode.toUpperCase());
        addToast(res.message, 'success');
      }
    } catch (e: any) {
      addToast(e.message || 'অবৈধ কুপন কোড', 'error');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
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
          city: deliveryArea === 'inside_dhaka' ? 'Dhaka' : district,
        },
        items: [
          {
            productId: product.id,
            variantId: selectedVariant?.id,
            nameBn: product.nameBn,
            nameEn: product.nameEn,
            price: activePrice,
            quantity,
            weight: selectedVariant ? selectedVariant.weight : product.weight,
            image: product.mainImage,
            sku: selectedVariant ? selectedVariant.sku : product.sku,
          },
        ],
        subtotal: itemSubtotal,
        discount: couponDiscount,
        couponCode: appliedCouponName || undefined,
        shippingFee,
        total: grandTotal,
        paymentMethod,
        paymentTransactionId: trxId || undefined,
        notes: customerNote,
      };

      const res = await api.createOrder(orderPayload);
      if (res.success && res.order) {
        setOrderSuccessData(res.order);
        customerLogin(phone.trim(), name.trim());
        addToast(
          language === 'bn'
            ? 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!'
            : 'Your order has been placed successfully!',
          'success'
        );
      }
    } catch (e: any) {
      addToast(e.message || 'অর্ডার করতে সমস্যা হয়েছে, আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#004d1a] text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-amber-300" />
            <h3 className="font-bold text-base sm:text-lg">
              {language === 'bn' ? 'দ্রুত অর্ডার করুন (ক্যাশ অন ডেলিভারি)' : 'Quick 1-Click Order'}
            </h3>
          </div>
          <button
            onClick={() => setQuickOrderProduct(null)}
            className="p-1 hover:bg-white/15 rounded-md transition-colors text-white cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          {orderSuccessData ? (
            /* Order Success View */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-[#004d1a] rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-xl font-bold text-gray-900">
                {language === 'bn' ? 'ধন্যবাদ! আপনার অর্ডারটি নিশ্চিত হয়েছে' : 'Thank You! Order Confirmed'}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                {language === 'bn'
                  ? 'আমাদের কাস্টমার কেয়ার প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন।'
                  : 'Our customer support representative will call you shortly to confirm.'}
              </p>

              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-w-sm mx-auto text-left space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">{language === 'bn' ? 'অর্ডার নম্বর:' : 'Order Number:'}</span>
                  <span className="font-bold text-[#004d1a]">{orderSuccessData.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{language === 'bn' ? 'মোট মূল্য:' : 'Total Amount:'}</span>
                  <span className="font-bold text-gray-900">৳{orderSuccessData.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{language === 'bn' ? 'পেমেন্ট পদ্ধতি:' : 'Payment:'}</span>
                  <span className="font-medium uppercase">{orderSuccessData.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{language === 'bn' ? 'ডেলিভারি ঠিকানা:' : 'Address:'}</span>
                  <span className="font-medium text-right max-w-[180px] truncate">{orderSuccessData.customer.address}</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <button
                  onClick={() => {
                    setQuickOrderProduct(null);
                    setCurrentView('track-order');
                  }}
                  className="bg-[#004d1a] hover:bg-[#003612] text-white px-5 py-2 rounded-md font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'অর্ডার ট্র্যাক করুন' : 'Track Order'}
                </button>
                <button
                  onClick={() => setQuickOrderProduct(null)}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-700 px-5 py-2 rounded-md font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {language === 'bn' ? 'আরো কেনাকাটা করুন' : 'Continue Shopping'}
                </button>
              </div>
            </div>
          ) : (
            /* Order Form View */
            <form onSubmit={handleSubmitOrder} className="space-y-4">
              {/* Product Info Strip */}
              <div className="flex items-center gap-3 p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                <img
                  src={product.mainImage}
                  alt={product.nameEn}
                  className="w-16 h-16 object-contain rounded bg-white p-1 border border-gray-200 shrink-0"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/products/pureghor_blackseed_honey_1787810945841.jpg';
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs sm:text-sm text-gray-900 truncate">
                    {language === 'bn' ? product.nameBn : product.nameEn}
                  </h4>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-extrabold text-sm sm:text-base text-[#004d1a]">
                      ৳{activePrice}
                    </span>
                    {product.compareAtPrice && product.compareAtPrice > activePrice && (
                      <span className="text-xs text-gray-400 line-through">৳{product.compareAtPrice}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Variant Selector if available */}
              {product.variants && product.variants.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {language === 'bn' ? 'প্যাকেজ / ওজন নির্বাচন করুন:' : 'Select Size / Variant:'}
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {product.variants.map(variant => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-2 rounded-md border text-left text-xs transition-all cursor-pointer ${
                            isSelected
                              ? 'border-[#004d1a] bg-[#004d1a]/10 text-[#004d1a] font-bold ring-1 ring-[#004d1a]'
                              : 'border-gray-200 hover:border-gray-300 text-gray-700'
                          }`}
                        >
                          <div className="font-semibold">{variant.weight}</div>
                          <div className="text-[11px] text-gray-500 font-bold">৳{variant.price}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between py-1">
                <span className="text-xs font-bold text-gray-700">
                  {language === 'bn' ? 'পরিমাণ (Quantity):' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1 text-xs sm:text-sm font-bold text-gray-800">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Shipping Information Fields */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <h5 className="text-xs font-bold text-[#004d1a] uppercase tracking-wider">
                  {language === 'bn' ? 'ডেলিভারি তথ্য দিন' : 'Shipping Information'}
                </h5>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {language === 'bn' ? 'আপনার নাম *' : 'Full Name *'}
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder={language === 'bn' ? 'আপনার সম্পূর্ণ নাম লিখুন' : 'Enter your full name'}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#004d1a]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {language === 'bn' ? 'মোবাইল নম্বর (১১ ডিজিট) *' : 'Mobile Number (11 digits) *'}
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="017XXXXXXXX"
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#004d1a]"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {language === 'bn' ? 'সম্পূর্ণ ঠিকানা (বাসা/রোড/এলাকা) *' : 'Full Delivery Address *'}
                  </label>
                  <div className="relative">
                    <MapPin size={15} className="absolute left-3 top-3 text-gray-400" />
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder={
                        language === 'bn'
                          ? 'বাসা নং, রোড নং, এলাকা, থানা ও জেলা উল্লেখ করুন'
                          : 'House, Road, Area, Thana and District'
                      }
                      className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:border-[#004d1a]"
                    />
                  </div>
                </div>

                {/* Delivery Zone Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {language === 'bn' ? 'ডেলিভারি এলাকা নির্বাচন করুন:' : 'Delivery Location:'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDeliveryArea('inside_dhaka')}
                      className={`p-2.5 rounded-md border text-left text-xs transition-colors cursor-pointer ${
                        deliveryArea === 'inside_dhaka'
                          ? 'border-[#004d1a] bg-emerald-50 text-[#004d1a] font-bold'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{language === 'bn' ? 'ঢাকার ভেতরে' : 'Inside Dhaka'}</div>
                      <div className="text-[11px] text-gray-500">৳{storeSettings.deliveryChargeInsideDhaka}</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDeliveryArea('outside_dhaka')}
                      className={`p-2.5 rounded-md border text-left text-xs transition-colors cursor-pointer ${
                        deliveryArea === 'outside_dhaka'
                          ? 'border-[#004d1a] bg-emerald-50 text-[#004d1a] font-bold'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="font-semibold">{language === 'bn' ? 'ঢাকার বাইরে' : 'Outside Dhaka'}</div>
                      <div className="text-[11px] text-gray-500">৳{storeSettings.deliveryChargeOutsideDhaka}</div>
                    </button>
                  </div>
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {language === 'bn' ? 'পেমেন্ট মেথড:' : 'Payment Method:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2 rounded-md border text-center text-xs transition-colors cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'border-[#004d1a] bg-emerald-50 text-[#004d1a] font-bold'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      {language === 'bn' ? 'ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-2 rounded-md border text-center text-xs transition-colors cursor-pointer ${
                        paymentMethod === 'bkash'
                          ? 'border-[#cc3366] bg-pink-50 text-[#cc3366] font-bold'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      বিকাশ (bKash)
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-2 rounded-md border text-center text-xs transition-colors cursor-pointer ${
                        paymentMethod === 'nagad'
                          ? 'border-amber-600 bg-amber-50 text-amber-700 font-bold'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      নগদ (Nagad)
                    </button>
                  </div>

                  {paymentMethod !== 'cod' && (
                    <div className="mt-2 p-2.5 bg-gray-50 border border-gray-200 rounded text-xs space-y-1">
                      <p className="font-semibold text-gray-800">
                        {paymentMethod === 'bkash' ? `bKash Personal: ${storeSettings.bkashNumber}` : `Nagad Personal: ${storeSettings.nagadNumber}`}
                      </p>
                      <p className="text-gray-500 text-[11px]">
                        Send Money করে নিচে ট্রানজেকশন আইডি দিন (অথবা ডেলিভারির সময় ক্যাশ দিন)।
                      </p>
                      <input
                        type="text"
                        value={trxId}
                        onChange={e => setTrxId(e.target.value)}
                        placeholder="TrxID (ঐচ্ছিক)"
                        className="w-full px-2.5 py-1 text-xs border border-gray-300 rounded focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Coupon Code Strip */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    placeholder={language === 'bn' ? 'কুপন কোড (যেমন: PURE10)' : 'Coupon code (e.g. PURE10)'}
                    className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-xs uppercase focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-gray-800 hover:bg-black text-white px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer"
                  >
                    {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                  </button>
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="bg-gray-50 rounded-lg p-3.5 space-y-1.5 text-xs text-gray-700 border border-gray-200">
                <div className="flex justify-between">
                  <span>{language === 'bn' ? 'পণ্যের মোট মূল্য:' : 'Subtotal:'}</span>
                  <span className="font-semibold">৳{itemSubtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{language === 'bn' ? 'কুপন ছাড়:' : 'Coupon Discount:'}</span>
                    <span>-৳{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Delivery Charge:'}</span>
                  <span className="font-semibold">{shippingFee === 0 ? (language === 'bn' ? 'ফ্রি' : 'FREE') : `৳${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#004d1a] pt-1.5 border-t border-gray-200">
                  <span>{language === 'bn' ? 'সর্বমোট প্রদেয়:' : 'Grand Total:'}</span>
                  <span>৳{grandTotal}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#004d1a] hover:bg-[#003612] disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded-lg text-sm sm:text-base transition-all duration-150 flex items-center justify-center gap-2 shadow hover:shadow-md cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{language === 'bn' ? 'অর্ডার প্রসেস হচ্ছে...' : 'Processing Order...'}</span>
                ) : (
                  <>
                    <ShieldCheck size={18} />
                    <span>{language === 'bn' ? 'অর্ডার কনফার্ম করুন (Confirm Order)' : 'Confirm Order'}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
