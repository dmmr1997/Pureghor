import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Boxes, Search, Plus, Minus, AlertTriangle, CheckCircle2, History } from 'lucide-react';
import { api } from '../../services/api';
import { Product } from '../../types';

export const AdminInventory: React.FC = () => {
  const { products, refreshProducts, addToast } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('নতুন স্টক গ্রহণ');
  const [isAdjusting, setIsAdjusting] = useState(false);

  const filteredProducts = products.filter(
    p =>
      p.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockUpdate = async (type: 'add' | 'subtract') => {
    if (!adjustingProduct) return;
    try {
      setIsAdjusting(true);
      const qtyChange = type === 'add' ? Number(adjustQuantity) : -Number(adjustQuantity);
      await api.updateStock(adjustingProduct.id, qtyChange, adjustReason);
      addToast('স্টক সফলভাবে সমন্বয় করা হয়েছে', 'success');
      await refreshProducts();
      setAdjustingProduct(null);
    } catch (e: any) {
      addToast(e.message || 'স্টক আপডেট করা যায়নি', 'error');
    } finally {
      setIsAdjusting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">ইনভেন্টরি ও স্টক অডিট (Inventory)</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          সকল পণ্যের বর্তমান স্টক যাচাই করুন, দ্রুত স্টক বাড়ান বা কমান এবং লো-স্টক পর্যবেক্ষণ করুন।
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="পণ্য বা SKU দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="p-3.5">পণ্য</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">বর্তমান স্টক</th>
                <th className="p-3.5">লো-স্টক থ্রেশহোল্ড</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">স্টক সমন্বয় (Action)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredProducts.map(prod => {
                const isLow = prod.stock <= (prod.lowStockThreshold || 5);
                return (
                  <tr key={prod.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3.5 flex items-center gap-3">
                      <img src={prod.mainImage} alt={prod.nameEn} className="w-9 h-9 rounded object-contain bg-white p-0.5" />
                      <div>
                        <p className="font-semibold text-slate-200">{prod.nameBn}</p>
                        <p className="text-[11px] text-slate-400">{prod.nameEn}</p>
                      </div>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{prod.sku}</td>
                    <td className="p-3.5">
                      <span className={`font-black text-sm ${isLow ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {prod.stock} পিস
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400 font-semibold">{prod.lowStockThreshold || 5} পিস</td>
                    <td className="p-3.5">
                      {isLow ? (
                        <span className="flex items-center gap-1 text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded w-fit text-[11px]">
                          <AlertTriangle size={13} />
                          <span>লো-স্টক অ্যালার্ট</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded w-fit text-[11px]">
                          <CheckCircle2 size={13} />
                          <span>পর্যাপ্ত স্টক</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => {
                          setAdjustingProduct(prod);
                          setAdjustQuantity(10);
                          setAdjustReason('নতুন স্টক গ্রহণ');
                        }}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded text-xs transition-colors cursor-pointer"
                      >
                        স্টক আপডেট
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Adjust Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full text-slate-200 space-y-4 shadow-2xl">
            <h3 className="font-bold text-base text-slate-100">
              স্টক সমন্বয়: {adjustingProduct.nameBn}
            </h3>
            <p className="text-xs text-slate-400">
              বর্তমান স্টক: <span className="font-bold text-emerald-400">{adjustingProduct.stock} পিস</span>
            </p>

            <div className="space-y-3 pt-2 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">পরিমাণ (Quantity)</label>
                <input
                  type="number"
                  min={1}
                  value={adjustQuantity}
                  onChange={e => setAdjustQuantity(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">সমন্বয়ের কারণ</label>
                <select
                  value={adjustReason}
                  onChange={e => setAdjustReason(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none cursor-pointer"
                >
                  <option value="নতুন স্টক গ্রহণ">নতুন স্টক গ্রহণ (Restock)</option>
                  <option value="নষ্ট / মেয়াদোত্তীর্ণ বাদ">নষ্ট / ড্যামেজ পণ্য বাদ</option>
                  <option value="ইনভেন্টরি ব্যালেন্স সংশোধন">ইনভেন্টরি ব্যালেন্স সংশোধন</option>
                  <option value="রিটার্ন পণ্য স্টকে যুক্ত">কাস্টমার রিটার্ন যুক্ত</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setAdjustingProduct(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer text-xs"
              >
                বাতিল
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={isAdjusting}
                  onClick={() => handleStockUpdate('subtract')}
                  className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Minus size={14} />
                  <span>স্টক কমান</span>
                </button>
                <button
                  type="button"
                  disabled={isAdjusting}
                  onClick={() => handleStockUpdate('add')}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>স্টক বাড়ান</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
