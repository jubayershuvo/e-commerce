import { Router } from "express";
import { addCategory, addGender, addSubCategory, allcategory, allSubCategory, deleteCategory, deleteSubCategory, findCategoryByGender, findSubCategoryByGenderAndCategory } from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.route("/allcategory").get(allcategory);

categoryRouter.route("/allsubcategory").get(allSubCategory);

categoryRouter.route("/gender").get(addGender);

categoryRouter.route("/add").post(addCategory);

categoryRouter.route("/delete/:_id").get(deleteCategory);

categoryRouter.route("/sub/add").post(addSubCategory);

categoryRouter.route("/sub/delete/:_id").get(deleteSubCategory);

categoryRouter.route("/delete/:_id").get();

categoryRouter.route("/sub/delete/:_id").get();

categoryRouter.route("/:genderName").get(findCategoryByGender);

categoryRouter.route("/:genderName/:categoryName").get(findSubCategoryByGenderAndCategory);


export default categoryRouter;