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
  sendEmailOtp: (email: string) => Promise<void>;
  verifyEmailOtp: (email: string, otp: string) => Promise<void>;
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

      // If user needs email verification, redirect to verify-otp page
      if (res.data.needs_email_verification) {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(res.data.email)}`);
        throw res.data.error || 'Email not verified';
      }

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
      const error = err as { response?: { data?: { error?: string; needs_email_verification?: boolean; email?: string } } };

      // Handle email not verified — redirect to verify-otp
      if (error.response?.data?.needs_email_verification) {
        const email = error.response.data.email || '';
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
        throw error.response.data.error || 'Email not verified. Please check your email for the verification code.';
      }

      throw error.response?.data?.error || 'Login failed';
    }
  };

  const register = async (data: Record<string, unknown>) => {
    try {
      const res = await apiClient.post('/auth/register', data);
      const needsVerification = res.data?.needs_email_verification;
      const email = res.data?.email || (data.email as string) || '';

      if (needsVerification) {
        // Redirect to verify-otp page with the email
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
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

  const sendEmailOtp = async (email: string) => {
    try {
      await apiClient.post('/auth/send-email-otp', { email });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      throw error.response?.data?.error || 'Failed to send verification code';
    }
  };

  const verifyEmailOtp = async (email: string, otp: string) => {
    try {
      const res = await apiClient.post('/auth/verify-email-otp', { email, otp });

      if (res.data.verified) {
        // Email verified — redirect to login so user can sign in with password
        router.push('/auth/login?verified=true');
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: string } } };
      throw error.response?.data?.error || 'Failed to verify code';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, sendEmailOtp, verifyEmailOtp }}>
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
