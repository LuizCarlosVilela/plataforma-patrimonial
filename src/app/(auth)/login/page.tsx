"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, Loader2, Building2, ChevronRight } from "lucide-react";
import { OriginLogo } from "@/components/shared/origin-logo";
import { loginAction } from "@/server/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await loginAction(formData);

    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex bg-[#16171B] font-sans">
      {/* Left Panel — Brand */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-16"
           style={{ background: "#16171B" }}>
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: "linear-gradient(rgba(239,234,224,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,234,224,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10">
          <OriginLogo size={40} />
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-3xl lg:text-4xl font-bold text-[#efeae0] leading-tight mb-6">
            Plataforma de diagnóstico patrimonial para investidores exigentes
          </h1>
          <p className="text-[#86837d] leading-relaxed text-base mb-8">
            Método MAPA — estrutura completa para separar patrimônio empresarial do pessoal e construir legado familiar duradouro.
          </p>

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

        <div className="relative z-10 flex items-center gap-3 text-[#86837d] text-xs">
          <Building2 size={14} />
          <span>Carvalho Group · Diagnóstico Patrimonial</span>
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col bg-[#16171B]">
        <div className="lg:hidden flex items-center gap-3 px-8 py-5 border-b border-[#cfc6b4]">
          <OriginLogo size={32} showText={false} />
          <span className="text-base font-semibold tracking-widest text-[#efeae0]">ORIGIN</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-xl font-semibold text-[#efeae0] mb-1">Acessar sua conta</h2>
            <p className="text-sm text-[#86837d] mb-8">Entre com suas credenciais reais para continuar</p>

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
                      name="email"
                      type="email"
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
                      name="password"
                      type={showPassword ? "text" : "password"}
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
                Cadastrar-se
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
