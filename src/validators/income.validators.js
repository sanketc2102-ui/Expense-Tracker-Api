import { body } from "express-validator";

// { incomeSourceId, amount, incomeDate }

const createIncomeValidators = () => {
  return [
    body("incomeSourceId")
      .notEmpty()
      .withMessage("Source of Income id is required")
      .isInt({ gt: 0 })
      .withMessage("source fo income id must be positive integer"),

    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("amount must be greater than zero"),

    body("incomeDate")
      .notEmpty()
      .withMessage("date is required ")
      .isISO8601()
      .withMessage("pls enter proper date"),

    body("note")
      .optional()
      .isLength({ max: 255 })
      .withMessage("notes must not be more thatn 255 characters"),
  ];
};

export { createIncomeValidators };
