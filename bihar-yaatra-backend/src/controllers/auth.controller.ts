import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Helper to set cookies
const setAuthCookies = (res: Response, access_token: string, refresh_token: string) => {
  res.cookie('access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 * 1000 // 1 hour (Default Supabase expiry)
  });

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role = 'traveller' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role }
      }
    });

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ 
        message: 'Registration successful. Please check your email for verification.',
        user: data.user 
    });
  } catch (error: any) {
    console.error('Register error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    setAuthCookies(res, data.session.access_token, data.session.refresh_token);

    return res.status(200).json({
      message: 'Login successful',
      user: data.user
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    const { data, error } = await supabase.auth.refreshSession({
        refresh_token: refreshToken
    });

    if (error || !data.session) {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    setAuthCookies(res, data.session.access_token, data.session.refresh_token);

    return res.status(200).json({ message: 'Tokens refreshed' });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    await supabase.auth.signOut();
    
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    
    return res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return res.status(500).json({ error: 'Internal server error during logout' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
