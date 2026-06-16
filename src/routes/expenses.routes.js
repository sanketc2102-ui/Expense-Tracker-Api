import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import {
  createExpenseValidator,
  getExpenseByIdValidator,
} from "../validators/expenses.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createExpense,
  getAllExpenses,
  getExpenseById,
} from "../controllers/expenses.controller.js";

const router = Router();

router
  .route("/")
  .post(jwtVerify, createExpenseValidator(), validate, createExpense);

router.route("/").get(jwtVerify, getAllExpenses);

router
  .route("/:expenseId")
  .post(jwtVerify, getExpenseByIdValidator(), validate, getExpenseById);

export default router;
