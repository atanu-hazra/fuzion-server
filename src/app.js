import express from "express"
import cors from 'cors'
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiError.js"

const app = express()

// Apply CORS globally with specific origins
const allowedOrigins = [process.env.CORS_ORIGIN, 'https://cron-job.org'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); // Allow the request
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow credentials (cookies, etc.) to be sent
}));

app.get('/health', (req, res) => {
    res.status(200).send('Server is running');
});

// express configurations

// Middleware to parse incoming JSON requests with a limit of 16kb
app.use(express.json({ limit: "16kb" }));

// Middleware to parse incoming URL-encoded form data with extended options and a limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse cookies from incoming requests
app.use(cookieParser());

// importing routes
import userRouter from './routes/user.routes.js'
import videoRouter from './routes/video.routes.js'
import subscriptionRouter from './routes/subscription.routes.js'
import tweetRouter from './routes/tweet.routes.js'
import likeRouter from './routes/like.routes.js'
import commentRouter from './routes/comment.routes.js'
import playlistRouter from './routes/playlist.routes.js'
import savedTweetRouter from './routes/savedTweet.routes.js'
import reportRouter from './routes/report.routes.js'

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/playlists", playlistRouter)
app.use("/api/v1/savedtweets", savedTweetRouter)
app.use("/api/v1/reports", reportRouter)

// middleware to send proper error response
app.use((err, req, res, next) => {
    // Default status code and message
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errorResponse = { status: statusCode, message };

    if (err instanceof ApiError) {
        errorResponse.error = err.error || [];
    }

    // Send the JSON response for API requests
    return res.status(statusCode).json(errorResponse);
});

export { app }