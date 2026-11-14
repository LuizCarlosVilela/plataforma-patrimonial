"use client";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
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
      callbackUrl: "/dashboard",
    });

    if (result?.error) {
      setError(result.error === "CredentialsSignin" ? "E-mail ou senha incorretos" : result.error);
    } else if (result?.ok) {
      router.push("/dashboard");
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-[#0e0e10] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: "linear-gradient(rgba(176,138,62,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(176,138,62,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }} />
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-[#b08a3e] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#b08a3e]" />
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">ORIGIN</span>
          </div>

          <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white leading-tight">
              Plataforma de diagnóstico<br />
              patrimonial para<br />
              <span className="text-[#b08a3e]">investidores exigentes</span>
            </h1>
            <p className="text-[#86837d] text-base leading-relaxed max-w-md">
              Método MAPA — estrutura completa para separar patrimônio empresarial do pessoal e construir legado familiar duradouro.
            </p>
            <div className="flex gap-12">
              <div>
                <p className="text-3xl font-bold text-[#b08a3e]">+R$ 2,4M</p>
                <p className="text-sm text-[#86837d] mt-1">Patrimônio médio dos clientes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-[#b08a3e]">100%</p>
                <p className="text-sm text-[#86837d] mt-1">Blindagem jurídica ativa</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-[#555]">Carvalho Group · Diagnóstico Patrimonial</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-8 h-8 rounded-full border-2 border-[#b08a3e] flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-[#b08a3e]" />
            </div>
            <span className="text-white font-semibold text-lg tracking-wide">ORIGIN</span>
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">Acessar sua conta</h2>
          <p className="text-sm text-[#86837d] mb-8">Entre com suas credenciais para continuar</p>

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#ffffff15] bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar com Google
            </button>
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#ffffff15] bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continuar com Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#ffffff15]" />
            <span className="text-xs text-[#555] uppercase tracking-wider">ou entre com e-mail</span>
            <div className="flex-1 h-px bg-[#ffffff15]" />
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-[#86837d] mb-2">E-mail corporativo</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="username"
                  className="w-full bg-[#1a1a1e] border border-[#ffffff15] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#555] focus:border-[#b08a3e] outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#86837d] mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="current-password"
                  className="w-full bg-[#1a1a1e] border border-[#ffffff15] rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder-[#555] focus:border-[#b08a3e] outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-[#ffffff20] bg-[#1a1a1e] text-[#b08a3e] focus:ring-[#b08a3e] cursor-pointer"
                />
                <span className="text-sm text-[#86837d]">Lembrar acesso</span>
              </label>
              <Link href="/forgot-password" className="text-sm text-[#b08a3e] hover:underline">
                Esqueceu a senha?
              </Link>
            </div>

            {registered && (
              <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-lg px-4 py-2.5">
                Conta criada com sucesso! Faça login para continuar.
              </p>
            )}

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-[#0e0e10] text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-[#b08a3e]/20"
              style={{ background: "#b08a3e" }}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-[#0e0e10]/30 border-t-[#0e0e10] rounded-full animate-spin" />
              ) : (
                <>Acessar plataforma <span aria-hidden="true">→</span></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#555] mt-8">
            Não tem acesso?{" "}
            <Link href="/register" className="text-[#b08a3e] hover:underline">
              Solicitar contato
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0e0e10]" />}>
      <LoginForm />
    </Suspense>
  );
}
