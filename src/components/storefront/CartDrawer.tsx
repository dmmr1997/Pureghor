import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Plus, Minus } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartCount,
    storeSettings,
    language,
    setCurrentView,
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCoupon,
  } = useStore();

  const [inputCoupon, setInputCoupon] = useState('');

  if (!isCartDrawerOpen) return null;

  // Free shipping progress calculation
  const freeThreshold = storeSettings.freeDeliveryThreshold || 1500;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeThreshold) * 100));
  const remainingForFree = Math.max(0, freeThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Slide Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-4 bg-[#004d1a] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-amber-300" />
              <h3 className="font-bold text-base sm:text-lg">
                {language === 'bn' ? `আপনার শপিং কার্ট (${cartCount})` : `Shopping Cart (${cartCount})`}
              </h3>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1 hover:bg-white/15 rounded text-white transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Meter Bar */}
          <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 text-xs">
            {remainingForFree > 0 ? (
              <p className="text-gray-700 font-medium">
                {language === 'bn' ? (
                  <>
                    আর মাত্র <span className="font-bold text-[#004d1a]">৳{remainingForFree}</span> এর কেনাকাটা করলেই{' '}
                    <span className="font-bold text-[#004d1a]">ফ্রি ডেলিভারি!</span>
                  </>
                ) : (
                  <>
                    Add <span className="font-bold text-[#004d1a]">৳{remainingForFree}</span> more for{' '}
                    <span className="font-bold text-[#004d1a]">FREE SHIPPING!</span>
                  </>
                )}
              </p>
            ) : (
              <p className="text-[#004d1a] font-bold flex items-center gap-1">
                <ShieldCheck size={15} />
                <span>
                  {language === 'bn'
                    ? 'অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন।'
                    : 'Congratulations! You qualify for Free Delivery.'}
                </span>
              </p>
            )}
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-[#004d1a] h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-gray-100">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                  <ShoppingBag size={32} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm sm:text-base">
                  {language === 'bn' ? 'আপনার কার্ট বর্তমানে খালি' : 'Your cart is empty'}
                </h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  {language === 'bn'
                    ? 'আমাদের খাঁটি অর্গানিক পণ্যগুলো দেখে কার্টে যোগ করুন।'
                    : 'Explore our pure organic catalog and add wholesome products to your cart.'}
                </p>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    setCurrentView('catalog');
                  }}
                  className="bg-[#004d1a] hover:bg-[#003612] text-white px-5 py-2 rounded text-xs font-semibold mt-2 cursor-pointer shadow-xs"
                >
                  {language === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Browse Products'}
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={`${item.productId}-${item.variantId || 'std'}`} className="pt-3 flex gap-3 items-center">
                  <img
                    src={item.image}
                    alt={item.nameEn}
                    className="w-16 h-16 object-contain rounded bg-gray-50 p-1 border border-gray-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-xs sm:text-sm text-gray-800 truncate">
                      {language === 'bn' ? item.nameBn : item.nameEn}
                    </h5>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {item.weight && <span>{item.weight} • </span>}
                      <span>৳{item.price}</span>
                    </div>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-gray-300 rounded overflow-hidden bg-white">
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-3 py-0.5 text-xs font-bold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                          className="px-2 py-0.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-xs sm:text-sm text-[#004d1a]">
                      ৳{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-3">
              {/* Coupon Code Input */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded text-xs">
                  <span className="font-semibold">
                    কুপন ({appliedCoupon.code}): -৳{couponDiscount}
                  </span>
                  <button onClick={removeCoupon} className="text-rose-600 font-bold hover:underline">
                    বাতিল
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
                    onClick={() => {
                      if (inputCoupon) applyCouponCode(inputCoupon);
                    }}
                    className="bg-gray-800 hover:bg-black text-white px-3 py-1.5 rounded text-xs font-semibold cursor-pointer"
                  >
                    {language === 'bn' ? 'প্রয়োগ' : 'Apply'}
                  </button>
                </div>
              )}

              {/* Subtotal */}
              <div className="space-y-1 text-xs sm:text-sm text-gray-700">
                <div className="flex justify-between font-semibold">
                  <span>{language === 'bn' ? 'মোট সাবটোটাল:' : 'Subtotal:'}</span>
                  <span className="text-gray-900">৳{cartSubtotal}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>{language === 'bn' ? 'কুপন ছাড়:' : 'Discount:'}</span>
                    <span>-৳{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Shipping:'}</span>
                  <span>
                    {remainingForFree === 0
                      ? language === 'bn'
                        ? 'ফ্রি'
                        : 'FREE'
                      : language === 'bn'
                      ? 'পরবর্তী ধাপে হিসেব হবে'
                      : 'Calculated at checkout'}
                  </span>
                </div>
              </div>

              {/* Direct Checkout Button */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  setCurrentView('checkout');
                }}
                className="w-full bg-[#004d1a] hover:bg-[#003612] text-white font-bold py-3 px-4 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 shadow hover:shadow-md transition-all cursor-pointer"
              >
                <span>{language === 'bn' ? 'চেকআউট ও অর্ডার কনফার্ম করুন' : 'Proceed to Checkout'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
