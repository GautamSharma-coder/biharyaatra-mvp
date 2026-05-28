import { z } from 'zod';

export const createBookingSchema = z.object({
  body: z.object({
    service_type: z.enum(['package', 'homestay', 'transport', 'guide']),
    service_id: z.string().min(1, 'Service ID is required'),
    service_name: z.string().min(1, 'Service name is required'),
    check_in: z.string().optional(), // Expected format YYYY-MM-DD
    check_out: z.string().optional(),
    guests: z.number().int().positive(),
    notes: z.string().optional(),
  })
});

export const updateBookingStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  })
});
