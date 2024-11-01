import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/orderModel.js";
import { Payment } from "../models/paymentModel.js";
import { cors_origin } from "../variables.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const deliveryCreate = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);
    if(order.status === "confirmed"){
      const url = `${cors_origin}/order/${orderId}`;
      return res.status(200).json(new ApiResponse(200, "User updated successfully.", url));
    }

    const payment = await Payment.create({
      user: _id,
      order: orderId,
      amount: order.total,
      stored_amount: order.total,
      trxID: "Cash on delivery",
      paymentID: "Cash on delivery",
      currency: "BDT",
      paymentMethod: "Cash on delivery",
      date: Date.now(),
      validationID: "Cash on delivery",
      risk_level: "Cash on delivery",
      status: "VALID",
      verificationSING: "Cash on delivery",
      allData: "Cash on delivery",
    });
    try {
      await Order.findByIdAndUpdate(
        orderId,
        {
          status: "confirmed",
          message: "Your order confirmed succesfully with Cash On delivery.",
          payment: payment._id,
        },
        { new: true }
      );

      const url = `${cors_origin}/paymentInfo?status=success&orderId=${orderId}`;

      return res.status(200).json(new ApiResponse(200, "User updated successfully.", url));

    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: error.statusCode || 500,
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
