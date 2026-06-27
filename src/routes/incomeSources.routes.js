import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import {
  createIncomeSourceValidator,
  deleteIncomeSourceValidator,
  updateIncomeSourceValidator,
} from "../validators/incomeSource.validators.js";
import validate from "../middlewares/validator.middleware.js";
import {
  createIncomeSource,
  deleteIncomeSourceById,
  getAllIncomeSources,
  updateIncomeSourceById,
} from "../controllers/incomeSources.controller.js";

const router = Router();

router
  .route("/")
  .post(jwtVerify, createIncomeSourceValidator(), validate, createIncomeSource)
  .get(jwtVerify, getAllIncomeSources);

router
  .route("/:sourceId")
  .delete(
    jwtVerify,
    deleteIncomeSourceValidator(),
    validate,
    deleteIncomeSourceById,
  )
  .put(
    jwtVerify,
    updateIncomeSourceValidator(),
    validate,
    updateIncomeSourceById,
  );

export default router;
