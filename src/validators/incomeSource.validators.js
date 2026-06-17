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

export { createIncomeSourceValidator, deleteIncomeSourceValidator };
