import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// POST /api/v1/bookings (Create a booking after Razorpay success/init)
export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;

    // Default to 'pending'. The Razorpay webhook will confirm it later.
    const bookingData = { 
      ...req.body, 
      user_id: userId,
      status: 'pending',
      payment_status: 'unpaid'
    };

    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select()
      .single();

    if (error) throw error;
    return res.status(201).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/bookings/my (User's booking history)
export const getMyBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// GET /api/v1/bookings/:id (Single booking details)
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;
    const role = req.user?.role;

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return res.status(404).json({ error: 'Booking not found' });

    // Allow user who made it, or an admin to see the booking
    if (data.user_id !== userId && role !== 'admin' && role !== 'superadmin') {
       return res.status(403).json({ error: 'Forbidden' });
    }

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// PATCH /api/v1/bookings/:id/cancel
export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;

    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('user_id, status')
      .eq('id', id)
      .single();

    if (fetchError || !booking) return res.status(404).json({ error: 'Booking not found' });

    if (booking.user_id !== userId) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    // Only allow cancellation if pending or confirmed (you might have business rules here)
    if (booking.status === 'completed' || booking.status === 'cancelled') {
        return res.status(400).json({ error: 'Cannot cancel a completed or already cancelled booking' });
    }

    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// --- Admin Endpoints ---

// GET /api/v1/bookings (List all bookings)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// PATCH /api/v1/bookings/:id/status (Admin updates booking status)
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
