"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, Loader2, ShieldCheck, TrendingUp, Building2, ChevronRight } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    router.push("/login?registered=true");
    setIsLoading(false);
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
            <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-[#16171B]"
                 style={{ background: "#b08a3e" }}>
              O
            </div>
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
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 px-8 py-5 border-b border-[#cfc6b4]">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm text-[#16171B]"
               style={{ background: "#b08a3e" }}>
            O
          </div>
          <span className="text-base font-semibold tracking-widest text-[#efeae0]">ORIGIN</span>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-sm">
            <h2 className="text-xl font-semibold text-[#efeae0] mb-1">Criar conta</h2>
            <p className="text-sm text-[#86837d] mb-8">Preencha os dados abaixo para iniciar</p>

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
              <span className="text-xs text-[#86837d] uppercase tracking-wider">ou cadastre-se manualmente</span>
              <div className="flex-1 h-px bg-[#cfc6b4]" />
            </div>

            {/* Card */}
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
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
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
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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

              <p className="text-xs text-[#86837d] text-center mt-4 leading-relaxed">
                Ao criar sua conta, você concorda com nossos{" "}
                <a href="/terms" className="font-medium transition-colors" style={{ color: "#b08a3e" }}>Termos de Uso</a>
                {" "}e <a href="/privacy" className="font-medium transition-colors" style={{ color: "#b08a3e" }}>Política de Privacidade</a>
              </p>
            </div>

            <p className="mt-6 text-center text-sm text-[#86837d]">
              Já tem conta?{" "}
              <a href="/login" className="font-medium transition-colors" style={{ color: "#b08a3e" }}>
                Fazer login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
