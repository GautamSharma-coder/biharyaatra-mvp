import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes';
import destinationRoutes from './routes/destination.routes';
import packageRoutes from './routes/package.routes';
import homestayRoutes from './routes/homestay.routes';
import guideRoutes from './routes/guide.routes';
import transportRoutes from './routes/transport.routes';
import bookingRoutes from './routes/booking.routes';
import paymentRoutes from './routes/payment.routes';
import aiRoutes from './routes/ai.routes';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = process.env.PORT || 8000;

// ── Security Middleware ──
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(morgan('dev'));

// ── CRIT-1 FIX: Raw body parser for Razorpay webhook (MUST be before express.json) ──
// Razorpay signs the raw request body; express.json() destroys the original byte sequence
app.use('/api/v1/payments/webhook', express.raw({ type: 'application/json' }));

// ── HIGH-3 FIX: Explicit body size limit to prevent memory exhaustion DoS ──
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first'); // Force IPv4 to prevent ENETUNREACH in Node 18+

// ── HIGH-4 FIX: Rate limiting ──
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15,                   // 15 attempts per window
  message: { error: 'Too many authentication attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false }, // Bypass validation crash on Render
});

const aiLimiter = rateLimit({
  windowMs: 60 * 1000,      // 1 minute
  max: 10,                   // 10 AI requests per minute
  message: { error: 'Saarthi AI rate limit exceeded. Please wait a moment.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,                  // 200 requests per window
  message: { error: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
});

// Apply rate limiters
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/auth/send-email-otp', authLimiter);
app.use('/api/v1/auth/verify-email-otp', authLimiter);
app.use('/api/v1/auth/forgot-password', authLimiter);
app.use('/api/v1/auth/reset-password', authLimiter);
app.use('/api/v1/ai', aiLimiter);
app.use('/api/v1', generalLimiter);

// ── Routes ──
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/destinations', destinationRoutes);
app.use('/api/v1/packages', packageRoutes);
app.use('/api/v1/homestays', homestayRoutes);
app.use('/api/v1/guides', guideRoutes);
app.use('/api/v1/transports', transportRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/ai', aiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
