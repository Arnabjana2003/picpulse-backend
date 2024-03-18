import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Friend from "../models/friendModel.js";
import User from "../models/userModel.js"


  const sendRequest = asyncHandler(async (req, res) => {
  const { sentTo } = req.body;
  if (!sentTo)
    throw new ApiError(
      400,
      "The userId whome trying to send request is required"
    );
    if(sentTo == req.userData?._id) throw new ApiError(400,"Can't send request to own")

  const isSent = await Friend.findOne({ sentBy: req.userData?._id, sentTo ,$or:[{status:"Pending"},{status:"Accepted"}]});
  if (isSent) throw new ApiError(400, "Request already sent");

  await Friend.create({
    sentBy: req.userData?._id,
    sentTo,
  });
  return res.status(200).json(new ApiResponse(200, "Friend request sent", {}));
});

const acceptResquest = asyncHandler(async (req, res) => {
    const { sentBy } = req.body;
  if (!sentBy)
    throw new ApiError(
      400,
      "The userId whome trying to accept request is required"
    );

  const isSent = await Friend.findOne({ sentTo: req.userData?._id, sentBy,status:"Accepted"});
  if (isSent) throw new ApiError(400, "Already friend");

  await Friend.findOneAndUpdate({sentBy: req.userData?._id, sentTo,status:"Pending"},{status:"Accepted"})
  return res.status(200).json(new ApiResponse(200, "Friend request accepted", {}));
});

const rejectResquest = asyncHandler(async (req, res) => {
    const { sentBy } = req.body;
  if (!sentBy)
    throw new ApiError(
      400,
      "The userId whome trying to reject request is required"
    );

  const isPending = await Friend.findOne({sentTo: req.userData?._id, sentBy,status:"Pending"})
  if(!isPending) throw new ApiError(404,"No Pending request")
  await Friend.findOneAndDelete({sentTo: req.userData?._id, sentBy,status:"Pending"})
  return res.status(200).json(new ApiResponse(200, "Friend request rejected", {}));
});

const suggestedFriends = asyncHandler(async(req,res)=>{
    const allFriends = await User.aggregate([
      {
        $match: {
          _id: req.userData?._id,
        },
      },
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "sentBy",
          as: "reqSentBy",
        },
      },
      {
        $lookup: {
          from: "friends",
          localField: "_id",
          foreignField: "sentTo",
          as: "reqSentTo",
        },
      },
      {
        $project: {
          reqSentBy:1,
          reqSentTo:1
        }
      }
      
    ])
    const allUsers = await User.find({_id:{$ne:req.userData._id}})
    const suggestedFriendsList1 = allFriends[0]?.reqSentBy && allUsers.filter((user)=>allFriends[0].reqSentBy.some(friend=>user._id == friend.sentBy))
    const suggestedFriendsList2 = allFriends[0]?.reqSentTo && allUsers.filter((user)=>allFriends[0].reqSentTo.some(friend=>user._id == friend.sentTo))
    let result;
    if(!allFriends[0].reqSentTo.length && !allFriends[0].reqSentBy.length){
      result = allUsers
    } else{
      result = [...suggestedFriendsList1,...suggestedFriendsList2]
    }
    // const sentByArr = allFriends[0].reqSentBy.map((fnd)=>fnd.sentBy)
    // const sentToArr = allFriends[0].reqSentTo.map((fnd)=>fnd.sentTo)
    // console.log({sentByArr,sentToArr})
    // const friends = [...new Set([...sentByArr, ...sentToArr])];
    // // console.log({friends})
    // const allUsers = await User.find({_id:{$ne:req.userData._id}})
    // // console.log("friList",friends)
    // const suggestedFriends = allUsers.filter(user=>friends.some(fnd=>fnd == user._id))
    // console.log("users",allUsers,"frinds",friends)
    // const result = friends.length?suggestedFriends:allUsers
    // console.log(result)
    return res
    .status(200)
    .json(new ApiResponse(200,"",result))
  })

  const friendRequest = asyncHandler(async(req,res)=>{
    const requests = await Friend.aggregate([
      {
        $match: {
          $and: [
            { sentTo: req?.userData?._id },
            { status: "Pending" },
          ],
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
          profile: {$first: "$profile"}
        }
      },
      {
        $project: {
          profile:1
        }
      }
    ])
    return res
    .status(200)
    .json(new ApiResponse(200,"",requests))
  })
export { sendRequest,acceptResquest,rejectResquest,suggestedFriends,friendRequest };
