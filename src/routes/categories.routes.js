import { Router } from "express";
import { getAllCategories } from "../controllers/categories.controller.js";
import jwtVerify from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(jwtVerify, getAllCategories);

export default router;
