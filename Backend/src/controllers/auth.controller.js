import User from '../models/user.model.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import customError from '../utils/customErrorHandler.js';
import { generateAccessAndRefreshToken, accessTokenOptions, refreshTokenOptions } from '../utils/utils.js';

// ------------------ Controllers --------------------------------//
export const registerUser = asyncHandler(async (req, res, next) => {
    const { fullName, userName, email, password } = req.body;

    const isUserExisted = await User.findOne({ $or: [{ userName }, { email }] });
    if (isUserExisted) {
        return next(new customError(409, 'User already exists'));
    }

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
    });

    // Response...
    return res.status(201).json(new ApiResponse(200, { userId: user._id }, 'User successfully registered'));
});

export const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const validUser = await User.findOne({ email });
    if (!validUser) {
        return next(new customError(400, 'Invalid Credentials'));
    }

    const isPasswordCorrect = await validUser.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return next(new customError(400, 'Invalid Credentials'));
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(validUser._id);
    const user = await User.findById(validUser._id).select('-password -refreshToken');

    // Response...
    return res
        .cookie('accessToken', accessToken, accessTokenOptions)
        .cookie('refreshToken', refreshToken, refreshTokenOptions)
        .status(200)
        .json(new ApiResponse(200, { user, accessToken, refreshToken }, 'User logged in successfully'));
});

export const googleSignIn = asyncHandler(async (req, res, next) => {
    const { name, email, googlePhotoUrl } = req.body;
    console.log(name, email, googlePhotoUrl);

    const user = await User.findOne({ email });
    if (user) {
        user.fullName = name;
        user.profilePicutre = googlePhotoUrl;
        await user.save();

        const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);
        const userRes = await User.findById(user._id).select('-password -refreshToken');

        res.status(200)
            .cookie('accessToken', accessToken, accessTokenOptions)
            .cookie('refreshToken', refreshToken, refreshTokenOptions)
            .json(new ApiResponse(200, { user: userRes, accessToken, refreshToken }, 'user SignIn successfully'));
    } else {
        const password = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const userName = name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4);

        const newUser = new User({
            fullName: name,
            userName,
            email,
            password,
            profilePicutre: googlePhotoUrl,
        });
        await newUser.save();

        const { accessToken, refreshToken } = generateAccessAndRefreshToken(newUser._id);
        const userRes = await User.findById(user._id).select('-password -refreshToken');

        res.status(200)
            .cookie('accessToken', accessToken, accessTokenOptions)
            .cookie('refreshToken', refreshToken, refreshTokenOptions)
            .json(new ApiResponse(200, { user: userRes, accessToken, refreshToken }, 'user SignIn successfully '));
    }
});

export const validateToken = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, { userId: req.user._id }, 'user valid'));
});

export const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    // Response....
    const options = { httpOnly: true, secure: true };
    res.status(200)
        .clearCookie('accessToken', options)
        .clearCookie('refreshToken', options)
        .json(new ApiResponse(200, { userId: req.user._id }, 'user logged out successfully'));
});
