import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Boxes,
  Tag,
  Users,
  MessageSquare,
  Image,
  Settings,
  RotateCcw,
  ExternalLink,
  LogOut,
  Bell,
  Search,
  Sparkles,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';
import { api } from '../../services/api';
import { PureGhorLogo } from '../common/PureGhorLogo';

export type AdminTab =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'inventory'
  | 'coupons'
  | 'customers'
  | 'reviews'
  | 'banners'
  | 'settings';

interface AdminLayoutProps {
  currentTab: AdminTab;
  setCurrentTab: (tab: AdminTab) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  setCurrentTab,
  children,
}) => {
  const { setCurrentView, addToast, refreshProducts, refreshCategories, refreshSettings } = useStore();
  const { adminUser, adminLogout } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    if (confirm('আপনি কি নিশ্চিত যে ডেমো ডাটা রিসেট করতে চান? এতে সকল পণ্য ও অর্ডার পূর্বাবস্থায় ফিরে আসবে।')) {
      try {
        setIsResetting(true);
        await api.resetDatabase();
        await Promise.all([refreshProducts(), refreshCategories(), refreshSettings()]);
        addToast('ডাটাবেজ সফলভাবে রিসেট সম্পন্ন হয়েছে!', 'success');
        window.location.reload();
      } catch (e) {
        addToast('Reset failed', 'error');
      } finally {
        setIsResetting(false);
      }
    }
  };

  const navItems = [
    { id: 'dashboard' as AdminTab, labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders' as AdminTab, labelBn: 'অর্ডার ও ইনভয়েস', labelEn: 'Orders', icon: ShoppingBag },
    { id: 'products' as AdminTab, labelBn: 'পণ্য ব্যবস্থাপনা', labelEn: 'Products', icon: Package },
    { id: 'inventory' as AdminTab, labelBn: 'ইনভেন্টরি ও স্টক', labelEn: 'Inventory', icon: Boxes },
    { id: 'categories' as AdminTab, labelBn: 'ক্যাটাগরি', labelEn: 'Categories', icon: FolderTree },
    { id: 'coupons' as AdminTab, labelBn: 'কুপন ও অফার', labelEn: 'Coupons', icon: Tag },
    { id: 'customers' as AdminTab, labelBn: 'গ্রাহক তালিকা', labelEn: 'Customers', icon: Users },
    { id: 'reviews' as AdminTab, labelBn: 'রিভিউ অনুমোদন', labelEn: 'Reviews', icon: MessageSquare },
    { id: 'banners' as AdminTab, labelBn: 'ব্যানার ও স্লাইডার', labelEn: 'Banners', icon: Image },
    { id: 'settings' as AdminTab, labelBn: 'দোকানের সেটিংস', labelEn: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <PureGhorLogo lightMode size="sm" showTagline={false} />
          <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-800">Admin</span>
        </div>
        <button
          onClick={() => setCurrentView('home')}
          className="text-xs bg-emerald-700 hover:bg-emerald-600 text-white px-2.5 py-1 rounded flex items-center gap-1 cursor-pointer transition-colors"
        >
          <ExternalLink size={12} />
          <span>দোকান দেখুন</span>
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <PureGhorLogo lightMode size="sm" showTagline={false} />
            <span className="text-[9px] bg-emerald-900/60 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-700/50 uppercase tracking-wider">
              Control Panel
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span>{item.labelBn}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2 bg-slate-950/80">
          {/* Quick Demo Reset */}
          <button
            onClick={handleResetData}
            disabled={isResetting}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <RotateCcw size={14} className={isResetting ? 'animate-spin' : ''} />
            <span>{isResetting ? 'রিসেট হচ্ছে...' : 'ডেমো ডাটা রিসেট'}</span>
          </button>

          {/* Return to Customer Storefront */}
          <button
            onClick={() => setCurrentView('home')}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors cursor-pointer"
          >
            <ExternalLink size={14} />
            <span>ওয়েবসাইটে যান (Storefront)</span>
          </button>

          {/* Admin User Info */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <div className="truncate">
              <p className="font-semibold text-slate-200 text-[11px] truncate">{adminUser?.name || 'Super Admin'}</p>
              <span className="text-[10px] text-emerald-400 uppercase font-bold">Role: {adminUser?.role || 'Admin'}</span>
            </div>
            <button
              onClick={adminLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <main className="flex-1 bg-slate-900 min-h-screen overflow-x-hidden p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};
