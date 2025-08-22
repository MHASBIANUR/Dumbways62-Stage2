import { Router } from "express";
import { transferPoints, userPoints } from "../controllers/transfer-points";

const router = Router();

// POST /api/v1/transfer
router.post("/transfer-points", transferPoints);
router.get("/user-points/:id", userPoints);


export default router;
