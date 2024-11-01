import mongoose, { Schema } from "mongoose";

// Helper function for setting the 'value' field
const setValueFromName = function (next) {
  if (this.isModified("name")) {
    this.value = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  next();
};

const genderSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
  },
  { timestamps: true }
);

genderSchema.pre("save", setValueFromName);

export const Gender = mongoose.model("Gender", genderSchema);

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
    gender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Gender",
    },
  },
  { timestamps: true }
);

categorySchema.pre("save", setValueFromName);

export const Category = mongoose.model("Category", categorySchema);

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  { timestamps: true }
);

subCategorySchema.pre("save", setValueFromName);

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);
