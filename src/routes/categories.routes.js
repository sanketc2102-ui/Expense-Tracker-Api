import { Router } from "express";
import {
  getAllCategories,
  getCategoryById,
} from "../controllers/categories.controller.js";
import jwtVerify from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(jwtVerify, getAllCategories);

router.route("/:categoryId").post(jwtVerify, getCategoryById);

export default router;
