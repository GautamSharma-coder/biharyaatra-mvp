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

    // Sign up with Supabase using admin to bypass email verification for MVP
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone, role }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({
      message: 'Registration successful. You can now log in.',
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
      console.error('Supabase Login Error Details:', error, 'Session:', !!data.session);
      return res.status(401).json({ error: error?.message || 'Invalid email or password' });
    }

    setAuthCookies(res, data.session.access_token, data.session.refresh_token);

    // Fetch user profile from the public.users table (which has roles, avatar_url, etc.)
    const userId = data.user.id;
    let { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    // If profile is missing, trigger self-healing sync directly during login
    if (profileError || !userProfile) {
      console.log(`Profile not found in public.users for user ${userId} on login. Attempting self-healing sync...`);
      const name = data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User';
      const role = data.user.app_metadata?.role || data.user.user_metadata?.role || 'traveller';
      const phone = data.user.user_metadata?.phone || null;

      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          name,
          email: data.user.email,
          phone,
          role
        }])
        .select()
        .single();

      if (!insertError && newProfile) {
        console.log(`Self-healing sync successful during login for user ${userId}!`);
        userProfile = newProfile;
      } else {
        console.error('Failed self-healing insert on login:', insertError);
      }
    }

    return res.status(200).json({
      message: 'Login successful',
      user: userProfile || {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || 'Traveler',
        role: data.user.user_metadata?.role || 'traveller'
      }
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

    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !user) {
      console.log(`Profile not found in public.users for user ${userId}. Attempting self-healing sync...`);

      let token = req.cookies?.access_token;
      if (!token && req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }

      if (token) {
        const { data: { user: authUser } } = await supabase.auth.getUser(token);
        if (authUser) {
          const name = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User';
          const role = authUser.app_metadata?.role || authUser.user_metadata?.role || 'traveller';
          const phone = authUser.user_metadata?.phone || null;

          // Insert the missing profile row dynamically
          const { data: newUser, error: insertError } = await supabase
            .from('users')
            .insert([{
              id: userId,
              name,
              email: authUser.email,
              phone,
              role
            }])
            .select()
            .single();

          if (!insertError && newUser) {
            console.log(`Self-healing sync successful for user ${userId}!`);
            user = newUser;
          } else {
            console.error('Failed self-healing insert:', insertError);
          }
        }
      }
    }

    if (!user) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    return res.status(200).json({ user });
  } catch (error: any) {
    console.error('getMe error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMe = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { name, phone, avatar_url } = req.body;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        name,
        email: req.user?.email || '',
        phone: phone || null,
        role: req.user?.role || 'traveller',
        avatar_url: avatar_url || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Also synchronize user_metadata in Supabase Auth
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { name, phone }
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.error('updateMe error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};
