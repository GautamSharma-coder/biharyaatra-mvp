import { Request, Response } from 'express';
import crypto from 'crypto';
import { razorpay, RAZORPAY_WEBHOOK_SECRET } from '../config/razorpay';
import { supabase } from '../config/supabase';

// POST /api/v1/payments/create-order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, currency = 'INR', booking_id } = req.body;
    const userId = req.user?.user_id;

    // Verify booking belongs to user
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (fetchError || !booking) return res.status(404).json({ error: 'Booking not found' });
    if (booking.user_id !== userId) return res.status(403).json({ error: 'Forbidden' });
    if (booking.payment_status === 'paid') return res.status(400).json({ error: 'Booking already paid' });

    // Create Razorpay order
    const options = {
      amount, // in paise
      currency,
      receipt: booking_id, // Use booking ID as receipt
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json(order);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

// POST /api/v1/payments/webhook
export const webhook = async (req: Request, res: Response) => {
  try {
    // ── CRIT-1 FIX: Razorpay webhook HMAC verification using raw body buffer ──
    // The raw body is preserved because server.ts registers express.raw() on this path
    // BEFORE express.json(), so req.body is a Buffer here.
    const signature = req.headers['x-razorpay-signature'] as string;

    if (!signature) {
      return res.status(400).json({ error: 'Missing x-razorpay-signature header' });
    }

    // req.body is a raw Buffer here (not parsed JSON) thanks to express.raw()
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
    
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest('hex');

    if (expectedSignature !== signature) {
      console.warn('Razorpay webhook: Invalid HMAC signature rejected.');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Parse the verified raw body
    const payload = JSON.parse(rawBody.toString());
    const { event } = payload;

    if (event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      const orderId = payment.order_id;
      const bookingId = payment.notes?.booking_id;

      console.log(`Payment captured for order: ${orderId}, booking: ${bookingId}`);

      if (bookingId) {
        // Actually update booking status in the database
        const { error: updateError } = await supabase
          .from('bookings')
          .update({ payment_status: 'paid', status: 'confirmed', razorpay_payment_id: payment.id, razorpay_order_id: orderId })
          .eq('id', bookingId);
        
        if (updateError) {
          console.error('Failed to update booking after payment capture:', updateError);
        } else {
          console.log(`Booking ${bookingId} marked as paid and confirmed.`);
        }
      } else {
        console.warn('Payment captured but no booking_id found in payment notes.');
      }
    }

    return res.status(200).json({ status: 'ok' });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: error.message });
  }
};
