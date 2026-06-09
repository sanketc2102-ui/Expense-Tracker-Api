import { Router } from "express";
import {
  getCurrentUser,
  login,
  registerUser,
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

// secured route
router.route("/me").get(jwtVerify, getCurrentUser);

export default router;
