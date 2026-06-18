import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { createIncomeValidators } from "../validators/income.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createIncome,
  getAllIncomes,
} from "../controllers/income.controller.js";

const router = Router();

router
  .route("/")
  .post(jwtVerify, createIncomeValidators(), validate, createIncome)
  .get(jwtVerify, getAllIncomes);

export default router;
