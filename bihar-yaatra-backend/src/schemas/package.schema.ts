import { z } from 'zod';

export const createPackageSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    duration_days: z.number().int().positive(),
    duration_nights: z.number().int().nonnegative(),
    price_per_person: z.number().positive(),
    cover_image_url: z.string().url().optional(),
    destination_ids: z.array(z.string().uuid()),
    itinerary: z.array(z.object({
      day: z.number().int(),
      title: z.string(),
      description: z.string(),
      meals: z.string().optional()
    })),
    includes: z.array(z.string()).optional(),
    excludes: z.array(z.string()).optional(),
    max_group_size: z.number().int().positive().optional(),
    difficulty: z.enum(['easy', 'moderate', 'challenging']).optional(),
    is_published: z.boolean().default(false),
  })
});

export const updatePackageSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    slug: z.string().optional(),
    duration_days: z.number().int().positive().optional(),
    duration_nights: z.number().int().nonnegative().optional(),
    price_per_person: z.number().positive().optional(),
    cover_image_url: z.string().url().optional(),
    destination_ids: z.array(z.string().uuid()).optional(),
    itinerary: z.array(z.object({
      day: z.number().int(),
      title: z.string(),
      description: z.string(),
      meals: z.string().optional()
    })).optional(),
    includes: z.array(z.string()).optional(),
    excludes: z.array(z.string()).optional(),
    max_group_size: z.number().int().positive().optional(),
    difficulty: z.enum(['easy', 'moderate', 'challenging']).optional(),
    is_published: z.boolean().optional(),
  })
});
