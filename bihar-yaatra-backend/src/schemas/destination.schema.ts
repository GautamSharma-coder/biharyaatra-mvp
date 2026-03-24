import { z } from 'zod';

export const createDestinationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    tagline: z.string().optional(),
    category: z.enum(['heritage', 'spiritual', 'nature', 'cultural']),
    location: z.string().min(1, 'Location is required'),
    hero_image_url: z.string().url().optional(),
    sections: z.array(z.object({
      header: z.string(),
      content: z.string()
    })).optional(),
    highlights: z.array(z.string()).optional(),
    best_time: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    tags: z.array(z.string()).optional(),
    is_published: z.boolean().default(false),
  })
});

export const updateDestinationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    slug: z.string().optional(),
    tagline: z.string().optional(),
    category: z.enum(['heritage', 'spiritual', 'nature', 'cultural']).optional(),
    location: z.string().optional(),
    hero_image_url: z.string().url().optional(),
    sections: z.array(z.object({
      header: z.string(),
      content: z.string()
    })).optional(),
    highlights: z.array(z.string()).optional(),
    best_time: z.string().optional(),
    lat: z.number().optional(),
    lng: z.number().optional(),
    tags: z.array(z.string()).optional(),
    is_published: z.boolean().optional(),
  })
});
