import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import { createPost, deletePost, getAllPosts, getPosts, updatePost } from '../controllers/post.controller.js';
import { createPostSchema } from '../validators/post.valodator.js';
import validate from '../middlewares/validator.middleware.js';

const router = Router();

router.route('/create').post(verifyToken, validate(createPostSchema), createPost);
router.route('/getposts').get(getPosts);
router.route('/getallposts').get(getAllPosts);
router.route('/deletepost/:postId/:userId').delete(verifyToken, deletePost);
router.route('/updatepost/:postId/:userId').put(verifyToken, updatePost);

export { router as postRoutes };
