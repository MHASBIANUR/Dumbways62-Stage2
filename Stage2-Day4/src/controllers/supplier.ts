import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// GET semua stok supplier
export const getSupplierStocks = async (req: Request, res: Response) => {
  try {
    const stocks = await prisma.supplierStock.findMany({
      include: {
        supplier: true,
        product: true,
      },
    });
    res.json(stocks);
  } catch (error) {
    console.error("Get supplier stocks error:", error);
    res.status(500).json({ error: "Failed to fetch supplier stocks" });
  }
};

// UPDATE stok beberapa supplier sekaligus + sinkronkan dengan product.stock
export const updateSupplierStocks = async (req: Request, res: Response) => {
  /**
   * Contoh body JSON:
   * {
   *   "updates": [
   *     { "supplierId": 1, "productId": 2, "stock": 99 },
   *     { "supplierId": 2, "productId": 3, "stock": 150 }
   *   ]
   * }
   */
  const { updates } = req.body;

  if (!Array.isArray(updates) || updates.length === 0) {
    return res.status(400).json({ error: "Updates must be a non-empty array" });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const updatedStocks = [];

      for (const u of updates) {
        // Update stok di tabel supplierStock
        await tx.supplierStock.update({
          where: {
            supplierId_productId: {
              supplierId: u.supplierId,
              productId: u.productId,
            },
          },
          data: { stock: u.stock },
        });

        // Sinkronkan stok juga di tabel Product
        await tx.product.update({
          where: { id: u.productId },
          data: { stock: u.stock },
        });

        // Ambil data lengkap setelah update
        const record = await tx.supplierStock.findFirst({
          where: {
            supplierId: u.supplierId,
            productId: u.productId,
          },
          include: { supplier: true, product: true },
        });

        updatedStocks.push(record);
      }

      return updatedStocks;
    });

    res.json({ message: "Stocks updated successfully", result });
  } catch (error) {
    console.error("Update supplier stocks error:", error);
    res.status(500).json({ error: "Failed to update supplier stocks" });
  }
};
