import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (username === "admin" && password === "admin12345") {
      login("token_admin", "admin", "admin");
      navigate("/product"); 
    }
    else if (username === "hasbi" && password === "hasbi16") {
      login("token_user", "user", "hasbi");
      navigate("/"); 
    }
    else {
      setErrorMsg("⚠️ Username atau password salah!");
    }

  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-300">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg space-y-6 transition-colors duration-300"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100">
          Login
        </h1>

        <div>
          <Label
            htmlFor="username"
            className="text-gray-700 dark:text-gray-200"
          >
            Username
          </Label>
          <Input
            id="username"
            type="text"
            placeholder="Masukkan username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <Label
            htmlFor="password"
            className="text-gray-700 dark:text-gray-200"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-gray-50 dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400"
          />
        </div>

        {errorMsg && (
          <p className="text-red-500 text-sm text-center">{errorMsg}</p>
        )}

        <Button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
        >
          Login
        </Button>
      </form>
    </div>
  );
}
