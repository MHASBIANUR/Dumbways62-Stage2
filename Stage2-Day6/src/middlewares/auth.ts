import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

/**
 * Middleware untuk autentikasi JWT
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyToken(token);
    (req as any).user = payload; // simpan payload di req.user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/**
 * Middleware untuk membatasi akses berdasarkan role
 */
export function authorize(roles: ("USER" | "SUPPLIER")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }

    next();
  };
}

/**
 * Middleware untuk proteksi route supplier (session-based)
 */
export function authenticateSupplier(req: Request, res: Response, next: NextFunction) {
  // sekarang TypeScript mengenal req.session.supplierId
  if (req.session?.supplierId) return next();
  return res.status(401).json({ message: "Silakan login sebagai supplier" });
}

/**
 * Extend tipe session untuk TypeScript
 */
declare module "express-session" {
  interface SessionData {
    userId?: number;
    supplierId?: number;
  }
}
