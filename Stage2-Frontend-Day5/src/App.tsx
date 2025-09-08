// src/App.tsx
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";

import Home from "./pages/Home";
import Products from "./pages/Product";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import Login from "./pages/Login";
import PrivateRoute from "./lib/PrivateRoute";
import ThemeToggle from "./components/ThemeToggle";
import { CartProvider, useCart } from "./context/CartContext";

function Header() {
  const { token, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="w-full flex gap-4 p-4 justify-center border-b mb-6 bg-amber-100 dark:bg-gray-800 rounded-4xl">
      <Button className="bg-black text-white" asChild variant="outline">
        <Link to="/">Home</Link>
      </Button>

      {token && (
        <Button className="bg-black text-white" asChild variant="outline">
          <Link to="/product">Product</Link>
        </Button>
      )}

      {token && (
        <Button className="bg-black text-white" asChild variant="outline">
          <Link to="/cart">Cart ({totalItems})</Link>
        </Button>
      )}

      {token ? (
        <Button onClick={logout} variant="destructive">
          Logout
        </Button>
      ) : (
        <Button className="bg-black text-white" asChild variant="outline">
          <Link to="/login">Login</Link>
        </Button>
      )}

      <ThemeToggle />
    </div>
  );
}


function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/product"
              element={
                <PrivateRoute>
                  <Products />
                </PrivateRoute>
              }
            >
              {/* ProductDetail langsung akses useCart sendiri */}
              <Route path=":productId" element={<ProductDetail />} />
            </Route>

            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
