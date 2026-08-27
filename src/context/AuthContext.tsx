import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AdminUser, CustomerUser } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  // Admin Auth
  adminUser: AdminUser | null;
  isAdminLoggedIn: boolean;
  adminLogin: (email: string, pass: string) => Promise<boolean>;
  adminLogout: () => void;
  // Customer Auth
  customerUser: CustomerUser | null;
  isCustomerLoggedIn: boolean;
  customerLogin: (phone: string, name?: string) => void;
  customerLogout: () => void;
  updateCustomerProfile: (data: Partial<CustomerUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(() => {
    try {
      const saved = localStorage.getItem('kb_admin');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('kb_customer');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (adminUser) {
      localStorage.setItem('kb_admin', JSON.stringify(adminUser));
    } else {
      localStorage.removeItem('kb_admin');
    }
  }, [adminUser]);

  useEffect(() => {
    if (customerUser) {
      localStorage.setItem('kb_customer', JSON.stringify(customerUser));
    } else {
      localStorage.removeItem('kb_customer');
    }
  }, [customerUser]);

  const adminLogin = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.adminLogin(email, pass);
      if (res.success && res.admin) {
        setAdminUser(res.admin);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const adminLogout = () => {
    setAdminUser(null);
  };

  const customerLogin = (phone: string, name?: string) => {
    const user: CustomerUser = {
      id: `cust-${Date.now()}`,
      name: name || 'সম্মানিত গ্রাহক (Valued Customer)',
      phone,
      ordersCount: 1,
      totalSpent: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    setCustomerUser(user);
  };

  const customerLogout = () => {
    setCustomerUser(null);
  };

  const updateCustomerProfile = (data: Partial<CustomerUser>) => {
    if (customerUser) {
      setCustomerUser({ ...customerUser, ...data });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        adminUser,
        isAdminLoggedIn: !!adminUser,
        adminLogin,
        adminLogout,
        customerUser,
        isCustomerLoggedIn: !!customerUser,
        customerLogin,
        customerLogout,
        updateCustomerProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
