import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/customErrorHandler.js";
import { generateAccessAndRefreshToken, accessTokenOptions, refreshTokenOptions } from "../utils/utils.js";

// ------------------ Controllers --------------------------------//
const registerUser = asyncHandler(async (req, res, next) => {
    const { fullName, userName, email, password } = req.body;

    const isUserExisted = await User.findOne({ $or: [{ userName }, { email }] });
    ApiError(next, isUserExisted, 409, "User already exists");

    const user = await User.create({
        fullName,
        userName: userName.toLowerCase(),
        email,
        password,
    });

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    // Response...
    return res
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .status(201)
        .json(new ApiResponse(200, { userId: user._id, accessToken, refreshToken }, "User successfully registered"));
});

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    ApiError(next, !user, 400, "Invalid Credentials");

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    ApiError(next, !isPasswordCorrect, 400, "Invalid Credentials");

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    // Response...
    return res
        .cookie("accessToken", accessToken, accessTokenOptions)
        .cookie("refreshToken", refreshToken, refreshTokenOptions)
        .status(200)
        .json(
            new ApiResponse(200, { userId: loggedInUser._id, accessToken, refreshToken }, "User logged in successfully")
        );
});

const validateToken = asyncHandler(async (req, res) => {
    res.status(200).json(new ApiResponse(200, { userId: req.user._id }, "user valid"));
});

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

    // Response....
    const options = { httpOnly: true, secure: true };
    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, { userId: req.user._id }, "user logged out successfully"));
});

export { registerUser, loginUser, validateToken, logoutUser };
