import jwt from "jsonwebtoken";

interface TokenPayload {
  id: string;
  role: string;
  companyId?: string;
}

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "15m", // Short-lived
  });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh") as string, {
    expiresIn: "7d", // Long-lived
  });
};

// Keeping default export for backward compatibility if needed, 
// though we should move to named exports
const generateToken = generateAccessToken;
export default generateToken;