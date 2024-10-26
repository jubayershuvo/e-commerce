import mongoose, { Schema } from "mongoose";

const paymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming the user is referenced from a User model
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Assuming the user is referenced from a User model
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    risk_level: {
      type: String,
    },
    stored_amount: {
      type: Number,
    },
    paymentID: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    trxID: {
      type: String,
      required: true, // Added the missing 'required' field
    },
    validationID: {
      type: String,
    },
    verificationSING: {
      type: String,
      required: true, // Added the missing 'required' field
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    date: {
      type: String, // Correct type for a date
      required: true,
    },
    allData: {
      type: String,
    },
  },
  { timestamps: true } // To track created/updated times
);

export const Payment = mongoose.model("Payment", paymentSchema);
