import { Link, Outlet } from "react-router-dom";
import { products } from "../dummy/data";

export default function Products() {
  return (
    <div className="min-h-screen p-6 bg-lime-200">
      <h1 className="text-4xl font-bold text-center mb-6">Products</h1>

      <ul className="mb-6 text-center">
        {products.map((product) => (
          <li key={product.id}>
            <Link to={product.id.toString()} className="text-blue-500 underline">
              {product.name}
            </Link>
          </li>
        ))}
      </ul>

      <Outlet />
    </div>
  );
}
