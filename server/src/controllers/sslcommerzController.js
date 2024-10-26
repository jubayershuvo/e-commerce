import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/orderModel.js";
import { Payment } from "../models/paymentModel.js";
import SSLCommerzPayment from "sslcommerz-lts";
import {
  cors_origin,
  sslcommerz_id,
  sslcommerz_is_live,
  sslcommerz_password,
} from "../variables.js";

export const sslInit = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  try {
    if (!orderId) {
      throw new ApiError(404, "OrderId Missing..!");
    }

    const order = await Order.findById(orderId)
      .populate("shippingAddress")
      .populate("user");

    if (!order) {
      throw new ApiError(404, "Order Not found..!");
    }
    
    const { total, status, shippingAddress, user } = order;

    if (!total || !shippingAddress || !user) {
      throw new ApiError(400, "Required order details are missing.");
    }
    if (status === "confirmed") {
      throw new ApiError(400, "Payment already  Done.");
    }
    const trxId = user.username + (Math.random() * 10000).toFixed(0);
    const data = {
      total_amount: total,
      currency: "BDT",
      tran_id: trxId, // Use UUID if possible
      success_url: `http://localhost:8080/api/sslcommerz/success/${orderId}`,
      fail_url: `http://localhost:8080/api/sslcommerz/failure/${orderId}`,
      cancel_url: `http://localhost:8080/api/sslcommerz/cancel${orderId}`,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "Courier",
      product_name: " ",
      product_category: " ",
      product_profile: " ",
      cus_name: user.fullName,
      cus_email: user.email,
      cus_add1: shippingAddress.address1,
      cus_add2: shippingAddress.address2,
      cus_city: shippingAddress.city,
      cus_state: shippingAddress.state,
      cus_postcode: shippingAddress.zip,
      cus_country: shippingAddress.country,
      cus_phone: `${shippingAddress.countryCode}${shippingAddress.mobileNumber}`,
      cus_fax: `${shippingAddress.countryCode}${shippingAddress.mobileNumber}`,
      ship_name: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      ship_add1: shippingAddress.address1,
      ship_add2: shippingAddress.address2,
      ship_city: shippingAddress.city,
      ship_state: shippingAddress.state,
      ship_postcode: shippingAddress.zip,
      ship_country: shippingAddress.country,
    };

    try {
      const sslcz = new SSLCommerzPayment(
        sslcommerz_id, // Moved to environment variables
        sslcommerz_password, // Moved to environment variables
        sslcommerz_is_live
      );
      const apiResponse = await sslcz.init(data);
      const GatewayPageURL = apiResponse.GatewayPageURL;

      await Order.findByIdAndUpdate(orderId,{
        paymentID: trxId
      })

      if (!GatewayPageURL) {
        throw new ApiError(500, "Failed to generate payment gateway URL");
      }

      return res
        .status(200)
        .json(new ApiResponse(200, "Payment created.", GatewayPageURL));
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
export const successPay = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const paymentInfo = req.body;
  try {
    const { _id, user } = await Order.findById(orderId).populate("user");

    const payment = await Payment.create({
      user: user._id,
      order: _id,
      amount: paymentInfo.amount,
      stored_amount: paymentInfo.store_amount,
      trxID: paymentInfo.bank_tran_id,
      paymentID: paymentInfo.tran_id,
      currency: paymentInfo.currency,
      paymentMethod: paymentInfo.card_issuer,
      date: paymentInfo.tran_date,
      validationID: paymentInfo.val_id,
      risk_level: paymentInfo.risk_level,
      status: paymentInfo.status,
      verificationSING: paymentInfo.verify_sign,
      allData: JSON.stringify(paymentInfo)
    });
    try {
      await Order.findByIdAndUpdate(
        orderId,
        {
          status: "confirmed",
          message: "Your order confirmed succesfully.",
          payment: payment._id,
        },
        { new: true }
      );
      return res.redirect(`${cors_origin}/paymentinfo?status=success&orderId=${orderId}`);

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
