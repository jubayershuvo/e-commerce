import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/userModel.js";
import { Address } from "../models/addressModel.js";

export const addAddress = asyncHandler(async (req, res) => {
  try {
  const { _id } = req.user;

  const {
    firstName,
    lastName,
    address1,
    address2,
    countryCode,
    mobileNumber,
    city,
    zip,
    state,
    country,
  } = req.body;

    // Validate required fields
    if (
      !firstName ||
      !lastName ||
      !address1 ||
      !countryCode ||
      !mobileNumber ||
      !city ||
      !zip ||
      !state ||
      !country
    ) {
      throw new ApiError(400, "All fields are required.");
    }

    // Create new address
    const address = await Address.create({
      firstName,
      lastName,
      address1,
      address2,
      countryCode,
      mobileNumber,
      city,
      zip,
      state,
      country,
    });

    if (!address) {
      throw new ApiError(500, "Address creation failed.");
    }

    // Update user with the new shipping address
    const user = await User.findByIdAndUpdate(
      _id,
      { shippingAddress: address._id },
      { new: true }
    ).populate('shippingAddress'); // Populate after updating

    return res.status(200).json(new ApiResponse(200, "User updated successfully.", user));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
export const updateAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const {
    firstName,
    lastName,
    address1,
    address2,
    countryCode,
    mobileNumber,
    city,
    zip,
    state,
    country,
  } = req.body;

  try {
    // Validate required fields

    // Create new address
    const address = await Address.create({
      firstName,
      lastName,
      address1,
      address2,
      countryCode,
      mobileNumber,
      city,
      zip,
      state,
      country,
    });

    if (!address) {
      throw new ApiError(500, "Address creation failed.");
    }

    // Update user with the new shipping address
    const user = await User.findByIdAndUpdate(
      _id,
      { shippingAddress: address._id },
      { new: true }
    ).populate('shippingAddress'); // Populate after updating

    return res.status(200).json(new ApiResponse(200, "User updated successfully.", user));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
