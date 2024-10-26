import { Router } from "express";
import {
  findProductByCategory,
  findProductById,
  findProducts,
} from "../controllers/productController.js";

const productRouter = Router();

productRouter.route("/single/:_id").get(findProductById);
productRouter.route("/all").get(findProducts);
productRouter.route("/:genderName/:categoryName/:subCategoryName").get(findProductByCategory);

export default productRouter;
