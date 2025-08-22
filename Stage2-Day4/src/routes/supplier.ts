import { Router } from "express";
import { getSupplierStocks, updateSupplierStocks } from "../controllers/supplier";

const router = Router();

// GET semua stok supplier
router.get("/stock", getSupplierStocks);

// Batch update stok supplier
router.put("/stock", updateSupplierStocks);

export default router;
