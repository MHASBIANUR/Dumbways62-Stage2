import { Request, Response } from "express";
import { prisma } from "../prisma/client";

// GET saldo user berdasarkan userId
export const getUserPoints = async (req: Request, res: Response) => {
  try {
    const userId = parseInt(req.params.userId, 10);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, points: true },
    });

    if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

    res.json({
      userId: user.id,
      name: user.name,
      points: user.points,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};

// POST transfer poin 
export const transferPoints = async (req: Request, res: Response) => {
  try {
    const senderId = (req as any).user.userId; 
    const { receiverId, amount } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({ message: "Tidak bisa transfer ke diri sendiri" });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: "Jumlah poin harus lebih dari 0" });
    }

    const sender = await prisma.user.findUnique({ where: { id: senderId } });
    const receiver = await prisma.user.findUnique({ where: { id: receiverId } });

    if (!sender || sender.points < amount) {
      return res.status(400).json({ message: "Saldo poin tidak mencukupi" });
    }

    if (!receiver) {
      return res.status(404).json({ message: "Penerima tidak ditemukan" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // Kurangi poin sender
      await tx.user.update({
        where: { id: senderId },
        data: { points: { decrement: amount } },
      });

      // Tambah poin receiver
      await tx.user.update({
        where: { id: receiverId },
        data: { points: { increment: amount } },
      });

      // Catat transaksi
      const transaction = await tx.pointTransaction.create({
        data: {
          type: "TRANSFER",
          amount,
          senderId,
          receiverId,
        },
      });

      return transaction;
    });

    res.json({ message: "Transfer berhasil", transaction: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Terjadi kesalahan server" });
  }
};
