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

  return res.json(new ApiResponse(200, result[0], "dashboard summery fetched"));
});

const getMonthlySpend = asyncHandler(async (req, res) => {});

const getIncomeVsExpense = asyncHandler(async (req, res) => {});

const getBudgetVsActual = asyncHandler(async (req, res) => {});

export {
  getDashboardSummary,
  getMonthlySpend,
  getIncomeVsExpense,
  getBudgetVsActual,
};
