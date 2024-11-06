import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    addVideoComment,
    addTweetComment,
    getVideoComments,
    getTweetComments,
    deleteComment,
    updateComment
} from "../controllers/comment.controller.js";

const router = Router();

    router
        .route("/v/:videoId")
        .get(getVideoComments)
        .post(verifyJWT, addVideoComment)

router
    .route("/t/:tweetId")
    .get(getTweetComments)
    .post(verifyJWT, addTweetComment)

router
    .route("/:commentId")
    .patch(verifyJWT, updateComment)
    .delete(verifyJWT, deleteComment)

export default router