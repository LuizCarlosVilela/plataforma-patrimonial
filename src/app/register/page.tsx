"use client";
export const dynamic = "force-dynamic";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        // Auto-login after registration and redirect to dashboard
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
          callbackUrl: "/dashboard",
        });

        if (signInResult?.ok) {
          router.push("/dashboard");
          router.refresh();
        } else {
          router.push("/login?registered=true");
        }
      } else {
        setError(data.error || "Erro ao cadastrar");
      }
    } catch (err) {
      setError("Erro na conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#16171B] flex">
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
            <div>
              <span className="text-white font-semibold text-lg tracking-wide block">ORIGIN</span>
              <span className="text-[#555] text-xs tracking-widest uppercase">Gestão Patrimonial</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                Crie sua conta e faça o diagnóstico<br />
                <span className="text-[#b08a3e]">patrimonial</span>
              </h1>
              <p className="text-[#86837d] text-base leading-relaxed max-w-md">
                Cadastre-se gratuitamente e tenha acesso ao método MAPA para diagnosticar e transformar sua gestão patrimonial.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: "🛡️", title: "Blindagem Jurídica", desc: "Proteção patrimonial estruturada" },
                { icon: "📊", title: "Visão Financeira Clara", desc: "Controle total dos seus números" },
                { icon: "🏢", title: "Separação Empresa × Pessoal", desc: "Estrutura societária adequada" },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4 p-4 rounded-xl border border-[#2a2b30] bg-white/[0.02]">
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-[#555] text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
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
            <div>
              <span className="text-white font-semibold text-lg tracking-wide block">ORIGIN</span>
              <span className="text-[#555] text-xs tracking-widest uppercase">Gestão Patrimonial</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white mb-1">Criar conta</h2>
          <p className="text-sm text-[#86837d] mb-8">Preencha os dados abaixo para iniciar</p>

          {/* Social buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#2a2b30] bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all duration-200"
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
              className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-[#2a2b30] bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all duration-200"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
              </svg>
              Continuar com Apple
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-[#2a2b30]" />
            <span className="text-xs text-[#555] uppercase tracking-wider">ou cadastre-se manualmente</span>
            <div className="flex-1 h-px bg-[#2a2b30]" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs text-[#86837d] mb-2">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="João da Silva"
                  required
                  minLength={2}
                  autoComplete="name"
                  className="w-full bg-[#191a1e] border border-[#2a2b30] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#555] focus:border-[#b08a3e] outline-none transition-colors"
                />
              </div>
            </div>

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
                  autoComplete="email"
                  className="w-full bg-[#191a1e] border border-[#2a2b30] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#555] focus:border-[#b08a3e] outline-none transition-colors"
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
                  placeholder="Mínimo 8 caracteres"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full bg-[#191a1e] border border-[#2a2b30] rounded-xl pl-10 pr-10 py-3 text-white text-sm placeholder-[#555] focus:border-[#b08a3e] outline-none transition-colors"
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

            <div>
              <label className="block text-xs text-[#86837d] mb-2">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#555]" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full bg-[#191a1e] border border-[#2a2b30] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-[#555] focus:border-[#b08a3e] outline-none transition-colors"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-medium text-[#16171B] text-sm flex items-center justify-center gap-2 disabled:opacity-50 transition-all duration-200 hover:shadow-lg hover:shadow-[#b08a3e]/20"
              style={{ background: "#b08a3e" }}
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-[#16171B]/30 border-t-[#16171B] rounded-full animate-spin" />
              ) : (
                <>Criar conta <span aria-hidden="true">→</span></>
              )}
            </button>

            <p className="text-xs text-[#555] text-center leading-relaxed">
              Ao criar sua conta, você concorda com nossos{" "}
              <Link href="/terms" className="text-[#b08a3e] hover:underline">Termos de Uso</Link> e{" "}
              <Link href="/privacy" className="text-[#b08a3e] hover:underline">Política de Privacidade</Link>
            </p>
          </form>

          <p className="text-center text-sm text-[#555] mt-8">
            Já tem conta?{" "}
            <Link href="/login" className="text-[#b08a3e] hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
