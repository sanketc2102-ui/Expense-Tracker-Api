import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getDashboardSummary = asyncHandler(async (req, res) => {});

const getMonthlySpend = asyncHandler(async (req, res) => {});

const getIncomeVsExpense = asyncHandler(async (req, res) => {});

const getBudgetVsActual = asyncHandler(async (req, res) => {});

export {
  getDashboardSummary,
  getMonthlySpend,
  getIncomeVsExpense,
  getBudgetVsActual,
};
