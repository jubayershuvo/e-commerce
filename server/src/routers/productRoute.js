import { Router } from "express";
import {
  findProductByCategory,
  findProductById,
  findProducts,
  findProductsBySearch,
  findProductsBySubCategory,
  findProdutsByGender,
  givReview,
} from "../controllers/productController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const productRouter = Router();

productRouter.route("/single/:_id").get(findProductById);
productRouter.route("/products/:search").get(findProductsBySearch);
productRouter.route("/gender/:gender").get(findProdutsByGender);
productRouter.route("/all").get(findProducts);
productRouter.route("/give-review").post(verifyJWT, givReview);
productRouter
  .route("/sub-category/:subCategory")
  .get(findProductsBySubCategory);
productRouter
  .route("/:genderName/:categoryName/:subCategoryName")
  .get(findProductByCategory);

export default productRouter;
