import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDashboardSummary = asyncHandler(async (req, res) => {
  const [result] = await db.execute(
    `
      SELECT 
        total_income,
        total_expense,
        net_savings
      FROM v_income_vs_expense
      WHERE user_id = ?
    `,
    [req.user.id],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result[0], "dashboard summery fetched"));
});

const getMonthlySpend = asyncHandler(async (req, res) => {
  const [result] = await db.execute(
    `
    SELECT 
      category,
      month,
      total_spent
    FROM v_monthly_spend
    WHERE user_id = ?
    ORDER BY month DESC
    `,
    [req.user.id],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result[0], "monthly spend fetched"));
});

const getIncomeVsExpense = asyncHandler(async (req, res) => {
  const [result] = await db.execute(
    `
    SELECT
      total_income,
      total_expense,
      net_savings
    FROM v_income_vs_expense
    WHERE user_id = ?
    `,
    [req.user.id],
  );

  res
    .status(200)
    .json(new ApiResponse(200, result[0], "Income vs expense fetched"));
});

const getBudgetVsActual = asyncHandler(async (req, res) => {});

export {
  getDashboardSummary,
  getMonthlySpend,
  getIncomeVsExpense,
  getBudgetVsActual,
};
