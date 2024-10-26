import { asyncHandler } from "../utils/asyncHandler.js";
import axios from 'axios';
import { ApiError } from "../utils/apiError.js";
import {
  bkash_app_key,
  bkash_grant_token_url,
  bkash_password,
  bkash_secret_key,
  bkash_username
} from "../variables.js";
import storage from 'node-global-storage';

export const authBkash = asyncHandler(async (req, res, next) => {
  try {
    // Clear any previous session values
    storage.unsetValue('id_token');
    storage.unsetValue('userId');
    storage.unsetValue('orderId');

    // Send a request to the bKash API to grant a token
    const response = await axios({
      method: "post",
      url: bkash_grant_token_url,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        username: bkash_username,
        password: bkash_password,
      },
      data: {
        app_key: bkash_app_key,
        app_secret: bkash_secret_key,
      },
    });

    // Check if the response is valid
    if (!response || !response.data) {
      throw new ApiError(401, "Payment failed..!");
    }

    // Store relevant information in global storage
    storage.setValue('id_token', response.data.id_token); // Ensure you store the actual token or data you need

    next(); // Proceed to the next middleware
  } catch (error) {
    // Handle errors and send the appropriate response
    return res.status(error.response?.status || 500).json({
      status: error.response?.status || 500,
      success: false,
      message: error.response?.data?.message || error.message,
    });
  }
});
