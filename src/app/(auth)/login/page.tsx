"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, Building2, ChevronRight } from "lucide-react";

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

    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/client/dashboard");
    router.refresh();
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-[#16171B] font-sans">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-16"
           style={{ background: "#16171B" }}>
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: "linear-gradient(rgba(239,234,224,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,234,224,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-[#16171B]"
                 style={{ background: "#b08a3e" }}>
              O
            </div>
            <div>
              <span className="text-lg font-semibold tracking-widest text-[#efeae0]">ORIGIN</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#86837d]">Gestão Patrimonial</p>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 max-w-md">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#efeae0] leading-tight mb-6">
            Plataforma de diagnóstico patrimonial para investidores exigentes
          </h1>
          <p className="text-[#86837d] leading-relaxed text-base mb-8">
            Método MAPA — estrutura completa para separar patrimônio empresarial do pessoal e construir legado familiar duradouro.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6">
            {[
              { value: "+R$ 2,4M", label: "Patrimônio médio dos clientes" },
              { value: "100%", label: "Blindagem jurídica ativa" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl font-bold" style={{ color: "#b08a3e" }}>{stat.value}</p>
                <p className="text-xs text-[#86837d] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer brand */}
        <div className="relative z-10 flex items-center gap-3 text-[#86837d] text-xs">
          <Building2 size={14} />
          <span>Carvalho Group · Diagnóstico Patrimonial</span>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col bg-[#16171B]">
        {/* Top bar - mobile logo */}
        <div className="lg:hidden flex items-center gap-3 px-8 py-5 border-b border-[#cfc6b4]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-[#16171B]"
               style={{ background: "#b08a3e" }}>
            O
          </div>
          <span className="text-base font-semibold tracking-widest text-[#efeae0]">ORIGIN</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-xl font-semibold text-[#efeae0] mb-1">Acessar sua conta</h2>
            <p className="text-sm text-[#86837d] mb-8">Entre com suas credenciais para continuar</p>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#cfc6b4] rounded-lg text-sm font-medium text-[#86837d] hover:bg-[#191A1E] hover:border-[#cfc6b4] transition-all duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar com Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-[#cfc6b4] rounded-lg text-sm font-medium text-[#86837d] hover:bg-[#191A1E] hover:border-[#cfc6b4] transition-all duration-200">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                Continuar com Apple
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[#cfc6b4]" />
              <span className="text-xs text-[#86837d] uppercase tracking-wider">ou entre com e-mail</span>
              <div className="flex-1 h-px bg-[#cfc6b4]" />
            </div>

            {/* Card */}
            <div className="bg-[#191A1E] border border-[#cfc6b4] rounded-xl p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-[#cfc6b4] mb-1.5">
                    E-mail corporativo
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86837d]" />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#16171B] border border-[#cfc6b4] rounded-lg text-[#efeae0] placeholder-[#86837d] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] transition-colors text-sm"
                      placeholder="seu@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-xs font-medium text-[#cfc6b4] mb-1.5">
                    Senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86837d]" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-11 py-2.5 bg-[#16171B] border border-[#cfc6b4] rounded-lg text-[#efeae0] placeholder-[#86837d] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] transition-colors text-sm"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#86837d] hover:text-[#cfc6b4] transition-colors"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-[#cfc6b4] bg-[#16171B] accent-[#b08a3e] focus:ring-[#b08a3e] focus:ring-offset-0" />
                    <span className="text-sm text-[#86837d]">Lembrar acesso</span>
                  </label>
                  <a href="/forgot-password" className="text-sm font-medium transition-colors" style={{ color: "#b08a3e" }}>
                    Esqueceu a senha?
                  </a>
                </div>

                {error && (
                  <div className="p-3 bg-[#9e4a3e]/10 border border-[#9e4a3e]/20 rounded-lg text-sm text-[#9e4a3e]">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-lg font-medium text-sm text-[#16171B] transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed shadow-gold"
                  style={{ background: "#b08a3e" }}
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Acessar plataforma</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-[#86837d]">
              Não tem acesso?{" "}
              <a href="/register" className="font-medium transition-colors" style={{ color: "#b08a3e" }}>
                Solicitar contato
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
