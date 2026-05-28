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
    } catch (err) {
      console.error('Refresh user error:', err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', data);
      const userObj = res.data.user;
      setUser(userObj);
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
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: Record<string, unknown>) => {
    setLoading(true);
    try {
      await apiClient.post('/auth/register', data);
      // After register, the user still needs to login or we log them in automatically 
      // depends on backend. My backend doesn't set cookies on register, so we redirect to login.
      router.push('/auth/login?registered=true');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      throw error.response?.data?.error || 'Registration failed';
    } finally {
      setLoading(false);
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

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
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
