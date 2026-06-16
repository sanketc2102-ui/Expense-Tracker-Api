import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { createExpenseValidator } from "../validators/expenses.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createExpense,
  getAllExpenses,
} from "../controllers/expenses.controller.js";

const router = Router();

router
  .route("/")
  .post(jwtVerify, createExpenseValidator(), validate, createExpense);

router.route("/").get(jwtVerify, getAllExpenses);

export default router;
