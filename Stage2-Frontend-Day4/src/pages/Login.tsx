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

    // dummy login
    if (username === "hasbi" && password === "hasbi16") {
      login("token_abc"); 
      navigate("/dashboard"); 
    } else {
      setErrorMsg("Username atau password salah!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
  <form
    onSubmit={handleLogin}
    className="w-full max-w-md bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-lg space-y-6"
  >
    <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
      Login
    </h1>

    <div>
      <Label htmlFor="username" className="text-gray-700 dark:text-white">
        Username
      </Label>
      <Input
        id="username"
        type="text"
        placeholder="Masukkan username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        className="dark:bg-gray-800 dark:text-white"
      />
    </div>

    <div>
      <Label htmlFor="password" className="text-gray-700 dark:text-white">
        Password
      </Label>
      <Input
        id="password"
        type="password"
        placeholder="Masukkan password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="dark:bg-gray-800 dark:text-white"
      />
    </div>

    {errorMsg && (
      <p className="text-red-500 dark:text-red-400 text-sm text-center">
        {errorMsg}
      </p>
    )}

    <Button
      type="submit"
      className="w-full bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white"
    >
      Login
    </Button>
  </form>
</div>

  );
}
