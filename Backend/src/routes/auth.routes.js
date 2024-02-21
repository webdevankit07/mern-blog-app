import { Router } from 'express';
import { googleSignIn, loginUser, registerUser, validateToken } from '../controllers/auth.controller.js';
import validate from '../middlewares/validator.middleware.js';
import { googleSchema, loginSchema, signupSchema } from '../validators/auth.validator.js';
import verifyToken from '../middlewares/auth.middleware.js';

const router = Router();

// Routes...
router.route('/register').post(validate(signupSchema), registerUser);
router.route('/login').post(validate(loginSchema), loginUser);
router.route('/google').post(validate(googleSchema), googleSignIn);

// Private routes....
router.route('/validate-token').get(verifyToken, validateToken);

export { router as authRoutes };
