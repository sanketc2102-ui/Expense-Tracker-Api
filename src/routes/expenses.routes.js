import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import {
  createExpenseValidator,
  getExpenseByIdValidator,
  updateExpenseValidator,
} from "../validators/expenses.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
  updateExpenseById,
} from "../controllers/expenses.controller.js";

const router = Router();

router
  .route("/")
  .post(jwtVerify, createExpenseValidator(), validate, createExpense);

router.route("/").get(jwtVerify, getAllExpenses);

router
  .route("/:expenseId")
  .post(jwtVerify, getExpenseByIdValidator(), validate, getExpenseById);

router
  .route("/:expenseId")
  .put(jwtVerify, updateExpenseValidator(), validate, updateExpenseById);

export default router;
