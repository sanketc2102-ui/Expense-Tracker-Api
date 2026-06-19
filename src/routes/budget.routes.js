import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import {
  createBudgetValidators,
  deleteBudgetValidators,
  getABudgetValidators,
} from "../validators/budget.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createBudget,
  deleteBudgetById,
  getAllBudgets,
  getBudgetById,
} from "../controllers/budget.controller.js";

const router = Router();

router
  .route("/")
  .post(jwtVerify, createBudgetValidators(), validate, createBudget)
  .get(jwtVerify, getAllBudgets);

router
  .route("/:budgetId")
  .delete(jwtVerify, deleteBudgetValidators(), validate, deleteBudgetById)
  .get(jwtVerify, getABudgetValidators(), validate, getBudgetById);

export default router;
