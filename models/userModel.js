import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../config.js";

const userSchema = new Schema(
  {
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
    mobile: {
      type: Number,
      length: [10, "A valid 10 digits mobile number is required"],
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      emum: ["Male", "Female", "Other"],
    },
    profileImageLink: String,
    profileImageId: String,
    coverImageLink: String,
    coverImageId: String,
    accessToken: String
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign({ _id: this._id, fullName: this.fullName },
    config.accessTokenSecret,
    {
      expiresIn: config.accessTokenExpiry
    });
};

const User = mongoose.model("User", userSchema);

export default User;
