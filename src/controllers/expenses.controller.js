import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createExpense = asyncHandler(async (req, res) => {
  const { name, expenseDate, amount, categoryId } = req.body;

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
    throw new ApiError(404, "Category not found");
  }

  const [result] = await db.execute(
    `
    INSERT INTO expenses (user_id, name, expense_date, amount, category_id)
    VALUES (?, ?, ?, ?, ?)
    `,
    [req.user.id, name, expenseDate, amount, categoryId],
  );

  if (result.affectedRows === 0) {
    throw new ApiError(400, "Create expense failed");
  }

  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: result.insertId,
        userId: req.user.id,
        name,
        expenseDate,
        amount,
        categoryId,
      },
      "Expense created successfully",
    ),
  );
});

const getAllExpenses = asyncHandler(async (req, res) => {
  const [result] = await db.execute(
    `
      SELECT
      e.id,
      e.name,
      e.expense_date,
      e.amount,
      c.type AS category
    FROM expenses e
    JOIN categories c
      ON c.id = e.category_id
    WHERE e.user_id = ?
    AND e.deleted_at IS NULL
    ORDER BY e.expense_date DESC
    `,
    [req.user.id],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Expenses fetched successfully"));
});

export { createExpense, getAllExpenses };
