import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import { useAuth } from "@/hooks/useAuth";

// tipe data product
type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
};

export default function Products() {
  const { role } = useAuth();

  // state utama
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // state Add/Edit
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // load awal: ambil dari localStorage, kalau kosong -> fetch API
  useEffect(() => {
    const saved = localStorage.getItem("products");
    if (saved) {
      setProducts(JSON.parse(saved));
      setLoading(false);
    } else {
      getProducts()
        .then((data) => {
          setProducts(data);
          localStorage.setItem("products", JSON.stringify(data));
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, []);

  // simpan ke localStorage tiap kali products berubah
  useEffect(() => {
    if (!loading) {
      localStorage.setItem("products", JSON.stringify(products));
    }
  }, [products, loading]);

  if (loading) {
    return <p className="text-center mt-6">Loading products...</p>;
  }

  // CRUD handler
  const handleAdd = () => {
    setCurrentProduct({ id: Date.now(), name: "", price: 0, image: "" });
    setIsEditing(true);
  };

  const handleEdit = (product: Product) => {
    setCurrentProduct(product);
    setIsEditing(true);
  };

  const handleDelete = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleSave = () => {
    if (!currentProduct) return;

    const productToSave = {
      ...currentProduct,
      price: Number(currentProduct.price),
    };

    // update jika id ada
    if (products.some((p) => p.id === currentProduct.id)) {
      setProducts(products.map((p) => (p.id === currentProduct.id ? productToSave : p)));
    } else {
      setProducts([...products, productToSave]);
    }

    setIsEditing(false);
    setCurrentProduct(null);
  };

  // upload gambar 
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCurrentProduct((prev) =>
        prev ? { ...prev, image: reader.result as string } : prev
      );
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen p-6 bg-lime-200 dark:bg-gray-900 transition-colors duration-300">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Products
      </h1>

      {role === "admin" && (
        <div className="flex justify-center mb-6">
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 
                   text-white rounded-lg transition-colors duration-300"
          >
            + Add Product
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 
                   hover:shadow-lg transition-all duration-300"
          >
            <Link to={product.id.toString()}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h2 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
                {product.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Rp {product.price.toLocaleString()}
              </p>
            </Link>

            {role === "admin" && (
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => handleEdit(product)}
                  className="px-3 py-1 bg-blue-500 hover:bg-blue-600 
                         text-white rounded transition-colors duration-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 
                         text-white rounded transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {isEditing && currentProduct && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-96 relative">
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-2 right-2 text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              {products.some((p) => p.id === currentProduct.id)
                ? "Edit Product"
                : "Add Product"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Name"
                value={currentProduct.name}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
              />

              <input
                type="number"
                placeholder="Price"
                value={currentProduct.price === 0 ? "" : currentProduct.price}
                onChange={(e) => {
                  let val = e.target.value;
                  if (val === "") {
                    setCurrentProduct({ ...currentProduct, price: 0 });
                  } else {
                    const num = Number(val.replace(/^0+/, ""));
                    setCurrentProduct({ ...currentProduct, price: num });
                  }
                }}
                className="w-full px-3 py-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300
                          dark:border-gray-600 text-gray-900 dark:text-white"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full text-sm text-gray-600 dark:text-gray-300"
              />

              {currentProduct.image && (
                <img
                  src={currentProduct.image}
                  alt="preview"
                  className="w-full h-32 object-cover rounded"
                />
              )}

              <button
                onClick={handleSave}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded 
                          dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <Outlet context={{ products }} />
    </div>
  );
}
