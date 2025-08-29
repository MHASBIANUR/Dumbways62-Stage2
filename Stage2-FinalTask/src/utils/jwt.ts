import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// Custom payload 
export interface MyJwtPayload extends JwtPayload {
  userId: number;
  role: string;
}

// Generate JWT
export const generateToken = (payload: { userId: number; role: string }) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

// Verify JWT
export const verifyToken = (token: string): MyJwtPayload => {
  return jwt.verify(token, JWT_SECRET) as MyJwtPayload;
};
