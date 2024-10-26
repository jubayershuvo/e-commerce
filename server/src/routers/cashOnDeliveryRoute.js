import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { deliveryCreate } from "../controllers/cashOnDeliveryController.js";

const cashOnDeliveryRouter = Router();
cashOnDeliveryRouter.route("/add/:orderId").get(verifyJWT, deliveryCreate);


export default cashOnDeliveryRouter;