import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async (req, _, next) => {
    try {

        // console.log("req.cookies", req.cookies)

        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken

        console.log("this is token in verifyJWT", token)

        if (!token) {
            throw new ApiError(401, "Unauthorized request.")
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if (!user) {
            throw new ApiError(401, "Authentication failed.")
        }
        //  console.log("req.user in auth", req.user)
        req.user = user
        next()

    } catch (error) {
        throw new ApiError(401, error?.message || "Authentication failed.")
    }
})
