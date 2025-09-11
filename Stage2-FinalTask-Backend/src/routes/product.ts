import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, restoreProduct } from "../controllers/product";
import { authenticate, authorize } from "../middlewares/auth";
import { upload } from "../utils/multer";

const router = Router();

// hanya admin yang boleh create / update / delete / restore
router.post("/", authenticate, authorize(["ADMIN"]), upload.single("image"), createProduct);
router.put("/:id", authenticate, authorize(["ADMIN"]), upload.single("image"), updateProduct);
router.delete("/:id", authenticate, authorize(["ADMIN"]), deleteProduct);
router.patch("/:id/restore", authenticate, authorize(["ADMIN"]), restoreProduct);

// semua user bisa lihat produk
router.get("/", getProducts);

export default router;
