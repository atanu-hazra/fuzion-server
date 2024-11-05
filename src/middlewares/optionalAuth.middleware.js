import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const optionalAuth = asyncHandler(async (req, _, next) => {
    try {

        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken

        if (!token) {
            return next()
        }

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        } catch (error) {
            console.warn("Token verification failed:", error.message);
            return next()
        }

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            console.error("Authentication failed.")
            return next()
        }

        req.user = user
        next()

    } catch (error) {
        console.error(error?.message || "Authentication failed.")
    }
})
