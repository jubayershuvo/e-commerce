import jwt from "jsonwebtoken";
import { refresh_token_secret_key } from "../variables.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";

const genAdminAccessAndRefreshToken = async (adminId) => {
  try {
    const admin = await User.findById(adminId);
    const adminAccessToken = admin.generateAccessToken();
    const adminRefreshToken = admin.generateRefreshToken();

    admin.adminRefreshToken = adminRefreshToken;
    await admin.save({ validateBeforeSave: false });

    return { adminAccessToken };
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
};

export const loginAdmin = asyncHandler(async (req, res) => {
  const { login, password } = req.body;

  try {
    // Check if login and password are provided
    if (!login || !password) {
      throw new ApiError(400, "Username/Email and Password are required...!");
    }

    // Find the admin by username or email
    const admin =
      (await User.findOne({ username: login })) ||
      (await User.findOne({ email: login }));

    if (!admin) {
      throw new ApiError(404, "Admin not registered...!");
    }

    // Check if the password is correct
    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Wrong password...!");
    }

    // Check if the admin account is banned
    if (admin.isBanned) {
      throw new ApiError(401, "Account is banned...!");
    }

    // Generate admin access and refresh tokens
    const { adminAccessToken } = await genAdminAccessAndRefreshToken(admin._id);

    // Remove the password field from the returned admin data
    const loggedAdmin = await User.findById(admin._id).select("-password");

    // Send response with a cookie containing the access token
    return res
      .status(200)
      .cookie("adminAccessToken", adminAccessToken)
      .cookie("adminVerify", "AdminVerifier")
      .json(new ApiResponse(200, "Admin logged in successfully", loggedAdmin));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
});

export const logoutAdmin = asyncHandler(async (req, res) => {
  const id = req.user._id;

  const loggedOutUser = await User.findOneAndUpdate(
    id,
    { $set: { refreshToken: undefined } },
    { new: true }
  );
  if (!loggedOutUser) {
    throw new ApiError(404, "Logout faild");
  }
  req.user = {};
  return res
    .status(200)
    .clearCookie("accessToken")
    .clearCookie("refreshToken")
    .json(new ApiResponse(200, `User logged out successfully..!`));
});


export const currentAdmin = asyncHandler(async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(400, "Please login first..!");
    }

    return res.status(200).json(new ApiResponse(200, "User is returned", user));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const banUser = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    if (!_id) {
      throw new ApiError(400, "ID empty..!");
    }
    const user = await User.findById(_id);
    if (!user) {
      throw new ApiError(400, "User not found..!");
    }

    if (user.role === "admin") {
      throw new ApiError(400, "User is an admin");
    }

    await User.findByIdAndUpdate(_id, {
      isBanned: true,
    });

    const users = await User.find().populate("shippingAddress");
    return res.status(200).json(new ApiResponse(200, "User Banned..!", users));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const unbanUser = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;

    if (!_id) {
      return res.status(400).json({
        status: 400,
        success: false,
        message: "User ID is required.",
      });
    }

    // Update the user to unban them
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { isBanned: false },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "User not found.",
      });
    }

    // Retrieve all users with their populated shipping addresses
    const users = await User.find().populate("shippingAddress");

    return res
      .status(200)
      .json(new ApiResponse(200, "User unbanned successfully!", users));
  } catch (error) {
    return res.status(500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "An unexpected error occurred.",
    });
  }
});
export const makeAdmin = asyncHandler(async (req, res) => {
  try {
    const { _id, password } = req.body;
    const adminId = req.admin._id;
    const admin = await User.findById(adminId);

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Wrong password.");
    }

    await User.findByIdAndUpdate(_id, {
      role: "admin",
    });

    const users = await User.find().populate("shippingAddress");
    return res
      .status(200)
      .json(new ApiResponse(200, "Done..!", users));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});
export const removeAdmin = asyncHandler(async (req, res) => {
  try {
    const { _id, password } = req.body;
    const adminId = req.admin._id;
    const admin = await User.findById(adminId);

    const isPasswordValid = await admin.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Wrong password.");
    }

    await User.findByIdAndUpdate(_id, {
      role: "customer",
    });

    const users = await User.find().populate("shippingAddress");
    return res
      .status(200)
      .json(new ApiResponse(200, "done..!", users));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});
