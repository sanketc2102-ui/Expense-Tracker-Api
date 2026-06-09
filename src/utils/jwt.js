import "dotenv/config";
import jwt from "jsonwebtoken";

const generateAccessToken = async (user) => {
  return jwt.sign(
    { id: user.id, user: user.username, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIERY,
    },
  );
};

const generateRefreshToken = async (user) => {
  return jwt.sign(
    { id: user.id, user: user.username, email: user.email },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIERY,
    },
  );
};

export { generateAccessToken, generateRefreshToken };
