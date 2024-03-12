import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    about: String,
    content:{
        type:String, //url
        required: [true,"Content link is required"],
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