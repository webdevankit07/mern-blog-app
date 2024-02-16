import { Router } from 'express';
import verifyToken from '../middlewares/auth.middleware.js';
import {
    createComment,
    deleteComment,
    editComment,
    getAllComments,
    getPostComments,
    likeComment,
} from '../controllers/comment.controller.js';
import { createCommentSchema } from '../validators/comment.validator.js';
import validate from '../middlewares/validator.middleware.js';

const router = new Router();

// Public routes....*:
router.route('/getPostComments/:postId').get(getPostComments);

// Private routes....*:
router.route('/create').post(verifyToken, validate(createCommentSchema), createComment);
router.route('/like-comment/:commentId').put(verifyToken, likeComment);
router.route('/edit-comment/:commentId').put(verifyToken, editComment);
router.route('/delete-comment/:commentId').delete(verifyToken, deleteComment);
router.route('/getAllComments').get(verifyToken, getAllComments);

export { router as commentRoutes };
