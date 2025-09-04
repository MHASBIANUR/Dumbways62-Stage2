import type { MovieType } from "../App";

export default function Cart({cart, removeFromCart,}: 
  {
  cart: MovieType[];
  removeFromCart: (imdbID: string) => void;
  })
  {
  if (cart.length === 0) {
    return <p className="text-center mt-10 text-gray-900 dark:text-gray-200">Keranjang kosong</p>;
  }

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Keranjang Belanja</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cart.map((item) => (
          <div key={item.imdbID} className="border rounded-lg p-4 text-center bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
            <img
              src={item.Poster !== "N/A" ? item.Poster : "/images/no-image.png"}
              alt={item.Title}
              className="w-full h-40 object-cover mb-3 rounded"
            />
            <h2 className="text-lg font-semibold">{item.Title}</h2>
            <p>Quantity: {item.quantity}</p>
            <button
              onClick={() => removeFromCart(item.imdbID)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded">Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
