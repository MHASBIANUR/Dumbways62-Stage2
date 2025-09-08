import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/api";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center mt-6">Loading products...</p>;
  }

  return (
    <div className="min-h-screen p-6 bg-lime-200 dark:bg-gray-900">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Products
      </h1>

      {/* Grid card product */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            to={product.id.toString()}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 hover:shadow-lg transition"
          >
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-40 object-cover rounded-md"
            />
            <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
              {product.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              $ {product.price.toLocaleString()}
            </p>
          </Link>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
