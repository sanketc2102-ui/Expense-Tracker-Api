import crypto from "node:crypto";

const generateTemporaryToken = () => {
  const unHashedToken = crypto.randomBytes(20);

  const hashedToken = crypto
    .createHash("sha256")
    .update(unHashedToken)
    .digest("hex");

  const expiryTimeMs = Date.now() + 20 * 60 * 1000; // 20min

  const tokenExpiery = new Date(expiryTimeMs)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  return { unHashedToken, hashedToken, tokenExpiery };
};

export { generateTemporaryToken };
