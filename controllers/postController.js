import Post from "../models/postModel.js";
import ApiError from "../utils/apiError.js"
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js"

const createPost = asyncHandler(async(req,res)=>{
    if(!req.userData && !req.userData._id) throw new ApiError(400,"User is not authenticated")

    const {about,content} = req.body;
    if(!content) throw new ApiError(400,"Content must be provided")

    const postDetails = await Post.create({
        userId:req.userData._id,
        about:about || "",
        content
    })

    return res
    .status(201)
    .json(
        new ApiResponse(201,"Post created successfully",postDetails)
    )
})

export {createPost}