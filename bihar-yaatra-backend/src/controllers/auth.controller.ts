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

    // Use signUp so Supabase sends a verification email when 'Confirm email' is enabled
    const { createClient } = require('@supabase/supabase-js');
    const localSupabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await localSupabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role }, // stored in user_metadata
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // If email confirmation is enabled, user won't have a session yet
    const needsConfirmation = !data.session;

    return res.status(201).json({
      message: needsConfirmation
        ? 'Registration successful! Please check your email to verify your account.'
        : 'Registration successful. You can now log in.',
      user: data.user,
      needs_email_verification: needsConfirmation,
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

    const { createClient } = require('@supabase/supabase-js');
    const localSupabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await localSupabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.session) {
      console.error('Supabase Login Error Details:', error, 'Session:', !!data.session);

      // If the email is not confirmed, trigger resending the verification email automatically
      if (error && error.message?.toLowerCase().includes('email not confirmed')) {
        try {
          const { error: resendError } = await localSupabase.auth.resend({
            type: 'signup',
            email
          });

          if (resendError) {
            console.error('Failed to auto-resend verification email:', resendError);
            if (resendError.message?.toLowerCase().includes('security purposes') || 
                resendError.message?.toLowerCase().includes('rate limit') || 
                resendError.status === 429) {
              return res.status(401).json({
                error: 'Email not confirmed. A verification link was recently sent. Please check your inbox (including Spam folder) or wait a minute before requesting another link.'
              });
            }
            return res.status(401).json({
              error: 'Email not confirmed. We tried to resend the verification link, but failed: ' + resendError.message
            });
          }

          return res.status(401).json({
            error: 'Email not confirmed. A new verification link has been sent to your email.'
          });
        } catch (resendCatch: any) {
          console.error('Error during automatic resend attempt:', resendCatch);
        }
      }

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

    const { createClient } = require('@supabase/supabase-js');
    const localSupabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await localSupabase.auth.refreshSession({
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

    // ── MED-4 FIX: Read existing role from DB, never allow user to change it ──
    const { data: existingProfile } = await supabase
      .from('users')
      .select('role, email')
      .eq('id', userId)
      .single();

    const existingRole = existingProfile?.role || 'traveller';
    const existingEmail = existingProfile?.email || req.user?.email || '';

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .upsert({
        id: userId,
        name,
        email: existingEmail,
        phone: phone || null,
        role: existingRole,  // Always use DB role, never client-provided
        avatar_url: avatar_url || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (updateError) {
      throw updateError;
    }

    // Also synchronize user_metadata in Supabase Auth (never sync role here)
    await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { name, phone }
    });

    return res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.error('updateMe error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// ── Admin Endpoints ──

// GET /api/v1/auth/users (List all users — admin/superadmin only)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (error: any) {
    console.error('getAllUsers error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/v1/auth/admin/create (Create user with any role — superadmin only)
export const adminCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role = 'traveller' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Create user via Supabase Admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, phone, role }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Also insert into public.users table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([{
        id: data.user.id,
        name,
        email,
        phone: phone || null,
        role
      }])
      .select()
      .single();

    if (profileError) {
      console.error('Profile insert error:', profileError);
    }

    return res.status(201).json({
      message: `User "${name}" created with role "${role}"`,
      user: profile || { id: data.user.id, name, email, role }
    });
  } catch (error: any) {
    console.error('adminCreateUser error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// PATCH /api/v1/auth/users/:id/role (Change user role — superadmin only)
export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id: paramId } = req.params;
    const id = Array.isArray(paramId) ? paramId[0] : paramId;
    const { role } = req.body;

    const validRoles = ['traveller', 'provider', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    // Update in public.users
    const { data, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Also sync to Supabase auth metadata
    await supabase.auth.admin.updateUserById(id, {
      user_metadata: { role }
    });

    return res.status(200).json({ message: `Role updated to "${role}"`, user: data });
  } catch (error: any) {
    console.error('updateUserRole error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// DELETE /api/v1/auth/users/:id (Delete user — superadmin only)
export const adminDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id: paramId } = req.params;
    const id = Array.isArray(paramId) ? paramId[0] : paramId;
    const currentUserId = req.user?.user_id;

    if (id === currentUserId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete from public.users
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    // Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(id);
    if (authError) {
      console.error('Auth delete error (user already removed from DB):', authError);
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('adminDeleteUser error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/auth/admin/stats (Dashboard counts — admin/superadmin only)
export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const [users, bookings, homestays, transports, guides, packages] = await Promise.all([
      supabase.from('users').select('id', { count: 'exact', head: true }),
      supabase.from('bookings').select('id, total_amount, status'),
      supabase.from('homestays').select('id', { count: 'exact', head: true }),
      supabase.from('transports').select('id', { count: 'exact', head: true }),
      supabase.from('guides').select('id', { count: 'exact', head: true }),
      supabase.from('packages').select('id', { count: 'exact', head: true }),
    ]);

    const totalRevenue = (bookings.data || [])
      .filter((b: any) => b.status === 'confirmed' || b.status === 'completed')
      .reduce((sum: number, b: any) => sum + Number(b.total_amount || 0), 0);

    return res.status(200).json({
      totalUsers: users.count || 0,
      totalBookings: bookings.data?.length || 0,
      totalHomestays: homestays.count || 0,
      totalTransports: transports.count || 0,
      totalGuides: guides.count || 0,
      totalPackages: packages.count || 0,
      totalRevenue,
    });
  } catch (error: any) {
    console.error('getAdminStats error:', error);
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/v1/auth/send-otp
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number is required' });

    // Format phone to E.164 if missing '+' (simple check, assume India +91 if length is 10)
    let formattedPhone = phone;
    if (phone.length === 10 && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone;
    }

    const { createClient } = require('@supabase/supabase-js');
    const localSupabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await localSupabase.auth.signInWithOtp({
      phone: formattedPhone
    });

    if (error) {
      console.error('sendOtp error:', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'OTP sent successfully', data });
  } catch (error: any) {
    console.error('sendOtp unexpected error:', error);
    return res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// POST /api/v1/auth/verify-otp
export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });

    let formattedPhone = phone;
    if (phone.length === 10 && !phone.startsWith('+')) {
      formattedPhone = '+91' + phone;
    }

    const { createClient } = require('@supabase/supabase-js');
    const localSupabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false }
    });

    const { data, error } = await localSupabase.auth.verifyOtp({
      phone: formattedPhone,
      token: otp,
      type: 'sms'
    });

    if (error || !data.session) {
      console.error('verifyOtp error:', error);
      return res.status(401).json({ error: error?.message || 'Invalid OTP' });
    }

    setAuthCookies(res, data.session.access_token, data.session.refresh_token);

    const userId = data.user.id;
    let { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      console.log(`Profile not found in public.users for user ${userId} on OTP login. Attempting self-healing sync...`);
      const name = data.user.user_metadata?.name || 'User';
      const role = data.user.app_metadata?.role || data.user.user_metadata?.role || 'traveller';

      const { data: newProfile, error: insertError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          name,
          email: data.user.email || null,
          phone: formattedPhone,
          role
        }])
        .select()
        .single();

      if (!insertError && newProfile) {
        userProfile = newProfile;
      }
    }

    return res.status(200).json({
      message: 'OTP verified successfully',
      user: userProfile || {
        id: data.user.id,
        phone: formattedPhone,
        name: 'User',
        role: 'traveller'
      }
    });
  } catch (error: any) {
    console.error('verifyOtp unexpected error:', error);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
};
