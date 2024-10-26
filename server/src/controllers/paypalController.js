import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/orderModel.js";
import paypal from "paypal-rest-sdk";
import { paypal_client_id, paypal_client_secret } from "../variables.js";
import { Payment } from "../models/paymentModel.js";

paypal.configure({
  mode: "sandbox", // Use 'live' for production mode
  client_id: paypal_client_id,
  client_secret: paypal_client_secret,
});

export const successPayment = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const data = req.body.details;
  try {
    const order = await Order.findById(orderId);

    const payment = await Payment.create({
      order: order._id,
      user: order.user,
      status: "VALID",
      amount: data.purchase_units[0].amount.value,
      stored_amount: data.purchase_units[0].amount.value,
      paymentID: data.payer.payer_id,
      currency: data.purchase_units[0].amount.currency_code,
      date: data.create_time,
      trxID: data.id,
      verificationSING: data.links[0].href,
      paymentMethod: "Paypal",
      risk_level: 0,
      allData: JSON.stringify(data),
    });

    await Order.findByIdAndUpdate(order._id, {
      status: "confirmed",
      message: "Your payment receved",
      payment: payment._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, "Payment receved successfully.", order._id));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
