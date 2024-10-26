import jwt from "jsonwebtoken";
import otpGenerator from "otp-generator";
import { environment, refresh_token_secret_key, smtp_username } from "../variables.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import deleteCloudinaryFolder from "../utils/cloudinaryFolderDelete.js";
import { User } from "./../models/userModel.js";
import { sendEmail } from "../utils/mailer.js";

const genAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken };
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  try {
    if (!fullName) {
      throw new ApiError(400, "Full-Name is required...!");
    }
    if (!username) {
      throw new ApiError(400, "Username is required...!");
    }
    if (!email) {
      throw new ApiError(400, "Email is required...!");
    }
    if (!password) {
      throw new ApiError(400, "Password is required...!");
    }

    const emailExist = await User.findOne({ email });
    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      throw new ApiError(409, "Username already exists..!");
    }
    if (emailExist) {
      throw new ApiError(409, "Email already exists..!");
    }
    if (password.length < 6) {
      throw new ApiError(400, "Password is too short...!");
    }

    const user = {
      fullName,
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
    };
    if (!user) {
      throw new ApiError(500, "User save faild");
    }
    req.app.locals.USER = user;
    try {
      const code = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
      req.app.locals.OTP = code;
      const options = {
        to: email,
        subject: "Email verification code.",
        html: `<h1>Hi ${username}</h1><br><p>Your registration code here.</p><br><h1>CODE: ${code}</h1>`,
      };
      await sendEmail(options);
    } catch (error) {
      throw new ApiError(500, "Faild to send mail..!");
    }
    return res
      .status(201)
      .json(
        new ApiResponse(
          200,
          "Registration code was sended successfully....!",
          req.app.locals.USER
        )
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const registerVerify = asyncHandler(async (req, res) => {
  const code = req.body.code;
  const user = req.app.locals.USER;
  const saved_code = req.app.locals.OTP;

  if (!saved_code) {
    return res.status(400).json({
      status: 400,
      success: false,
      message: "Unauthorized request..!",
    });
  }
  if (!code) {
    return res
      .status(400)
      .json({ status: 400, success: false, message: "Enter code..!" });
  }

  try {
    if (saved_code !== code) {
      throw new ApiError(400, "Wrong OTP...!");
    }
    const createdUser = await User.create({
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      password: user.password,
    });
    try {
      const options = {
        to: createdUser.email,
        subject: "Your registration email is confirmed.",
        html: `<h1>Welcome ${createdUser.fullName}</h1><br><p>Thank you for register</p>`,
      };
      await sendEmail(options);
    } catch (error) {
      res.status(401).json({ success: false, message: "mail send faild" });
      return;
    }
    req.app.locals.OTP = null;
    req.app.locals.USER = null;
    return res
      .status(201)
      .json(
        new ApiResponse(200, "User verified successfully....!", createdUser)
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const passwordRecovery = asyncHandler(async (req, res) => {
  const { request } = req.body;

  try {
    if (!request) {
      throw new ApiError(400, "Enter email or username");
    }

    const userExist = await User.findOne({
      $or: [{ username: request }, { email: request }],
    });
    if (!userExist) {
      throw new ApiError(409, "User not registered..!");
    }

    const code = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
    const options = {
      to: userExist.email,
      subject: "Password recovery code",
      html: `<h1>Hi ${userExist.username}</h1><br><p>This mail for your password recovery.</p><br><h1>CODE: ${code}</h1>`,
    };
    const mailResult = await sendEmail(options);
    if (!mailResult) {
      throw new ApiError(409, "Mail sending faild..!");
    }
    req.app.locals.USERNAME = userExist.username;
    req.app.locals.OTP = code;
    return res
      .status(200)
      .json(new ApiResponse(200, "Code deliverd", req.app.locals.USERNAME));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const forgetCodeVerify = asyncHandler(async (req, res) => {
  try {
    const username = req.app.locals.USERNAME;
    if (!username) {
      throw new ApiError(400, "Unauthorized request..!");
    }
    const saved_code = req.app.locals.OTP;
    if (!saved_code) {
      throw new ApiError(400, "Unauthorized request..!");
    }
    const { code } = req.body;
    if (!code) {
      throw new ApiError(400, "Enter code first");
    }

    if (saved_code !== code) {
      throw new ApiError(400, "Wrong OTP...!");
    }

    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(400, "User find faild...!");
    }

    req.app.locals.ID = user._id;
    req.app.locals.USERNAME = "";
    req.app.locals.OTP = null;

    return res
      .status(200)
      .json(new ApiResponse(200, "Now you can change password", user.fullName));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const setPassword = asyncHandler(async (req, res) => {
  const id = req.app.locals.ID;
  try {
    if (!id) {
      throw new ApiError(400, "Unauthorized request..!");
    }
    const { password } = req.body;
    if (password < 6) {
      throw new ApiError(400, "Password too short...!");
    }
    const user = await User.findOne({ _id: id });
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (isPasswordCorrect) {
      throw new ApiError(400, "This password is already in use..!");
    }

    user.password = password;
    user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(id).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, "Password is updated", updatedUser));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const loginUser = asyncHandler(async (req, res) => {
  const { login, password } = req.body;
  try {
    if (!login) {
      throw new ApiError(400, "Username or Email is required.");
    }

    // Find the user by either username or email
    const user =
      (await User.findOne({ username: login })) ||
      (await User.findOne({ email: login }));

    if (!user) {
      throw new ApiError(404, "User not registered.");
    }

    // Check if the password is valid
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Wrong password.");
    }

    // Check if the user account is banned
    if (user.isBanned) {
      throw new ApiError(401, "This account has been banned.");
    }

    // Generate access and refresh tokens
    const { accessToken } = await genAccessAndRefreshToken(user._id);

    // Fetch the user details (excluding password and tokens)
    const loggedUser = await User.findById(user._id)
      .select("-password -adminRefreshToken")
      .populate("orders")
      .populate("shippingAddress");

    // Define cookie options for tokens
    const cookieOptions = {
      httpOnly: true,
      secure: environment === "production", // Secure cookie in production (HTTPS)
      sameSite: "Strict",
    };

    // Set the accessToken and refreshToken in HttpOnly cookies
    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("accessVerify", "accessVerifier")
      .json(new ApiResponse(200, "User logged in successfully", loggedUser));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});


export const logoutUser = asyncHandler(async (req, res) => {
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

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const userRefreshToken =
    req.body.refreshToken ||
    req.header("Authorization")?.replace("Bearer", "").trim();
  try {
    if (!userRefreshToken) {
      throw new ApiError(404, "Login again..!");
    }
    const decoded = jwt.verify(userRefreshToken, refresh_token_secret_key);
    const user = await User.findOne({ _id: decoded?._id }).select("-password");

    if (!user) {
      throw new ApiError(404, "Login Expired...!");
    }

    const { accessToken } = await genAccessAndRefreshToken(user._id);

    const cookieOptions = {
      httpOnly: true,
      secure: environment === "production", // Secure cookie in production (HTTPS)
      sameSite: "Strict",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("accessVerify", "accessVerifier")
      .json(new ApiResponse(200, "Token refreshed", user));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (oldPassword === newPassword) {
      throw new ApiError(400, "Old password and New password almost same..!");
    }

    if (newPassword.length < 6) {
      throw new ApiError(400, "New password too short..!");
    }

    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Old password is wrong..!");
    }

    user.password = newPassword;
    user.save({ validateBeforeSave: false });

    const updatedUser = await User.findById(req.user?._id).select("-password");

    return res
      .status(200)
      .json(new ApiResponse(200, "Password is updated", updatedUser));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const updateUserInfo = asyncHandler(async (req, res) => {
  try {
    const { fullName, email } = req.body;
    if (!email && !fullName) {
      throw new ApiError(500, "Nothing to update...!");
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          email,
          fullName,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, "updated user...", user));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const currentUser = asyncHandler(async (req, res) => {
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

export const avatarUpdate = asyncHandler(async (req, res) => {
  try {
    const avatarPath = req.file?.path;

    if (!avatarPath) {
      throw new ApiError(400, "Avatar missing..!");
    }
    const avatarImg = await uploadOnCloudinary(
      avatarPath,
      `Users_images/${req.user.username}`,
      "avatar"
    );
    if (!avatarImg) {
      throw new ApiError(400, "Avatar saving faild");
    }
    const avatarUrlSqureArry = avatarImg.url.split("/");
    const getFolder = avatarUrlSqureArry[avatarUrlSqureArry.length - 2];
    const getImgId = avatarUrlSqureArry[avatarUrlSqureArry.length - 4];
    const getImgName = avatarUrlSqureArry[avatarUrlSqureArry.length - 1];
    const getIdName = `${getImgId}/Users_images/${getFolder}/${getImgName}`;
    const avatarSqureUrl =
      "https://res.cloudinary.com/dhw3jdygg/image/upload/w_1000,ar_1:1,c_fill/" +
      getIdName;

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar: avatarSqureUrl,
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, "Avatar updated", user));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { username } = req.user;
    if (!username) {
      throw new ApiError(409, "Login again..!");
    }

    const { password } = req.body;
    if (!password) {
      throw new ApiError(409, "Enter password....!");
    }
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(400, "User not found..!");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Wrong password..!");
    }

    const deletedUser = await User.findOneAndDelete({ username });
    if (!deletedUser) {
      throw new ApiError(400, "User deleting faild..!");
    }

    const { email } = user;
    try {
      const options = {
        to: email,
        subject: "Your account was deleted successfully.",
        html: `<h1>Hi ${username}</h1><br><p>if you are fetched any problame.</p><br><h1>Send <a href="mailto:${smtp_username}">Email us</a></h1>`,
      };
      const deletedResult = deleteCloudinaryFolder(username);
      if (!deletedResult) {
        throw new ApiError(400, "User folder deleting faild...!");
      }
      await sendEmail(options);
    } catch (error) {
      res.status(401).json({ success: false, message: "mail send faild" });
      return;
    }
    return res
      .status(202)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, "User deleted successfully....!", user));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const findUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) {
      throw new ApiError(400, "Users not found..!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "User returned..!", users));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});
export const findUserByUsername = asyncHandler(async (req, res) => {
  const { username } = req.params;
  try {
    if (!username) {
      throw new ApiError(400, "Username empty..!");
    }

    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      throw new ApiError(400, "User not found..!");
    }
    return res.status(200).json(new ApiResponse(200, "User returned..!", user));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const findUsersBySearch = asyncHandler(async (req, res) => {
  try {
    const search = req.query.search;
    if (!search) {
      throw new ApiError(400, "Enter something...!...!");
    }
    const keyword = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } }, // Case-insensitive match for fullName
            { username: { $regex: search, $options: "i" } }, // Case-insensitive match for username
            { email: { $regex: search, $options: "i" } }, // Case-insensitive match for email
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    return res
      .status(200)
      .json(new ApiResponse(200, "User returned..!", users));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});
