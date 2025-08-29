import { Router } from "express";
import { register, login, me } from "../controllers/auth";
import { validate, authenticate } from "../middlewares/auth";
import { registerSchema, loginSchema } from "../validation/auth";
import { upload } from "../utils/multer";

const router = Router();

router.post("/register", validate(registerSchema), upload.single("profileImage"), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);

export default router;
