import { createContext } from "react";

export type AuthContextType = {
  token: string | null;
  role: "admin" | "user" | null;
  username: string | null;
  login: (token: string, role: "admin" | "user", username: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null)