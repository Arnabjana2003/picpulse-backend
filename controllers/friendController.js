import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiResponse.js";
import Friend from "../models/friendModel.js";

const sendRequest = asyncHandler(async (req, res) => {
  const { sentTo } = req.body;
  if (!sentTo)
    throw new ApiError(
      400,
      "The userId whome trying to send request is required"
    );

  const isSent = await Friend.findOne({ sentBy: req.userData?._id, sentTo ,$or:[{status:"Pending"},{status:"Accepted"}]});
  if (isSent) throw new ApiError(400, "Request already sent");

  await Friend.create({
    sentBy: req.userData?._id,
    sentTo,
  });
  return res.status(200).json(new ApiResponse(200, "Friend request sent", {}));
});

const acceptResquest = asyncHandler(async (req, res) => {
    const { sentTo } = req.body;
  if (!sentTo)
    throw new ApiError(
      400,
      "The userId whome trying to accept request is required"
    );

  const isSent = await Friend.findOne({ sentBy: req.userData?._id, sentTo,status:"Accepted"});
  if (isSent) throw new ApiError(400, "Already friend");

  await Friend.findOneAndUpdate({sentBy: req.userData?._id, sentTo,status:"Pending"},{status:"Accepted"})
  return res.status(200).json(new ApiResponse(200, "Friend request accepted", {}));
});

const rejectResquest = asyncHandler(async (req, res) => {
    const { sentTo } = req.body;
  if (!sentTo)
    throw new ApiError(
      400,
      "The userId whome trying to reject request is required"
    );

//   const isSent = await Friend.findOne({ sentBy: req.userData?._id, sentTo,status:"Accepted"});
//   if (isSent) throw new ApiError(400, "Already friend");

  await Friend.findOneAndUpdate({sentBy: req.userData?._id, sentTo,status:"Pending"},{status:"Rejected"})
  return res.status(200).json(new ApiResponse(200, "Friend request rejected", {}));
});

export { sendRequest,acceptResquest,rejectResquest };
