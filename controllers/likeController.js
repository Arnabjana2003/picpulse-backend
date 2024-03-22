import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Like from "../models/likeModel.js";

const like = asyncHandler(async (req, res) => {
  if (!req?.userData._id) throw new ApiError(401, "User not authenticated");
  const { postId, commentId } = req.body;
  if (!postId && !commentId)
    throw new ApiError(400, "post or comment id not found");

  if(!commentId){
    const isPostLiked = await Like.findOne({
      user: req.userData._id,
      post: postId,
    });
    console.log({postId,commentId,isLiked})
    if (isPostLiked) throw new ApiError(400, "User already liked");
  }else{
    const isCommentLiked = await Like.findOne({
      user: req.userData._id,
      comment: commentId,
    });
    console.log({postId,commentId,isLiked})
    if (isCommentLiked) throw new ApiError(400, "User already liked");
  }

  await Like.create({
    user: req.userData._id,
    post: postId || undefined,
    comment: commentId || undefined,
  });

  return res.status(201).json(new ApiResponse(201, "Liked", {}));
});

const unlike = asyncHandler(async (req, res) => {
  if (!req?.userData._id) throw new ApiError(401, "User not authenticated");
  const { postId, commentId } = req.body;
  if (!postId && !commentId)
    throw new ApiError(400, "Any of postId and commentId is required");
  const isLiked = await Like.findOne({
    user: req?.userData?._id,
    $or: [{ post: postId }, { comment: commentId }],
  });
  if (!isLiked) throw new ApiError(400, "User did not like yet");
  const isDeleted =   await Like.findOneAndDelete({user:req.userData._id,$or:[{post:postId},{comment:commentId}]})
  if(!isDeleted) throw new ApiError("Failed to unlike")
  return res.
status(200)
.json(new ApiResponse(200,"unliked",{}))
});

export { like,unlike };
