// src/controllers/order-controller.ts
import { Request, Response } from "express";
import { orders, calculateTotal, Order } from "../models/order-model";

let orderId = 1;

// CREATE Order
export function createOrder(req: Request, res: Response) {
  const { productIds } = req.body;

  if (!Array.isArray(productIds)) {
    return res.status(400).json({ message: "productIds harus array" });
  }

  const total = calculateTotal(productIds);
  const newOrder: Order = { id: orderId++, productIds, total };

  orders.push(newOrder);
  res.status(201).json(newOrder);
}

// READ semua Order
export function getOrders(req: Request, res: Response) {
  res.json(orders);
}

// READ Order by ID
export function getOrderById(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });
  res.json(order);
}

// UPDATE Order
export function updateOrder(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const { productIds } = req.body;

  const order = orders.find(o => o.id === id);
  if (!order) return res.status(404).json({ message: "Order tidak ditemukan" });

  order.productIds = productIds;
  order.total = calculateTotal(productIds);
  res.json(order);
}

// DELETE Order
export function deleteOrder(req: Request, res: Response) {
  const id = parseInt(req.params.id);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) return res.status(404).json({ message: "Order tidak ditemukan" });

  orders.splice(index, 1);
  res.status(204).send();
}
