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

export { createExpenseValidator, getExpenseByIdValidator };
