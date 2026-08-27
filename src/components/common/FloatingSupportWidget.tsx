import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Phone, MessageCircle, X, ShoppingBag } from 'lucide-react';

export const FloatingSupportWidget: React.FC = () => {
  const { storeSettings, language, currentView } = useStore();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show in admin view to avoid clutter
  if (currentView === 'admin') return null;

  const phoneClean = (storeSettings.phonePrimary || '01789-454565').replace(/[^0-9+]/g, '');
  const whatsappClean = (storeSettings.whatsappNumber || storeSettings.phonePrimary || '8801789454565').replace(/[^0-9]/g, '');

  const whatsappMessage = encodeURIComponent(
    language === 'bn'
      ? 'আসসালামু আলাইকুম, আমি PureGhor থেকে পণ্য অর্ডার করতে সহায়তা চাই।'
      : 'Hello PureGhor, I would like assistance placing an order.'
  );

  return (
    <aside aria-label="Support contacts" className="fixed bottom-20 md:bottom-6 right-4 z-40 flex flex-col items-end gap-2">
      {/* Expanded Quick Contact Menu */}
      {isOpen && (
        <div className="bg-white rounded-2xl p-4 shadow-2xl border border-emerald-100 w-72 mb-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                PG
              </div>
              <div>
                <h4 className="font-bold text-xs text-gray-900 leading-none">
                  {language === 'bn' ? 'পিউর ঘর হেল্পলাইন' : 'PureGhor Helpline'}
                </h4>
                <span className="text-[10px] text-emerald-600 font-medium">
                  {language === 'bn' ? 'সরাসরি অর্ডারে সহায়তা' : 'Instant Order Support'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="space-y-2 pt-3 text-xs">
            {/* WhatsApp Link */}
            <a
              href={`https://wa.me/${whatsappClean}?text=${whatsappMessage}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200/60 font-semibold transition-all hover:translate-x-0.5"
            >
              <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-xs">
                <MessageCircle size={16} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{language === 'bn' ? 'হোয়াটসঅ্যাপে অর্ডার' : 'WhatsApp Order'}</span>
                <span className="text-[10px] text-emerald-700 font-normal">
                  {language === 'bn' ? 'মেসেজ পাঠিয়ে দ্রুত অর্ডার করুন' : 'Chat & order instantly'}
                </span>
              </div>
            </a>

            {/* Direct Phone Call */}
            <a
              href={`tel:${phoneClean}`}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200 font-semibold transition-all hover:translate-x-0.5"
            >
              <div className="w-8 h-8 rounded-full bg-[#004e1c] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Phone size={15} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold">{language === 'bn' ? 'হটলাইনে কল করুন' : 'Call Hotline'}</span>
                <span className="text-[10px] text-gray-600 font-mono">
                  {storeSettings.phonePrimary || '০১৭৮৯-৪৫৪৫৬৫'}
                </span>
              </div>
            </a>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2 bg-[#004e1c] hover:bg-[#003814] text-white p-3.5 md:px-4 md:py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 cursor-pointer border-2 border-white/20"
        aria-label="Order support helpline"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
        </span>
        <Phone size={18} className="md:hidden" />
        <div className="hidden md:flex items-center gap-2">
          <MessageCircle size={18} className="text-[#25D366]" />
          <span className="font-bold text-xs tracking-wide">
            {language === 'bn' ? 'অর্ডার হেল্পলাইন' : 'Order Support'}
          </span>
        </div>
      </button>
    </aside>
  );
};
