import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";
import { verifyToken } from "../utils/jwt";

/* Extend Express.Request */
declare global {
  namespace Express {
    interface Request {
      user?: { userId: number; role: string };
    }
  }
}

/* Validate (Joi) */
export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    console.log("🔍 Validating with schema:", schema.describe().keys); 
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validation failed",
        details: error.details.map((d: any) => d.message),
      });
    }
    next();
  };
};

/* Authenticate (JWT) */
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "Isi token terlebih dahulu" });

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer")
    return res.status(401).json({ message: "Invalid authorization format" });

  const token = parts[1];
  try {
    const decoded = verifyToken(token); 

    req.user = { userId: decoded.userId, role: decoded.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Ada kesalahan token atau expired" });
  }
};

/* Authorize (role-based) */
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Hanya Admin Yang Boleh" });
    next();
  };
};


