import { useAuth } from "@/hooks/useAuth";
import { useTransaction } from "@/context/TransactionContext";

export default function Transactions() {
  const { role, username } = useAuth();
  const { transactions } = useTransaction();

  // admin lihat semua
  const visibleTransactions =
    role === "admin"
      ? transactions
      : transactions.filter((t) => t.user === username);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Transactions</h1>

      {visibleTransactions.length === 0 ? (
        <p className="text-gray-500">
          {role === "admin"
            ? "Belum ada transaksi dari user manapun"
            : "Anda belum memiliki transaksi"}
        </p>
      ) : (
        <ul className="space-y-2">
          {visibleTransactions.map((t) => (
            <li
              key={t.id}
              className="flex justify-between items-center border p-2 rounded"
            >
              <span>
                {t.product} - Rp {t.total.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500">by {t.user}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
