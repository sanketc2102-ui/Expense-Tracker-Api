import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { createBudgetValidators } from "../validators/budget.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createBudget,
  getAllBudgets,
} from "../controllers/budget.controller.js";

const router = Router();

router
  .route("/")
  .post(jwtVerify, createBudgetValidators(), validate, createBudget)
  .get(jwtVerify, getAllBudgets);

export default router;
