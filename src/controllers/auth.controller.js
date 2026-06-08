import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { emailVerificationMailGen, sendMail } from "../utils/mail.js";
import { hashedPassword } from "../utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { generateTemporaryToken } from "../utils/token.js";

const generateAccessAndRefreshToken = async (userId) => {
  const [users] = await db.execute(
    `SELECT name, email FROM users WHERE id = ?`,
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

export { registerUser };
