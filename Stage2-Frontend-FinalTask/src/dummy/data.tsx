export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export const products: Product[] = [
  { id: 1, name: "Keripik Kentang", price: 20000, image: "/images/keripik-kentang.jpg" },
  { id: 2, name: "Keripik Pisang", price: 15000, image: "/images/keripik-pisang.jpg" },
  { id: 3, name: "Roti Bakar", price: 10000, image: "/images/roti-bakar.jpg" },
  { id: 4, name: "Burger", price: 25000, image: "/images/burger.jpg" },
  { id: 5, name: "Kebab", price: 30000, image: "/images/kebab.jpg" },
  { id: 6, name: "Hotdog", price: 45000, image: "/images/hotdog.jpg" },
];
