import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabase';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default_access_secret_change_me';

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

    // Verify our custom JWT
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_ACCESS_SECRET);
    } catch (jwtError: any) {
      // Auto-clear invalid/expired cookies to self-heal state
      res.clearCookie('access_token');
      res.clearCookie('refresh_token');
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Token expired. Please refresh.' });
      }
      return res.status(401).json({ error: 'Invalid token.' });
    }

    // Fetch the latest role from the database (authoritative source)
    const { data: profile, error } = await supabase
      .from('users')
      .select('role, is_verified')
      .eq('id', decoded.user_id)
      .single();

    if (error || !profile) {
      return res.status(401).json({ error: 'User not found.' });
    }

    if (!profile.is_verified) {
      return res.status(403).json({ error: 'Email not verified. Please verify your email first.' });
    }

    // Attach user to request
    req.user = {
      user_id: decoded.user_id,
      email: decoded.email || '',
      role: profile.role || 'traveller'
    };

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    return res.status(500).json({ error: 'Internal auth error.' });
  }
};
