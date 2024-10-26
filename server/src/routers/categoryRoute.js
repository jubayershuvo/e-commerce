import { Router } from "express";
import { addCategory, addGender, addSubCategory, findCategoryByGender, findSubCategoryByGenderAndCategory } from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.route("/gender").get(addGender);
categoryRouter.route("/add").post(addCategory);
categoryRouter.route("/sub/add").post(addSubCategory);
categoryRouter.route("/delete/:_id").get();
categoryRouter.route("/sub/delete/:_id").get();
categoryRouter.route("/:genderName").get(findCategoryByGender);
categoryRouter.route("/:genderName/:categoryName").get(findSubCategoryByGenderAndCategory);


export default categoryRouter;