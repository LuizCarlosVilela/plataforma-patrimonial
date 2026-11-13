"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ShieldCheck, TrendingUp, Building2, ChevronRight } from "lucide-react";
import { OriginLogo } from "@/components/shared/origin-logo";
import { registerAction } from "@/server/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setIsLoading(true);
    const result = await registerAction(formData);
    setIsLoading(false);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#16171B] font-sans">
      {/* Left Panel — Benefits */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-16"
           style={{ background: "#16171B" }}>
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: "linear-gradient(rgba(239,234,224,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(239,234,224,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <OriginLogo size={40} showText={false} />
            <div>
              <span className="text-lg font-semibold tracking-widest text-[#efeae0]">ORIGIN</span>
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#86837d]">Gestão Patrimonial</p>
            </div>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-[#efeae0] leading-tight mb-4">
            Crie sua conta e faça o diagnóstico patrimonial
          </h1>
          <p className="text-[#86837d] leading-relaxed">
            Cadastre-se gratuitamente e tenha acesso ao método MAPA para diagnosticar e transformar sua gestão patrimonial.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {[
            { icon: ShieldCheck, title: "Blindagem Jurídica", desc: "Proteção patrimonial estruturada" },
            { icon: TrendingUp, title: "Visão Financeira Clara", desc: "Controle total dos seus números" },
            { icon: Building2, title: "Separação Empresa × Pessoal", desc: "Estrutura societária adequada" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-4 rounded-xl border border-[#cfc6b4] hover:border-[#b08a3e]/30 transition-colors">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                   style={{ background: "rgba(176,138,62,0.15)" }}>
                <item.icon size={16} className="text-[#b08a3e]" />
              </div>
              <div>
                <p className="font-medium text-[#efeae0] text-sm">{item.title}</p>
                <p className="text-xs text-[#86837d] mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="relative z-10 text-xs text-[#86837d] flex items-center gap-2">
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
            <h2 className="text-xl font-semibold text-[#efeae0] mb-1">Criar conta</h2>
            <p className="text-sm text-[#86837d] mb-8">Preencha os dados abaixo para iniciar</p>

            <div className="bg-[#191A1E] border border-[#cfc6b4] rounded-xl p-5">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-[#cfc6b4] mb-1.5">
                    Nome completo
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86837d]" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className="w-full pl-9 pr-4 py-2.5 bg-[#16171B] border border-[#cfc6b4] rounded-lg text-[#efeae0] placeholder-[#86837d] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] transition-colors text-sm"
                      placeholder="João da Silva"
                      required
                      autoComplete="name"
                    />
                  </div>
                </div>

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
                      placeholder="Mínimo 8 caracteres"
                      required
                      autoComplete="new-password"
                      minLength={8}
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-xs font-medium text-[#cfc6b4] mb-1.5">
                    Confirmar senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86837d]" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      className="w-full pl-9 pr-4 py-2.5 bg-[#16171B] border border-[#cfc6b4] rounded-lg text-[#efeae0] placeholder-[#86837d] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] transition-colors text-sm"
                      placeholder="Repita a senha"
                      required
                      autoComplete="new-password"
                    />
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
                      <span>Criar conta</span>
                      <ChevronRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
