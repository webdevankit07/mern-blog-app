import Comment from '../models/comment.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import customError from '../utils/customErrorHandler.js';

export const createComment = asyncHandler(async (req, res, next) => {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
        return next(new customError(403, 'you are not allowed to create a comment'));
    }

    const comment = new Comment({
        postId,
        userId,
        content,
    });

    const newComment = await comment.save();

    res.status(200).send(new ApiResponse(200, newComment, 'Comment has been created successfully'));
});

export const getPostComments = asyncHandler(async (req, res, next) => {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: -1 });

    res.status(200).send(new ApiResponse(200, comments, 'success'));
});

export const likeComment = asyncHandler(async (req, res, next) => {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
        return next(new customError(404, 'comment not found'));
    }

    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
        comment.numberOfLikes += 1;
        comment.likes.push(req.user.id);
    } else {
        comment.numberOfLikes -= 1;
        comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    res.status(200).json(new ApiResponse(200, comment, 'likes updated'));
});