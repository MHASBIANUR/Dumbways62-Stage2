import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContext";

type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
};

export default function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart(); // ✅ ambil dari context, bukan props

  useEffect(() => {
    if (!productId) return;
    getProductById(productId)
      .then((data) => setProduct(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!product) return <p className="text-center mt-6">Product not found</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
        <button
          onClick={() => window.history.back()}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-48 object-cover rounded-lg"
        />
        <h2 className="mt-4 text-xl font-bold">{product.title}</h2>
        <p className="text-gray-600 mb-4">
          Rp {product.price.toLocaleString()}
        </p>

        <button
          onClick={() => addToCart(product)} // langsung pake dari context
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
