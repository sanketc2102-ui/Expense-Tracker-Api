import { body } from "express-validator";

const registerUserValidators = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("name is required field")
      .isLength({ min: 3 })
      .withMessage("name must have at least 3 characters"),
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required filed")
      .isEmail()
      .withMessage("Please enter valid email"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("password is required filed"),
  ];
};

export { registerUserValidators };
