import ProductCard from './components/ProductCard';
import { useState } from 'react';
import './App.css';

function App() {
  const products = [
    { id: 1, name: "Keripik Kentang", price: 20000, image: "/assets/images/keripik-kentang.jpg" },
    { id: 2, name: "Keripik Pisang", price: 15000, image: "/assets/images/keripik-pisang.jpg" },
    { id: 3, name: "Roti Bakar", price: 10000, image: "/assets/images/roti-bakar.jpg" },
  ];

  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);

  const addToCart = (id: number) => {
    setCart(prev => {
      const exist = prev.find(item => item.id === id);
      if (exist) {
        return prev.map(item =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="app-container">
      <h1 className="app-title">Daftar Produk</h1>
      <p className="cart-info">Cart: {totalItems} item</p>

      <div className="product-list">
        {products.map(product => {
          const cartItem = cart.find(item => item.id === product.id);
          return (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              image={product.image}
              quantity={cartItem?.quantity || 0}
              isInCart={!!cartItem}
              onAddToCart={() => addToCart(product.id)}
              onRemoveFromCart={() => removeFromCart(product.id)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default App;
