import { Router } from "express";
import { addAddress, updateAddress } from "../controllers/addressController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const addressRouter = Router();
addressRouter.route("/add").post(verifyJWT, addAddress);
addressRouter.route("/update/:_id").get(verifyJWT, updateAddress);


export default addressRouter;