import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Comment from "../models/commentModel.js";
import Like from "../models/likeModel.js"


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

const updateComment = asyncHandler(async(req,res)=>{
    if(!req?.userData._id) throw new ApiError(401,"User not authenticated")

    const {content,commentId} = req.body;
    if(!content || !commentId)throw new ApiError(400,"Comment and its id are require");

    const isUpdated = await Comment.findOneAndUpdate({_id:commentId,userId:req.userData._id},{content})
    if(!isUpdated) throw new ApiError(500,"Unable to update comment")

    return res.
    status(200)
    .json(new ApiResponse(200,"Updated comment",{}))
})

const deleteComment = asyncHandler(async(req,res)=>{
    if(!req?.userData._id) throw new ApiError(401,"User not authenticated")

    const {commentId} = req.body
    if(!commentId) throw new ApiError(400,"comment id is required")

    const isDeleted = await Comment.findOneAndDelete({userId:req.userData._id,_id:commentId})
    await Like.deleteMany({comment:commentId})
    if(!isDeleted)throw new ApiError(500,"Unable to delete comment")

    return res
    .status(200)
    .json(new ApiResponse(200,"Comment deleted",{}))
})

export {addComment,updateComment,deleteComment}