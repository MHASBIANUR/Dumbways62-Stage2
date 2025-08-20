import { Request, Response } from "express";
import { prisma } from "../connection/client";

export const getProduct = async (req:Request, res:Response) => {
    try {
        const id = parseInt (req.params.id);

      const product =  await prisma.product.findUnique({where:{ id }});
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error : "Failed to fetch datas"});
    }
};

export const getProducts = async (req:Request, res:Response) => {
    try {
      const product =  await prisma.product.findMany();
      res.status(200).json(product);
    } catch (error) {
      res.status(500).json({ error : "Failed to fetch datas"});
    }
};

export const createProducts = async (req:Request, res:Response) => {
    try {
        const {name, price} = req.body
        const product = await prisma.product.create({
            data:{name, price: parseFloat(price)},
        });

        res.status(201).json(product)
    } catch (error) {
      res.status(500).json({ error : "Failed to create product"});
    }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, price } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: price ? parseFloat(price) : undefined, // optional
      },
    });

    res.json(product);
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    await prisma.product.delete({
      where: { id },
    });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(404).json({ message: "Product not found" });
  }
};


