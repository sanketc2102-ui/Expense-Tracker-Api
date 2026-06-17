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

const getAllIncomeSources = asyncHandler(async (req, res) => {
  const [incomeSources] = await db.execute(
    `
    SELECT id,name
    FROM income_sources
    WHERE user_id = ?
    ORDER BY name ASC
    `,
    [req.user.id],
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        incomeSources,
        "all sources of income fetched successfully",
      ),
    );
});

const deleteIncomeSourceById = asyncHandler(async (req, res) => {
  const { sourceId } = req.params;

  try {
    const [result] = await db.execute(
      `
      DELETE FROM income_sources
      WHERE id = ?
      AND user_id = ?
      `,
      [sourceId, req.user.id],
    );

    if (result.affectedRows === 0) {
      throw new ApiError(404, "income soruce not found");
    }
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      throw new ApiError(
        409,
        "Cannot delete income source because income records exist",
      );
    }
    throw error;
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "income source deleted successfully"));
});

export { createIncomeSource, getAllIncomeSources, deleteIncomeSourceById };
