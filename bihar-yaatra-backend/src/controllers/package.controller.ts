import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// GET /api/v1/packages
export const getPackages = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('packages')
      .select('id, title, slug, duration_days, duration_nights, price_per_person, cover_image_url, difficulty, is_published')
      .eq('is_published', true);

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/packages/:slug
export const getPackageBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabase
      .from('packages')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) return res.status(404).json({ error: 'Package not found' });
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/v1/packages (Admin only)
export const createPackage = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const packageData = { ...req.body, created_by: userId };

    const { data, error } = await supabase
      .from('packages')
      .insert([packageData])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// PUT /api/v1/packages/:id (Admin only)
export const updatePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('packages')
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

// DELETE /api/v1/packages/:id (Admin only)
export const deletePackage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { error } = await supabase
      .from('packages')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
