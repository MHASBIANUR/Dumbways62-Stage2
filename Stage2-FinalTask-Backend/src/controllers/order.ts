// src/controllers/auth.ts
import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// Create Order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { productId, quantity } = req.body;

    // cek produk
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }
    if (product.stock < quantity) {
      return res.status(400).json({ message: "Stok tidak cukup" });
    }

    // hitung total harga & poin
    const totalHarga = product.price * quantity;
    const earnedPoints = Math.floor(totalHarga / 1000); // contoh: tiap 1000 rupiah = 1 poin

    const result = await prisma.$transaction(async (tx) => {
      // kurangi stok produk
      await tx.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
      });

      // simpan order
      const order = await tx.order.create({
        data: {
          userId,
          productId,
          quantity,
        },
      });

      // tambahkan poin ke user
      await tx.user.update({
        where: { id: userId },
        data: { points: { increment: earnedPoints } },
      });

      // catat transaksi poin
      const pointTransaction = await tx.pointTransaction.create({
        data: {
          type: "ORDER",
          amount: earnedPoints,
          orderId: order.id,
          receiverId: userId, // user yang dapat poin
        },
      });

      return { order, pointTransaction };
    });

    return res.json({
      message: "Order berhasil",
      order: result.order,
      pointTransaction: result.pointTransaction,
    });
  } catch (err) {
    console.error(" createOrder error:", err);
    return res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// Get Orders milik user sendiri
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const { sort = "createdAt", order = "desc", page = "1", limit = "10", name } = req.query;
    const userId = req.user!.userId;

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const orders = await prisma.order.findMany({
      where: {
        userId,
        product: name
          ? {
              name: {
                contains: name as string, // LIKE '%bakar%'
                mode: "insensitive",     // biar gak case-sensitive
              },
            }
          : undefined,
      },
      include: { product: true },
      orderBy: { [sort as string]: order === "asc" ? "asc" : "desc" },
      skip,
      take: pageSize,
    });

    const total = await prisma.order.count({
      where: {
        userId,
        product: name
          ? {
              name: {
                contains: name as string,
                mode: "insensitive",
              },
            }
          : undefined,
      },
    });

    return res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data: orders,
    });
  } catch (err) {
    console.error("getMyOrders error:", err);
    return res.status(500).json({ message: "Error fetching orders" });
  }
};


// Admin melihat semua order
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { sort = "createdAt", order = "desc", page = "1", limit = "10" } = req.query;

    const pageNumber = parseInt(page as string) || 1;
    const pageSize = parseInt(limit as string) || 10;
    const skip = (pageNumber - 1) * pageSize;

    const orders = await prisma.order.findMany({
      include: { product: true, user: true },
      orderBy: { [sort as string]: order === "asc" ? "asc" : "desc" },
      skip,
      take: pageSize,
    });

    const total = await prisma.order.count();

    return res.json({
      page: pageNumber,
      limit: pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data: orders,
    });
  } catch (err) {
    console.error(" getAllOrders error:", err);
    return res.status(500).json({ message: "Error fetching all orders" });
  }
};

// Admin: Group orders by user
export const groupOrdersByUser = async (req: Request, res: Response) => {
  try {
    const grouped = await prisma.order.groupBy({
      by: ["userId"],
      _count: { id: true },
    });

    const result = await Promise.all(
      grouped.map(async (g) => {
        const user = await prisma.user.findUnique({
          where: { id: g.userId },
          select: { id: true, name: true, email: true },
        });
        return { user, totalOrders: g._count.id };
      })
    );

    return res.json(result);
  } catch (err) {
    console.error(" groupOrdersByUser error:", err);
    return res.status(500).json({ message: "Error grouping orders" });
  }
};
