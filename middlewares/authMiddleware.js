import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import config from "../config.js"
import User from "../models/userModel.js"

const auth = asyncHandler(async(req,res,next)=>{
    const accessToken = req.cookies?.accessToken
    if(!accessToken) throw new ApiError(404,"Access toekn not found in request")
    
    const decodedValue = jwt.verify(accessToken,config.accessTokenSecret)
    if(!decodedValue) throw new ApiError(400,"Failed to decode accesstoken")
    console.log(decodedValue);

    const userData = await User.findById(decodedValue._id).select("-password -accessToken")

    req.userData = userData,
    next()
})

export default auth