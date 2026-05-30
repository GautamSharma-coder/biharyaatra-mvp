import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { supabase } from '../config/supabase';
import { generateOtp, storeOtp, verifyStoredOtp } from '../services/otp.service';
import { sendOtpEmail, sendPasswordResetEmail } from '../services/email.service';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default_access_secret_change_me';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_change_me';
const SALT_ROUNDS = 12;

// ── JWT Helpers ──

function generateAccessToken(userId: string, email: string, role: string): string {
  return jwt.sign(
    { user_id: userId, email, role },
    JWT_ACCESS_SECRET,
    { expiresIn: '1h' }
  );
}

function generateRefreshToken(userId: string): string {
  return jwt.sign(
    { user_id: userId },
    JWT_REFRESH_SECRET,
    { expiresIn: '30d' }
  );
}

// ── Cookie Helpers ──

const setAuthCookies = (res: Response, access_token: string, refresh_token: string) => {
  res.cookie('access_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 3600 * 1000 // 1 hour
  });

  res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  });
};

// ══════════════════════════════════════════════════
// ── Public Endpoints ──
// ══════════════════════════════════════════════════

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role = 'traveller' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if email already exists
    const { data: existing } = await supabase
      .from('users')
      .select('id, is_verified')
      .eq('email', normalizedEmail)
      .single();

    if (existing) {
      if (existing.is_verified) {
        return res.status(400).json({ error: 'An account with this email already exists' });
      }
      // If they registered but never verified, delete the old entry and let them re-register
      await supabase.from('users').delete().eq('id', existing.id);
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert into public.users
    const { data: newUser, error: insertError } = await supabase
      .from('users')
      .insert([{
        name,
        email: normalizedEmail,
        phone: phone || null,
        role,
        password_hash,
        is_verified: false,
      }])
      .select('id, name, email, role')
      .single();

    if (insertError) {
      console.error('Registration insert error:', insertError);
      return res.status(400).json({ error: insertError.message || 'Registration failed' });
    }

    // Generate and send OTP
    try {
      const otp = generateOtp();
      await storeOtp(normalizedEmail, otp);
      await sendOtpEmail(normalizedEmail, otp, name);
    } catch (emailError: any) {
      console.error('Failed to send verification OTP email:', emailError.message);
      // Registration succeeded but email failed — user can resend from verify-otp page
    }

    return res.status(201).json({
      message: 'Registration successful! Please check your email for your verification code.',
      user: newUser,
      needs_email_verification: true,
      email: normalizedEmail,
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

    const normalizedEmail = email.toLowerCase().trim();

    // Fetch user from public.users
    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, password_hash, is_verified, avatar_url')
      .eq('email', normalizedEmail)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (!user.password_hash) {
      return res.status(401).json({ error: 'This is a legacy account. Please register again to use the new authentication system.' });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check if email is verified
    if (!user.is_verified) {
      // Send a new OTP automatically
      try {
        const otp = generateOtp();
        await storeOtp(normalizedEmail, otp);
        await sendOtpEmail(normalizedEmail, otp, user.name);

        return res.status(401).json({
          error: 'Email not verified. A new verification code has been sent to your email.',
          needs_email_verification: true,
          email: normalizedEmail,
        });
      } catch (resendError: any) {
        console.error('Error sending verification OTP on login:', resendError);
        return res.status(401).json({
          error: 'Email not verified. Please try again later.'
        });
      }
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in DB
    await supabase
      .from('refresh_tokens')
      .insert([{ user_id: user.id, token: refreshToken }]);

    setAuthCookies(res, accessToken, refreshToken);

    // Return user without password_hash
    const { password_hash: _, ...safeUser } = user;

    return res.status(200).json({
      message: 'Login successful',
      user: safeUser
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { token, role = 'traveller' } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Google ID token is required' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ error: 'Invalid Google token' });
    }

    const email = payload.email.toLowerCase().trim();
    const name = payload.name || 'Google User';
    const avatar_url = payload.picture || null;

    // Check if user exists
    let { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, email, phone, role, password_hash, is_verified, avatar_url')
      .eq('email', email)
      .single();

    if (userError && userError.code !== 'PGRST116') { // PGRST116 is no rows returned
      throw userError;
    }

    if (!user) {
      // Create new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{
          name,
          email,
          role,
          is_verified: true,
          avatar_url,
          password_hash: null
        }])
        .select('id, name, email, phone, role, password_hash, is_verified, avatar_url')
        .single();
        
      if (insertError) throw insertError;
      user = newUser;
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.id, user.email, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Store refresh token in DB
    await supabase
      .from('refresh_tokens')
      .insert([{ user_id: user.id, token: refreshToken }]);

    setAuthCookies(res, accessToken, refreshToken);

    // Return user without password_hash
    const { password_hash: _, ...safeUser } = user;

    return res.status(200).json({
      message: 'Login successful',
      user: safeUser
    });
  } catch (error: any) {
    console.error('Google Login error:', error);
    return res.status(500).json({ error: 'Google authentication failed' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }

    // Verify the refresh token
    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch {
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Check if the refresh token exists in DB (not revoked)
    const { data: storedToken } = await supabase
      .from('refresh_tokens')
      .select('id')
      .eq('token', refreshToken)
      .eq('user_id', decoded.user_id)
      .single();

    if (!storedToken) {
      return res.status(401).json({ error: 'Refresh token has been revoked' });
    }

    // Fetch current user data for the new access token
    const { data: user } = await supabase
      .from('users')
      .select('id, email, role')
      .eq('id', decoded.user_id)
      .single();

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user.id, user.email, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    // Rotate: delete old refresh token and insert new one
    await supabase.from('refresh_tokens').delete().eq('id', storedToken.id);
    await supabase.from('refresh_tokens').insert([{ user_id: user.id, token: newRefreshToken }]);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.status(200).json({ message: 'Tokens refreshed' });
  } catch (error) {
    console.error('Refresh error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refresh_token;

    // Delete the refresh token from DB if present
    if (refreshToken) {
      await supabase.from('refresh_tokens').delete().eq('token', refreshToken);
    }

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
      .select('id, name, email, phone, role, avatar_url, is_verified, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (error || !user) {
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
      .update({
        name,
        phone: phone || null,
        avatar_url: avatar_url || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, name, email, phone, role, avatar_url, is_verified, created_at, updated_at')
      .single();

    if (updateError) {
      throw updateError;
    }

    return res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.error('updateMe error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// ══════════════════════════════════════════════════
// ── Admin Endpoints ──
// ══════════════════════════════════════════════════

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, avatar_url, is_verified, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (error: any) {
    console.error('getAllUsers error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const adminCreateUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, role = 'traveller' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert([{
        name,
        email: normalizedEmail,
        phone: phone || null,
        role,
        password_hash,
        is_verified: true, // Admin-created users are pre-verified
      }])
      .select('id, name, email, phone, role, is_verified, created_at')
      .single();

    if (profileError) {
      return res.status(400).json({ error: profileError.message });
    }

    return res.status(201).json({
      message: `User "${name}" created with role "${role}"`,
      user: profile
    });
  } catch (error: any) {
    console.error('adminCreateUser error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response) => {
  try {
    const { id: paramId } = req.params;
    const id = Array.isArray(paramId) ? paramId[0] : paramId;
    const { role } = req.body;

    const validRoles = ['traveller', 'provider', 'admin', 'superadmin'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('id, name, email, role')
      .single();

    if (error) throw error;

    return res.status(200).json({ message: `Role updated to "${role}"`, user: data });
  } catch (error: any) {
    console.error('updateUserRole error:', error);
    return res.status(500).json({ error: error.message });
  }
};

export const adminDeleteUser = async (req: Request, res: Response) => {
  try {
    const { id: paramId } = req.params;
    const id = Array.isArray(paramId) ? paramId[0] : paramId;
    const currentUserId = req.user?.user_id;

    if (id === currentUserId) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete refresh tokens first
    await supabase.from('refresh_tokens').delete().eq('user_id', id);

    // Delete user from public.users
    const { error: dbError } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('adminDeleteUser error:', error);
    return res.status(500).json({ error: error.message });
  }
};

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

// ══════════════════════════════════════════════════
// ── Email OTP Endpoints ──
// ══════════════════════════════════════════════════

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    const { data: user } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', normalizedEmail)
      .single();

    // To prevent email enumeration, we can still say "If an account exists, a reset code was sent"
    // But since the current flow is more explicit, let's return a 404 for clarity just like sendEmailOtp.
    if (!user) {
      return res.status(404).json({ error: 'No account found with this email.' });
    }

    const otp = generateOtp();
    await storeOtp(normalizedEmail, otp);
    await sendPasswordResetEmail(normalizedEmail, otp, user.name);

    return res.status(200).json({ message: 'Password reset code sent to your email.' });
  } catch (error: any) {
    console.error('forgotPassword error:', error);
    return res.status(500).json({ error: 'Failed to process forgot password request.' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: 'Email, verification code, and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify the OTP
    const isValid = await verifyStoredOtp(normalizedEmail, otp);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid or expired verification code. Please request a new one.' });
    }

    // Hash the new password
    const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    // Update the password in the database
    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash, updated_at: new Date().toISOString() })
      .eq('email', normalizedEmail);

    if (updateError) {
      console.error('Error updating password:', updateError);
      return res.status(500).json({ error: 'Failed to reset password.' });
    }

    // Optionally: Revoke all existing refresh tokens so the user is logged out of all devices
    const { data: user } = await supabase.from('users').select('id').eq('email', normalizedEmail).single();
    if (user) {
      await supabase.from('refresh_tokens').delete().eq('user_id', user.id);
    }

    return res.status(200).json({ message: 'Password has been reset successfully. You can now log in.' });
  } catch (error: any) {
    console.error('resetPassword error:', error);
    return res.status(500).json({ error: 'Failed to reset password.' });
  }
};

export const sendEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const normalizedEmail = email.toLowerCase().trim();

    // Verify the user exists
    const { data: user } = await supabase
      .from('users')
      .select('id, name')
      .eq('email', normalizedEmail)
      .single();

    if (!user) {
      return res.status(404).json({ error: 'No account found with this email. Please register first.' });
    }

    const otp = generateOtp();
    await storeOtp(normalizedEmail, otp);
    await sendOtpEmail(normalizedEmail, otp, user.name);

    return res.status(200).json({ message: 'Verification code sent to your email' });
  } catch (error: any) {
    console.error('sendEmailOtp error:', error);
    return res.status(500).json({ error: error.message || 'Failed to send verification code' });
  }
};

export const verifyEmailOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: 'Email and verification code are required' });

    const normalizedEmail = email.toLowerCase().trim();

    // Verify the OTP
    const isValid = await verifyStoredOtp(normalizedEmail, otp);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid or expired verification code. Please request a new one.' });
    }

    // Mark the user as verified
    const { data: user, error: updateError } = await supabase
      .from('users')
      .update({ is_verified: true, updated_at: new Date().toISOString() })
      .eq('email', normalizedEmail)
      .select('id, name, email, role, avatar_url')
      .single();

    if (updateError || !user) {
      console.error('Error updating user verification status:', updateError);
      return res.status(500).json({ error: 'Failed to verify email' });
    }

    return res.status(200).json({
      message: 'Email verified successfully! You can now log in.',
      verified: true,
      user
    });
  } catch (error: any) {
    console.error('verifyEmailOtp error:', error);
    return res.status(500).json({ error: 'Failed to verify email' });
  }
};
