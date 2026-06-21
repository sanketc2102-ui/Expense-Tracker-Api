import { Router } from "express";
import {
  changeCurrentPassword,
  forgotPasswordRequest,
  getCurrentUser,
  login,
  logOut,
  registerUser,
  verifyEmail,
} from "../controllers/auth.controller.js";
import validate from "../middlewares/validator.middleware.js";
import {
  registerUserValidators,
  loginUserValidators,
} from "../validators/index.js";
import jwtVerify from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(registerUserValidators(), validate, registerUser);

router.route("/login").post(loginUserValidators(), validate, login);

router.route("/verify-email/:verificationToken").get(verifyEmail);

// secured route
router.route("/me").get(jwtVerify, getCurrentUser);
router.route("/change-password").post(jwtVerify, changeCurrentPassword);
router.route("/logout").post(jwtVerify, logOut);

export default router;
