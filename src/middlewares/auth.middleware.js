import "dotenv/config";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import db from "../db/dbConnection.js";

const jwtVerify = asyncHandler(async (req, res, next) => {
  const token =
    req?.cookies?.accessToken ||
    req?.header("Authorization").replace("Bearer ", "");

  if (!token) {
    throw new ApiError(400, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const [[user]] = await db.execute(
      `SELECT id, email, username FROM users WHERE id = ?`,
      [decodedToken.id],
    );

    if (!user) {
      throw new ApiError(400, "invalid access token");
    }

    req.user = user;

    next();
  } catch (err) {
    throw new ApiError(400, "Invalid access token");
  }
});

export default jwtVerify;
