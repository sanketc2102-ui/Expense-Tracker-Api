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

const getExpenseById = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;

  const [expense] = await db.execute(
    `
    SELECT 
      id, 
      name, 
      expense_date, 
      amount 
    FROM expenses
    WHERE id = ?
      AND user_id = ?
      AND deleted_at IS NULL
    `,
    [expenseId, req.user.id],
  );

  if (expense.length === 0) {
    throw new ApiError(404, "no expense is found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, expense[0], "expense fetched successfully"));
});

const updateExpenseById = asyncHandler(async (req, res) => {
  const { expenseId } = req.params;

  const { name, amount, expenseDate, categoryId } = req.body;

  // Check expense exists and belongs to logged-in user
  const [expense] = await db.execute(
    `
    SELECT *
    FROM expenses
    WHERE id = ?
      AND user_id = ?
      AND deleted_at IS NULL
    `,
    [expenseId, req.user.id],
  );

  if (expense.length === 0) {
    throw new ApiError(404, "Expense not found");
  }

  const existingExpense = expense[0];

  // If category is being updated, verify ownership
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
      throw new ApiError(404, "Category not found");
    }
  }

  const updatedName = name ?? existingExpense.name;

  const updatedAmount = amount ?? existingExpense.amount;

  const updatedExpenseDate = expenseDate ?? existingExpense.expense_date;

  const updatedCategoryId = categoryId ?? existingExpense.category_id;

  const [result] = await db.execute(
    `
    UPDATE expenses
    SET
      name = ?,
      amount = ?,
      expense_date = ?,
      category_id = ?
    WHERE id = ?
      AND user_id = ?
    `,
    [
      updatedName,
      updatedAmount,
      updatedExpenseDate,
      updatedCategoryId,
      expenseId,
      req.user.id,
    ],
  );

  if (result.affectedRows === 0) {
    throw new ApiError(400, "Failed to update expense");
  }

  const [updatedExpense] = await db.execute(
    `
    SELECT
      id,
      name,
      amount,
      expense_date,
      category_id
    FROM expenses
    WHERE id = ?
    `,
    [expenseId],
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedExpense[0], "Expense updated successfully"),
    );
});

export { createExpense, getAllExpenses, getExpenseById, updateExpenseById };
