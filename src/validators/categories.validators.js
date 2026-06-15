import { body } from "express-validator";

// category

const categoryTypeValidator = () => {
  return [
    body("type")
      .trim()
      .notEmpty()
      .withMessage("Category type is required")
      .isLength({ min: 2, max: 100 })
      .withMessage("Category type must be between 2 and 100 characters"),
  ];
};
