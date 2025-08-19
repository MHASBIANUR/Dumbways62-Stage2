// src/models/order-model.ts
import { products } from "./belanja-model";

export interface Order {
  id: number;
  productIds: number[]; // relasi ke product
  total: number;
}

export let orders: Order[] = [];

// Hitung total harga order berdasarkan productIds
export function calculateTotal(productIds: number[]): number {
  let total = 0;
  for (const id of productIds) {
    const product = products.find(p => p.id === id);
    if (product) total += product.price;
  }
  return total;
}
