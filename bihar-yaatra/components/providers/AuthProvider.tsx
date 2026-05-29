"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar_url?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: Record<string, unknown>) => Promise<void>;
  register: (data: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  sendOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/auth/me');
      setUser(res.data.user);
    } catch (err: any) {
      if (err.response?.status !== 401) {
        console.error('Refresh user error:', err);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: Record<string, unknown>) => {
    try {
      const res = await apiClient.post('/auth/login', data);
      const userObj = res.data.user;
      setUser(userObj);
      // Small delay to ensure the cookie is set before navigating
      await new Promise(resolve => setTimeout(resolve, 100));
      if (userObj && (userObj.role === 'admin' || userObj.role === 'superadmin')) {
        router.push('/dashboard/admin');
      } else if (userObj && userObj.role === 'provider') {
        router.push('/dashboard/provider/homestay');
      } else {
        router.push('/dashboard/user');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      throw error.response?.data?.error || 'Login failed';
    }
  };

  const register = async (data: Record<string, unknown>) => {
    try {
      const res = await apiClient.post('/auth/register', data);
      const needsVerification = res.data?.needs_email_verification;
      if (needsVerification) {
        // Redirect to login with a message telling user to check email
        router.push('/auth/login?registered=true&verify=true');
      } else {
        router.push('/auth/login?registered=true');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      throw error.response?.data?.error || 'Registration failed';
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await apiClient.post('/auth/logout');
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (phone: string) => {
    try {
      await apiClient.post('/auth/send-otp', { phone });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      throw error.response?.data?.error || 'Failed to send OTP';
    }
  };

  const verifyOtp = async (phone: string, otp: string) => {
    try {
      const res = await apiClient.post('/auth/verify-otp', { phone, otp });
      const userObj = res.data.user;
      setUser(userObj);
      await new Promise(resolve => setTimeout(resolve, 100));
      if (userObj && (userObj.role === 'admin' || userObj.role === 'superadmin')) {
        router.push('/dashboard/admin');
      } else if (userObj && userObj.role === 'provider') {
        router.push('/dashboard/provider/homestay');
      } else {
        router.push('/dashboard/user');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      throw error.response?.data?.error || 'Failed to verify OTP';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, sendOtp, verifyOtp }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
