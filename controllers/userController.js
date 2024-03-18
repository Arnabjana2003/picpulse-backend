import mongoose from "mongoose";
import User from "../models/userModel.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

const createUser = asyncHandler(async (req, res) => {
  console.log(req.body);
  const { fullName, mobile, password, dob, gender } = req.body;

  if (!fullName || !mobile || !password || !dob || !gender)
    throw new ApiError(400, "All fields are required");

  const isExistedUser = await User.findOne({ mobile });

  console.log("isExist :", isExistedUser);
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

  const user = await User.findOne({ mobile });
  if (!user) throw new ApiError(404, "User not exist");
  const isPasswordCorrect = await user.isPasswordCorrect(password)
  console.log(isPasswordCorrect)
  if(!isPasswordCorrect) throw new ApiError(400,"Wrong password entered")

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

const logout = asyncHandler(async (req, res) => {
  const userId = req.userData?._id;
  if (!userId) throw new ApiError(404, "User id needed");

  await User.findOneAndUpdate({ _id: userId }, { accessToken: undefined });
  console.log(User);

  return res
    .status(201)
    .clearCookie("accessToken", "", { httpOnly: true, secure: true })
    .json(new ApiResponse(200, "Logged out successfully", {}));
});

const currentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, "User found", { data: req.userData }));
});

const updateProfileImage = asyncHandler(async (req, res) => {
  if (!req.userData) throw new ApiError(404, "user id not found");
  const { profileImageLink, profileImageId } = req.body;
  if (!(profileImageLink && profileImageId))
    throw new ApiError(400, "image link and id needed");

  await User.findOneAndUpdate(
    { _id: req.userData._id },
    { profileImageLink, profileImageId }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Photo updated successfully",{}));
});

const deleteProfileImage = asyncHandler(async (req, res) => {
  if (!req.userData) throw new ApiError(404, "user id not found");

  await User.findOneAndUpdate(
    { _id: req.userData._id },
    { profileImageLink: undefined, profileImageId: undefined }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Photo updated successfully",{}));
});

const updateCoverImage = asyncHandler(async (req, res) => {
  if (!req.userData) throw new ApiError(404, "user id not found");
  const { coverImageLink, coverImageId } = req.body;
  if (!(coverImageLink && coverImageId))
    throw new ApiError(400, "image link and id needed");

  await User.findOneAndUpdate(
    { _id: req.userData._id },
    { coverImageLink, coverImageId }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Photo updated successfully",{}));
});

const deleteCoverImage = asyncHandler(async (req, res) => {
  if (!req.userData) throw new ApiError(404, "user id not found");

  await User.findOneAndUpdate(
    { _id: req.userData._id },
    { coverImageLink: undefined, coverImageId: undefined }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Photo updated successfully",{}));
});

const getFeeds = asyncHandler(async (req, res) => {
  console.log("query: ", req.query);
  console.log("userid", req.userData?._id, "done");
  const feeds = await User.aggregate([
    {
      $match: {
        _id: req.userData?._id,
      },
    },
    {
      $lookup: {
        from: "friends",
        foreignField: "sentBy",
        localField: "_id",
        as: "friendsByUser",
        pipeline: [
          {
            $match: { status: "Accepted" },
          },
          {
            $project: {
              sentTo: 1,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "friends",
        foreignField: "sentTo",
        localField: "_id",
        as: "friendsToUser",
        pipeline: [
          {
            $match: { status: "Accepted" },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "posts",
        foreignField: "userId",
        localField: "friendsByUser.sentTo",
        as: "posts1",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "userId",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    gender: 1,
                    profileImageLink: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $arrayElemAt: ["$owner", 0],
              },
            },
          },
          {
            $lookup: {
              from: "likes",
              foreignField: "post",
              localField: "_id",
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "comments",
              foreignField: "postId",
              localField: "_id",
              as: "comments",
            },
          },
          {
            $addFields: {
              commentsCount: { $size: "$comments" },
              likesCount: { $size: "$likes" },
              isLiked: {
                $cond: {
                  if: { $in: [req.userData?._id, "$likes"] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              likes: 0,
              comments: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "posts",
        foreignField: "userId",
        localField: "friendsToUser.sentBy",
        as: "posts2",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "userId",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    gender: 1,
                    profileImageLink: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $arrayElemAt: ["$owner", 0],
              },
            },
          },
          {
            $lookup: {
              from: "likes",
              foreignField: "post",
              localField: "_id",
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "comments",
              foreignField: "postId",
              localField: "_id",
              as: "comments",
            },
          },
          {
            $addFields: {
              commentsCount: { $size: "$comments" },
              likesCount: { $size: "$likes" },
              isLiked: {
                $cond: {
                  if: { $in: [req.userData?._id, "$likes"] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              likes: 0,
              comments: 0,
            },
          },
        ],
      },
    },
    {
      $lookup: {
        from: "posts",
        foreignField: "userId",
        localField: "_id",
        as: "posts3",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "userId",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    gender: 1,
                    profileImageLink: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $arrayElemAt: ["$owner", 0],
              },
            },
          },
          {
            $lookup: {
              from: "likes",
              foreignField: "post",
              localField: "_id",
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "comments",
              foreignField: "postId",
              localField: "_id",
              as: "comments",
            },
          },
          {
            $addFields: {
              commentsCount: { $size: "$comments" },
              likesCount: { $size: "$likes" },
              isLiked: {
                $cond: {
                  if: { $in: [req.userData?._id, "$likes.user"] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              likes: 0,
              comments: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        feeds: { $concatArrays: ["$posts1", "$posts2", "$posts3"] },
      },
    },
    {
      $project: {
        feeds: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, "Feeds fetched successfully", feeds[0]));
});

const viewProfile = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  if (!userId)
    throw new ApiError(
      400,
      "User id is required of which profile view is needed"
    );
  const data = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "friends",
        foreignField: "sentBy",
        localField: "_id",
        as: "sentByUser",
        pipeline:[
          {$match: {
            status: "Accepted"
          }}
        ]
      },
    },
    {
      $lookup: {
        from: "friends",
        foreignField: "sentTo",
        localField: "_id",
        as: "sentToUser",
        pipeline:[
          {$match: {
            status: "Accepted"
          }}
        ]
      },
    },
    {
      $lookup: {
        from: "posts",
        foreignField: "userId",
        localField: "_id",
        as: "posts",
        pipeline: [
          {
            $lookup: {
              from: "users",
              foreignField: "_id",
              localField: "userId",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    gender: 1,
                    profileImageLink: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $arrayElemAt: ["$owner", 0],
              },
            },
          },
          {
            $lookup: {
              from: "likes",
              foreignField: "post",
              localField: "_id",
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "comments",
              foreignField: "postId",
              localField: "_id",
              as: "comments",
            },
          },
          {
            $addFields: {
              commentsCount: { $size: "$comments" },
              likesCount: { $size: "$likes" },
              isLiked: {
                $cond: {
                  if: { $in: [req.userData?._id, "$likes.user"] },
                  then: true,
                  else: false,
                },
              },
            },
          },
          {
            $project: {
              likes: 0,
              comments: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        friendsCount: {
          $size: { $concatArrays: ["$sentToUser", "$sentByUser"] },
        },
      },
    },
    {
      $project: {
        password: 0,
        accessToken: 0,
        sentByUser: 0,
        sentToUser: 0,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, "user profile fetched", data));
});
export {
  createUser,
  loginUser,
  logout,
  currentUser,
  updateProfileImage,
  deleteProfileImage,
  updateCoverImage,
  deleteCoverImage,
  getFeeds,
  viewProfile,
};
