import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js"
import Post from "../models/postModel.js"

const like = asyncHandler(async(req,res)=>{
    const {postId,commentId} = req.body
    if(!postId && !commentId) throw new ApiError(400,"post or comment id not found")

        const isLiked = await Post.findOne({user:req.userData._id,post:postId})
        if(isLiked) throw new ApiError(400,"User already liked")

        await Post.create({user:req.userData._id,post:postId||undefined,comment:commentId||undefined})
        return res
        .send(201)
        .json(new ApiResponse(201,"Liked",{}))
})

export {like}