import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  access_token_expiry,
  access_token_secret_key,
  refresh_token_expiry,
  refresh_token_secret_key,
} from "../variables.js";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dhw3jdygg/image/upload/v1728892043/user_nc3bad.svg",
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      default: 'customer',
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
    refreshToken: {
      type: String,
    },
    adminRefreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware for proper error handling
  }
});

// Method to check if password is correct
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Method to generate access token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
      isAdmin: this.isAdmin,
      isBanned: this.isBanned,
      isOwner: this.isOwner,
    },
    access_token_secret_key,
    { expiresIn: access_token_expiry }
  );
};

// Method to generate refresh token
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    refresh_token_secret_key,
    { expiresIn: refresh_token_expiry }
  );
};

export const User = mongoose.model("User", userSchema);
