import { Router } from "express";
import jwtVerify from "../middlewares/auth.middleware.js";
import {
  getBudgetVsActual,
  getDashboardSummary,
  getIncomeVsExpense,
  getMonthlySpend,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(jwtVerify);

router.get("/summary", getDashboardSummary);

router.get("/monthly-spend", getMonthlySpend);

router.get("/income-vs-expense", getIncomeVsExpense);

router.get("/budget-vs-actual", getBudgetVsActual);

export default router;
