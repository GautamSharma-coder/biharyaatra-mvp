import { Router } from 'express';
import { generateTripPlan } from '../controllers/ai.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { planTripSchema } from '../schemas/ai.schema';

const router = Router();

// Calling the AI requires a logged-in user to prevent abuse
router.post('/plan-trip', authenticate, validate(planTripSchema), generateTripPlan);

export default router;
