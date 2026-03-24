import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// GET /api/v1/destinations
export const getDestinations = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('destinations')
      .select('id, name, slug, tagline, category, location, hero_image_url, is_published')
      .eq('is_published', true);

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/destinations/:slug
export const getDestinationBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) return res.status(404).json({ error: 'Destination not found' });
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/v1/destinations (Admin only)
export const createDestination = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const destinationData = { ...req.body, created_by: userId };

    const { data, error } = await supabase
      .from('destinations')
      .insert([destinationData])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT /api/v1/destinations/:id (Admin only)
export const updateDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('destinations')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// DELETE /api/v1/destinations/:id (Admin only)
export const deleteDestination = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/destinations/search
export const searchDestinations = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const { data, error } = await supabase
      .from('destinations')
      .select('*')
      .eq('is_published', true)
      .ilike('name', `%${q}%`);

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
