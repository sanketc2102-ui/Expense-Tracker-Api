import bcrypt from "bcrypt";

const hashedPassword = async (password) => {
  return bcrypt.hash(password, 10);
};

const isPasswordCorrect = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export { hashedPassword, isPasswordCorrect };
