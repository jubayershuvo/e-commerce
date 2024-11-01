import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import deleteCloudinaryFolder from "../utils/cloudinaryFolderDelete.js";
import { User } from "../models/userModel.js";
import { Product } from "../models/productModel.js";
import { sendEmail } from "../utils/mailer.js";

export const addOrder = asyncHandler(async (req, res) => {
  const { shippingCost, couponDiscount, products, user, shippingAddress } = req.body;
  const {productImage, images} = req.files;
  try {
    if (!title) {
      throw new ApiError(400, "Full-Name is required...!");
    }
    if (!description) {
      throw new ApiError(400, "Username is required...!");
    }
    if (!regularPrice) {
      throw new ApiError(400, "Email is required...!");
    }
    if (!discount) {
      throw new ApiError(400, "Password is required...!");
    }
    if (!availableSize) {
      throw new ApiError(400, "Password is required...!");
    }
    const product = await Product.create({
      title,
      description,
      regularPrice: Number(regularPrice),
      discount: Number(discount),
      availableSize: availableSize.split(','),
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
    if (images.length > 0) {
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
            imageUrl: uploaderProductImage.secure_url,
            images: productImages
          },
        },
        { new: true }
      );
      return res
        .status(201)
        .json(
          new ApiResponse(
            200,
            "Product added successfully....!",
            addedProduct
          )
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
    const { fullName, email } = req.body;
    if (!email && !fullName) {
      throw new ApiError(500, "Nothing to update...!");
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          email,
          fullName,
        },
      },
      {
        new: true,
      }
    ).select("-password");

    return res.status(200).json(new ApiResponse(200, "updated user...", user));
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
    const product = await Product.find();
    if (!product) {
      throw new ApiError(400, "Products not found..!");
    }
    return res.status(200).json(new ApiResponse(200, "Product returned..!", product));
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

    const product = await Product.findOne({ _id });
    if (!product) {
      throw new ApiError(400, "Product not found..!");
    }
    return res.status(200).json(new ApiResponse(200, "Product returned..!", product));
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      status: error.statusCode,
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

