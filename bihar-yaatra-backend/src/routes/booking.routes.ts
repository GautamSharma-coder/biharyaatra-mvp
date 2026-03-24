import { Router } from 'express';
import { 
  createBooking, 
  getMyBookings, 
  getBookingById, 
  cancelBooking, 
  getAllBookings,
  updateBookingStatus
} from '../controllers/booking.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createBookingSchema, updateBookingStatusSchema } from '../schemas/booking.schema';

const router = Router();

// ALL booking routes require authentication
router.use(authenticate);

// User endpoints
router.post('/', validate(createBookingSchema), createBooking);
router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.patch('/:id/cancel', cancelBooking);

// Admin endpoints
router.get('/', authorize('admin', 'superadmin'), getAllBookings);
router.patch('/:id/status', authorize('admin', 'superadmin'), validate(updateBookingStatusSchema), updateBookingStatus);

export default router;
