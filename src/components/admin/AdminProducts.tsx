import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Search, Filter, Edit, Trash2, CheckCircle2, XCircle, AlertTriangle, Eye } from 'lucide-react';
import { Product } from '../../types';
import { api } from '../../services/api';
import { AdminProductModal } from './AdminProductModal';

export const AdminProducts: React.FC = () => {
  const { products, categories, refreshProducts, addToast, setSelectedProductSlug, setCurrentView } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredProducts = products.filter(p => {
    const matchSearch =
      p.nameBn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const matchStatus = selectedStatus === 'all' || p.status === selectedStatus;
    return matchSearch && matchCat && matchStatus;
  });

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, productData);
      addToast('পণ্য সফলভাবে আপডেট করা হয়েছে', 'success');
    } else {
      await api.createProduct(productData);
      addToast('নতুন পণ্য যুক্ত করা হয়েছে', 'success');
    }
    await refreshProducts();
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (confirm(`আপনি কি "${name}" মুছে ফেলতে চান?`)) {
      try {
        await api.deleteProduct(id);
        addToast('পণ্য মুছে ফেলা হয়েছে', 'info');
        await refreshProducts();
      } catch (e) {
        addToast('মুছে ফেলা সম্ভব হয়নি', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">পণ্য ব্যবস্থাপনা (Products)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            মোট {products.length} টি পণ্য স্টোরে রয়েছে। নতুন পণ্য যোগ বা সম্পাদনা করুন।
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>নতুন পণ্য যোগ করুন</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="নাম বা SKU দিয়ে খুঁজুন..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Category & Status Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">সকল ক্যাটাগরি</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.nameBn}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="flex-1 sm:flex-initial bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none cursor-pointer"
          >
            <option value="all">সকল স্ট্যাটাস</option>
            <option value="active">সক্রিয় (Active)</option>
            <option value="inactive">নিষ্ক্রিয় (Inactive)</option>
            <option value="draft">খসড়া (Draft)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold border-b border-slate-700/80">
              <tr>
                <th className="p-3.5">পণ্য</th>
                <th className="p-3.5">ক্যাটাগরি</th>
                <th className="p-3.5">SKU</th>
                <th className="p-3.5">বিক্রয় মূল্য</th>
                <th className="p-3.5">স্টক</th>
                <th className="p-3.5">স্ট্যাটাস</th>
                <th className="p-3.5 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    কোনো পণ্য খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const isLowStock = product.stock <= (product.lowStockThreshold || 5);
                  return (
                    <tr key={product.id} className="hover:bg-slate-700/30 transition-colors">
                      <td className="p-3.5 flex items-center gap-3">
                        <img
                          src={product.mainImage}
                          alt={product.nameEn}
                          className="w-10 h-10 rounded object-contain bg-white p-0.5 border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-100 truncate max-w-xs">{product.nameBn}</p>
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{product.nameEn}</p>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">{product.categoryNameBn}</td>
                      <td className="p-3.5 text-slate-400 font-mono text-[11px]">{product.sku}</td>
                      <td className="p-3.5 font-bold text-emerald-400">
                        ৳{product.price}
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="ml-1.5 text-[11px] text-slate-500 line-through">
                            ৳{product.compareAtPrice}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                            isLowStock
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/10 text-emerald-400'
                          }`}
                        >
                          {product.stock} পিস
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                            product.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {product.status === 'active' ? 'সক্রিয়' : 'নিষ্ক্রিয়'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => {
                            setSelectedProductSlug(product.slug);
                            setCurrentView('product-details');
                          }}
                          className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-slate-300 transition-colors cursor-pointer"
                          title="View on Storefront"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setIsModalOpen(true);
                          }}
                          className="p-1.5 bg-slate-700 hover:bg-slate-600 rounded text-emerald-400 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.nameBn)}
                          className="p-1.5 bg-slate-700 hover:bg-rose-900/60 rounded text-rose-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Modal */}
      <AdminProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={editingProduct}
        categories={categories}
        onSave={handleSaveProduct}
      />
    </div>
  );
};
