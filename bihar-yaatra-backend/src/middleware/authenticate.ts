import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: {
          user_id: string;
          email: string;
          role: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.cookies?.access_token;
    
    // Fallback to Bearer token
    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. No token provided.' });
    }

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired session.' });
    }

    // ── HIGH-5 FIX: Read role from the database, NOT from user-writable metadata ──
    // user_metadata is writable by the user themselves via Supabase client.
    // Always use the authoritative public.users table for role determination.
    let role = 'traveller';
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    
    if (profile?.role) {
      role = profile.role;
    }

    // Attach user to request
    req.user = {
      user_id: user.id,
      email: user.email || '',
      role
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ error: 'Internal auth error.' });
  }
};
