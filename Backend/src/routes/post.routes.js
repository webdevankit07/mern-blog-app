import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import { createPost, getAllPosts } from '../controllers/post.controller.js';
import { createPostSchema } from '../validators/post.valodator.js';
import validate from '../middlewares/validator.middleware.js';

const router = Router();

router.route('/create').post(verifyToken, validate(createPostSchema), createPost);
router.route('/getposts').get(getAllPosts);

export { router as postRoutes };
