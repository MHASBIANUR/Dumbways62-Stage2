import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Transaction = {
  id: number;
  user: string;
  product: string;
  total: number;
};

type TransactionContextType = {
  transactions: Transaction[];
  addTransaction: (t: Omit<Transaction, "id">) => void;
};

const TransactionContext = createContext<TransactionContextType | null>(null);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [idCounter, setIdCounter] = useState(1);

  const addTransaction = (t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [
      ...prev,
      { ...t, id: idCounter }, 
    ]);
    setIdCounter((prev) => prev + 1);
  };

  return (
    <TransactionContext.Provider value={{ transactions, addTransaction }}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransaction = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error("useTransaction must be used inside provider");
  return ctx;
};
