import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { LogIn, Store, ShieldCheck } from "lucide-react";

export default function AdminLogin() {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // MOCK LOGIN
    if (user === "admin" && password === "admin123") {
      localStorage.setItem("admin_auth", "true");
      navigate("/admin/dashboard");
    } else {
      alert("Credenciais inválidas! Tente admin / admin123");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-xl dark:shadow-2xl p-8 border border-zinc-100 dark:border-zinc-800">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mb-4">
            <ShieldCheck className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mt-2">Admin - Sistema Lojista</h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Entre para gerenciar sua loja</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Usuário</label>
            <input
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-primary-500 transition-all outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-transparent focus:ring-2 focus:ring-primary-500 transition-all outline-none text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
              placeholder="Digite sua senha"
              required
            />
          </div>

          <Button type="submit" className="w-full h-12 text-base rounded-xl">
            <LogIn className="w-5 h-5 mr-2" />
            Entrar no Painel
          </Button>

          <footer className="pt-4 text-center">
            <button onClick={() => navigate("/cliente")} className="text-primary-600 dark:text-primary-400 text-sm hover:underline flex items-center justify-center mx-auto">
                <Store className="w-4 h-4 mr-2" />
                Voltar para Loja
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
