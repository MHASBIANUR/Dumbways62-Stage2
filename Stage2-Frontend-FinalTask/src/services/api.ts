import { products } from "../dummy/data";
import type { Product } from "../dummy/data";

export async function getProducts(): Promise<Product[]> {
  return Promise.resolve(products);
}

export async function getProductById(id: string | number): Promise<Product | null> {
  const product = products.find((p) => p.id === Number(id));
  return Promise.resolve(product ?? null);
}

