import { Router } from "express";
import { transferPoints, getUserPoints } from "../controllers/point";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/transfer", authenticate, transferPoints);
router.get("/:userId", authenticate, getUserPoints);

export default router;
