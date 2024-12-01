import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { SavedTweet } from "../models/savedTweet.model.js";


const toggleSaveTweet = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiError(400, "Tweet Id is missing.")
    }

    if (!mongoose.isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet Id format.")
    }

    let savedTweets = await SavedTweet.findOne({
        savedBy: new mongoose.Types.ObjectId(String(req.user._id))
    })

    // If no savedTweets exist, create a new document
    if (!savedTweets) {
        savedTweets = new SavedTweet({
            savedBy: req.user._id,
            tweets: []
        })
    }

    const isTweetSaved = savedTweets.tweets.includes(tweetId)

    if (isTweetSaved) {
        const tweetIndex = savedTweets.tweets.indexOf(tweetId)
        savedTweets.tweets.splice(tweetIndex, 1)
    } else {
        savedTweets.tweets.push(tweetId)
    }

    try {
        await savedTweets.save({ validateBeforeSave: false })
    } catch (error) {
        throw new ApiError(400, "Update Error: " + error.message)
    }

    const message = isTweetSaved ? "Tweet unsaved successfully." : "Tweet saved successfully."

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                savedTweets,
                message
            )
        )
})

const getSavedTweets = asyncHandler(async (req, res) => {

    let savedTweets;
    const userId = req.user ? req.user._id : null;
    
    try {
        savedTweets = await SavedTweet.aggregate([
            {
                $match: {
                    savedBy: new mongoose.Types.ObjectId(String(req.user._id))
                }
            },
            {
                $lookup: {
                    from: "tweets",
                    localField: "tweets",
                    foreignField: "_id",
                    as: "tweets",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            fullName: 1,
                                            username: 1,
                                            avatar: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: "likes",
                                localField: "_id",
                                foreignField: "tweet",
                                as: "likes",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "likedBy",
                                            foreignField: "_id",
                                            as: "likedBy",
                                            pipeline: [
                                                {
                                                    $project: {
                                                        fullName: 1,
                                                        username: 1,
                                                        avatar: 1
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $addFields: {
                                            likedBy: { $arrayElemAt: ["$likedBy", 0] }
                                        }
                                    },
                                    {
                                        $project: {
                                            likedBy: 1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $lookup: {
                                from: "savedtweets",
                                let: { tweetId: "$_id", userId: userId },
                                pipeline: [
                                    { $match: { $expr: { $and: [{ $in: ["$$tweetId", "$tweets"] }, { $eq: ["$savedBy", "$$userId"] }] } } },
                                    { $project: { _id: 1 } }
                                ],
                                as: "savedByUser"
                            }
                        },
                        {
                            $lookup: {
                                from: "comments",
                                localField: "_id",
                                foreignField: "tweet",
                                as: "comments",
                                pipeline: [
                                    {
                                        $lookup: {
                                            from: "users",
                                            localField: "owner",
                                            foreignField: "_id",
                                            as: "owner",
                                            pipeline: [
                                                {
                                                    $project: {
                                                        fullName: 1,
                                                        username: 1,
                                                        avatar: 1
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        $addFields: {
                                            owner: { $arrayElemAt: ["$owner", 0] }
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields: {
                                owner: {
                                    $arrayElemAt: ["$owner", 0]
                                },
                                likesCount: {
                                    $size: "$likes"
                                },
                                commentsCount: {
                                    $size: "$comments"
                                },
                                isLikedByUser: userId ? {
                                    $cond: {
                                        if: { $isArray: "$likes.likedBy._id" },
                                        then: { $in: [userId, "$likes.likedBy._id"] },
                                        else: false
                                    }
                                } : false,
                                isSavedByUser: {
                                    $cond: {
                                        if: { $isArray: "$savedByUser" },
                                        then: { $gt: [{ $size: "$savedByUser" }, 0] },
                                        else: false
                                    }
                                }
                            }
                        },
                    ]
                }
            }
        ])
    } catch (error) {
        throw new ApiError(500, "Aggregation Error: " + error.message)
    }

    let responseMessage = "Tweets fetched Successfully.";
    let responseData = savedTweets[0] || {};

    if (!savedTweets[0].tweets || savedTweets[0].tweets.length === 0) {
        responseMessage = "No saved tweets found.";
        responseData = {tweets: []};
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                responseData,
                responseMessage
            )
        )
})


export {
    toggleSaveTweet,
    getSavedTweets
}