import { Router } from 'express';
import { googleSignIn, loginUser, registerUser } from '../controllers/auth.controller.js';
import validate from '../middlewares/validator.middleware.js';
import { googleSchema, loginSchema, signupSchema } from '../validators/auth.validator.js';

const router = Router();

// Public Routes...
router.route('/register').post(validate(signupSchema), registerUser);
router.route('/login').post(validate(loginSchema), loginUser);
router.route('/google').post(validate(googleSchema), googleSignIn);

// Private Routes...

export { router as authRoutes };
