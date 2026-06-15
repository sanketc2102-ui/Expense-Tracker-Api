import { body, param } from "express-validator";

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

const updateCategoryValidators = () => {
  return [
    param("categoryId").isInt({ min: 1 }).withMessage("Invalid category id"),

    body("categoryTypeToUpdate")
      .trim()
      .notEmpty()
      .withMessage("Please inter the category to update")
      .isLength({ max: 100 })
      .withMessage("Category name cannot exceed 100 characters"),
  ];
};

const deleteCategoryValidator = () => {
  return [
    param("categoryId")
      .isInt({ min: 1 })
      .withMessage("category id must be a number"),
  ];
};

export { categoryTypeValidator, updateCategoryValidators };
