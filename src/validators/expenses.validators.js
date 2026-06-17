import { body, param } from "express-validator";

const createExpenseValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("name of expense is required")
      .isLength({ max: 200 })
      .withMessage("expense must be within 200 character"),

    body("expenseDate")
      .notEmpty()
      .withMessage("epense date is required")
      .isISO8601()
      .withMessage("expense date is must be a valid date"),

    body("amount")
      .notEmpty()
      .withMessage("amount is required")
      .isFloat({ gt: 0 })
      .withMessage("amount must be greater than zero"),

    body("categoryId")
      .notEmpty()
      .withMessage("categoryId is required")
      .isInt({ gt: 0 })
      .withMessage("category id must be postive integer"),
  ];
};

const getExpenseByIdValidator = () => {
  return [
    param("expenseId")
      .notEmpty()
      .withMessage("expense id is required ")
      .isInt({ gt: 0 })
      .withMessage("expense is must be type of number"),
  ];
};

const updateExpenseValidator = () => {
  return [
    param("expenseId")
      .isInt({ gt: 0 })
      .withMessage("Expense id must be a positive integer"),

    body("name")
      .optional()
      .trim()
      .notEmpty()
      .isLength({ max: 200 })
      .withMessage("Name must be less than 200 characters"),

    body("amount")
      .optional()
      .isFloat({ gt: 0 })
      .withMessage("Amount must be greater than 0"),

    body("expenseDate")
      .optional()
      .isISO8601()
      .withMessage("Expense date must be valid"),

    body("categoryId")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("Category id must be a positive integer"),
  ];
};

const deleteExpenseValidator = () => {
  return [
    param("expenseId")
      .isInt({ gt: 0 })
      .withMessage("Expense id must be a positive integer"),
  ];
};

export {
  createExpenseValidator,
  getExpenseByIdValidator,
  updateExpenseValidator,
  deleteExpenseValidator,
};
