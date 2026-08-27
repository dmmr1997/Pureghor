import React from 'react';
import { Order } from '../../types';
import { useStore } from '../../context/StoreContext';
import { PureGhorLogo } from '../common/PureGhorLogo';
import { X, Printer, ShieldCheck } from 'lucide-react';

interface AdminInvoiceModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminInvoiceModal: React.FC<AdminInvoiceModalProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  const { storeSettings } = useStore();

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="relative bg-white text-gray-900 rounded-xl shadow-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden">
        {/* Controls Bar (Hidden during print) */}
        <div className="p-3 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <span>ইনভয়েস প্রিভিউ (#{order.orderNumber})</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer size={14} />
              <span>প্রিন্ট করুন (Print Invoice)</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 overflow-y-auto flex-1 space-y-6 text-xs bg-white" id="printable-invoice">
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-[#004e1c] pb-6">
            <div>
              <PureGhorLogo size="md" showTagline={false} />
              <p className="text-gray-600 text-[11px] font-medium mt-1">
                ১০০% খাঁটি ও প্রাকৃতিক অর্গানিক পণ্যের নির্ভরযোগ্য প্রতিষ্ঠান
              </p>
              <p className="text-gray-600 text-[11px] mt-1">
                হটলাইন: {storeSettings.phonePrimary} | {storeSettings.email}
              </p>
              <p className="text-gray-500 text-[11px]">
                ওয়েবসাইট: www.pureghor.com
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="bg-emerald-100 text-[#004d1a] font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                INVOICE / বিল
              </span>
              <p className="font-extrabold text-gray-800 text-sm mt-1.5">
                #{order.orderNumber}
              </p>
              <p className="text-gray-500 text-[11px]">
                তারিখ: {new Date(order.createdAt).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <p className="text-gray-500 text-[11px] uppercase font-semibold">
                পেমেন্ট: {order.paymentMethod} ({order.paymentStatus})
              </p>
            </div>
          </div>

          {/* Customer & Shipping Details */}
          <div className="grid grid-cols-2 gap-6 bg-emerald-50/40 p-4 rounded-lg border border-emerald-100">
            <div>
              <h4 className="font-bold text-gray-800 text-xs mb-1 uppercase text-[#004d1a]">গ্রাহকের বিবরণ:</h4>
              <p className="font-bold text-gray-900 text-sm">{order.customer.name}</p>
              <p className="text-gray-700 font-semibold">{order.customer.phone}</p>
              {order.customer.email && <p className="text-gray-500 text-[11px]">{order.customer.email}</p>}
            </div>

            <div>
              <h4 className="font-bold text-gray-800 text-xs mb-1 uppercase text-[#004d1a]">ডেলিভারি ঠিকানা:</h4>
              <p className="text-gray-800 leading-relaxed font-medium">{order.customer.address}</p>
              <p className="text-gray-600 text-[11px]">জেলা: {order.customer.district || 'Dhaka'}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left text-xs border border-gray-200">
              <thead className="bg-gray-100 text-gray-700 font-bold border-b border-gray-200">
                <tr>
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">পণ্যের বিবরণ</th>
                  <th className="p-2.5">ওজন / সাইজ</th>
                  <th className="p-2.5 text-right">একক মূল্য</th>
                  <th className="p-2.5 text-center">পরিমাণ</th>
                  <th className="p-2.5 text-right">মোট (৳)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 text-gray-500">{idx + 1}</td>
                    <td className="p-2.5 font-bold text-gray-800">
                      {item.nameBn}
                      <span className="block font-normal text-gray-500 text-[11px]">{item.nameEn}</span>
                    </td>
                    <td className="p-2.5 text-gray-600">{item.weight || '-'}</td>
                    <td className="p-2.5 text-right font-medium">৳{item.price}</td>
                    <td className="p-2.5 text-center font-bold">{item.quantity}</td>
                    <td className="p-2.5 text-right font-bold text-gray-900">৳{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 bg-gray-50 p-3.5 rounded-lg border border-gray-200 text-xs">
              <div className="flex justify-between text-gray-600">
                <span>সাবটোটাল:</span>
                <span className="font-semibold">৳{order.subtotal}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>ছাড় ({order.couponCode || 'কুপন'}):</span>
                  <span>-৳{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-semibold">৳{order.shippingFee}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-[#004d1a] pt-2 border-t border-gray-300">
                <span>সর্বমোট পরিশোধযোগ্য:</span>
                <span>৳{order.total}</span>
              </div>
            </div>
          </div>

          {/* Footer & Signature lines */}
          <div className="pt-8 border-t border-gray-200 flex justify-between items-end text-[11px] text-gray-500">
            <div className="space-y-1">
              <p className="font-bold text-gray-700">খাঁটি ভাইয়ের সাথে কেনাকাটা করার জন্য ধন্যবাদ!</p>
              <p>পণ্য গ্রহণের সময় অনুগ্রহ করে দেখে বুঝে নিন।</p>
            </div>
            <div className="text-center">
              <div className="w-32 border-b border-gray-400 mb-1" />
              <span>কর্তৃপক্ষের স্বাক্ষর</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
