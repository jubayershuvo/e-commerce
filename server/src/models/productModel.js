import mongoose, { Schema } from "mongoose";

const productSchema = new Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gender",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    totalOrder: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    regularPrice: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0, // Default discount value to 0
      min: [0, "Discount cannot be less than 0%"], // Minimum value is 0
      max: [100, "Discount cannot exceed 100%"], // Maximum value is 100
    },
    price: {
      type: Number,
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    inStock: {
      type: Boolean,
      default: true,
    },
    availableSize: [
      {
        type: String,
      },
    ],
    selectedSize: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    imageAlt: {
      type: String,
      default: "product.png",
    },
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.availableSize?.length > 0 && (this.selectedSize = this.availableSize[0]);
  if (this.regularPrice && this.discount > 0) {
    this.price = Math.ceil(this.regularPrice - this.regularPrice * (this.discount / 100));
  } else {
    this.price = Math.ceil(this.regularPric);
  }
  next();
});

export const Product = mongoose.model("Product", productSchema);
