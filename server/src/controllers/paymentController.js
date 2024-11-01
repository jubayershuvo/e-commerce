import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Payment } from "../models/paymentModel.js";
import { ApiError } from "../utils/apiError.js";

export const allPayments = asyncHandler(async (req, res) => {
  try {
    const payments = await Payment.find().sort({createdAt: -1});
    return res
      .status(200)
      .json(new ApiResponse(200, "User updated successfully.", payments));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
export const singlePayment = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    const payment = await Payment.findById(_id).populate('user');
    if(!payment){
      throw new ApiError(404,"Payment not found..!")
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Payment found successfully.", payment));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
