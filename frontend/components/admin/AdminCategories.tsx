import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Plus, Edit, Trash2, FolderTree, X, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { Category } from '../../types';
import { api } from '../../services/api';
import { uploadImage } from '../../services/imageUpload';

export const AdminCategories: React.FC = () => {
  const { categories, refreshCategories, addToast } = useStore();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [nameBn, setNameBn] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingImage(true);
      const url = await uploadImage(file);
      setImage(url);
      addToast('ক্যাটাগরি ছবি সফলভাবে আপলোড হয়েছে!', 'success');
    } catch (err: any) {
      addToast(err.message || 'ছবি আপলোড করতে সমস্যা হয়েছে', 'error');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setNameBn(cat.nameBn);
      setNameEn(cat.nameEn);
      setSlug(cat.slug);
      setImage(cat.image);
      setDescriptionBn(cat.descriptionBn || '');
    } else {
      setEditingCategory(null);
      setNameBn('');
      setNameEn('');
      setSlug('');
      setImage('https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80');
      setDescriptionBn('');
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameBn.trim()) return;

    try {
      setIsSaving(true);
      const payload: Partial<Category> = {
        nameBn: nameBn.trim(),
        nameEn: nameEn.trim() || nameBn.trim(),
        slug: slug.trim() || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: image.trim(),
        descriptionBn: descriptionBn.trim() || undefined,
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, payload);
        addToast('ক্যাটাগরি আপডেট সম্পন্ন', 'success');
      } else {
        await api.createCategory(payload);
        addToast('নতুন ক্যাটাগরি তৈরি হয়েছে', 'success');
      }

      await refreshCategories();
      setIsModalOpen(false);
    } catch (e: any) {
      addToast(e.message || 'সংরক্ষণ ব্যর্থ হয়েছে', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`আপনি কি "${name}" ক্যাটাগরি মুছে ফেলতে চান?`)) {
      try {
        await api.deleteCategory(id);
        addToast('ক্যাটাগরি মুছে ফেলা হয়েছে', 'info');
        await refreshCategories();
      } catch (e) {
        addToast('মুছে ফেলা সম্ভব হয়নি', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">ক্যাটাগরি ব্যবস্থাপনা (Categories)</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            পণ্যের বিভাগ বা ক্যাটাগরি তৈরি ও সাজান।
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>নতুন ক্যাটাগরি যোগ</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div
            key={cat.id}
            className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={cat.image}
                alt={cat.nameEn}
                className="w-14 h-14 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-slate-100 truncate">{cat.nameBn}</h4>
                <p className="text-xs text-slate-400 truncate">{cat.nameEn}</p>
                <span className="text-[11px] text-emerald-400 font-semibold">{cat.itemCount || 0} টি পণ্য</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-end gap-2 text-xs">
              <button
                onClick={() => handleOpenModal(cat)}
                className="p-1.5 bg-slate-700 hover:bg-slate-600 text-emerald-400 rounded transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleDelete(cat.id, cat.nameBn)}
                className="p-1.5 bg-slate-700 hover:bg-rose-900/60 text-rose-400 rounded transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-lg w-full p-6 text-slate-200 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-slate-100">
                {editingCategory ? 'ক্যাটাগরি সম্পাদনা' : 'নতুন ক্যাটাগরি তৈরি'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">ক্যাটাগরির নাম (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={nameBn}
                  onChange={e => setNameBn(e.target.value)}
                  placeholder="যেমন: খাঁটি ঘি ও মাখন"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category Name (English)</label>
                <input
                  type="text"
                  value={nameEn}
                  onChange={e => setNameEn(e.target.value)}
                  placeholder="e.g. Pure Ghee & Butter"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-semibold text-slate-300">ক্যাটাগরি ছবি (Image) *</label>
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingImage}
                      onClick={() => fileInputRef.current?.click()}
                      className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        isUploadingImage
                          ? 'bg-slate-700 text-slate-400'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      {isUploadingImage ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      <span>{isUploadingImage ? 'আপলোড হচ্ছে...' : 'ছবি আপলোড'}</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    required
                    value={image}
                    onChange={e => setImage(e.target.value)}
                    placeholder="https://... অথবা আপলোড করুন"
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 focus:outline-none text-[11px] font-mono"
                  />
                  {image && (
                    <img
                      src={image}
                      alt="Preview"
                      className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">সংক্ষিপ্ত বিবরণ</label>
                <textarea
                  rows={2}
                  value={descriptionBn}
                  onChange={e => setDescriptionBn(e.target.value)}
                  placeholder="ক্যাটাগরির সংক্ষিপ্ত পরিচিতি..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-colors cursor-pointer"
                >
                  {isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
