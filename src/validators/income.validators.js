import { body, param } from "express-validator";

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

const deleteIncomeValidators = () => {
  return [
    param("incomeId")
      .trim()
      .isInt({ gt: 0 })
      .withMessage("income id must be positive integer")
      .toInt(),
  ];
};

const updateIncomeValidators = () => {
  return [
    param("incomeId")
      .isInt({ gt: 0 })
      .withMessage("income id must be positive integer")
      .toInt(),

    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("amount must me greater than zero")
      .toFloat(),

    body("incomeSourceId")
      .isInt({ gt: 0 })
      .withMessage("income source id must be a positive integer")
      .toInt(),

    body("incomeDate")
      .notEmpty()
      .withMessage("date is required")
      .isISO8601()
      .withMessage("please enter a valid date"),

    body("note")
      .optional()
      .isLength({ max: 255 })
      .withMessage("note cannot exceed 255 characters"),
  ];
};

export {
  createIncomeValidators,
  deleteIncomeValidators,
  updateIncomeValidators,
};
