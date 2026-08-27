import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import { User, Phone, Package, MapPin, LogOut, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { Order } from '../../types';
import { OrderStatusBadge } from '../common/Badge';

export const CustomerAccountView: React.FC = () => {
  const { language, setCurrentView, addToast } = useStore();
  const { customerUser, isCustomerLoggedIn, customerLogin, customerLogout, updateCustomerProfile } = useAuth();

  const [inputPhone, setInputPhone] = useState('');
  const [inputName, setInputName] = useState('');
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (customerUser?.phone) {
      setLoadingOrders(true);
      api.getOrders({ phone: customerUser.phone })
        .then(res => setCustomerOrders(res.orders))
        .catch(console.error)
        .finally(() => setLoadingOrders(false));
    }
  }, [customerUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPhone.trim() || inputPhone.replace(/[^0-9]/g, '').length < 11) {
      addToast(language === 'bn' ? 'সঠিক ১১ ডিজিটের ফোন নম্বর দিন' : 'Enter valid phone number', 'error');
      return;
    }
    customerLogin(inputPhone.trim(), inputName.trim() || undefined);
    addToast(language === 'bn' ? 'লগইন সফল হয়েছে!' : 'Logged in successfully!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          {language === 'bn' ? 'আমার একাউন্ট' : 'My Account'}
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          {language === 'bn'
            ? 'আপনার প্রোফাইল এবং অতীতের সকল অর্ডারের বিস্তারিত তথ্য দেখুন।'
            : 'View your profile and past purchase history.'}
        </p>
      </div>

      {!isCustomerLoggedIn ? (
        /* Simple Customer Login */
        <div className="max-w-md mx-auto bg-white rounded-xl border border-gray-200 p-6 sm:p-8 space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#004d1a] flex items-center justify-center mx-auto">
            <User size={24} />
          </div>

          <div className="text-center">
            <h3 className="font-bold text-lg text-gray-900">
              {language === 'bn' ? 'গ্রাহক লগইন' : 'Customer Sign In'}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {language === 'bn' ? 'আপনার মোবাইল নম্বর দিয়ে সহজেই প্রবেশ করুন' : 'Login easily with your mobile number'}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
              </label>
              <input
                type="tel"
                required
                value={inputPhone}
                onChange={e => setInputPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#004d1a]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {language === 'bn' ? 'আপনার নাম (ঐচ্ছিক)' : 'Your Name (optional)'}
              </label>
              <input
                type="text"
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: মোহাম্মদ রাসেল' : 'e.g. John Doe'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:border-[#004d1a]"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#004d1a] hover:bg-[#003612] text-white font-bold py-2.5 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer"
            >
              {language === 'bn' ? 'লগইন করুন' : 'Sign In'}
            </button>
          </form>
        </div>
      ) : (
        /* Logged In Dashboard */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Profile Card (4 cols) */}
          <div className="md:col-span-4 bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-xs h-fit">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#004d1a] text-white flex items-center justify-center font-bold text-lg">
                {customerUser?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base text-gray-900">{customerUser?.name}</h3>
                <p className="text-xs text-gray-500">{customerUser?.phone}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-100 space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'মোট অর্ডার:' : 'Total Orders:'}</span>
                <span className="font-bold text-gray-900">{customerOrders.length}</span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'মোট খরচ:' : 'Total Spent:'}</span>
                <span className="font-bold text-[#004d1a]">
                  ৳{customerOrders.reduce((sum, o) => sum + o.total, 0)}
                </span>
              </div>
            </div>

            <button
              onClick={customerLogout}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
            </button>
          </div>

          {/* Orders History (8 cols) */}
          <div className="md:col-span-8 bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-base text-gray-900 pb-2 border-b border-gray-100 flex items-center gap-2">
              <Package size={18} className="text-[#004d1a]" />
              <span>{language === 'bn' ? 'আপনার অতীতের অর্ডারসমূহ' : 'Order History'}</span>
            </h3>

            {loadingOrders ? (
              <p className="text-xs text-gray-400 py-4">{language === 'bn' ? 'অর্ডার লোড হচ্ছে...' : 'Loading orders...'}</p>
            ) : customerOrders.length === 0 ? (
              <div className="text-center py-8 space-y-2">
                <ShoppingBag size={32} className="text-gray-300 mx-auto" />
                <p className="text-xs text-gray-500">
                  {language === 'bn' ? 'আপনার কোনো পূর্ববর্তী অর্ডার নেই।' : 'You have no past orders.'}
                </p>
                <button
                  onClick={() => setCurrentView('catalog')}
                  className="bg-[#004d1a] text-white px-4 py-2 rounded text-xs font-semibold cursor-pointer"
                >
                  {language === 'bn' ? 'কেনাকাটা শুরু করুন' : 'Shop Now'}
                </button>
              </div>
            ) : (
              <div className="space-y-3 divide-y divide-gray-100">
                {customerOrders.map(order => (
                  <div key={order.id} className="pt-3 first:pt-0 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-gray-900">{order.orderNumber}</span>
                        <span className="text-gray-400 ml-2">
                          {new Date(order.createdAt).toLocaleDateString('bn-BD')}
                        </span>
                      </div>
                      <OrderStatusBadge status={order.orderStatus} lang={language} />
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{order.items.length} টি পণ্য • ৳{order.total}</span>
                      <button
                        onClick={() => setCurrentView('track-order')}
                        className="text-[#004d1a] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>ট্র্যাক করুন</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
