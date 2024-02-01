import User from "../models/user.model.js";
import { ApiError } from "../utils/customErrorHandler.js";
import jwt from "jsonwebtoken";

const verifyToken = async (req, _, next) => {
    const token = req.cookies?.accessToken;
    ApiError(next, !token, 401, "unauthorized");

    try {
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        ApiError(next, !decodeToken, 401, "unauthorized");

        const user = await User.findById(decodeToken._id).select("-password -refreshToken");
        ApiError(next, !user, 401, "Invalid access token");

        req.user = user;
        next();
    } catch (error) {
        return ApiError(next, error, 401, "Invalid access Token");
    }
};

export default verifyToken;
