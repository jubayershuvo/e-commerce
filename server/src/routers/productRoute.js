import { Router } from "express";
import {
  findProductByCategory,
  findProductById,
  findProducts,
  givReview,
} from "../controllers/productController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const productRouter = Router();

productRouter.route("/single/:_id").get(findProductById);
productRouter.route("/all").get(findProducts);
productRouter.route("/give-review").post(verifyJWT, givReview);
productRouter.route("/:genderName/:categoryName/:subCategoryName").get(findProductByCategory);

export default productRouter;
