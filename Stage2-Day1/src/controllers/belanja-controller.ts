import { Request, Response } from "express";
import { products, Product } from "../models/belanja-model";

// Product
export const getProducts = (req: Request, res: Response) => {
  res.json(products);
};

export const getProductById = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const product = products.find(p => p.id === id);
  product ? res.json(product) : res.status(404).json({ message: "Product not found" });
};

export const createProduct = (req: Request, res: Response) => {
  const { name, price } = req.body;
  const newProduct: Product = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

export const updateProduct = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, price } = req.body;
  const product = products.find(p => p.id === id);
  if (product) {
    product.name = name ?? product.name;
    product.price = price ?? product.price;
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

export const deleteProduct = (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
    res.json({ message: "Product deleted" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

