import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routers/userRoutes.js";
import { cors_origin } from "./variables.js";
import adminRouter from "./routers/adminRoute.js";
import productRouter from "./routers/productRoute.js";
import addressRouter from "./routers/addressRoute.js";
import orderRouter from "./routers/orderRoute.js";
import bkashRouter from "./routers/bkashRoute.js";
import sslcommerzRouter from "./routers/sslcommerzRoute.js";
import cashOnDeliveryRouter from "./routers/cashOnDeliveryRoute.js";
import paypalRouter from "./routers/paypalRoute.js";
import paymentRouter from "./routers/paymentRoute.js";
import categoryRouter from "./routers/categoryRoute.js";

const app = express();
app.use(cookieParser());
app.use(
  cors({
    origin: cors_origin,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.get("/", (_req, res) => {
  return res.status(200).json({ message: "ok" });
});

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/product", productRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/bkash", bkashRouter);
app.use("/api/sslcommerz", sslcommerzRouter);
app.use("/api/cod", cashOnDeliveryRouter);
app.use("/api/paypal", paypalRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/category", categoryRouter);

app.use("*", (req, res) => {
  return res
    .status(404)
    .json({ success: false, message: "Route doesn't exist..!" });
});

export default app;
