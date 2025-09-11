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
import AdminRoute from "./lib/AdminRoute";
import Transactions from "./pages/Transactions";
import { TransactionProvider } from "./context/TransactionContext";

function Header() {
  const { token, role, logout } = useAuth();
  const { totalItems } = useCart();

  return (
    <div className="w-full flex gap-4 p-4 justify-center border-b mb-6 bg-amber-100 dark:bg-gray-800 rounded-4xl">
      <Button className="bg-black text-white" asChild variant="outline">
        <Link to="/">Home</Link>
      </Button>

      {token && (
        <Button className="bg-black text-white" asChild variant="outline">
          <Link to="/product">Products</Link>
        </Button>
      )}

      {token && role === "user" && (
        <Button className="bg-black text-white" asChild variant="outline">
          <Link to="/cart">Cart ({totalItems})</Link>
        </Button>
      )}

      {token && role === "admin" && (
        <Button className="bg-black text-white" asChild variant="outline">
          <Link to="/transactions">Transactions</Link>
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
        <TransactionProvider>
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
                }>
                <Route path=":productId" element={<ProductDetail />} />
              </Route>
              <Route
                path="/cart"
                element={
                  <PrivateRoute>
                    <Cart />
                  </PrivateRoute>
                }/>
              <Route
                path="/transactions"
                element={
                  <AdminRoute>
                    <Transactions />
                  </AdminRoute>
                }/>
            </Routes>
          </BrowserRouter>
        </TransactionProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
