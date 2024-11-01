import { Router } from "express";
import {
  avatarUpdate,
  changePassword,
  currentUser,
  deleteUser,
  emailVerify,
  findUserByUsername,
  findUsers,
  findUsersBySearch,
  forgetCodeVerify,
  getMenu,
  loginUser,
  logoutUser,
  passwordRecovery,
  refreshAccessToken,
  registerUser,
  registerVerify,
  setPassword,
  updateUserEmail,
  updateUserInfo,
} from "../controllers/userController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/multerMiddleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  registerUser
);
userRouter.route("/activate-user").post(registerVerify);
userRouter.route("/forget-password").post(passwordRecovery);
userRouter.route("/verify-code").post(forgetCodeVerify);
userRouter.route("/set-password").post(setPassword);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").get(verifyJWT, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);
userRouter.route("/update-email").post(verifyJWT, updateUserEmail);
userRouter.route("/email-verify").post(verifyJWT, emailVerify);
userRouter.route("/update-password").post(verifyJWT, changePassword);
userRouter.route("/current-user").get(verifyJWT, currentUser);
userRouter.route("/update-user").patch(verifyJWT, updateUserInfo);
userRouter.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), avatarUpdate);
userRouter.route("/single/:username").get(findUserByUsername);
userRouter.route("/all").get(findUsers);
userRouter.route("/search-users").get(verifyJWT, findUsersBySearch);
userRouter.route("/search-users").get(verifyJWT, findUsersBySearch);
userRouter.route("/delete-user").post(verifyJWT, deleteUser);
userRouter.route("/menu").get(getMenu);

export default userRouter;
