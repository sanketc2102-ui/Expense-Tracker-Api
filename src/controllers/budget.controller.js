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

export { createBudget };
