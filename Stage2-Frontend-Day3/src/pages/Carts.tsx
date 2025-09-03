import type { Product } from "../dummy/data";

type CartItem = Product & { quantity: number };

export default function Cart({
  cart,
  removeFromCart,
}: {
  cart: CartItem[];
  removeFromCart: (id: number) => void;
}) {
  if (cart.length === 0) {
    return <p className="text-center mt-10">Keranjang kosong</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Keranjang Belanja</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="border rounded-lg p-4 bg-white text-center"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-gray-600">
              Rp {item.price.toLocaleString()} x {item.quantity}
            </p>
            <p className="font-bold mt-2">
              Total: Rp {(item.price * item.quantity).toLocaleString()}
            </p>
            <button
              onClick={() => removeFromCart(item.id)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
