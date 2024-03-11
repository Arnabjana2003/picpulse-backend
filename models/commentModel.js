import mongoose,{ Schema } from "mongoose";


const commentSchema = new Schema({
    content:{
        type: String,
        required: [true,"Comment content is reqired"]
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true,"Post id is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true,"User id is required"]
    },
    parentCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }]
},
{
    timestamps:true
})
  
  const Comment = mongoose.model('Comment', commentSchema);

  export default Comment