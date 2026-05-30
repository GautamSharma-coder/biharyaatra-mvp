import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { sendBookingEmail } from '../services/email.service';

// POST /api/v1/bookings (Create a booking after Razorpay success/init)
export const createBooking = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;
    const { service_type, service_id, service_name, check_in, check_out, guests, notes } = req.body;

    // ── CRIT-3 FIX: Server-side price validation ──
    let unitPrice = 0;
    let fetchError = null;
    
    if (service_type === 'package') {
      const { data: pkg, error } = await supabase.from('packages').select('price_per_person').eq('id', service_id).single();
      fetchError = error;
      if (pkg) unitPrice = Number(pkg.price_per_person);
    } else if (service_type === 'homestay') {
      const { data: hs, error } = await supabase.from('homestays').select('price_per_night').eq('id', service_id).single();
      fetchError = error;
      if (hs) {
        let nights = 1;
        if (check_in && check_out) {
          const diffMs = new Date(check_out).getTime() - new Date(check_in).getTime();
          nights = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        }
        unitPrice = Number(hs.price_per_night) * nights;
      }
    } else if (service_type === 'transport') {
      const { data: tr, error } = await supabase.from('transports').select('price_per_day').eq('id', service_id).single();
      fetchError = error;
      if (tr) unitPrice = Number(tr.price_per_day);
    } else if (service_type === 'guide') {
      const { data: g, error } = await supabase.from('guides').select('price_per_day').eq('id', service_id).single();
      fetchError = error;
      if (g) unitPrice = Number(g.price_per_day);
    } else {
      return res.status(400).json({ error: 'Invalid service type' });
    }

    if (fetchError || unitPrice <= 0) {
      return res.status(404).json({ error: 'Service not found or price unavailable' });
    }

    const validGuests = guests ? Math.max(1, Number(guests)) : 1;
    const total_amount = unitPrice * validGuests;

    const bookingData = { 
      service_type,
      service_id,
      service_name,
      check_in: check_in || null,
      check_out: check_out || null,
      guests,
      total_amount,
      notes: notes || null,
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

    // Fetch user details for enrichment
    const { data: userProfile } = await supabase
      .from('users')
      .select('name, email, phone')
      .eq('id', data.user_id)
      .single();

    // Fetch service location details
    let location = 'Bihar, India';
    if (data.service_type === 'homestay') {
      const { data: hs } = await supabase.from('homestays').select('location').eq('id', data.service_id).single();
      if (hs) location = hs.location;
    } else if (data.service_type === 'package') {
      const { data: pkg } = await supabase.from('packages').select('route').eq('id', data.service_id).single();
      if (pkg && pkg.route) location = pkg.route;
    } else if (data.service_type === 'transport') {
      const { data: tr } = await supabase.from('transports').select('route_from, route_to').eq('id', data.service_id).single();
      if (tr) location = `${tr.route_from} to ${tr.route_to}`;
    } else if (data.service_type === 'guide') {
      const { data: g } = await supabase.from('guides').select('location').eq('id', data.service_id).single();
      if (g && (g as any).location) location = (g as any).location;
    }

    const enrichedBooking = {
      ...data,
      guest_name: userProfile?.name || 'Guest',
      guest_email: userProfile?.email || '',
      guest_phone: userProfile?.phone || '',
      location,
    };

    return res.status(200).json(enrichedBooking);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/v1/bookings/:id/confirm-location (Confirm Pay at Location booking)
export const confirmLocationBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.user_id;

    // Fetch booking
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });

    // Update booking status to confirmed
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        status: 'confirmed',
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Fetch user details for email
    const { data: userProfile } = await supabase
      .from('users')
      .select('name, email')
      .eq('id', booking.user_id)
      .single();

    // Fetch service location details
    let details: { location?: string } = {};
    if (booking.service_type === 'homestay') {
      const { data: hs } = await supabase.from('homestays').select('location').eq('id', booking.service_id).single();
      if (hs) details.location = hs.location;
    } else if (booking.service_type === 'package') {
      const { data: pkg } = await supabase.from('packages').select('route').eq('id', booking.service_id).single();
      if (pkg) details.location = pkg.route;
    } else if (booking.service_type === 'transport') {
      const { data: tr } = await supabase.from('transports').select('route_from, route_to').eq('id', booking.service_id).single();
      if (tr) details.location = `${tr.route_from} to ${tr.route_to}`;
    } else if (booking.service_type === 'guide') {
      const { data: g } = await supabase.from('guides').select('location').eq('id', booking.service_id).single();
      if (g && (g as any).location) details.location = (g as any).location;
    }

    // Send confirmation email asynchronously
    if (userProfile && userProfile.email) {
      sendBookingEmail(userProfile.email, updatedBooking, userProfile, details).catch(err => {
        console.error('Failed to send booking confirmation email:', err);
      });
    }

    return res.status(200).json(updatedBooking);
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

    // Fetch user profiles to map customer details
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, phone');

    const userMap = new Map((users || []).map(u => [u.id, u]));

    const enrichedBookings = (data || []).map(booking => {
      const u = userMap.get(booking.user_id);
      return {
        ...booking,
        guest_name: u?.name || 'Guest',
        guest_email: u?.email || '',
        guest_phone: u?.phone || '',
      };
    });

    return res.status(200).json(enrichedBookings);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// PATCH /api/v1/bookings/:id/status (Admin/Provider updates booking status)
export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user?.user_id;
    const role = req.user?.role;

    if (role === 'provider') {
      const { data: booking, error: fetchError } = await supabase
        .from('bookings')
        .select('service_type, service_id')
        .eq('id', id)
        .single();
        
      if (fetchError || !booking) return res.status(404).json({ error: 'Booking not found' });

      let ownsService = false;
      if (booking.service_type === 'homestay') {
        const { data } = await supabase.from('homestays').select('id').eq('id', booking.service_id).eq('host_id', userId).single();
        if (data) ownsService = true;
      } else if (booking.service_type === 'transport') {
        const { data } = await supabase.from('transports').select('id').eq('id', booking.service_id).eq('provider_id', userId).single();
        if (data) ownsService = true;
      } else if (booking.service_type === 'guide') {
        const { data } = await supabase.from('guides').select('id').eq('id', booking.service_id).eq('user_id', userId).single();
        if (data) ownsService = true;
      }

      if (!ownsService) {
        return res.status(403).json({ error: 'Forbidden: You do not own this service' });
      }
    }

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

// --- Provider Endpoints ---

// GET /api/v1/bookings/provider (Bookings for the provider's own services)
export const getProviderBookings = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.user_id;

    // Collect all service IDs owned by this provider across all service types
    const serviceIds: string[] = [];

    const [homestays, transports, guides] = await Promise.all([
      supabase.from('homestays').select('id').eq('host_id', userId),
      supabase.from('transports').select('id').eq('provider_id', userId),
      supabase.from('guides').select('id').eq('user_id', userId),
    ]);

    if (homestays.data) serviceIds.push(...homestays.data.map((h: any) => h.id));
    if (transports.data) serviceIds.push(...transports.data.map((t: any) => t.id));
    if (guides.data) serviceIds.push(...guides.data.map((g: any) => g.id));

    if (serviceIds.length === 0) {
      return res.status(200).json([]);
    }

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .in('service_id', serviceIds)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
