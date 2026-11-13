import Link from "next/link";
import { ShieldCheck, TrendingUp, Users, Building2, ArrowRight, CheckCircle, Sparkles, CalendarDays, Award } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#16171B] text-[#efeae0] overflow-hidden relative font-sans">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Radial gradient spots */}
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px]"
             style={{ background: "radial-gradient(circle, #b08a3e 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full opacity-10 blur-[100px]"
             style={{ background: "radial-gradient(circle, #4f6b52 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full opacity-10 blur-[120px]"
             style={{ background: "radial-gradient(circle, #b08a3e 0%, transparent 70%)" }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
             style={{ backgroundImage: "linear-gradient(rgba(176,138,62,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(176,138,62,0.5) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-[#cfc6b4]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center font-black text-sm text-[#16171B]"
                 style={{ background: "#b08a3e" }}>
              O
            </div>
            <span className="text-base font-semibold tracking-widest text-[#efeae0]">ORIGIN</span>
            <span className="hidden sm:inline text-xs text-[#86837d] uppercase tracking-[0.15em]">por Carvalho Group</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm text-[#86837d] hover:text-[#efeae0] transition-colors">
              Entrar
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-gold"
              style={{ background: "#b08a3e", color: "#16171B" }}
            >
              Começar Grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-24 lg:pt-32 lg:pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
                 style={{ borderColor: "rgba(176,138,62,0.3)", background: "rgba(176,138,62,0.08)" }}>
              <Sparkles size={14} style={{ color: "#b08a3e" }} />
              <span className="text-xs font-medium" style={{ color: "#b08a3e" }}>DIAGNÓSTICO PATRIMONIAL · 3 MINUTOS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Você já faturou milhões, mas{" "}
              <span style={{ color: "#b08a3e" }}>quanto disso virou patrimônio?</span>
            </h1>

            <p className="text-base lg:text-lg text-[#86837d] leading-relaxed mb-8 max-w-lg">
              A maioria dos empresários fatura alto por anos e descobre tarde que o patrimônio pessoal não acompanhou. O dinheiro passou pela mão — mas não virou estrutura. Em 3 minutos, o diagnóstico mostra onde o seu patrimônio está travado.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm transition-all duration-200 active:scale-[0.98] shadow-gold"
                style={{ background: "#b08a3e", color: "#16171B" }}
              >
                <span>Ver onde meu patrimônio está travado →</span>
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm border transition-all duration-200 hover:bg-[#191A1E]"
                style={{ borderColor: "#cfc6b4", color: "#efeae0" }}
              >
                Já tenho conta
              </Link>
            </div>

            {/* Subtitle / credibility */}
            <p className="mt-6 text-xs text-[#86837d]" style={{ letterSpacing: "0.05em" }}>
              Para empresários com operação estruturada. Sem venda de produto, sem comissão.
            </p>
            <p className="mt-2 text-xs" style={{ color: "#cfc6b4" }}>
              <strong>O mercado financeiro vive disso, a Origin não.</strong>
            </p>

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-9 h-9 rounded-full border-2 border-[#16171B] flex items-center justify-center text-xs font-bold text-[#16171B]"
                       style={{ background: "#efeae0" }}>
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-semibold text-sm text-[#efeae0]">+200 empresários</p>
                <p className="text-xs text-[#86837d]">já transformaram seu patrimônio</p>
              </div>
            </div>
          </div>

          {/* Hero Visual — Mock Dashboard */}
          <div className="relative">
            <div className="relative bg-[#191A1E] border border-[#cfc6b4] rounded-3xl p-6 shadow-2xl">
              {/* Top bar */}
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-[#b08a3e]/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                <span className="ml-3 text-xs text-[#86837d]">origin.dashboard.com</span>
              </div>
              {/* Net Worth Display */}
              <div className="mb-5">
                <p className="text-xs uppercase tracking-wider text-[#86837d] mb-1">Patrimônio Líquido</p>
                <p className="text-3xl font-bold text-[#efeae0]">R$ 2.450.000</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                    ↑ +12.4% este mês
                  </span>
                </div>
              </div>
              {/* Mini Cards Row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: "Ativos", value: "R$ 2.63M", pct: "+8%" },
                  { label: "Passivos", value: "R$ 180K", pct: "-3%" },
                  { label: "Metas Ativas", value: "5/8", pct: "" },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#16171B] border border-[#cfc6b4]">
                    <p className="text-[10px] text-[#86837d] uppercase tracking-wider">{item.label}</p>
                    <p className="font-bold text-sm text-[#efeae0] mt-0.5">{item.value}</p>
                    {item.pct && <p className="text-[10px] mt-0.5" style={{ color: item.pct.startsWith("+") ? "#22c55e" : "#ef4444" }}>{item.pct}</p>}
                  </div>
                ))}
              </div>
              {/* Progress Bars */}
              <div className="space-y-3">
                <p className="text-xs text-[#86837d] uppercase tracking-wider">Metas do Método MAPA</p>
                {[
                  { name: "Diagnóstico", progress: 100, done: true },
                  { name: "Blindagem Jurídica", progress: 72 },
                  { name: "Governança Familiar", progress: 45 },
                  { name: "Planejamento Sucessório", progress: 20 },
                ].map((goal, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {goal.done ? (
                      <CheckCircle size={16} className="flex-shrink-0" style={{ color: "#22c55e" }} />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 flex-shrink-0 border-[#cfc6b4]" />
                    )}
                    <span className="text-xs text-[#efeae0] flex-1">{goal.name}</span>
                    <div className="w-20 h-1.5 rounded-full bg-[#16171B] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${goal.progress}%`, background: goal.done ? "#22c55e" : "#b08a3e" }} />
                    </div>
                    <span className="text-[10px] text-[#86837d] w-8 text-right">{goal.progress}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Por que faturar mais{" "}
              <span style={{ color: "#b08a3e" }}>não virou patrimônio pessoal maior</span>?
            </h2>
            <p className="text-[#86837d] max-w-2xl mx-auto">
              Quatro questões essenciais que todo empresário precisa responder antes de tomar qualquer decisão financeira.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ArrowRight, text: "Quais dos seus ativos estão parados — e quanto isso custa por ano?", subtext: "Você já calculou quanto dinheiro parado renderia?" },
              { icon: TrendingUp, text: "O que separa você de uma renda que não depende de você trabalhar?", subtext: "Seu CNPJ paga suas contas — e seu nome também deveria." },
              { icon: ShieldCheck, text: "Sua empresa é seu único ativo?", subtext: "Se algo acontecer com ela, acontece com tudo. Até sua aposentadoria." },
              { icon: CalendarDays, text: "Você consegue parar?", subtext: "Não tira duas semanas de férias sem o telefone tocar? É o gargalo da sua rotina." },
            ].map((item, i) => (
              <div key={i} className="card-body p-6 group hover:border-[#b08a3e]/40 cursor-pointer">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: "rgba(176,138,62,0.1)", color: "#b08a3e" }}>
                  <item.icon size={20} />
                </div>
                <h3 className="font-semibold text-sm mb-2 text-[#efeae0] group-hover:text-[#b08a3e] transition-colors">{item.text}</h3>
                <p className="text-xs text-[#86837d] leading-relaxed">{item.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Method MAPA Section */}
      <section className="relative z-10 py-20 border-t border-[#cfc6b4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
                   style={{ borderColor: "rgba(176,138,62,0.3)", background: "rgba(176,138,62,0.08)" }}>
                <Award size={14} style={{ color: "#b08a3e" }} />
                <span className="text-xs font-medium" style={{ color: "#b08a3e" }}>MÉTODO MAPA</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Três pilares que trabalham{" "}
                <span style={{ color: "#b08a3e" }}>juntos</span>
              </h2>
              <p className="text-[#86837d] mb-8 leading-relaxed">
                Se um pilar falha, tudo trava. Cada etapa do método garante que seu dinheiro tenha lugar certo — e hora certa.
              </p>

              <div className="space-y-4">
                {[
                  { num: "01", title: "Gestão Estratégica", desc: "Organize antes de multiplicar. Domine o fluxo de caixa da empresa e o seu." },
                  { num: "02", title: "Alavancagem Inteligente", desc: "Crescer mais rápido, com método. Use recursos que já estão ao seu alcance." },
                  { num: "03", title: "Liberdade Real", desc: "Renda passiva e reserva de valor. O patrimônio vira renda sem depender de você." },
                ].map((step) => (
                  <div key={step.num} className="flex items-start gap-4 p-4 rounded-xl bg-[#191A1E] border border-[#cfc6b4] hover:border-[#b08a3e]/40 transition-all duration-200">
                    <span className="text-2xl font-bold text-[#b08a3e] min-w-[2rem]">{step.num}</span>
                    <div>
                      <h3 className="font-semibold text-[#efeae0] mb-1">{step.title}</h3>
                      <p className="text-sm text-[#86837d]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual representation of 3 pillars */}
            <div className="relative flex items-center justify-center">
              <div className="relative w-80 h-80">
                {/* Central circle */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border-2 border-[#b08a3e] flex items-center justify-center"
                       style={{ boxShadow: "0 0 40px rgba(176,138,62,0.3)" }}>
                    <div className="text-center">
                      <span className="block text-2xl font-bold text-[#b08a3e]">MAPA</span>
                      <span className="text-[10px] text-[#86837d] uppercase tracking-wider">Método</span>
                    </div>
                  </div>
                </div>

                {/* Orbit circles */}
                {["Gestão", "Alavancagem", "Liberdade"].map((label, i) => {
                  const angle = (i * 120 - 90) * (Math.PI / 180);
                  const x = Math.cos(angle) * 120;
                  const y = Math.sin(angle) * 120;
                  return (
                    <div key={label} className="absolute" style={{
                      left: `calc(50% + ${x}px - 60px)`,
                      top: `calc(50% + ${y}px - 24px)`
                    }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center border-2"
                           style={{ borderColor: "rgba(176,138,62,0.5)", background: "#191A1E", color: "#b08a3e" }}>
                        {i === 0 ? <Building2 size={18} /> : i === 1 ? <TrendingUp size={18} /> : <Users size={18} />}
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-xs font-medium text-[#efeae0]">{label}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Connecting lines SVG */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 320">
                  <circle cx="160" cy="160" r="120" fill="none" stroke="rgba(176,138,62,0.2)" strokeWidth="1" strokeDasharray="4 4" />
                  <line x1="160" y1="160" x2="160" y2="40" stroke="rgba(176,138,62,0.3)" strokeWidth="1" />
                  <line x1="160" y1="160" x2="264" y2="220" stroke="rgba(176,138,62,0.3)" strokeWidth="1" />
                  <line x1="160" y1="160" x2="56" y2="220" stroke="rgba(176,138,62,0.3)" strokeWidth="1" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <section className="relative z-10 py-20 border-t border-[#cfc6b4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Um caso real de{" "}
              <span style={{ color: "#b08a3e" }}>estrutuação patrimonial</span>
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="card-premium p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-full bg-[#b08a3e] flex items-center justify-center text-[#16171B] font-bold text-xl">
                  DC
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#efeae0]">Daniel Carvalho</p>
                  <p className="text-xs text-[#86837d]">Estrategista Patrimonial · Criador do Método MAPA</p>
                </div>
              </div>

              <blockquote className="text-[#efeae0] italic leading-relaxed mb-6 border-l-2 pl-4" style={{ borderColor: "#b08a3e" }}>
                "Eu não falo de patrimônio olhando de fora. Estou no mesmo jogo que você. Comecei a estudar finanças com 13 anos, saí de uma consultoria por princípio — e hoje construí o que ensino."
              </blockquote>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "13", label: "Anos estudando" },
                  { value: "9", label: "Estúdios operando" },
                  { value: "R$50k", label: "Receita mensal" },
                  { value: "0%", label: "Comissão sobre produto" },
                ].map((stat) => (
                  <div key={stat.label} className="text-center p-3 rounded-lg bg-[#16171B] border border-[#cfc6b4]">
                    <p className="text-xl font-bold" style={{ color: "#b08a3e" }}>{stat.value}</p>
                    <p className="text-xs text-[#86837d]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Diagnostic CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="card-premium p-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-6"
                 style={{ borderColor: "rgba(176,138,62,0.3)", background: "rgba(176,138,62,0.08)" }}>
              <Sparkles size={14} style={{ color: "#b08a3e" }} />
              <span className="text-xs font-medium" style={{ color: "#b08a3e" }}>GRATUITO · 3 MINUTOS · COM IA</span>
            </div>

            <h2 className="text-2xl lg:text-4xl font-bold mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Descubra onde seu patrimônio está{" "}
              <span style={{ color: "#b08a3e" }}>travado</span>
            </h2>
            <p className="text-[#86837d] mb-8 max-w-2xl mx-auto">
              Em 3 minutos, você descobre exatamente onde seu patrimônio está travado — e o que fazer a respeito. Resultado personalizado na hora.
            </p>

            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold transition-all duration-200 active:scale-[0.98] shadow-gold-lg"
              style={{ background: "#b08a3e", color: "#16171B", fontSize: "1rem" }}
            >
              Ver onde meu patrimônio está travado →
            </Link>

            <p className="mt-4 text-xs text-[#86837d]">
              Para empresários com operação estruturada. Sem venda de produto, sem comissão.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#cfc6b4] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs text-[#16171B]"
                 style={{ background: "#b08a3e" }}>
              O
            </div>
            <span className="text-sm font-semibold text-[#efeae0]">ORIGIN</span>
            <span className="text-xs text-[#86837d]">por Carvalho Group</span>
          </div>
          <p className="text-xs text-[#86837d]">© 2026 Origin. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
