import { Router } from "express";
import { successPayment } from "../controllers/paypalController.js";

const paypalRouter = Router();
paypalRouter.route("/payment-success/:orderId").post(successPayment);


export default paypalRouter;