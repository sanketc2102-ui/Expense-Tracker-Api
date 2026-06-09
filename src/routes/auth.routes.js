import { Router } from "express";
import { login, registerUser } from "../controllers/auth.controller.js";
import validate from "../middlewares/validator.middleware.js";
import {
  registerUserValidators,
  loginUserValidators,
} from "../validators/index.js";

const router = Router();

router
  .route("/register")
  .post(registerUserValidators(), validate, registerUser);

router.route("/login").post(loginUserValidators(), validate, login);

export default router;
