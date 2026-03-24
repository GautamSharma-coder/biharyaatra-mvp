import { z } from 'zod';

export const createHomestaySchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    location: z.string().min(1, 'Location is required'),
    address: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    price_per_night: z.number().positive(),
    max_guests: z.number().int().positive(),
    amenities: z.array(z.string()),
    images: z.array(z.string().url()).optional(),
    is_available: z.boolean().default(true),
    is_published: z.boolean().default(false),
  })
});

export const updateHomestaySchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    location: z.string().optional(),
    address: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    price_per_night: z.number().positive().optional(),
    max_guests: z.number().int().positive().optional(),
    amenities: z.array(z.string()).optional(),
    images: z.array(z.string().url()).optional(),
    is_available: z.boolean().optional(),
    is_published: z.boolean().optional(),
  })
});
