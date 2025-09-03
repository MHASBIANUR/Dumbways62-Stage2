import { useParams } from "react-router-dom";
import { products, type Product } from "../dummy/data";

type ProductDetailProps = {
  addToCart: (p: Product) => void;
};

export default function ProductDetail({ addToCart }: ProductDetailProps) {
  const { productId } = useParams<{ productId: string }>();
  const product = products.find((p) => p.id === Number(productId));

  if (!product) {
    return <p>Produk tidak ditemukan</p>;
  }

  return (
    <div className="flex justify-center">
      <div className="border rounded-lg p-4 bg-white text-center max-w-sm">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded-md mb-3"
        />
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-gray-600">Rp {product.price.toLocaleString()}</p>

        <button
          onClick={() => addToCart(product)}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
