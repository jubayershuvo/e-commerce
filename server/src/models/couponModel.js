import mongoose, { Schema } from "mongoose";

const couponSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    
  },
  { timestamps: true } // To track created/updated times
);

export const Coupon = mongoose.model("Coupon", couponSchema);
