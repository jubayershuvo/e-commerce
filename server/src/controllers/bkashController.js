import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import axios from "axios";
import storage from "node-global-storage";
import { Order } from "../models/orderModel.js";
import { Payment } from "../models/paymentModel.js";
import { bkash_app_key, bkash_create_payment_url, bkash_execute_payment_url, cors_origin } from "../variables.js";

export const paymentCreate = asyncHandler(async (req, res) => {
  try {
    const id_token = storage.getValue("id_token");
    const { username, _id } = req.user;
    const { amount, orderId } = req.body;
    if (!id_token || !amount || !orderId) {
      throw new ApiError(400, "Some data missing...!");
    }
    storage.setValue('userId', _id); // Store user ID
    storage.setValue('orderId', orderId); // Store order ID
    try {
      const response = await axios({
        method: "post",
        url: bkash_create_payment_url, // Replace with the actual base URL
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          authorization: id_token, // Replace 'id_token' with the actual token
          "x-app-key": bkash_app_key, // Replace 'x-app-key' with the actual app key
        },
        data: {
          mode: "0011",
          callbackURL: "http://localhost:8080/api/bkash/payment/callback", // Replace with the actual callback URL
          payerReference: "Your payment receved Ecommerce store", // Replace with the actual payer reference
          amount: amount,
          currency: "BDT",
          intent: "sale",
          merchantInvoiceNumber: username,
        },
      });

      if (!response.data) {
        throw new ApiError(400, "Somthing else...!");
      }

      const { bkashURL } = response.data;

      return res
        .status(200)
        .json(new ApiResponse(200, "User updated successfully.", bkashURL));
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
export const bkashCallBack = asyncHandler(async (req, res) => {
  try {
    const id_token = storage.getValue("id_token");
    const orderId = storage.getValue("orderId");
    const userId = storage.getValue("userId");
    const { paymentID, status } = req.query;


    // Redirect if the payment status is not success
    if (status !== "success") {
      return res.redirect(`${cors_origin}/paymentinfo?status=${status}&orderId=${orderId}`);
    }

    try {
      const response = await axios({
        method: "post",
        url: bkash_execute_payment_url, // Make sure to define `base_URL`
        headers: {
          Accept: "application/json",
          Authorization: id_token, // Use 'Authorization' for the token
          "x-app-key": bkash_app_key, // The app key from your environment
        },
        data: {
          paymentID: paymentID, // Payment ID received from the query parameters
        },
      });

      // Check if the response is successful
      if (response.data && response.data.statusCode === "0000") {
        const paymentInfo = response.data;

        // Create a new payment entry in the database
        const payment = await Payment.create({
          user: userId,
          order: orderId,
          amount: paymentInfo.amount,
          paymentID,
          currency: paymentInfo.currency,
          trxID: paymentInfo.trxID,
          date: paymentInfo.paymentCreateTime, // Ensure this is a Date object or formatted correctly
        });

        // Update the order with the payment information
        await Order.findByIdAndUpdate(orderId, {
          payment: payment._id,
          status:'confirmed',
          message: 'Your order confirmed'
        });

        // Optionally redirect or send a success response
        return res.redirect(`${cors_origin}/paymentinfo?status=success&orderId=${orderId}`);
      } else {
        // Handle case where payment status is not success
        return res.redirect(`${cors_origin}/paymentinfo?status=failure&orderId=${orderId}`);
      }
    } catch (error) {
      return res.redirect(`${cors_origin}/paymentinfo?status=failure&orderId=${orderId}`);
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});

