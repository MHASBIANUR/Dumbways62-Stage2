import { useEffect, useState } from "react";
import { debounce } from "../hooks/debounce";
import { fetchProduct } from "../api/fetchProduct";
import SearchProduct from "./SearchProduct";
import type { Product } from "./dummy/data";

function ProductCard() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = debounce(search, 1000);

  useEffect(() => {
    if (!debouncedSearch) {
      setProducts([]);
      setError(null);
      return;
    }

    const getData = async () => {
      setLoading(true);
      setError(null); 
      try {
        const result = await fetchProduct(debouncedSearch);
        setProducts(result);

        if (result.length === 0) {
          setError("Data produk tidak ditemukan");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setProducts([]);
        setError("Terjadi kesalahan saat mengambil data");
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [debouncedSearch]);

  return (
    <div className="app-container">
      <h1 className="app-title">Product Search</h1>

      <SearchProduct value={search} onChange={setSearch} />

      {loading && <p className="text-red">Loading...</p>}
      {!loading && error && <p className="text-red">{error}</p>}

      <div className="product-list">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.image} alt={p.name} className="product-image" />
            <div className="product-info">
              <h3 className="product-name">{p.name}</h3>
              <p className="product-price">Rp {p.price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductCard;
