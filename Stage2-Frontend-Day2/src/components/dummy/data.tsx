export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const dummyProducts: Product[] = [
  { id: 1, name: "Keripik Kentang", price: 20000, image: "/assets/images/keripik-kentang.jpg" },
  { id: 2, name: "Keripik Pisang", price: 15000, image: "/assets/images/keripik-pisang.jpg" },
  { id: 3, name: "Roti Bakar", price: 10000, image: "/assets/images/roti-bakar.jpg" },
  { id: 4, name: "Kebab", price: 30000, image: "/assets/images/kebab.jpg" },
  { id: 5, name: "Burger", price: 25000, image: "/assets/images/burger.jpg" }
];
