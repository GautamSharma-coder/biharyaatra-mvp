import { Router } from 'express';
import { createOrder, webhook } from '../controllers/payment.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { createOrderSchema } from '../schemas/payment.schema';

const router = Router();

// Create order needs authentication
router.post('/create-order', authenticate, validate(createOrderSchema), createOrder);

// Webhook is called by Razorpay servers directly
router.post('/webhook', webhook);

export default router;
