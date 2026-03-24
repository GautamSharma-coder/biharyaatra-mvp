import { Router } from 'express';
import { 
  getTransports, 
  getTransportById, 
  createTransport, 
  updateTransport, 
  deleteTransport 
} from '../controllers/transport.controller';
import { authenticate } from '../middleware/authenticate';
import { authorize } from '../middleware/authorize';
import { validate } from '../middleware/validate';
import { createTransportSchema, updateTransportSchema } from '../schemas/transport.schema';

const router = Router();

// Public routes
router.get('/', getTransports);
router.get('/:id', getTransportById);

// Protected routes
router.use(authenticate);

router.post('/', authorize('provider', 'admin', 'superadmin'), validate(createTransportSchema), createTransport);
router.put('/:id', authorize('provider', 'admin', 'superadmin'), validate(updateTransportSchema), updateTransport);
router.delete('/:id', authorize('provider', 'admin', 'superadmin'), deleteTransport);

export default router;
