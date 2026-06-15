import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from "../controllers/categories.controller.js";
import jwtVerify from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validator.middleware.js";
import { updateCategoryValidators } from "../validators/categories.validators.js";

const router = Router();

router.route("/").get(jwtVerify, getAllCategories);

router.route("/:categoryId").post(jwtVerify, getCategoryById);

router
  .route("/:categoryId")
  .put(jwtVerify, updateCategoryValidators(), validate, updateCategoryById);

export default router;
