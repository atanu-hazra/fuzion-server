import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";
import {
    createPlaylist,
    addVideoToPlaylist,
    deletePlaylist,
    getPlaylistById,
    getUserPlaylists,
    removeVideoFromPlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/").post(verifyJWT, createPlaylist)

router
    .route("/:playlistId")
    .get(optionalAuth, getPlaylistById)
    .patch(verifyJWT, updatePlaylist)
    .delete(verifyJWT, deletePlaylist)

router
    .route("/add/:videoId/:playlistId")
    .patch(verifyJWT, addVideoToPlaylist)

router
    .route("/remove/:videoId/:playlistId")
    .patch(verifyJWT, removeVideoFromPlaylist)

router.route("/user/:userId").get(optionalAuth, getUserPlaylists)

export default router