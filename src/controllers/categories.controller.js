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
    ORDER BY ASC
    `,

    [user.id],
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, { categories }, "Categories Fetched successfully"),
    );
});

export { getAllCategories };
