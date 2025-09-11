import { useState } from "react"
import { AuthContext } from "./AuthContext"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  const login = (token: string, role: "admin" | "user", username: string) => {
    setToken(token);
    setRole(role);
    setUsername(username);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}