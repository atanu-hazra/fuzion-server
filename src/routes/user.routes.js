import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    changeCurrentPassword,
    getCurrentUser,
    getUserChannelProfile,
    getWatchHistory,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    removeUserAvatar,
    removeUserCoverImage,
    emailRegistration,
    verifyEmail,
    sendForgotPasswordOTP,
    verifyForgotPasswordOTP,
    forgotPassword,
    deleteAccount
} from "../controllers/user.controller.js";

const router = Router()

router.route("/register-email").post(emailRegistration)

router.route("/verify-email").post(verifyEmail)

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

router.route("/send-forgot-password-otp").post(sendForgotPasswordOTP)

router.route("/verify-forgot-password-otp").post(verifyForgotPasswordOTP)

router.route("/forgot-password").post(forgotPassword)


// secured routes
router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-access-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)

router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-profile").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
)

router.route("/update-cover").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage
)

router.route("/:username").get(getUserChannelProfile)

router.route("/v/watch-history").get(verifyJWT, getWatchHistory)

router.route("/delete-user").delete(verifyJWT, deleteAccount)

router.route("/remove-avatar").delete(verifyJWT, removeUserAvatar)

router.route("/remove-cover").delete(verifyJWT, removeUserCoverImage)

export default router