import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Order } from "../models/orderModel.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";

export const addOrder = asyncHandler(async (req, res) => {
  try {
    const { shippingCost, couponDiscount, products } = req.body;
    const { _id, shippingAddress } = req.user;

    if (!shippingCost || !products) {
      throw new ApiError(400, "All fields are required.");
    }

    // Create new order
    const order = await Order.create({
      shippingCost,
      couponDiscount,
      products,
      user: _id,
      shippingAddress: shippingAddress,
    });

    if (!order) {
      throw new ApiError(500, "Order creation failed.");
    }

    // Update product order count
    await Promise.all(
      products.map(async (product) => {
        return Product.findByIdAndUpdate(product.item, {
          $inc: { totalOrder: 1 }, // Increment totalOrder by 1
        });
      })
    );

    // Update user with the new order
    const updatedDetails = await User.findByIdAndUpdate(
      _id,
      { $push: { orders: order._id } }, // Push new order into user's orders
      { new: true }
    )
      .select("-password -adminRefreshToken")
      .populate("orders")
      .populate("shippingAddress");

    return res.status(201).json(
      new ApiResponse(201, "Order added successfully!", {
        user: updatedDetails,
        order: order,
      })
    );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
export const allOrders = asyncHandler(async (req, res) => {
  try {
    // Fetch orders and populate fields in a single query
    const orders = await Order.find()
      .populate("shippingAddress")
      .populate("user")
      .populate("products.item")
      .sort({ createdAt: -1 });

    // Return 200 for successful fetching
    return res
      .status(200)
      .json(new ApiResponse(200, "Orders fetched successfully!", orders));
  } catch (error) {
    // Log error for debugging (optional)
    console.error(error);

    // Return appropriate error response
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
});
export const myOrders = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.user;
    const orders = await Order.find({ user: _id })
      .sort({ createdAt: -1 })
      .populate("shippingAddress")
      .populate("user")
      .populate("products.item");

    // Return 200 for successful fetching
    return res
      .status(200)
      .json(new ApiResponse(200, "Orders fetched successfully!", orders));
  } catch (error) {
    // Log error for debugging (optional)
    console.error(error);

    // Return appropriate error response
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
});
export const singleOrder = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    // Fetch orders and populate fields in a single query
    const orders = await Order.findById(_id.trim())
      .populate("shippingAddress")
      .populate("user")
      .populate("products.item");

    // Return 200 for successful fetching
    return res
      .status(200)
      .json(new ApiResponse(200, "Orders fetched successfully!", orders));
  } catch (error) {
    // Log error for debugging (optional)
    console.error(error);

    // Return appropriate error response
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
});
export const myOrder = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.params;
    const userId = req.user._id;

    // Fetch all orders for the logged-in user
    const orders = await Order.find({ user: userId })
      .populate("shippingAddress")
      .populate("user")
      .populate("products.item");

    // Find the specific order by _id
    const order = orders.find((order) => order._id.toString() === _id);

    if (!order) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Order not found!",
      });
    }

    // Return 200 for successful fetching
    return res
      .status(200)
      .json(new ApiResponse(200, "Order fetched successfully!", order));
  } catch (error) {
    // Log error for debugging (optional)
    console.error(error);

    // Return appropriate error response
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
});
export const pendingOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ status: "pending" });

    if (!orders) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Orders not found!",
      });
    }

    // Return 200 for successful fetching
    return res
      .status(200)
      .json(new ApiResponse(200, "Order fetched successfully!", orders));
  } catch (error) {
    // Log error for debugging (optional)
    console.error(error);

    // Return appropriate error response
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
});
export const withoutP = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({
      status: { $nin: ["pending", "cancel"] },
    });

    if (!orders) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Orders not found!",
      });
    }

    // Return 200 for successful fetching
    return res
      .status(200)
      .json(new ApiResponse(200, "Order fetched successfully!", orders));
  } catch (error) {
    // Log error for debugging (optional)
    console.error(error);

    // Return appropriate error response
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
});
export const confirmedOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ status: "confirmed" });

    if (!orders) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Orders not found!",
      });
    }

    // Return 200 for successful fetching
    return res
      .status(200)
      .json(new ApiResponse(200, "Order fetched successfully!", orders));
  } catch (error) {
    // Log error for debugging (optional)
    console.error(error);

    // Return appropriate error response
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
});
export const updateStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId, status, message } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        status,
        message,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: "Order update faild!",
      });
    }
    const orders = await Order.find()
      .populate("user")
      .populate("shippingAddress")
      .populate("products.item")
      .sort({ createdAt: -1 });
    // Return 200 for successful fetching
    return res
      .status(200)
      .json(new ApiResponse(200, "Order fetched successfully!", orders));
  } catch (error) {
    // Log error for debugging (optional)
    console.error(error);

    // Return appropriate error response
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message || "Something went wrong!",
    });
  }
});
