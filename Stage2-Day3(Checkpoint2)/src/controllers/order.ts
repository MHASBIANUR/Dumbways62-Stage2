import { Request, Response } from "express";
import { prisma } from "../prisma/client";

export const getOrderSummary = async (req: Request, res: Response) => {
  try {
    // ambil query param (default page=1, limit=10)
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const summary = await prisma.order.groupBy({
      by: ["userId"],
      _count: {
        id: true,
      },
      _sum: {
        quantity: true,
      },
    });

    // total user yang ada summary-nya
    const totalUsers = summary.length;

    // pagination di JS (karena groupBy tidak support skip/take)
    const paginated = summary.slice(skip, skip + limit);

    const result = await Promise.all(
      paginated.map(async (s) => {
        const user = await prisma.user.findUnique({
          where: { id: s.userId },
          select: { id: true, name: true, email: true },
        });
        return {
          user,
          totalOrders: s._count?.id ?? 0,
          totalQuantity: s._sum?.quantity ?? 0,
        };
      })
    );

    res.status(200).json({
      code: 200,
      status: "success",
      message: "get order summary successfully!",
      meta: {
        page,
        limit,
        totalUsers,
        totalPages: Math.ceil(totalUsers / limit),
      },
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      code: 500,
      status: "error",
      message: "internal server error",
    });
  }
};
