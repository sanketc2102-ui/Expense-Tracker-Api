import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createIncome = asyncHandler(async (req, res) => {
  const { incomeSourceId, amount, incomeDate, note } = req.body;

  const [result] = await db.execute(
    `
    SELECT id, name
    FROM income_sources
    WHERE id = ?
    AND user_id = ?
    `,
    [incomeSourceId, req.user.id],
  );

  if (result.length === 0) {
    throw new ApiError(404, "income source not found");
  }

  const [createdIncome] = await db.execute(
    `
      INSERT INTO incomes (
        user_id, 
        income_source_id,
        amount,
        income_date,
        note
      )
      VALUES (?,?,?,?,?)
    `,
    [req.user.id, incomeSourceId, amount, incomeDate, note],
  );

  if (createdIncome.affectedRows === 0) {
    throw new ApiError(
      400,
      "something went wrong while creating the new income",
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { incomeId: createdIncome.insertId },
        "new income has been created",
      ),
    );
});

export { createIncome };
