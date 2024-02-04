import { Router } from 'express';
import { updateUser } from '../controllers/user.controller.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = new Router();

// Routes....*:
router.route('/update/:userId').put(verifyToken, updateUser);

export { router as userRoutes };
