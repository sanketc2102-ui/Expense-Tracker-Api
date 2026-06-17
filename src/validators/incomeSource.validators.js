import { body, param } from "express-validator";

const createIncomeSourceValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("mention name of source of incone it is mendatory ")
      .isLength({ max: 100 })
      .withMessage("rource of income is required"),
  ];
};

const deleteIncomeSourceValidator = () => {
  return [
    param("sourceId")
      .isInt({ gt: 0 })
      .withMessage("income source id must be positive integer"),
  ];
};

const updateIncomeSourceValidator = () => {
  return [
    param("sourceId")
      .isInt({ gt: 0 })
      .withMessage("income source id must be positive integer"),

    body("name")
      .trim()
      .notEmpty()
      .withMessage("name is required")
      .isLength({ max: 100 })
      .withMessage("name can not be more than 100 characters"),
  ];
};

export {
  createIncomeSourceValidator,
  deleteIncomeSourceValidator,
  updateIncomeSourceValidator,
};
