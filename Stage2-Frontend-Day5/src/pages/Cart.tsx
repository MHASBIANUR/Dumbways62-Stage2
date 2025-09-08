import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, loadingId } = useCart();

  if (cart.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-900 dark:text-gray-200">
        Keranjang kosong
      </p>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-lime-200 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        Keranjang Belanja
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 bg-white dark:bg-gray-800 text-center"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {item.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Rp {item.price.toLocaleString()} x {item.quantity}
            </p>

            {/* Controls update quantity */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <button
                disabled={loadingId === item.id}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="px-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                disabled={loadingId === item.id}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="px-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
              >
                +
              </button>
            </div>

            <p className="font-bold mt-2 text-gray-900 dark:text-gray-100">
              Total: Rp {(item.price * item.quantity).toLocaleString()}
            </p>

            {/* Remove button with loading indicator */}
            <button
              disabled={loadingId === item.id}
              onClick={() => removeFromCart(item.id)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
            >
              {loadingId === item.id ? "Loading..." : "Remove"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
