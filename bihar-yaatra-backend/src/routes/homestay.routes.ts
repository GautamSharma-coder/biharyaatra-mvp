import { Router } from 'express';
import { 
  getHomestays, 
  getHomestayBySlug, 
  createHomestay, 
  updateHomestay, 
  deleteHomestay,
  toggleAvailability,
  getMyHomestays
} from '../controllers/homestay.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createHomestaySchema, updateHomestaySchema } from '../schemas/homestay.schema';

const router = Router();

// Public routes
router.get('/', getHomestays);
router.get('/:slug', getHomestayBySlug);

// Protected routes (Providers & Admins)
router.use(authenticate);

router.get('/my/listings', authorize('provider', 'admin', 'superadmin'), getMyHomestays);
router.post('/', authorize('provider', 'admin', 'superadmin'), validate(createHomestaySchema), createHomestay);
router.put('/:id', authorize('provider', 'admin', 'superadmin'), validate(updateHomestaySchema), updateHomestay);
router.delete('/:id', authorize('provider', 'admin', 'superadmin'), deleteHomestay);
router.patch('/:id/availability', authorize('provider', 'admin', 'superadmin'), toggleAvailability);

export default router;
