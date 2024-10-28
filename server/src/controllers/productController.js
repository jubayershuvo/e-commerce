import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import deleteCloudinaryFolder from "../utils/cloudinaryFolderDelete.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import { sendEmail } from "../utils/mailer.js";
import mongoose from "mongoose";
import { Category, Gender, SubCategory } from "../models/categoryModel.js";
import { Review } from "../models/reviewModel.js";

export const addProduct = asyncHandler(async (req, res) => {
  const {
    genderName,
    categoryName,
    subCategoryName,
    title,
    description,
    regularPrice,
    discount,
    availableSize,
  } = req.body;
  const { productImage, images } = req.files;
  try {
    if (!title) {
      throw new ApiError(400, "Title is required...!");
    }
    if (!description) {
      throw new ApiError(400, "Description is required...!");
    }
    if (!regularPrice) {
      throw new ApiError(400, "Price is required...!");
    }
    if (!productImage) {
      throw new ApiError(400, "Product Image is required...!");
    }
    const gender = await Gender.findOne({ name: genderName });

    const category = await Category.findOne({
      name: categoryName,
      gender: gender?._id,
    });

    const subCategory = await SubCategory.findOne({
      name: subCategoryName,
      category: category?._id,
    });
    const product = await Product.create({
      title,
      description,
      regularPrice: Number(regularPrice),
      discount: Number(discount),
      availableSize: availableSize.split(","),
      gender: gender?._id,
      category: category?._id,
      subCategory: subCategory?._id,
    });
    if (!product) {
      throw new ApiError(500, "Product save faild");
    }
    const productImagePath = productImage[0].path;
    const uploaderProductImage = await uploadOnCloudinary(
      productImagePath,
      `Product_images/${product._id}`,
      "ProductImage"
    );
    let productImages = []; // Initialize as an empty array
    if (images?.length > 0) {
      const uploadPromises = images.map(async (element, index) => {
        const res = await uploadOnCloudinary(
          element.path,
          `Product_images/${product._id}`,
          `ProductImage${index + 1}`
        );
        return res.secure_url; // Return the secure URL
      });

      // Wait for all uploads to complete
      productImages = await Promise.all(uploadPromises);
    }
    try {
      const addedProduct = await Product.findByIdAndUpdate(
        product._id,
        {
          $set: {
            imageUrl: uploaderProductImage?.secure_url,
            images: productImages,
          },
        },
        { new: true }
      );
      return res
        .status(201)
        .json(
          new ApiResponse(200, "Product added successfully....!", addedProduct)
        );
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: error.statusCode,
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const updateProductInfo = asyncHandler(async (req, res) => {
  try {
    const { _id, title, description, regularPrice, discount, availableSize } =
      req.body;
    const { productImage, images } = req.files;

    const product = await User.findOneAndUpdate(
      _id,
      {
        title,
        description,
        regularPrice: Number(regularPrice),
        discount: Number(discount),
        availableSize: availableSize.split(","),
      },
      {
        new: true,
      }
    );

    if (!product) {
      throw new ApiError(500, "Product save faild");
    }
    const productImagePath = productImage[0].path;
    const uploaderProductImage = await uploadOnCloudinary(
      productImagePath,
      `Product_images/${product._id}`,
      "ProductImage"
    );
    let productImages = []; // Initialize as an empty array
    if (images?.length > 0) {
      const uploadPromises = images.map(async (element, index) => {
        const res = await uploadOnCloudinary(
          element.path,
          `Product_images/${product._id}`,
          `ProductImage${index + 1}`
        );
        return res.secure_url; // Return the secure URL
      });

      // Wait for all uploads to complete
      productImages = await Promise.all(uploadPromises);
    }
    try {
      await Product.findByIdAndUpdate(
        product._id,
        {
          $set: {
            imageUrl: uploaderProductImage?.secure_url,
            images: productImages,
          },
        },
        { new: true }
      );
      const products = await Product.find().sort({ createdAt: -1 });
      return res
        .status(201)
        .json(
          new ApiResponse(200, "Product added successfully....!", products)
        );
    } catch (error) {
      return res.status(error.statusCode || 500).json({
        status: error.statusCode,
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  try {
    const { username } = req.user;
    if (!username) {
      throw new ApiError(409, "Login again..!");
    }

    const { password } = req.body;
    if (!password) {
      throw new ApiError(409, "Enter password....!");
    }
    const user = await User.findOne({ username });
    if (!user) {
      throw new ApiError(400, "User not found..!");
    }
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new ApiError(400, "Wrong password..!");
    }

    const deletedUser = await User.findOneAndDelete({ username });
    if (!deletedUser) {
      throw new ApiError(400, "User deleting faild..!");
    }

    const { email } = user;
    try {
      const options = {
        to: email,
        subject: "Your account was deleted successfully.",
        html: `<h1>Hi ${username}</h1><br><p>if you are fetched any problame.</p><br><h1>Send <a href="mailto:${smtp_username}">Email us</a></h1>`,
      };
      const deletedResult = deleteCloudinaryFolder(username);
      if (!deletedResult) {
        throw new ApiError(400, "User folder deleting faild...!");
      }
      await sendEmail(options);
    } catch (error) {
      res.status(401).json({ success: false, message: "mail send faild" });
      return;
    }
    return res
      .status(202)
      .clearCookie("accessToken")
      .clearCookie("refreshToken")
      .json(new ApiResponse(200, "User deleted successfully....!", user));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const findProducts = asyncHandler(async (req, res) => {
  try {
    const product = await Product.find().sort({ createdAt: -1 });
    if (!product) {
      throw new ApiError(400, "Products not found..!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Product returned..!", product));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});
export const findProductByCategory = asyncHandler(async (req, res) => {
  const { genderName, categoryName, subCategoryName } = req.params;
  try {
    if (!genderName || !categoryName || !subCategoryName) {
      throw new ApiError(400, "Something is missing..!");
    }
    const gender = await Gender.findOne({ name: genderName });

    const category = await Category.findOne({
      name: categoryName,
      gender: gender?._id,
    });

    const subCategory = await SubCategory.findOne({
      name: subCategoryName,
      category: category?._id,
    });

    const products = await Product.find({
      gender: gender?._id,
      category: category?._id,
      subCategory: subCategory?._id,
    });
    if (!products) {
      throw new ApiError(400, "Products not found..!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Product returned..!", products));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});
export const findProductById = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  try {
    if (!_id) {
      throw new ApiError(400, "Product ID empty..!");
    }

    if (!mongoose.Types.ObjectId.isValid(_id)) {
      throw new ApiError(400, "Product ID invalid..!");
    }

    const product = await Product.findById(_id).populate("reviews");
    if (!product) {
      throw new ApiError(400, "Product not found..!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "Product returned..!", product));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});

export const givReview = asyncHandler(async (req, res) => {
  try {
    const { _id, star, review } = req.body;
    const userId = req.user._id;

    // Check if necessary fields are provided
    if (!_id || !star || !review) {
      throw new ApiError(400, "Something missing...!");
    }

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(400, "User missing...!");
    }

    // Create the review
    const createdReview = await Review.create({
      star,
      text: review,
      user: userId,
    });

    // Add the review to the product
    const product = await Product.findByIdAndUpdate(
      _id,
      {
        $push: { reviews: createdReview._id },
      },
      { new: true }
    );
    if (!product) {
      throw new ApiError(400, "Product missing...!");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, "User returned..!", product));
  } catch (error) {
    // Error handling
    return res.status(error.statusCode || 500).json({
      status: error.statusCode || 500,
      success: false,
      message: error.message,
    });
  }
});

export const findProdutsBySearch = asyncHandler(async (req, res) => {
  try {
    const search = req.query.search;
    if (!search) {
      throw new ApiError(400, "Enter something...!...!");
    }
    const keyword = search
      ? {
          $or: [
            { fullName: { $regex: search, $options: "i" } }, // Case-insensitive match for fullName
            { username: { $regex: search, $options: "i" } }, // Case-insensitive match for username
            { email: { $regex: search, $options: "i" } }, // Case-insensitive match for email
          ],
        }
      : {};

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    return res
      .status(200)
      .json(new ApiResponse(200, "User returned..!", users));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
      success: false,
      message: error.message,
    });
  }
});
