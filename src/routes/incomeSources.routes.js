import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import { createIncomeSourceValidator } from "../validators/incomeSource.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createIncomeSource,
  getAllIncomeSources,
} from "../controllers/incomeSources.controller.js";

const router = Router();

router
  .route("/")
  .post(jwtVerify, createIncomeSourceValidator(), validate, createIncomeSource)
  .get(jwtVerify, getAllIncomeSources);

export default router;
