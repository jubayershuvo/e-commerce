import { Router } from "express";
import { addOrder, getCoupon, myOrder, myOrders, } from "../controllers/orderController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const orderRouter = Router();

//for user
orderRouter.route("/add").post(verifyJWT, addOrder);
orderRouter.route("/myorders").get(verifyJWT, myOrders);
orderRouter.route("/myorder/:_id").get(verifyJWT, myOrder);
orderRouter.route("/coupon/:code").get(getCoupon);


export default orderRouter;
