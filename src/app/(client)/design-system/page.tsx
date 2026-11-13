"use client";

import React, { useState } from "react";
import {
  Shield,
  TrendingUp,
  Award,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<"colors" | "typography" | "components" | "cards" | "forms" | "hero">("colors");
  const [inputVal, setInputVal] = useState("");

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <div className="border-b border-[#cfc6b4]/30 pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-[#16171b] text-xl shadow-gold" style={{ background: "#b08a3e" }}>
            O
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#efeae0]">
              Origin <span style={{ color: "#b08a3e" }}>Design System</span>
            </h1>
            <p className="text-sm text-[#86837d]">
              Sistema de Design Oficial — Paleta Carvalho Group
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mt-6">
          {[
            { id: "colors", label: "Cores & Tokens" },
            { id: "typography", label: "Tipografia" },
            { id: "components", label: "Botões & Badges" },
            { id: "cards", label: "Cards & Surfaces" },
            { id: "forms", label: "Formulários" },
            { id: "hero", label: "Seção Hero & Diagnóstico" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "text-[#16171b] font-semibold shadow-gold"
                  : "bg-[#16171b] text-[#86837d] hover:text-[#efeae0] hover:bg-[#191a1e]"
              }`}
              style={activeTab === tab.id ? { background: "#b08a3e" } : undefined}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Colors Section */}
      {activeTab === "colors" && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#efeae0] flex items-center gap-2">
            <Sparkles className="w-5 h-5" style={{ color: "#b08a3e" }} /> Paleta Carvalho Group
          </h2>

          {/* Primary Colors */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#86837d] uppercase tracking-wider">Cores Principais</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorCard name="Ocre" hex="#b08a3e" textColor="#16171b" desc="CTA primário, destaques e badges de luxo" />
              <ColorCard name="Obsidiana" hex="#16171b" textColor="#efeae0" desc="Fundo principal da interface" />
              <ColorCard name="Tinta" hex="#191a1e" textColor="#efeae0" desc="Superfície de cards e modais" />
              <ColorCard name="Osso" hex="#efeae0" textColor="#16171b" desc="Texto principal sobre fundos escuros" />
            </div>
          </div>

          {/* Extended Palette */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#86837d] uppercase tracking-wider">Paleta Estendida</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              <ColorCard name="Areia" hex="#e6dfd2" textColor="#16171b" desc="Fundos alternativos claros" />
              <ColorCard name="Linha" hex="#cfc6b4" textColor="#16171b" desc="Bordas, divisórias e input borders" />
              <ColorCard name="Mineral" hex="#c2b293" textColor="#16171b" desc="Acentos neutros quentes" />
              <ColorCard name="Bronze" hex="#7e6e52" textColor="#efeae0" desc="Ring focus e anéis de interação" />
              <ColorCard name="Cinza" hex="#86837d" textColor="#efeae0" desc="Textos secundários e muted" />
            </div>
          </div>

          {/* Status Colors */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#86837d] uppercase tracking-wider">Cores de Estado</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ColorCard name="Verde" hex="#4f6b52" textColor="#efeae0" desc="Métricas positivas e confirmações" />
              <ColorCard name="Vinho" hex="#9e4a3e" textColor="#efeae0" desc="Despesas, alertas e valores negativos" />
              <ColorCard name="Ocre" hex="#b08a3e" textColor="#16171b" desc="Metas ativas, progresso e CTAs" />
              <ColorCard name="Mineral" hex="#c2b293" textColor="#16171b" desc="Informações neutras e destaque sutil" />
            </div>
          </div>

          {/* Semantic Tokens Grid */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[#86837d] uppercase tracking-wider">Tokens Semânticos (CSS Variables)</h3>
            <div className="card-premium rounded-xl p-6 font-mono text-xs space-y-2 text-[#86837d]">
              <p><span className="text-[#b08a3e]">--obsidiana</span>: #16171b &nbsp;|&nbsp; <span className="text-[#b08a3e">--ossos</span>: #efeae0 &nbsp;|&nbsp; <span className="text-[#b08a3e">--areia</span>: #e6dfd2</p>
              <p><span className="text-[#b08a3e]">--linha</span>: #cfc6b4 &nbsp;|&nbsp; <span className="text-[#b08a3e]">--mineral</span>: #c2b293 &nbsp;|&nbsp; <span className="text-[#b08a3e]">--bronze</span>: #7e6e52</p>
              <p><span className="text-[#b08a3e]">--tinta</span>: #191a1e &nbsp;|&nbsp; <span className="text-[#b08a3e]">--cinza</span>: #86837d &nbsp;|&nbsp; <span className="text-[#b08a3e]">--verde</span>: #4f6b52</p>
              <p><span className="text-[#b08a3e]">--ocre</span>: #b08a3e &nbsp;|&nbsp; <span className="text-[#b08a3e]">--vinho</span>: #9e4a3e &nbsp;|&nbsp; <span className="text-[#b08a3e]">--radius</span>: 6px</p>
            </div>
          </div>
        </section>
      )}

      {/* Typography Section */}
      {activeTab === "typography" && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#efeae0] flex items-center gap-2">
            Tipografia (Poppins)
          </h2>

          <div className="space-y-6 card-premium p-6 rounded-xl">
            <div>
              <p className="text-xs text-[#86837d] uppercase tracking-wider mb-1">Display / Hero (4xl - 36px/40px)</p>
              <h1 className="text-4xl font-bold tracking-tight text-[#efeae0]">
                Quanto do que você fatura virou{" "}
                <span className="gold-gradient-text">patrimônio seu?</span>
              </h1>
            </div>

            <div className="border-t border-[#cfc6b4]/20 pt-4">
              <p className="text-xs text-[#86837d] uppercase tracking-wider mb-1">Heading 1 (2xl - 24px/32px)</p>
              <h2 className="text-2xl font-bold text-[#efeae0]">
                A sua posição no espectro Construtor → Governante
              </h2>
            </div>

            <div className="border-t border-[#cfc6b4]/20 pt-4">
              <p className="text-xs text-[#86837d] uppercase tracking-wider mb-1">Heading 2 (xl - 20px/28px)</p>
              <h3 className="text-xl font-semibold text-[#efeae0]">
                O gargalo principal da sua estrutura, nas 3 órbitas do Método MAPA
              </h3>
            </div>

            <div className="border-t border-[#cfc6b4]/20 pt-4">
              <p className="text-xs text-[#86837d] uppercase tracking-wider mb-1">Body Text (base - 16px/24px)</p>
              <p className="text-base text-[#efeae0] leading-relaxed max-w-3xl">
                Em 3 minutos, o diagnóstico mostra onde você está entre o Construtor e o Governante, e qual parte da sua estrutura está segurando a próxima virada.
              </p>
            </div>

            <div className="border-t border-[#cfc6b4]/20 pt-4">
              <p className="text-xs text-[#86837d] uppercase tracking-wider mb-1">Muted / Secondary (sm - 14px/20px)</p>
              <p className="text-sm text-[#86837d]">
                Gratuito · 3 minutos · Resultado na hora
              </p>
            </div>

            <div className="border-t border-[#cfc6b4]/20 pt-4">
              <p className="text-xs text-[#86837d] uppercase tracking-wider mb-1">Monospace / Data</p>
              <p className="font-mono text-sm" style={{ color: "#b08a3e" }}>
                NET_WORTH: R$ 2.450.000,00 | LIABILITIES: R$ 180.000,00 | SCORE: 84/100
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Components Section */}
      {activeTab === "components" && (
        <section className="space-y-8">
          <h2 className="text-xl font-semibold text-[#efeae0] flex items-center gap-2">
            Botões & Badges
          </h2>

          {/* Buttons */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#86837d] uppercase tracking-wider">Variantes de Botões</h3>
            <div className="flex flex-wrap items-center gap-4 card-premium p-6 rounded-xl">
              <button
                className="px-6 py-3 text-[#16171b] font-semibold rounded-xl transition-all shadow-gold flex items-center gap-2 hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#b08a3e" }}
              >
                Começar meu diagnóstico <ArrowRight className="w-4 h-4" />
              </button>

              <button
                className="px-6 py-3 font-semibold rounded-xl transition-all flex items-center gap-2 border"
                style={{ borderColor: "rgba(176,138,62,0.5)", color: "#b08a3e", background: "transparent" }}
              >
                Ver detalhes do método
              </button>

              <button className="px-4 py-2 bg-[#16171b] text-[#efeae0] hover:border-[#cfc6b4] border border-[#cfc6b4]/40 font-medium rounded-lg transition-colors flex items-center gap-2 text-sm">
                Ação secundária
              </button>

              <button className="px-4 py-2 text-[#86837d] hover:text-[#efeae0] font-medium rounded-lg transition-colors text-sm">
                Cancelar
              </button>
            </div>
          </div>

          {/* Button Sizes */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#86837d] uppercase tracking-wider">Tamanhos de Botões</h3>
            <div className="flex flex-wrap items-end gap-4 card-premium p-6 rounded-xl">
              <button className="px-3 py-1.5 text-[#16171b] font-semibold text-xs rounded-md shadow-sm" style={{ background: "#b08a3e" }}>
                Pequeno (sm)
              </button>
              <button className="px-4 py-2 text-[#16171b] font-semibold text-sm rounded-lg shadow-gold" style={{ background: "#b08a3e" }}>
                Padrão (md)
              </button>
              <button className="px-6 py-3 text-[#16171b] font-semibold text-base rounded-xl shadow-gold flex items-center gap-2" style={{ background: "#b08a3e" }}>
                Grande (lg) <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-[#86837d] uppercase tracking-wider">Badges & Tags de Status</h3>
            <div className="flex flex-wrap gap-3 card-premium p-6 rounded-xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ background: "rgba(176,138,62,0.1)", borderColor: "rgba(176,138,62,0.3)", color: "#b08a3e" }}>
                <Sparkles className="w-3.5 h-3.5" /> DIAGNÓSTICO PATRIMONIAL
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ background: "rgba(79,107,82,0.1)", borderColor: "rgba(79,107,82,0.3)", color: "#4f6b52" }}>
                <CheckCircle className="w-3.5 h-3.5" /> CONCLUÍDO
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ background: "rgba(176,138,62,0.1)", borderColor: "rgba(176,138,62,0.3)", color: "#b08a3e" }}>
                <AlertTriangle className="w-3.5 h-3.5" /> EM ANDAMENTO
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ background: "rgba(79,107,82,0.1)", borderColor: "rgba(79,107,82,0.3)", color: "#4f6b52" }}>
                <Shield className="w-3.5 h-3.5" /> MÉTODO MAPA
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
                    style={{ background: "#16171b", borderColor: "#cfc6b4/40", color: "#86837d" }}>
                Gratuito · 3 min
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Cards Section */}
      {activeTab === "cards" && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#efeae0] flex items-center gap-2">
            Cards & Superfícies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Standard Card */}
            <div className="bg-[#191a1e] border border-[#cfc6b4]/30 rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16171b] flex items-center justify-center text-[#86837d]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#efeae0]">Card Padrão</h3>
              <p className="text-sm text-[#86837d]">
                Superfície em Tinta (#191a1e) com borda sutil Linha. Usado para componentes gerais.
              </p>
            </div>

            {/* Premium Gold Card */}
            <div className="card-premium rounded-xl p-6 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl" style={{ background: "rgba(176,138,62,0.08)" }} />
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-[#b08a3e] border"
                   style={{ background: "rgba(176,138,62,0.1)", borderColor: "rgba(176,138,62,0.3)" }}>
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#efeae0]">Card Premium</h3>
              <p className="text-sm text-[#86837d]">
                Glow sutil ocre e bordas destacadas. Ideal para diagnósticos e entregáveis importantes.
              </p>
            </div>

            {/* Glassmorphism Card */}
            <div className="glass rounded-xl p-6 space-y-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center border"
                   style={{ background: "rgba(79,107,82,0.1)", borderColor: "rgba(79,107,82,0.3)", color: "#4f6b52" }}>
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#efeae0]">Card Glass Effect</h3>
              <p className="text-sm text-[#86837d]">
                Backdrop blur com fundo semitransparente para overlays e dashboards flutuantes.
              </p>
            </div>
          </div>

          {/* MAPA Orbit Method Cards Example */}
          <div className="mt-8 space-y-4">
            <h3 className="text-sm font-medium text-[#86837d] uppercase tracking-wider">
              As 3 Órbitas do Método MAPA
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { number: "01", title: "Órbita Corporativa", desc: "Estruturação de holding, distribuição de lucros e proteção do caixa da empresa." },
                { number: "02", title: "Órbita Patrimonial", desc: "Alocação eficiente, blindagem jurídica e multiplicação segura dos ativos familiares." },
                { number: "03", title: "Órbita Sucessória", desc: "Governança familiar, planejamento sucessório e perpetuidade do legado." },
              ].map((orbit) => (
                <div key={orbit.number} className="card-premium rounded-xl p-6 relative group hover:border-[#b08a3e]/50 transition-all">
                  <span className="text-3xl font-bold font-mono gold-gradient-text opacity-40 group-hover:opacity-100 transition-opacity">
                    {orbit.number}
                  </span>
                  <h4 className="text-lg font-semibold text-[#efeae0] mt-2 mb-1">{orbit.title}</h4>
                  <p className="text-sm text-[#86837d]">{orbit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Forms Section */}
      {activeTab === "forms" && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#efeae0] flex items-center gap-2">
            Formulários & Inputs
          </h2>

          <div className="max-w-xl card-premium p-6 rounded-xl space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#efeae0] mb-1.5">
                Faturamento Mensal Médio (R$)
              </label>
              <input
                type="text"
                placeholder="Ex: R$ 150.000,00"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-[#16171b] border border-[#cfc6b4]/40 rounded-xl px-4 py-2.5 text-[#efeae0] placeholder-[#86837d] focus:outline-none focus:border-[#b08a3e] focus:ring-1 focus:ring-[#b08a3e] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#efeae0] mb-1.5">
                Estágio do Negócio / Carreira
              </label>
              <select className="w-full bg-[#16171b] border border-[#cfc6b4]/40 rounded-xl px-4 py-2.5 text-[#efeae0] focus:outline-none focus:border-[#b08a3e] transition-colors">
                <option>Construtor (Foco em tracionar faturamento)</option>
                <option>Transição (Faturamento alto, pouco patrimônio)</option>
                <option>Governante (Patrimônio estruturado e protegido)</option>
              </select>
              <p className="text-xs text-[#86837d] mt-1.5">Selecione a fase atual do seu negócio</p>
            </div>

            <div className="pt-2">
              <button
                className="w-full py-3 text-[#16171b] font-semibold rounded-xl transition-all shadow-gold hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#b08a3e" }}
              >
                Calcular Meu Espectro
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Hero Example Section */}
      {activeTab === "hero" && (
        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-[#efeae0]">
            Exemplo: Seção Hero do Diagnóstico Origin
          </h2>

          <div className="card-premium rounded-2xl p-8 md:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none"
                 style={{ background: "radial-gradient(ellipse_at_top, rgba(176,138,62,0.1) 0%, transparent 60%)" }} />

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border tracking-wider uppercase"
                 style={{ background: "rgba(176,138,62,0.1)", borderColor: "rgba(176,138,62,0.3)", color: "#b08a3e" }}>
              <Sparkles className="w-3.5 h-3.5" /> DIAGNÓSTICO PATRIMONIAL ORIGIN
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold text-[#efeae0] tracking-tight max-w-3xl mx-auto leading-tight">
              Quanto do que você fatura virou{" "}
              <span className="gold-gradient-text">patrimônio seu?</span>
            </h1>

            <p className="text-base md:text-lg text-[#86837d] max-w-2xl mx-auto leading-relaxed">
              Em <strong className="text-[#efeae0]">3 minutos</strong>, o diagnóstico mostra onde você está entre o{" "}
              <strong style={{ color: "#b08a3e" }}>Construtor</strong> e o <strong style={{ color: "#b08a3e" }}>Governante</strong>, e qual parte da sua estrutura está segurando a próxima virada.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="w-full sm:w-auto px-8 py-4 text-[#16171b] font-bold text-lg rounded-xl transition-all shadow-gold flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98]"
                style={{ background: "#b08a3e" }}
              >
                Começar meu diagnóstico <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#86837d]">
              Gratuito · 3 minutos · Resultado na hora
            </p>
          </div>
        </section>
      )}
    </div>
  );
}

// Helper Components for Palette
function ColorCard({ name, hex, textColor, desc }: { name: string; hex: string; textColor: string; desc: string }) {
  const isLight = ["#efeae0", "#e6dfd2", "#cfc6b4", "#c2b293", "#16171b"].includes(textColor);
  return (
    <div className="bg-[#191a1e] border border-[#cfc6b4]/30 rounded-xl p-4 space-y-3">
      <div
        className="h-16 rounded-lg flex items-center justify-center font-mono text-xs font-bold shadow-inner"
        style={{ background: hex, color: textColor }}
      >
        {hex}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-[#efeae0]">{name}</h4>
        <p className="text-xs text-[#86837d] mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
