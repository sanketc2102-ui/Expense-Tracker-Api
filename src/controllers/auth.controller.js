import db from "../db/dbConnection.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  emailVerificationMailGen,
  forgetPasswordMailGen,
  sendMail,
} from "../utils/mail.js";
import { hashedPassword, isPasswordCorrect } from "../utils/bcrypt.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { generateTemporaryToken } from "../utils/token.js";
import crypto, { createHash } from "node:crypto";
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
      `${req.protocol}://${req.get("host")}/auth/v1/verify-email/${unHashedToken}`,
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

const logOut = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "user is not found");
  }

  await db.execute(`UPDATE users SET refresh_token = ? WHERE id = ?`, [
    null,
    user.id,
  ]);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .status(200)
    .json(new ApiResponse(200, {}, "log out successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User successfully fetched"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ApiError(400, "Token is missing");
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  console.log("hashed Token", hashedToken);

  const [result] = await db.execute(
    `SELECT id, username FROM users WHERE email_verification_token = ? AND email_verification_expiry > NOW()`,
    [hashedToken],
  );

  console.log(result);

  if (result.length === 0) {
    throw new ApiError(400, "Invaid or expired token");
  }

  const user = result[0];

  await db.execute(
    `UPDATE users SET email_verification_token = ?, email_verification_expiry = ?, is_email_verified = ? WHERE id = ?`,
    [null, null, 1, user.id],
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { username: user.username, isEmailVerified: true },
        "email successfully verified",
      ),
    );
});

// #ff2c2c pending :- we  allowed resend verification email to loged in user only
const resentEmailVerification = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(400, "unauthorized request");
  }

  const [result] = await db.execute(
    "SELECT is_email_verified FROM users WHERE id = ?",
    [user.id],
  );

  const resultUser = result[0];

  if (resultUser.is_email_verified === 1) {
    throw new ApiError(400, "Email is alredy verified");
  }

  const { unHashedToken, hashedToken, tokenExpiery } = generateTemporaryToken();

  const [users] = await db.execute(
    "UPDATE users SET email_verification_token = ?, email_verification_expiry = ? WHERE id = ? ",
    [hashedToken, tokenExpiery, resultUser.id],
  );

  await sendMail({
    email: email,
    subject: "pleas verify your email",
    mailGenContent: emailVerificationMailGen(
      name,
      `${req.protocol}://${req.get("host")}/auth/v1/verify-email/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "email is been you to your inbox"));
});

//#ff2c2c pending
const refreshAccessToken = asyncHandler(async (req, res) => {
  const inComingToken = req.cookies.refreshToken;

  if (!inComingToken) {
    throw new ApiError(400, "Token is not provided");
  }

  try {
    const decodedRefreshToken = jwt.verify(
      inComingToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    if (!decodedRefreshToken?.id) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const [[user]] = await db.execute(
      "SELECT refresh_token FROM users WHERE id = ? ",
      [decodedRefreshToken.id],
    );

    if (!user) {
      throw new ApiError(400, "");
    }

    if (user.refresh_token !== inComingToken) {
      throw new ApiError(401, "Refresh Token is invalid or expired");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      decodedRefreshToken.id,
    );

    await db.execute("UPDATE users SET refresh_token = ? WHERE id = ?", [
      refreshToken,
      decodedRefreshToken.id,
    ]);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken },
          "re-generatin of token compelte",
        ),
      );
  } catch (err) {
    throw new ApiError(401, "invalid refresh  token", err);
  }
});

//  #ff2c2c
const forgotPasswordRequest = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const [[user]] = await db.execute(
    "SELECT id, username, email FROM users WHERE email = ?",
    [email],
  );

  if (!user) {
    throw new ApiError("User with email does not exit");
  }

  const { unHashedToken, hashedToken, tokenExpiery } = generateTemporaryToken();

  await db.execute(
    `UPDATE users SET  forget_password_token = ?, forget_password_expiry = ? WHERE id = ?`,
    [hashedToken, tokenExpiery, user.id],
  );

  await sendMail({
    email: email,
    subject: "Resetting forgotted password",
    mailGenContent: forgetPasswordMailGen(
      user.username,
      `${process.env.FORGET_PASSWORD_URL}/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "reset password email been send to you"));
});

const resetForgotPassword = asyncHandler(async (req, res) => {
  const { forgetpasswordToken } = req.params;
  const { password: newPassword } = req.body;

  if (!forgetpasswordToken) {
    throw new ApiError(400, "Invalid or missing token");
  }

  const hashedtoken = crypto
    .createHash("sha256")
    .update(forgetpasswordToken)
    .digest("hex");

  const [[user]] = await db.execute(
    "SELECT id, username, forget_password_token FROM users WHERE email_verification_token = ? AND email forget_password_expiry > NOW() ",
    [hashedtoken],
  );

  if (!user) {
    throw new ApiError(409, "Invalid or expired token");
  }

  const hashedNewPassword = await hashedPassword(newPassword);

  await db.execute(
    "UPDATE users SET forget_password_token = ?, forget_password_expiry = ? , password = ? WHERE id = ?",
    [null, null, hashedNewPassword, user.id],
  );

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password reset successfully"));
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { newPassword, oldPassword } = req.body;

  const user = req.user;

  if (!user) {
    throw new ApiError(400, "unauthorized request");
  }

  const [[resultedUser]] = await db.execute(
    "SELECT password_hash FROM users WHERE id = ? ",
    [user.id],
  );

  const userInputedOldPwHashed = await hashedPassword(oldPassword);

  const isValidPassWord = await isPasswordCorrect(
    userInputedOldPwHashed,
    resultedUser.password_hash,
  );

  if (isValidPassWord) {
    throw new ApiError("incorrect password");
  }

  const hashedNewPassword = await hashedPassword(newPassword);

  await db.execute("UPDATE users SET password = ? WHERE id = ?", [
    hashedNewPassword,
    user.id,
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "password is being reset"));
});

export {
  registerUser,
  login,
  logOut,
  getCurrentUser,
  verifyEmail,
  refreshAccessToken,
  forgotPasswordRequest,
  resentEmailVerification,
  resetForgotPassword,
  changeCurrentPassword,
};
