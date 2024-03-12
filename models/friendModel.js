import mongoose, { Schema } from "mongoose";

const friendModel = new Schema({
    sentTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    sentBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    status:{
        type: String,
        emun: ["Pending","Accepted","Rejected"],
        default: "Pending",
    },
    acceptedDate:Date
},{timestamps:true})

const Friend = mongoose.model("Friend",friendModel)

export default Friend