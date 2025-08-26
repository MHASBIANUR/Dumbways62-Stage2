import { Router } from "express";
import { handleSupplierLogin } from "../controllers/supplier";
import { authenticate, authorize } from "../middlewares/auth";
import { prisma } from "../prisma/client";

const router = Router();

// Endpoint login khusus supplier
router.post("/login", handleSupplierLogin);

// GET semua produk milik supplier login
router.get("/products", authenticate, authorize(["SUPPLIER"]), async (req, res) => {
  const userId = (req as any).user.id;

  const supplier = await prisma.supplier.findUnique({ where: { userId } });
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });

  const products = await prisma.product.findMany({ where: { supplierId: supplier.id } });
  res.json(products);
});

// POST tambah produk baru
router.post("/products", authenticate, authorize(["SUPPLIER"]), async (req, res) => {
  const userId = (req as any).user.id;
  const { name, price } = req.body;

  if (!name || price === undefined) return res.status(400).json({ message: "Name and price required" });

  const supplier = await prisma.supplier.findUnique({ where: { userId } });
  if (!supplier) return res.status(404).json({ message: "Supplier not found" });

  const product = await prisma.product.create({ data: { name, price, supplierId: supplier.id } });
  res.status(201).json(product);
});

export default router;
