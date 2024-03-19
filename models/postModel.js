import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    about: String,
    contentUrl:{
        type:String, //appwrite url
        required: [true,"Content link is required"],
    },
    type:String,
    contentId:{
        type:String, //appwrite id
        required: [true,"Content id is required"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true,"User id is required"]
    },
    // likes:{
    //     type: Number,
    //     default: 0
    // },
    // comments:{
    //     type: Number,
    //     default: 0
    // },
},
{
    timestamps: true
})

const Post = mongoose.model("Post",postSchema)

export default Post