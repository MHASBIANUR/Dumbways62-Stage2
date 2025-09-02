import { dummyProducts } from "../components/dummy/data";
import type { Product } from "../components/dummy/data";

export const fetchProduct = async (query: string): Promise<Product[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result: Product[] = dummyProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      resolve(result);
    }, 3000);
  });
};
