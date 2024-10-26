import mongoose, { Schema } from "mongoose";

const genderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // To track created/updated times
);

export const Gender = mongoose.model("Gender", genderSchema);

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gender",
    },
  },
  { timestamps: true } // To track created/updated times
);

export const Category = mongoose.model("Category", categorySchema);

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true } // To track created/updated times
);

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
