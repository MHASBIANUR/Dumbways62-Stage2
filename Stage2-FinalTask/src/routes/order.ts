import { Router } from "express";
import { createOrder, getMyOrders, getAllOrders, groupOrdersByUser } from "../controllers/order";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();

// User routes
router.post("/", authenticate, createOrder);       
router.get("/me", authenticate, getMyOrders);      

// Admin routes
router.get("/", authenticate, authorize(["ADMIN"]), getAllOrders);     
router.get("/group-by-user", authenticate, authorize(["ADMIN"]), groupOrdersByUser);

export default router;
