import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// Create Product (hanya admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, price, stock } = req.body;

    const user = req.user as { userId: number; role: string };

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        image: req.file ? req.file.filename : null,
        createdById: user.userId,
      },
    });

    res.json({ message: "Produk berhasil dibuat", product });
  } catch (err: any) {
    res.status(500).json({ message: "Gagal membuat produk", error: err.message });
  }
};


// Get Products (filter, sort, pagination)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", sortBy = "createdAt", sortOrder = "desc", name } = req.query;

    const products = await prisma.product.findMany({
      where: {
        deletedAt: null, // hanya produk aktif
        ...(name ? { name: { contains: String(name), mode: "insensitive" } } : {}),
      },
      orderBy: { [String(sortBy)]: sortOrder === "asc" ? "asc" : "desc" },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
      include: { createdBy: { select: { id: true, name: true } } },
    });

    res.json({ message: "Daftar produk", products });
  } catch (err: any) {
    res.status(500).json({ message: "Gagal mengambil produk", error: err.message });
  }
};


// Update Product (hanya admin)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, stock, image } = req.body;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, 
              price: Number(price), 
              stock: Number(stock), 
              image },
    });

    res.json({ message: "Produk berhasil diupdate", product });
  } catch (err: any) {
    res.status(500).json({ message: "Gagal update produk", error: err.message });
  }
};

// Soft Delete Product (hanya admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { deletedAt: new Date() },  // soft delete
    });

    res.json({ message: "Produk berhasil dihapus (soft delete)", product });
  } catch (err: any) {
    res.status(500).json({ message: "Gagal menghapus produk", error: err.message });
  }
};

// Restore Product (hanya admin)
export const restoreProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { deletedAt: null },
    });

    res.json({ message: "Produk berhasil direstore", product });
  } catch (err: any) {
    res.status(500).json({ message: "Gagal merestore produk", error: err.message });
  }
};

