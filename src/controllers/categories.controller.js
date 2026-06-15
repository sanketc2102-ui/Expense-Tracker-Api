import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getAllCategories = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(401, "unauthorized request");
  }

  const [categories] = await db.execute(
    ` 
    SELECT type 
    FROM  categories 
    WHERE user_id = ? 
    ORDER BY type ASC
    `,

    [user.id],
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { categories }, "Categories Fetched successfully"),
    );
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!Number.isInteger(Number(categoryId))) {
    throw new ApiError(400, "Invalid category id");
  }

  if (!categoryId) {
    throw new ApiError(400, "Please provide the category id");
  }

  const [category] = await db.execute(
    `
    SELECT type
    FROM categories
    WHERE id = ? AND user_id = ?
    `,
    [categoryId, req.user.id],
  );

  if (category.length === 0) {
    throw new ApiError(400, "category not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Required Category fetched successfully"),
    );
});

const updateCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { categoryTypeToUpdate } = req.body;

  const [result] = await db.execute(
    `
    UPDATE categories
    SET type = ?
    WHERE id = ? AND user_id = ?
    `,
    [categoryTypeToUpdate, categoryId, req.user.id],
  );

  if (result.affectedRows === 0) {
    throw new ApiError(404, "category not found");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Successful Update"));
});

export { getAllCategories, getCategoryById, updateCategoryById };
