import { Router, Request, Response } from "express";
import { handleRegister, handleLogin } from "../controllers/auth";
import { authenticate, authorize } from "../middlewares/auth";
import { upload } from "../utils/multer";
import limiter from "../middlewares/rate-limiter";

const router = Router();

router.post("/register", upload.single("profile"), handleRegister);

router.post("/login", handleLogin);

router.get("/me", limiter, authenticate, (req: Request, res: Response) => {
  const userPayload = (req as any).user;

  res.json({
    message: "Protected route",
    user: {
      id: userPayload.id,
      role: userPayload.role,
    },
  });
});

// Hanya SUPPLIER
router.get(
  "/supplier-only",
  authenticate,
  authorize(["SUPPLIER"]),
  (req: Request, res: Response) => {
    res.json({ message: "Hello Supplier!" });
  }
);

export default router;
