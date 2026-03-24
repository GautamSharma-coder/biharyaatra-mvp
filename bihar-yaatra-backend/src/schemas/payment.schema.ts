import { z } from 'zod';

export const createOrderSchema = z.object({
  body: z.object({
    amount: z.number().int().positive('Amount must be in smallest currency unit (paise)'),
    currency: z.string().default('INR'),
    booking_id: z.string().uuid('Booking ID is required'),
    receipt: z.string().optional(),
  })
});

// Note: webhook validation isn't strictly Zod because we must verify the HMAC signature from Razorpay directly.
