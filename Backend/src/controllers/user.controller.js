import User from '../models/user.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import customError from '../utils/customErrorHandler.js';

// ......... Controllers .............//
export const updateUser = asyncHandler(async (req, res, next) => {
    const { userName, email, password, profilePicutre } = req.body;

    const user = await User.findById(req.params.userId);
    if (!user) {
        return next(new customError(403, 'unauthorized'));
    }

    return res.status(200).json(new ApiResponse(200, user, 'success'));
});
