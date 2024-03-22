import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Friend from "../models/friendModel.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

const sendRequest = asyncHandler(async (req, res) => {
  const { sentTo } = req.body;
  if (!sentTo)
    throw new ApiError(
      400,
      "The userId whome trying to send request is required"
    );
  if (sentTo == req.userData?._id)
    throw new ApiError(400, "Can't send request to own");

  const isSent = await Friend.findOne({
    sentBy: req.userData?._id,
    sentTo,
    $or: [{ status: "Pending" }, { status: "Accepted" }],
  });
  if (isSent) throw new ApiError(400, "Request already sent");

  await Friend.create({
    sentBy: req.userData?._id,
    sentTo,
  });
  return res.status(200).json(new ApiResponse(200, "Friend request sent", {}));
});

const acceptResquest = asyncHandler(async (req, res) => {
  if (!req.userData) throw new ApiError(401, "User not authenticated");
  const { sentBy } = req.body;
  if (!sentBy)
  throw new ApiError(
400,
"The userId whome trying to accept request is required"
);

const isAccepted = await Friend.findOne({
  sentTo: req.userData?._id,
  sentBy,
  status: "Accepted",
});
  if (isAccepted) throw new ApiError(400, "Already friend");

  await Friend.findOneAndUpdate(
    { sentTo: req.userData?._id, sentBy, status: "Pending" },
    { status: "Accepted" }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Friend request accepted", {}));
});

const rejectResquest = asyncHandler(async (req, res) => {
  const { sentBy } = req.body;
  if (!sentBy)
    throw new ApiError(
      400,
      "The userId whome trying to reject request is required"
    );

  const isPending = await Friend.findOne({
    sentTo: req.userData?._id,
    sentBy,
    status: "Pending",
  });
  if (!isPending) throw new ApiError(404, "No Pending request");
  await Friend.findOneAndDelete({
    sentTo: req.userData?._id,
    sentBy,
    status: "Pending",
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Friend request rejected", {}));
});

const suggestedFriends = asyncHandler(async (req, res) => {
  const userFriends = await Friend.find({$or:[{sentBy:req.userData._id},{sentTo:req.userData._id}]})
  let friendList =  userFriends.map(friend => friend.sentTo.equals(req.userData._id) ? friend.sentBy : friend.sentTo);
  const result = await User.aggregate([
    {
      $match: {
        $and:[
          {_id: { $nin: friendList }},
          {_id: {$ne: req.userData._id}}
        ]
      }
    }
  ]);
  return res.status(200).json(new ApiResponse(200, "", result));
});

const friendRequest = asyncHandler(async (req, res) => {
  const requests = await Friend.aggregate([
    {
      $match: {
        $and: [{ sentTo: req?.userData?._id }, { status: "Pending" }],
      },
    },
    {
      $lookup: {
        from: "users",
        foreignField: "_id",
        localField: "sentBy",
        as: "profile",
        pipeline: [
          {
            $project: {
              fullName: 1,
              profileImageLink: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        profile: { $first: "$profile" },
      },
    },
    {
      $project: {
        profile: 1,
      },
    },
  ]);
  return res.status(200).json(new ApiResponse(200, "", requests));
});

const getPendingReqCount = asyncHandler(async (req, res) => {
  if (!req.userData) throw new ApiError(400, "User not authenticated");
  const pendingCount = await Friend.aggregate([
    {
      $match: {
        sentTo: req.userData?._id, // Filter by the recipient user ID
        status: "Pending", // Filter by pending status
      },
    },
    {
      $group: {
        _id: null, // Group all documents into a single group
        count: { $sum: 1 }, // Count the number of documents in the group
      },
    },
  ]);
  const pendingRequestCount =
    pendingCount.length > 0 ? pendingCount[0].count : 0;
  return res
    .status(200)
    .json(new ApiResponse(200, "", { pendingRequestCount, pendingCount }));
});
export {
  sendRequest,
  acceptResquest,
  rejectResquest,
  suggestedFriends,
  friendRequest,
  getPendingReqCount,
};
