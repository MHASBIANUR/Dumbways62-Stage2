// src/services/api.ts
import axios from "axios";

export const api = axios.create({
  baseURL: "https://fakestoreapi.com/",
});

export async function getProducts() {
  const res = await api.get("/products");
  return res.data;
}

export async function getProductById(id: string | number) {
  const res = await api.get(`/products/${id}`);
  return res.data;
}
