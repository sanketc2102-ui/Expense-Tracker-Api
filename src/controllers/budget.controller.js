import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createBudget = asyncHandler(async (req, res) => {
  const { categoryId, amount, period, startDate } = req.body;

  if (categoryId) {
    const [category] = await db.execute(
      `
      SELECT id
      FROM categories
      WHERE id = ?
      AND user_id = ?
    `,
      [categoryId, req.user.id],
    );

    if (category.length === 0) {
      throw new ApiError(404, "category not found");
    }
  }

  try {
    const [result] = await db.execute(
      `
      INSERT INTO budgets (
        user_id, 
        category_id,
        amount,
        period,
        start_date
        )
        VALUES (?,?,?,?,?)
    `,
      [req.user.id, categoryId ?? null, amount, period, startDate],
    );

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { budgetId: result.insertId },
          "new buget successfully created",
        ),
      );
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new ApiError(
        409,
        "budget already exists for this category and period",
      );
    }

    throw error;
  }
});

const getAllBudgets = asyncHandler(async (req, res) => {
  const [result] = await db.execute(
    `
       SELECT
          b.id,
          b.amount,
          b.period,
          b.start_date,
          COALESCE(c.type, 'Overall') AS category_name
      FROM budgets b
      LEFT JOIN categories c
          ON c.id = b.category_id
      WHERE b.user_id = ?
      ORDER BY b.start_date DESC
    `,
    [req.user.id],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "all budgets fetched successfuly"));
});

const getBudgetById = asyncHandler(async (req, res) => {
  const { budgetId } = req.params;

  const [result] = await db.execute(
    `
      SELECT 
       b.id,
       b.amount,
       b.start_date,
       b.period,
       c.type AS category_name
      FROM budgets b
      LEFT JOIN categories c
        ON b.category_id = c.id
      WHERE b.user_id = ?
      AND b.id = ?
    
    `,
    [req.user.id, budgetId],
  );

  const budgetNotFound = result.length === 0;

  if (budgetNotFound) {
    throw new ApiError(404, "bugest not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, result[0], "budget fetched successfully"));
});

const deleteBudgetById = asyncHandler(async (req, res) => {
  const { budgetId } = req.params;

  const [result] = await db.execute(
    `
        DELETE FROM budgets
        WHERE user_id = ?
        AND id = ?
      `,
    [req.user.id, budgetId],
  );

  if (result.affectedRows === 0) {
    throw new ApiError(400, "somthing went wrong while deleting the budget");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "budget deleted successfully"));
});

export { createBudget, getAllBudgets, deleteBudgetById, getBudgetById };
