import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import {
  createIncomeValidators,
  deleteIncomeValidators,
  updateIncomeValidators,
} from "../validators/income.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createIncome,
  deleteIncomeById,
  getAllIncomes,
  updateIncomeById,
} from "../controllers/income.controller.js";

const router = Router();

router
  .route("/")
  .post(jwtVerify, createIncomeValidators(), validate, createIncome)
  .get(jwtVerify, getAllIncomes);

router
  .route("/:incomeId")
  .delete(jwtVerify, deleteIncomeValidators(), validate, deleteIncomeById)
  .put(jwtVerify, updateIncomeValidators(), validate, updateIncomeById);

export default router;
