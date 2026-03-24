import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    service_type: z.enum(['package', 'homestay', 'transport', 'guide']),
    service_id: z.string().uuid('Invalid service ID'),
    service_name: z.string().min(1, 'Service name is required'),
    check_in: z.string().optional(), // Expected format YYYY-MM-DD
    check_out: z.string().optional(),
    guests: z.number().int().positive(),
    total_amount: z.number().positive(),
    notes: z.string().optional(),
  })
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  })
});
