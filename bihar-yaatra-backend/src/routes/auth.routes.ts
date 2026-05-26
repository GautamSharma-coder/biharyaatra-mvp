import { Router } from 'express';
import { register, login, refresh, logout, getMe, updateMe } from '../controllers/auth.controller';
import { authenticate } from '../middleware/authenticate';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticate, getMe);
router.put('/me', authenticate, updateMe);

export default router;
