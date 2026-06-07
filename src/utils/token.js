import crypto from "node:crypto";

const generateTemporaryToken = () => {
  const unHashedToken = crypto.randomBytes(20);

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const tokenExpiery = Date.now() + 20 * 60 * 1000; // 20min

  return { unHashedToken, hashedToken, tokenExpiery };
};

export { generateTemporaryToken };
