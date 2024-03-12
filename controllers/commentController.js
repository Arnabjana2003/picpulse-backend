import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Comment from "../models/commentModel.js";


const addComment = asyncHandler(async(req,res)=>{
    const {content,postId,parentCommentId} = req.body
    if(!content || !postId) throw new ApiError(404,"content and postid id required")

    const addedComment = await Comment.create({
        content,postId,userId:req.userData?._id,parentCommentId: parentCommentId || null
    })
    if(parentCommentId){
        const prevComment = await Comment.findOne({_id:parentCommentId})
        if(!prevComment) throw new ApiError(404,"Parent comment not found")

        prevComment.replies.push(addedComment._id)
        await prevComment.save()
    }

    return res
    .status(200)
    .json(new ApiResponse(201,"Comment added"))
})

export {addComment}