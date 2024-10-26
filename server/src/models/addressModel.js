import mongoose, { Schema } from "mongoose";

const addressSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    address1: {
      type: String,
      required: true, // Main address
    },
    address2: {
      type: String, // Optional secondary address
    },
    countryCode: {
      type: String,
      required: true, // Country code for phone number
    },
    mobileNumber: {
      type: String,
      required: true, // Phone number
    },
    city: {
      type: String,
      required: true,
    },
    zip: {
      type: String,
      required: true, // Postal/ZIP code
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // To track created/updated times
);

export const Address = mongoose.model("Address", addressSchema);
