import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { 
    bkashCallBack,
    paymentCreate
 } from "../controllers/bkashController.js";
import { authBkash } from "../middlewares/bkashMiddleware.js";

const bkashRouter = Router();
bkashRouter.route("/payment/create").post(verifyJWT, authBkash, paymentCreate);
bkashRouter.route("/payment/callback").get(bkashCallBack);


export default bkashRouter;