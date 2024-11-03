import { Router } from "express";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { upload } from "../middlewares/multerMiddleware.js";
import { banUser, loginAdmin, makeAdmin, removeAdmin, unbanUser } from "../controllers/adminController.js";
import { verifyAdminJWT } from "../middlewares/adminMiddleware.js";
import { addCoupon, allOrders, confirmedOrders, deleteCoupon, getAllCoupon, pendingOrders, singleOrder, updateStatus, withoutP } from "../controllers/orderController.js";

const adminRouter = Router();


adminRouter.route('/login').post(loginAdmin)
adminRouter.route('/user/ban/:_id').get(verifyAdminJWT, banUser)
adminRouter.route('/user/unban/:_id').get(verifyAdminJWT, unbanUser)
adminRouter.route('/user/makeAdmin').post(verifyAdminJWT, makeAdmin)
adminRouter.route('/user/removeAdmin').post(verifyAdminJWT, removeAdmin)

adminRouter.route("/product/add").post(
  verifyAdminJWT,
  upload.fields([
    { name: "productImage", maxCount: 1 }, // Single file for productImage
    { name: "images", maxCount: 5 }, // Multiple files for images
  ]),
  addProduct
);
adminRouter.route("/product/update/:_id").post(
  verifyAdminJWT,
  upload.fields([
    { name: "productImage", maxCount: 1 }, // Single file for productImage
    { name: "images", maxCount: 5 }, // Multiple files for images
  ]),
  updateProduct
);
adminRouter.route("/product/delete").post(verifyAdminJWT, deleteProduct);
adminRouter.route("/coupon/add").post(verifyAdminJWT, addCoupon);
adminRouter.route("/coupon/all").get(verifyAdminJWT, getAllCoupon);
adminRouter.route("/coupon/delete/:_id").get(verifyAdminJWT, deleteCoupon);

// for admin
adminRouter.route("/order/all").get(verifyAdminJWT, allOrders);
adminRouter.route("/order/single/:_id").get(verifyAdminJWT, singleOrder);
adminRouter.route("/order/pending").get(verifyAdminJWT, pendingOrders);
adminRouter.route("/order/confirmed").get(verifyAdminJWT, confirmedOrders);
adminRouter.route("/order/withoutp").get(verifyAdminJWT, withoutP);
adminRouter.route("/order/update/status").post(verifyAdminJWT, updateStatus);

export default adminRouter;
