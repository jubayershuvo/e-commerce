import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Gender, Category, SubCategory } from "../models/categoryModel.js";

export const addGender = asyncHandler(async (_req, res) => {
  try {
    const genderExist = await Gender.find();
    if (genderExist.length === 3) {
      throw new ApiError(401, "Genders already here..!");
    }
    await Gender.deleteMany();

    await Gender.create({
      name: "Men",
    });
    await Gender.create({
      name: "Women",
    });
    await Gender.create({
      name: "Others",
    });

    const genders = await Gender.find();

    return res
      .status(200)
      .json(new ApiResponse(200, "Genders created successfully.", genders));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});

export const addSubCategory = asyncHandler(async (req, res) => {
  const { name, genderName, categoryName } = req.body;

  try {
    if (!genderName) {
      throw new ApiError(404, "Select gender...!");
    }
    if (!categoryName) {
      throw new ApiError(404, "Select category...!");
    }
    if (!name) {
      throw new ApiError(404, "Enter Sub-Category...!");
    }
    const gender = await Gender.findOne({ value: genderName });
    const category = await Category.findOne({
      value: categoryName,
      gender: gender._id,
    });

    const subCategory = await SubCategory.create({
      name,
      category: category._id,
    });

    if (!subCategory) {
      throw new ApiError(500, "SubCategory creation failed.");
    }

    const subCategories = await SubCategory.find()
      .populate({
        path: "category",
        populate: {
          path: "gender", // This populates the 'gender' field within the 'category' document
        },
      })
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "SubCategory added successfully.", subCategories)
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});

export const addCategory = asyncHandler(async (req, res) => {
  const { name, genderName } = req.body;

  try {
    const gender = await Gender.findOne({ value: genderName });
 

    const category = await Category.create({
      name,
      gender: gender._id,
    });

    if (!category) {
      throw new ApiError(500, "Category creation failed.");
    }

    const categories = await Category.find()
      .populate("gender")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(new ApiResponse(200, "Category added successfully.", categories));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
export const findSubCategoryByGenderAndCategory = asyncHandler(
  async (req, res) => {
    const { genderName, categoryName } = req.params;

    try {
      const gender = await Gender.findOne({ value: genderName });
      const category = await Category.findOne({ value: categoryName, gender:gender._id });
    
      const subCategories = await SubCategory.find({
        category: category._id,
      });

      if (!subCategories) {
        throw new ApiError(500, "Categories found  failed.");
      }

      return res
        .status(200)
        .json(new ApiResponse(200, "Subcategoriies.", subCategories));
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: error.statusCode || 500,
        success: false,
        message: error.message,
      });
    }
  }
);
export const findCategoryByGender = asyncHandler(async (req, res) => {
  const { genderName } = req.params;

  try {
    const gender = await Gender.findOne({ value: genderName });

    const categories = await Category.find({
      gender: gender?._id,
    });

    if (!categories) {
      throw new ApiError(500, "Categories found  failed.");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Categoriese returned successfully.", categories)
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
export const allcategory = asyncHandler(async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("gender")
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Categories returned successfully.", categories)
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});

export const allSubCategory = asyncHandler(async (req, res) => {
  try {
    const subCategories = await SubCategory.find()
      .populate({
        path: "category",
        populate: {
          path: "gender", // This populates the 'gender' field within the 'category' document
        },
      })
      .sort({ createdAt: -1 });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Categories returned successfully.", subCategories)
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
export const deleteCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  try {
    await Category.findByIdAndDelete(_id);
    const categories = await Category.find()
      .populate("gender")
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json(new ApiResponse(200, "Category added successfully.", categories));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
export const deleteSubCategory = asyncHandler(async (req, res) => {
  const { _id } = req.params;

  try {
    await SubCategory.findByIdAndDelete(_id);
    const subCategories = await SubCategory.find()
      .populate({
        path: "category",
        populate: {
          path: "gender", // This populates the 'gender' field within the 'category' document
        },
      })
      .sort({ createdAt: -1 });
    return res
      .status(200)
      .json(
        new ApiResponse(200, "Category added successfully.", subCategories)
      );
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});
