import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "./App.css";
import { Button } from "./components/ui/button";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Cart from "./pages/Carts";
import ProductDetail from "./pages/ProductDetail";
import { useState } from "react";
import { type Product as ProductType } from "./dummy/data";

type CartItem = ProductType & { quantity: number };

function App() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: ProductType) => {
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="w-full flex gap-4 p-4 justify-center border-b mb-6 bg-amber-100 rounded-4xl">
        <Button className="bg-black text-white" asChild variant="outline">
          <Link to="/">Home</Link>
        </Button>
        <Button className="bg-black text-white" asChild variant="outline">
          <Link to="/product">Product</Link>
        </Button>
        <Button className="bg-black text-white" asChild variant="outline">
          <Link to="/cart">Cart ({totalItems})</Link>
        </Button>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />}>
          <Route path=":productId" element={<ProductDetail addToCart={addToCart} />}/>
        </Route>
        <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
