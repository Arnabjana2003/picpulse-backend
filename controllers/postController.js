import mongoose from "mongoose";
import Post from "../models/postModel.js";
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"

const createPost = asyncHandler(async(req,res)=>{
    if(!req?.userData && !req?.userData?._id) throw new ApiError(400,"User is not authenticated")

    const {about,contentId,contentUrl} = req.body;
    if(!contentId && !contentUrl) throw new ApiError(400,"Content must be provided")

    const postDetails = await Post.create({
        userId:req.userData._id,
        about:about || "",
        contentId,
        contentUrl
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,"Post created successfully",postDetails)
    )
})

const viewPost = asyncHandler(async(req,res)=>{
    const {postId} = req.body
    if(!postId) throw new ApiError(400,"Both userId and postId are required");

    const result = await Post.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(postId)
            }
        },
        {
            $lookup:{
                from: "users",
                foreignField:"_id",
                localField:"userId",
                as:"owner",
                pipeline:[
                    {$project:{
                        fullName:1,
                        profileImageLink:1    
                    }},
                ]
            }
        },
        {
            $addFields:{owner:{$first:"$owner"}}
        },
        {
            $lookup:{
                from:"comments",
                foreignField:"postId",
                localField:"_id",
                as:"comments",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            foreignField:"_id",
                            localField:"userId",
                            as:"commenter",
                            pipeline:[
                                {
                                    $project: {fullName:1,profileImageLink:1}
                                }
                            ]
                        }
                    },
                    {
                        $lookup:{
                            from:"likes",
                            foreignField:"comment",
                            localField:"_id",
                            as:"likes",
                        }
                    },
                    {
                        $addFields:{
                            commenter: {$first: "$commenter"},
                            likesCount:{$size:"$likes"},
                            isLiked:{
                                $cond:{
                                    if:{$in:[req?.userData?._id,"$likes.user"]},
                                    then:true,
                                    else:false
                                }
                            }
                        }
                    },
                    {
                        $project:{
                            content:1,
                            commenter:1,
                            createdAt:1,
                            updatedAt:1,
                            likesCount:1,
                            isLiked:1,
                        }
                    }
                ]
            }
        },
    ])
    return res
    .status(200)
    .json(new ApiResponse(200,"post details fetched",result[0]))
})

export {createPost,viewPost}