import Post from '../models/post.model.js';
import { postRoutes } from '../routes/post.routes.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import customError from '../utils/customErrorHandler.js';

export const createPost = asyncHandler(async (req, res, next) => {
    const { title, content } = req.body;

    if (!req.user.isAdmin) {
        return next(new customError(403, 'You are not allowed to create a post'));
    }

    const post = await Post.findOne({ title });
    if (post) {
        return next(new customError(403, 'Create unique post or title'));
    }

    const slug = req.body.title
        .split(' ')
        .join('-')
        .toLowerCase()
        .replace(/[^a-zA-Z0-9-]/g, '');

    console.log(req.user.id);
    const newPost = new Post({ ...req.body, userId: req.user.id, slug });

    const createdPost = await newPost.save();

    res.status(201).json(new ApiResponse(201, { post: createdPost }, 'post has been created successfully'));
});
