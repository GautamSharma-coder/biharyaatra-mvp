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
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
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
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (data: any) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/login', data);
      const userObj = res.data.user;
      setUser(userObj);
      if (userObj && (userObj.role === 'admin' || userObj.role === 'superadmin')) {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard/user');
      }
    } catch (err: any) {
      throw err.response?.data?.error || 'Login failed';
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await apiClient.post('/auth/register', data);
      // After register, the user still needs to login or we log them in automatically 
      // depends on backend. My backend doesn't set cookies on register, so we redirect to login.
      router.push('/auth/login?registered=true');
    } catch (err: any) {
      throw err.response?.data?.error || 'Registration failed';
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
