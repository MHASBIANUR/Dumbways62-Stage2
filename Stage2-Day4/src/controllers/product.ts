import { Request, Response } from "express"
import { prisma } from "../prisma/client";

export const getProducts = async (req: Request, res: Response) => {
  const { sortBy, order, minPrice, maxPrice, limit, offset } = req.query;

  const filters: any = {}
    if (minPrice) filters.price = { gte: parseFloat(minPrice as string) } 
    if (maxPrice) {
        filters.price = {
            ...(filters.price || {}),
            lte: parseFloat(maxPrice as string),
        };
    }
  
  try {
    const products = await prisma.product.findMany({
      where: filters,
      orderBy: {
        [sortBy as string]: (order as "asc") || "desc",
      },
      take: Number(limit),
      skip: Number(offset),
    });

    const total = await prisma.product.count({ where: filters});
    res.json({ data: products, total });
  } catch (error) {
    res.status(500).json({
      code: 500,status: "error", message: "failed to fetch datas!",
    });
  }
}

