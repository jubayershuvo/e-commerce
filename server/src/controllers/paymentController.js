import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Payment } from "../models/paymentModel.js";

export const allPayments = asyncHandler(async (req, res) => {
  try {
    const payments = await Payment.find();
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
    const payment = await Payment.findById(_id);
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
