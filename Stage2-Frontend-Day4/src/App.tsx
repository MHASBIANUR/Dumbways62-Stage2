// App.tsx
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { useState } from "react";
import { Button } from "./components/ui/button";
import "./App.css";

import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Cart from "./pages/Carts";
import { AuthProvider } from "./context/AuthProvider";
import Login from "./pages/Login";
import PrivateRoute from "./lib/PrivateRoute";
import ThemeToggle from "./components/ThemeToggle";
import Dashboard from "./pages/Dashboard";
import Favorites from "./pages/Favorites";
import { useAuth } from "./hooks/useAuth";

// Tipe movie
export type MovieType = {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  Genre?: string;
  Plot?: string;
  Actors?: string;
  quantity?: number;
};

// Header
function Header({ totalItems }: { totalItems: number }) {
  const { token, logout } = useAuth();

  return (
    <header className="w-full flex flex-wrap items-center justify-center gap-3 p-4 mb-6 bg-amber-100 dark:bg-gray-900 rounded-4xl shadow-lg">
      <Button asChild variant="ghost" className="bg-black text-white hover:bg-gray-800 dark:hover:bg-gray-600 shadow-sm transition-all flex items-center gap-1">
        <Link to="/">🏠 Home</Link>
      </Button>

      {token && (
        <>
          <Button asChild variant="ghost" className="bg-black text-white hover:bg-gray-800 dark:hover:bg-gray-600 shadow-sm transition-all flex items-center gap-1">
            <Link to="/dashboard">📊 Dashboard</Link>
          </Button>

          <Button asChild variant="ghost" className="bg-black text-white hover:bg-gray-800 dark:hover:bg-gray-600 shadow-sm transition-all flex items-center gap-1">
            <Link to="/movies">🎬 Movies</Link>
          </Button>

          <Button asChild variant="ghost" className="bg-black text-white hover:bg-gray-800 dark:hover:bg-gray-600 shadow-sm transition-all flex items-center gap-1 relative">
            <Link to="/favorites">⭐ Favorites</Link>
          </Button>

          <Button asChild variant="ghost" className="bg-black text-white hover:bg-gray-800 dark:hover:bg-gray-600 shadow-sm transition-all flex items-center gap-1 relative">
            <Link to="/cart"> 🛒 Cart {totalItems > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full animate-pulse">
                  {totalItems}
                </span>)}
            </Link>
          </Button>
        </>
      )}

      {token ? (
        <Button onClick={logout} variant="destructive" className="hover:scale-105 transition transform shadow-sm flex items-center gap-1">
          Logout
        </Button>
      ) : (
        <Button asChild variant="ghost" className="bg-black text-white hover:bg-gray-800 dark:hover:bg-gray-600 shadow-sm transition-all flex items-center gap-1">
          <Link to="/login">🔑 Login</Link>
        </Button>
      )}

      <ThemeToggle />
    </header>
  );
}

export default function App() {
  const [cart, setCart] = useState<MovieType[]>([]);
  const [favorites, setFavorites] = useState<MovieType[]>([]);

  const totalItems = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

  const addToCart = (movie: MovieType) => {
    setCart(prev => {
      const existing = prev.find(m => m.imdbID === movie.imdbID);
      if (existing) {
        return prev.map(m =>
          m.imdbID === movie.imdbID ? { ...m, quantity: (m.quantity || 1) + 1 } : m
        );
      }
      return [...prev, { ...movie, quantity: 1 }];
    });
  };

  const addToFavorites = (movie: MovieType) => {
    setFavorites(prev => {
      if (!prev.find(m => m.imdbID === movie.imdbID)) {
        const updated = [...prev, movie];
        localStorage.setItem("favorites", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  const removeFromCart = (imdbID: string) => {
    setCart(prev => prev.filter(m => m.imdbID !== imdbID));
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Header totalItems={totalItems} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }/>
          <Route path="/movies" element={
              <PrivateRoute>
                <Movies addToCart={addToCart} addToFavorites={addToFavorites} />
              </PrivateRoute>
            }/>
          <Route path="/favorites" element={
              <PrivateRoute>
                <Favorites favorites={favorites} setFavorites={setFavorites} />
              </PrivateRoute>
            }/>
          <Route path="/cart" element={<Cart cart={cart} removeFromCart={removeFromCart} />}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
