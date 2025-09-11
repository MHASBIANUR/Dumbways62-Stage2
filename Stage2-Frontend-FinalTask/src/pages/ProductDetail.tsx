import { useParams, useOutletContext } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "@/hooks/useAuth";  

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

// tipe context dari parent Products
type OutletCtx = { products?: Product[] };

export default function ProductDetail() {
  const { productId } = useParams();
  const outlet = useOutletContext<OutletCtx | undefined>();
  const { addToCart } = useCart();
  const { role } = useAuth(); 

  // state utama
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  // ambil data product
  useEffect(() => {
    let mounted = true;
    const idStr = productId ?? "";

    const load = async () => {
      setLoading(true);

      // 1) ambil dari Outlet context
      if (outlet?.products) {
        const p = outlet.products.find((p) => p.id.toString() === idStr) ?? null;
        if (mounted) {
          setProduct(p);
          setLoading(false);
        }
        return;
      }

      // 2) kalau tidak ada, fallback fetch dari API
      if (!productId) {
        setProduct(null);
        setLoading(false);
        return;
      }

      try {
        const p = await getProductById(productId);
        if (mounted) setProduct(p ?? null);
      } catch {
        if (mounted) setProduct(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [productId, outlet]);

  // tampilkan state
  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (!product) return <p className="text-center mt-6">Product not found</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96 relative">
        <button
          onClick={() => window.history.back()}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>
        
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        <h2 className="mt-4 text-xl font-bold">{product.name}</h2>
        <p className="text-gray-600 mb-4">
          Rp {product.price.toLocaleString()}
        </p>

        {role === "user" && (
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
