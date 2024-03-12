import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createUser = asyncHandler(async (req, res) => {
    console.log(req.body)
  const { fullName, mobile,  password, dob, gender } = req.body;
  console.log('fullname:',fullName,"mobile",mobile,"password",password,dob,gender);

  if (!fullName || !mobile || !password || !dob || !gender)
    throw new ApiError(400, "All fields are required");

  const isExistedUser = await User.findOne({mobile
  });

  console.log("isExist :", isExistedUser)
  if (isExistedUser) throw new ApiError(400, "User already exist");

  const user = await User.create({
    fullName,
    mobile,
    password,
    dob,
    gender,
  });

  user.password = undefined;
  user.accessToken = undefined;

  return res
    .status(201)
    .json(new ApiResponse(201, "account created successfully", user));
});

const loginUser = asyncHandler(async (req, res) => {
  const { mobile, password } = req.body;
  if (!mobile || !password)
    throw new ApiError(404, "Mobile and password is required");

  const user = await User.findOne({mobile});
  if (!user) throw new ApiError(404, "User not exist");

  const token = user.generateAccessToken();
  if (!token)
    throw new ApiError(
      500,
      "Failed to generate new access token, please try again"
    );

  user.accessToken = token;
  const loginDetails = await user.save({ validateBeforeSave: false });

  loginDetails.password = undefined;

  return res
    .status(200)
    .cookie("accessToken", token, {
      httpOnly: true,
      secure: true,
    })
    .json(new ApiResponse(200, "Login successfull", loginDetails));
});

const logout = asyncHandler(async(req,res)=>{
  const userId = req.userData?._id
  if(!userId) throw new ApiError(404,"User id needed")

  await User.findOneAndUpdate({_id:userId},{accessToken:undefined})
  console.log(User)

  return res
  .status(201)
  .clearCookie("accessToken","",{httpOnly:true,secure:true})
  .json(new ApiResponse(200,"Logged out successfully",{}))
})

const currentUser = asyncHandler(async(req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200,"User found",{data:req.userData}))
})

const updateProfileImage = asyncHandler(async(req,res)=>{
  if(!req.userData) throw new ApiError(404,"user id not found")
  const {profileImageLink,profileImageId} = req.body
if(!(profileImageLink && profileImageId)) throw new ApiError(400,"image link and id needed");

  await User.findOneAndUpdate({_id:req.userData._id},{profileImageLink,profileImageId})
  return res
  .status(200)
  .json(new ApiResponse(200,"Photo updated successfully"),{})
})

const deleteProfileImage = asyncHandler(async(req,res)=>{
  if(!req.userData) throw new ApiError(404,"user id not found")
  
  await User.findOneAndUpdate({_id:req.userData._id},{profileImageLink:undefined,profileImageId:undefined})
  return res
  .status(200)
  .json(new ApiResponse(200,"Photo updated successfully"),{})
})


const updateCoverImage = asyncHandler(async(req,res)=>{
  if(!req.userData) throw new ApiError(404,"user id not found")
  const {coverImageLink,coverImageId} = req.body
if(!(coverImageLink && coverImageId)) throw new ApiError(400,"image link and id needed");

await User.findOneAndUpdate({_id:req.userData._id},{coverImageLink,coverImageId})
return res
.status(200)
.json(new ApiResponse(200,"Photo updated successfully"),{})
})


const deleteCoverImage = asyncHandler(async(req,res)=>{
  if(!req.userData) throw new ApiError(404,"user id not found")
  
  await User.findOneAndUpdate({_id:req.userData._id},{coverImageLink:undefined,coverImageId:undefined})
  return res
  .status(200)
  .json(new ApiResponse(200,"Photo updated successfully"),{})
})
export { createUser, loginUser,logout,currentUser,updateProfileImage,deleteProfileImage,updateCoverImage,deleteCoverImage};
