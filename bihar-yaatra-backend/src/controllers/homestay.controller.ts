import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// GET /api/v1/homestays
export const getHomestays = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('homestays')
      .select('id, name, slug, location, price_per_night, max_guests, amenities, images, avg_rating, review_count')
      .eq('is_published', true)
      .eq('is_available', true);

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/homestays/:slug
export const getHomestayBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('homestays')
      .select('*, users!host_id(id, name, avatar_url, phone)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) return res.status(404).json({ error: 'Homestay not found' });
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/v1/homestays (Providers and Admins)
export const createHomestay = async (req: Request, res: Response) => {
  try {
    const hostId = req.user?.user_id; // JWT user ID
    if (!hostId) return res.status(401).json({ error: 'Unauthorized' });

    const homestayData = { ...req.body, host_id: hostId };

    const { data, error } = await supabase
      .from('homestays')
      .insert([homestayData])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT /api/v1/homestays/:id
export const updateHomestay = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;

    // Must be host or admin
    const { data: currentHomestay, error: fetchError } = await supabase
      .from('homestays')
      .select('host_id')
      .eq('id', id)
      .single();

    if (fetchError || !currentHomestay) {
      return res.status(404).json({ error: 'Homestay not found' });
    }

    if (currentHomestay.host_id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // ── CRIT-2 FIX: Whitelist allowed fields to prevent mass assignment ──
    const { name, location, address, lat, lng, price_per_night, max_guests, amenities, images } = req.body;
    const allowedUpdate: Record<string, any> = {};
    if (name !== undefined) allowedUpdate.name = name;
    if (location !== undefined) allowedUpdate.location = location;
    if (address !== undefined) allowedUpdate.address = address;
    if (lat !== undefined) allowedUpdate.lat = lat;
    if (lng !== undefined) allowedUpdate.lng = lng;
    if (price_per_night !== undefined) allowedUpdate.price_per_night = price_per_night;
    if (max_guests !== undefined) allowedUpdate.max_guests = max_guests;
    if (amenities !== undefined) allowedUpdate.amenities = amenities;
    if (images !== undefined) allowedUpdate.images = images;

    const { data, error } = await supabase
      .from('homestays')
      .update(allowedUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE /api/v1/homestays/:id
export const deleteHomestay = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;

    const { data: currentHomestay, error: fetchError } = await supabase
      .from('homestays')
      .select('host_id')
      .eq('id', id)
      .single();

    if (fetchError || !currentHomestay) {
      return res.status(404).json({ error: 'Homestay not found' });
    }

    if (currentHomestay.host_id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { error } = await supabase
      .from('homestays')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// PATCH /api/v1/homestays/:id/availability
export const toggleAvailability = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { is_available } = req.body;
    const userId = req.user?.user_id;

    if (typeof is_available !== 'boolean') {
      return res.status(400).json({ error: 'is_available boolean is required' });
    }

    const { data: currentHomestay } = await supabase
      .from('homestays')
      .select('host_id')
      .eq('id', id)
      .single();

    if (!currentHomestay) return res.status(404).json({ error: 'Homestay not found' });
    
    if (currentHomestay.host_id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { data, error } = await supabase
      .from('homestays')
      .update({ is_available })
      .eq('id', id)
      .select('id, is_available')
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/homestays/my (Provider listings)
export const getMyHomestays = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { data, error } = await supabase
      .from('homestays')
      .select('*')
      .eq('host_id', userId);

    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
