import { Router } from "express";
import { allPayments, singlePayment } from "../controllers/paymentController.js";
import { verifyAdminJWT } from "../middlewares/adminMiddleware.js";

const paymentRouter = Router();
paymentRouter.route("/all").get(verifyAdminJWT, allPayments);
paymentRouter.route("/single/:_id").get(verifyAdminJWT, singlePayment);


export default paymentRouter;