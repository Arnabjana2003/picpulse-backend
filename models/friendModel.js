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
        required: true,
        emun: ["Pending","Accepted","Rejected"]
    },
    acceptedDate:Date
},{timestamps:true})

const Friend = mongoose.model("Friend",friendModel)

export default Friend