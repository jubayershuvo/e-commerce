import dotenv from "dotenv";
dotenv.config();

export const environment = process.env.NODE_ENV || "";
export const port = process.env.PORT || 8080;
export const cors_origin = process.env.CORS_ORIGIN;
export const db_url = process.env.MONGO_DB_URL;
export const db_name = process.env.DB_NAME;

export const access_token_secret_key =
  process.env.ACCESS_TOKEN_SECRET_KEY || "shuvo";
export const access_token_expiry = process.env.ACCESS_TOKEN_EXPIRY || "1d";
export const refresh_token_secret_key =
  process.env.REFRESH_TOKEN_SECRET_KEY || "shuvo";
export const refresh_token_expiry = process.env.REFRESH_TOKEN_EXPIRY || "10d";

export const cloudinary_api_key = process.env.CLOUDINARY_API_KEY;
export const cloudinary_api_secret_key = process.env.CLOUDINARY_API_SECRET_KEY;
export const cloudinary_name = process.env.CLOUDINARY_NAME;
export const smtp_username = process.env.SMTP_USERNAME;
export const smtp_password = process.env.SMTP_PASSWORD;

export const bkash_username = process.env.BKASH_USERNAME;
export const bkash_password = process.env.BKASH_PASSWORD;
export const bkash_app_key = process.env.BKASH_APP_KEY;
export const bkash_secret_key = process.env.BKASH_SECRET_KEY;

export const bkash_create_payment_url = process.env.BKASH_CREATE_PAYMENT_URL;
export const bkash_grant_token_url = process.env.BKASH_GRANT_TOKEN_URL;
export const bkash_execute_payment_url = process.env.BKASH_EXECUTE_PAYMENT_URL;
export const bkash_refund_transaction_url = process.env.BKASH_REFUND_TRANSACTION_URL;

export const sslcommerz_id = process.env.SSL_COMMERZ_STORE_ID;
export const sslcommerz_password = process.env.SSL_COMMERZ_STORE_PASSWORD;
export const sslcommerz_is_live = process.env.SSL_COMMERZ_STORE_IS_LIVE || false;

export const paypal_client_id = process.env.PAYPAL_CLIENT_ID;
export const paypal_client_secret = process.env.PAYPAL_CLIENT_SECRET;
