import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailVerificationMailGen, sendMail } from "../utils/mail.js";
import { hashedPassword, isPasswordCorrect } from "../utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { generateTemporaryToken } from "../utils/token.js";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  const [users] = await db.execute(
    `SELECT id, username, email FROM users WHERE id = ?`,
    [userId],
  );

  if (!users.length === 0) {
    throw new ApiError(400, "User  not found");
  }

  const user = users[0];

  try {
    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    await db.execute(`UPDATE users SET refresh_token = ? WHERE id = ?`, [
      refreshToken,
      userId,
    ]);

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh token",
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log(req.body);

  const [existedUser] = await db.execute(
    `SELECT id, email FROM users WHERE email = ?`,
    [email],
  );

  if (existedUser.length !== 0) {
    throw new ApiError(400, "User with email already exist");
  }

  const hashedUserPassword = await hashedPassword(password);
  const { unHashedToken, hashedToken, tokenExpiery } = generateTemporaryToken();

  const [newUser] = await db.execute(
    `INSERT INTO users (username, email, password_hash, email_verification_token,  email_verification_expiry) VALUES(?,?,?,?,?)`,
    [name, email, hashedUserPassword, hashedToken, tokenExpiery],
  );

  const newUserId = newUser.insertId;

  await sendMail({
    email: email,
    subject: "pleas verify your email",
    mailGenContent: emailVerificationMailGen(
      name,
      `${req.protocol}://${req.get("host")}/verify-email/${unHashedToken}`,
    ),
  });

  const [[createdUser]] = await db.execute(
    `SELECT username, email, email_verification_token FROM users WHERE id = ?`,
    [newUserId],
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        { createdUser },
        "User is been successfuly register",
      ),
    );
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const [existeadUser] = await db.execute(
    `SELECT id, email, password_hash FROM users WHERE email = ?`,
    [email],
  );

  if (existeadUser.length === 0) {
    throw new ApiError(400, "User with email does not exist");
  }

  const user = existeadUser[0];

  const isValidPassword = await isPasswordCorrect(password, user.password_hash);

  if (!isValidPassword) {
    throw new ApiError(400, "Invalid password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id,
  );

  const [[userData]] = await db.execute(
    `SELECT username, email FROM users WHERE id = ?`,
    [user.id],
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: userData, accessToken, refreshToken },
        "user loged in successfully",
      ),
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User successfully fetched"));
});

export { registerUser, login, getCurrentUser };
