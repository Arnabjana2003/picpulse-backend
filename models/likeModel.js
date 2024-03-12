import mongoose,{ Schema } from "mongoose";

const likeSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  comment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }
}, { timestamps: true });

const Like = mongoose.model("Like", likeSchema);

export default Like