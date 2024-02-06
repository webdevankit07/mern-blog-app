import User from '../models/user.model.js';
import customError from './customErrorHandler.js';

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        console.log({ accessToken, refreshToken });
        return { accessToken, refreshToken };
    } catch (error) {
        console.log(error.message);
        new customError(500, error.message);
    }
};

export const accessTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 86400000,
};

export const refreshTokenOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 864000000,
};
