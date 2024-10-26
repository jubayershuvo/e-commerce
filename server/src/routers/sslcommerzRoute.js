import { Router } from "express";
import { sslInit, successPay } from "../controllers/sslcommerzController.js";


const sslcommerzRouter = Router();

sslcommerzRouter.route("/init/:orderId").get(sslInit);
sslcommerzRouter.route("/success/:orderId").post(successPay);

export default sslcommerzRouter;
