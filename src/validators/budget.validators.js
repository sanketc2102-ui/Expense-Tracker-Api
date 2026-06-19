import { body, param } from "express-validator";

const createBudgetValidators = () => {
  return [
    body("categoryId")
      .optional()
      .isInt({ gt: 0 })
      .withMessage("category id must be a positive integer"),

    body("amount")
      .notEmpty()
      .withMessage("amount is required field")
      .isFloat({ gt: 0 })
      .withMessage("amount must be greater than zero")
      .toFloat(),

    body("period")
      .trim()
      .notEmpty()
      .withMessage("period is required")
      .isIn(["weekly", "monthly", "yearly"])
      .withMessage("period must be weekly, monthly or yearly")
      .isLength({ max: 20 })
      .withMessage("period must not excced 20 characters"),

    body("startDate")
      .notEmpty()
      .withMessage("start date is required filed")
      .isISO8601()
      .withMessage("pls enter valid date")
      .toDate(),
  ];
};

export { createBudgetValidators };
