import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(v);
      },
      message: (props) => `${props.value} is not a valid full name!`,
    },
  },
  mobile:{
    type: Number,
    length: [10,"A valid 10 digits mobile number is required"]
  },
  email:{
    type: String,
    required: true,
  },
  password: {
    type:String,
    required: true
  },
  dob:{
    type: Date,
    required:true
  },
  gender:{
    type: String,
    required:true,
    emum: ["Male","Female","Other"]
  },
  profileImage: String,
  coverImage: String,
},
{
    timestamps:true
});


const User = mongoose.model("User",userSchema)

export default User
