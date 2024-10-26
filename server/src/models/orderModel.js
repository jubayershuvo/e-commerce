import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    date: {
      type: Date,
      default: Date.now,
    },
    total: {
      type: Number,
      default: 0, // Auto-calculated by backend
    },
    orderPrice: {
      type: Number,
      default: 0, // Auto-calculated by backend
    },
    shippingCost: {
      type: Number,
      required: true, // Sent from frontend
    },
    discount: {
      type: Number,
      default: 0, // Auto-calculated by backend
    },
    couponDiscount: {
      type: Number,
      required: true, // Sent from frontend
    },
    status: {
      type: String,
      default: "pending",
    },
    message: {
      type: String,
      default: "Your order is pending",
    },
    products: [
      {
        item: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Reference to Product model
          required: true, // Products must be sent from frontend
        },
        quantity: {
          type: Number, // Quantity should be a number
          required: true,
        },
      },
    ],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // User information must be sent from frontend
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    paymentID: {
      type: String,
      default: "Not Paid",
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true, // Shipping address must be sent from frontend
    },
  },
  { timestamps: true }
);

// Pre-save hook to calculate total and order price before saving
orderSchema.pre("save", async function (next) {
  try {
    // Populate the 'item' field with details from the 'Product' model
    await this.populate({
      path: "products.item",
    });

    // Calculate the total product price and order price
    let productsTotal = this.products.reduce((acc, product) => {
      return acc + product.item.price * product.quantity;
    }, 0);

    // Calculate total product discount (regular price - actual price) * quantity
    let productsDiscount = this.products.reduce((acc, product) => {
      return (
        acc +
        (product.item.regularPrice - product.item.price) * product.quantity
      );
    }, 0);

    // Combine product discounts with the coupon discount
    this.discount = Math.floor(productsDiscount);

    // Calculate the final total after discounts and shipping
    this.total = Math.ceil(
      productsTotal + this.shippingCost - this.couponDiscount
    );

    // Calculate the original order price (before discounts)
    let orderTotal = this.products.reduce((acc, product) => {
      return acc + product.item.regularPrice * product.quantity;
    }, 0);

    this.orderPrice = orderTotal;

    next();
  } catch (err) {
    next(err);
  }
});

export const Order = mongoose.model("Order", orderSchema);
