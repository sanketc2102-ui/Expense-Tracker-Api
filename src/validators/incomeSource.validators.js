import { body } from "express-validator";

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

export { createIncomeSourceValidator };
