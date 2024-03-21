import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const auth = asyncHandler(async (req, res, next) => {
  const accessToken =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

    console.log(accessToken)
  if (!accessToken) throw new ApiError(401, "accessToken not found in request");

  //verify the access token from jwt
  const decodedValue = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
  if (!decodedValue) throw new ApiError(500, "Failed to match access token");

  //find the user
  const userData = await User.findById(decodedValue._id).select(
    "-password -refreshToken"
  );
  if (!userData) throw new ApiError(401, "Invalid access token");

  //inject user details in the request
  req.userData = userData;

  next();
});

export default auth;
