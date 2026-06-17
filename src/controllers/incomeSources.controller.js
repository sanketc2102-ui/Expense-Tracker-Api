import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createIncomeSource = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const [existingSource] = await db.execute(
    `
    SELECT id 
    FROM income_sources
    WHERE user_id = ?
    AND name = ?
    `,
    [req.user.id, name],
  );

  if (existingSource.length > 0) {
    throw new ApiError(409, "source of income already exist");
  }

  try {
    const [result] = await db.execute(
      `
    INSERT INTO income_sources (user_id, name)
    VALUES (?, ?)
    
    `,
      [req.user.id, name],
    );

    if (result.affectedRows === 0) {
      throw new ApiError(
        400,
        "something went wrong while creating the income source",
      );
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new ApiError(409, "source of income already exist");
    }

    throw error;
  }

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "source of income created successfully"));
});

export { createIncomeSource };
