import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const optionalAuth = asyncHandler(async (req, _, next) => {
    try {

        // console.log("req.cookies", req.cookies)

        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken

        if (!token) {
            return next()
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

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
