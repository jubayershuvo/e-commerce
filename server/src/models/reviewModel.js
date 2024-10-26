import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
  {
    star: {
      type: Number,
      required: true,
      min: 1,
      max: 5, // Assuming a rating scale of 1 to 5 stars
    },
    text: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming the user is referenced from a User model
      required: true,
    },
  },
  { timestamps: true } // To track when the review was created or updated
);

export const Review = mongoose.model("Review", reviewSchema);
