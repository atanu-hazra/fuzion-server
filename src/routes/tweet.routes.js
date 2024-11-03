import { Router } from 'express';
import {
    createTweet,
    updateTweet,
    deleteTweet,
    getUserTweets,
    getAllTweets,
    getTweetById
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from '../middlewares/multer.middleware.js';
import { optionalAuth } from '../middlewares/optionalAuth.middleware.js';

const router = Router();
// router.use(verifyJWT); // Apply verifyJWT middleware to all routes in this file

router
    .route("/")
    .post(
        verifyJWT,
        upload.fields([
            {
                name: "images",
                maxCount: 10
            }
        ]),
        createTweet
    );

router
    .route("/user/:username")
    .get(optionalAuth, getUserTweets);

router
    .route("/:tweetId")
    .get(optionalAuth, getTweetById)
    .patch(verifyJWT, updateTweet)
    .delete(verifyJWT, deleteTweet);

router
    .route("/search")
    .get(optionalAuth, getAllTweets)

export default router