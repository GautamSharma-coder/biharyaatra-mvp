import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// GET /api/v1/guides
export const getGuides = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('guides')
      .select('id, name, slug, bio, location, languages, skills, price_per_day, profile_image_url, avg_rating, review_count, is_verified')
      .eq('is_available', true);

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/guides/:slug
export const getGuideBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('guides')
      .select('*, users!user_id(id, name, avatar_url, phone)')
      .eq('slug', slug)
      .single();

    if (error) return res.status(404).json({ error: 'Guide not found' });
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/v1/guides (Providers/Admins)
export const createGuide = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    const guideData = { ...req.body, user_id: userId };

    const { data, error } = await supabase
      .from('guides')
      .insert([guideData])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT /api/v1/guides/:id
export const updateGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;

    const { data: currentGuide, error: fetchError } = await supabase
      .from('guides')
      .select('user_id')
      .eq('id', id)
      .single();

    if (fetchError || !currentGuide) return res.status(404).json({ error: 'Guide not found' });

    if (currentGuide.user_id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // ── CRIT-2 FIX: Whitelist allowed fields to prevent mass assignment ──
    const { name, slug, bio, location, languages, skills, price_per_day, profile_image_url, is_available } = req.body;
    const allowedUpdate: Record<string, any> = {};
    if (name !== undefined) allowedUpdate.name = name;
    if (slug !== undefined) allowedUpdate.slug = slug;
    if (bio !== undefined) allowedUpdate.bio = bio;
    if (location !== undefined) allowedUpdate.location = location;
    if (languages !== undefined) allowedUpdate.languages = languages;
    if (skills !== undefined) allowedUpdate.skills = skills;
    if (price_per_day !== undefined) allowedUpdate.price_per_day = price_per_day;
    if (profile_image_url !== undefined) allowedUpdate.profile_image_url = profile_image_url;
    if (is_available !== undefined) allowedUpdate.is_available = is_available;

    const { data, error } = await supabase
      .from('guides')
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

// DELETE /api/v1/guides/:id
export const deleteGuide = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;

    const { data: currentGuide } = await supabase
      .from('guides')
      .select('user_id')
      .eq('id', id)
      .single();

    if (!currentGuide) return res.status(404).json({ error: 'Guide not found' });

    if (currentGuide.user_id !== userId && req.user?.role !== 'admin' && req.user?.role !== 'superadmin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    const { error } = await supabase
      .from('guides')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/guides/my/listings (Provider's own guide profiles)
export const getMyGuides = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { data, error } = await supabase
      .from('guides')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
