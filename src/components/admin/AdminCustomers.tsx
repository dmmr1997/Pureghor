import React, { useState, useEffect } from 'react';
import { Search, Phone, Mail, MapPin, User, ShoppingBag } from 'lucide-react';
import { Customer } from '../../types';
import { api } from '../../services/api';

export const AdminCustomers: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setLoading(true);
    api.getCustomers(searchQuery)
      .then(res => setCustomers(res.customers))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchQuery]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">গ্রাহক তালিকা (Customers)</h1>
        <p className="text-xs text-slate-400 mt-0.5">
          সকল নিবন্ধিত ও অর্ডারকারী গ্রাহকদের তথ্য, মোট অর্ডার এবং অর্জিত রাজস্ব দেখুন।
        </p>
      </div>

      {/* Search */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="নাম বা মোবাইল নম্বর দিয়ে গ্রাহক খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="p-3.5">গ্রাহক</th>
                <th className="p-3.5">মোবাইল</th>
                <th className="p-3.5">ঠিকানা</th>
                <th className="p-3.5">জেলা</th>
                <th className="p-3.5">মোট অর্ডার</th>
                <th className="p-3.5">সর্বমোট ক্রয় (৳)</th>
                <th className="p-3.5 text-right">যোগাযোগ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    লোড হচ্ছে...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    কোনো গ্রাহক পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                customers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="p-3.5 flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-emerald-600/20 text-emerald-400 font-bold flex items-center justify-center">
                        {c.name.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-200">{c.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400">{c.phone}</td>
                    <td className="p-3.5 max-w-[200px] truncate text-slate-300" title={c.address}>
                      {c.address || '-'}
                    </td>
                    <td className="p-3.5 text-slate-400">{c.district || 'Dhaka'}</td>
                    <td className="p-3.5 font-bold text-slate-200">{c.totalOrders || 0} টি</td>
                    <td className="p-3.5 font-extrabold text-emerald-400">৳{c.totalSpent || 0}</td>
                    <td className="p-3.5 text-right">
                      <a
                        href={`tel:${c.phone}`}
                        className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-emerald-400 inline-flex items-center gap-1 font-semibold"
                      >
                        <Phone size={13} />
                        <span>কল</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
