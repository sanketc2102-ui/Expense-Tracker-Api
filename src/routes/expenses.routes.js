import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import {
  createExpenseValidator,
  deleteExpenseValidator,
  getExpenseByIdValidator,
  updateExpenseValidator,
} from "../validators/expenses.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createExpense,
  deleteExpenseById,
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

router.route("/:expenseId").delete(jwtVerify, deleteExpenseById);

export default router;
