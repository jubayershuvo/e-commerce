import jwt from "jsonwebtoken";
import { access_token_secret_key } from "../variables.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/userModel.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer','').trim();

    if (!token) {
      throw new ApiError(401, "Unauthorized user, please login first...!");
    }

    const decoded = jwt.verify(token, access_token_secret_key);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(401, "Session expired..!");
    }

    if (user.isBanned) {
      req.user = {}; // Clear user info if banned
      res.clearCookie("accessToken"); // Clear the token cookie
      throw new ApiError(401, "Your account was banned..!");
    }

    req.user = user; // Set user in request object
    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const isBanned = asyncHandler(async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (!_id) {
      throw new ApiError(401, "Unauthorized user, please login first...!");
    }

    const user = await User.findOne({ _id }); // Await the query
    if (!user) {
      throw new ApiError(401, "User not found...!");
    }

    if (user.isBanned) {
      return res.clearCookie("accessToken").clearCookie("adminVerify")
    }

    next(); // Proceed to the next middleware
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});
