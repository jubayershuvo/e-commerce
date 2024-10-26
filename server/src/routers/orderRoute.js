import { Router } from "express";
import { addOrder, myOrder, myOrders, } from "../controllers/orderController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const orderRouter = Router();

//for user
orderRouter.route("/add").post(verifyJWT, addOrder);
orderRouter.route("/myorders").get(verifyJWT, myOrders);
orderRouter.route("/myorder/:_id").get(verifyJWT, myOrder);


export default orderRouter;
