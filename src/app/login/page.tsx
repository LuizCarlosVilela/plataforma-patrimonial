"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "E-mail ou senha incorretos" : result.error);
    } else if (result?.ok) {
      router.push("/dashboard");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d] px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#efeae0] mb-2">Patrimônio+</h1>
          <p className="text-[#86837d]">Seu patrimônio sob controle</p>
        </div>

        {/* Card */}
        <div className="bg-[#191a1e]/80 border border-[#cfc6b4] rounded-2xl p-8 space-y-6">
          {/* Google Sign In */}
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-gray-800 font-medium hover:bg-gray-100 transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#cfc6b4]/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#191a1e] px-4 text-[#86837d]">ou continue com email</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86837d]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-xl pl-10 pr-4 py-3 text-[#efeae0] focus:border-[#b08a3e] outline-none"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86837d]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                minLength={6}
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-xl pl-10 pr-4 py-3 text-[#efeae0] focus:border-[#b08a3e] outline-none"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-[#16171b] flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ background: "#b08a3e" }}
            >
              {loading ? "Entrando..." : "Entrar"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-[#86837d] mt-6">
          Não tem uma conta?{" "}
          <Link href="/register" className="text-[#b08a3e] hover:underline">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
}
