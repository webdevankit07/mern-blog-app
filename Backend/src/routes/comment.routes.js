import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import { createComment } from '../controllers/comment.controller.js';
import { createCommentSchema } from '../validators/comment.validator.js';
import validate from '../middlewares/validator.middleware.js';

const router = new Router();

// routes....*:
router.route('/create').post(verifyToken, validate(createCommentSchema), createComment);

export { router as commentRoutes };
