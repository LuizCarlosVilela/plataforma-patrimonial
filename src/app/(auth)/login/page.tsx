"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simular login - em produção integrar com NextAuth/Supabase Auth
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "cliente@demo.com.br" || email === "consultor@w1.com.br") {
      router.push("/dashboard");
      router.refresh();
    } else {
      setError("Credenciais inválidas. Use cliente@demo.com.br ou consultor@w1.com.br");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">S1NC</h1>
          <p className="text-slate-400 text-sm mt-1">Gestão Patrimonial W1</p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6 text-center">Entrar na sua conta</h2>

          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-sm text-rose-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-2">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-400 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-600 bg-slate-950 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-300">Lembrar-me</span>
              </label>
              <a href="/forgot-password" className="text-xs text-indigo-400 hover:underline">
                Esqueci a senha
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Entrar</span>}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <p className="text-xs text-slate-500 text-center mb-3">Contas de demonstração:</p>
            <div className="space-y-2">
              <button
                onClick={() => {
                  setEmail("cliente@demo.com.br");
                  setPassword("demo123");
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl text-sm text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Cliente Demo</span>
              </button>
              <button
                onClick={() => {
                  setEmail("consultor@w1.com.br");
                  setPassword("demo123");
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-950 border border-slate-700 hover:border-slate-600 rounded-xl text-sm text-slate-300 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Assessor Demo</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <p className="mt-6 text-center text-sm text-slate-400">
            Não tem conta?{" "}
            <a href="/register" className="text-indigo-400 hover:underline font-medium">
              Cadastre-se
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}