import { Router } from 'express';
import { 
  getGuides, 
  getGuideBySlug, 
  createGuide, 
  updateGuide, 
  deleteGuide 
} from '../controllers/guide.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createGuideSchema, updateGuideSchema } from '../schemas/guide.schema';

const router = Router();

// Public routes
router.get('/', getGuides);
router.get('/:slug', getGuideBySlug);

// Protected routes
router.use(authenticate);

router.post('/', authorize('provider', 'admin', 'superadmin'), validate(createGuideSchema), createGuide);
router.put('/:id', authorize('provider', 'admin', 'superadmin'), validate(updateGuideSchema), updateGuide);
router.delete('/:id', authorize('provider', 'admin', 'superadmin'), deleteGuide);

export default router;
