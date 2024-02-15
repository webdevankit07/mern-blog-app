import User from '../models/user.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import customError from '../utils/customErrorHandler.js';
import { accessTokenOptions, refreshTokenOptions } from '../utils/utils.js';

// ......... Controllers .............//
export const updateUser = asyncHandler(async (req, res, next) => {
    const { userName, email, password, profilePicture } = req.body;
    console.log({ userName, email, password, profilePicture });

    if (req.user.id !== req.params.userId) {
        return next(new customError(403, 'You are not allowed to update this user'));
    }

    const user = await User.findById(req.params.userId);

    if (userName) {
        if (userName.length < 7 || userName.length > 20) {
            return next(new customError(400, 'userName must be at between 7 and 20 characters'));
        }
        if (userName.includes(' ')) {
            return next(new customError(400, 'userName cannot contain spaces'));
        }
        if (!userName.match(/^[a-zA-Z0-9]+$/)) {
            return next(new customError(400, 'userName can only contains letter or number'));
        }
        const isUsernameMatched = await User.findOne({ userName: userName.toLowerCase() });
        if (isUsernameMatched) {
            const isAuthorizedUserName = isUsernameMatched.userName === user.userName;
            if (!isAuthorizedUserName) {
                return next(new customError(400, 'userName already exists'));
            }
        }
        user.userName = userName.toLowerCase();
    }

    if (email) {
        if (
            !email.match(
                /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
            )
        ) {
            return next(new customError(400, 'Not a valid email'));
        }
        if (email.length < 7) {
            return next(new customError(400, 'email must be at least 7 characters'));
        }
        const isEmailMatched = await User.findOne({ email: email });
        if (isEmailMatched) {
            const isAuthorizedEmail = isEmailMatched.email === user.email;
            if (!isAuthorizedEmail) {
                return next(new customError(400, 'email already exists'));
            }
        }
        user.email = email;
    }

    if (password) {
        if (password.length < 6) {
            return next(new customError(400, 'Password must be at least 6 characters'));
        }
        user.password = password;
    }

    if (profilePicture) {
        user.profilePicture = profilePicture;
    }

    const updatedUser = await user.save();
    console.log(updateUser);

    return res.status(200).json(new ApiResponse(200, { updatedUser }, 'user successfully updated'));
});

export const deleteUser = asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(new customError(403, 'You are not allowed to delete this user'));
    }
    const deleteUser = await User.findByIdAndDelete(req.params.userId);
    if (!deleteUser) {
        return next(new customError(403, 'Error while deleting user'));
    }

    if (req.user.isAdmin && req.user.id !== req.params.userId) {
        res.status(200).json(new ApiResponse(200, {}, 'user has been deleted'));
    } else {
        res.status(200)
            .clearCookie('accessToken', accessTokenOptions)
            .clearCookie('refreshToken', refreshTokenOptions)
            .json(new ApiResponse(200, {}, 'user has been deleted'));
    }
});

export const logoutUser = asyncHandler(async (req, res) => {
    if (req.user.id !== req.params.userId) {
        return next(new customError(403, 'You are not allowed to logout this user'));
    }

    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    res.status(200)
        .clearCookie('accessToken', accessTokenOptions)
        .clearCookie('refreshToken', refreshTokenOptions)
        .json(new ApiResponse(200, { userId: req.user._id }, 'user has been signed out'));
});

export const getUsers = asyncHandler(async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(new customError(403, 'You are not allowed to access users'));
    }

    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;

    const users = await User.find()
        .sort({ createdAt: sortDirection })
        .skip(startIndex)
        .limit(limit)
        .select('-password');

    const totalUsers = await User.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthUsers = await User.countDocuments({ createdAt: { $gte: oneMonthAgo } });

    return res.status(200).json(new ApiResponse(200, { users, totalUsers, lastMonthUsers }, 'Users'));
});

export const getUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.userId).select('-password -email -refreshToken');
    if (!user) {
        return next(new customError(404, 'user not found'));
    }

    res.status(200).json(new ApiResponse(200, user, 'success'));
});
