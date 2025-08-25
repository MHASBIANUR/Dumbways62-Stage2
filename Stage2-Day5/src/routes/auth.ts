import { Router, Request, Response } from "express";
import { handleRegister, handleLogin } from "../controllers/auth";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// Register user / supplier
router.post("/register", handleRegister);

// Login
router.post("/login", handleLogin);

// Protected route: semua user login bisa akses
router.get("/me", authenticate, (req: Request, res: Response) => {
  const userPayload = (req as any).user;

  const user = {
    id: userPayload.id,
    role: userPayload.role
  };

  res.json({ message: "Protected route", user });
});

// Route khusus SUPPLIER
router.get("/supplier-only", authenticate, authorize(["SUPPLIER"]), (req: Request, res: Response) => {
  res.json({ message: "Hello Supplier!" });
});

export default router;
