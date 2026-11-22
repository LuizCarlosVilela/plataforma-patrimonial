"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Plus, CreditCard, Landmark, TrendingUp, Wallet, RefreshCw, AlertCircle } from "lucide-react";
import { formatBRL } from "@/lib/utils";
import { SearchableSelect } from "@/components/shared/searchable-select";

interface BankOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

const BANKS: BankOption[] = [
  // Principais bancos brasileiros
  { id: "bb", name: "Banco do Brasil", icon: <span className="text-xs font-bold text-white">BB</span>, color: "#e52d2d" },
  { id: "santander", name: "Santander", icon: <span className="text-xs font-bold text-white">Sa</span>, color: "#ec0000" },
  { id: "itau", name: "Itaú", icon: <span className="text-xs font-bold text-white">Ita</span>, color: "#ff7a00" },
  { id: "bradesco", name: "Bradesco", icon: <span className="text-xs font-bold text-white">B</span>, color: "#e32632" },
  { id: "caixa", name: "Caixa Econômica Federal", icon: <span className="text-xs font-bold text-white">CX</span>, color: "#005ca9" },
  { id: "nubank", name: "Nubank", icon: <span className="text-xs font-bold text-white">Nu</span>, color: "#8a09d2" },
  { id: "inter", name: "Banco Inter", icon: <span className="text-xs font-bold text-white">Int</span>, color: "#ff7a00" },
  { id: "c6", name: "C6 Bank", icon: <span className="text-xs font-bold text-white">C6</span>, color: "#000000" },
  { id: "bmg", name: "Banco BMG", icon: <span className="text-xs font-bold text-white">Bm</span>, color: "#ff8200" },
  { id: "daycoval", name: "Daycoval", icon: <span className="text-xs font-bold text-white">Da</span>, color: "#005696" },
  { id: "sofisa", name: "Sofisa Direto", icon: <span className="text-xs font-bold text-white">So</span>, color: "#f7941e" },
  { id: "original", name: "Original", icon: <span className="text-xs font-bold text-white">Or</span>, color: "#00a651" },

  // Fintechs populares
  { id: "picpay", name: "PicPay", icon: <span className="text-xs font-bold text-white">Pp</span>, color: "#21c25e" },
  { id: "cora", name: "Cora", icon: <span className="text-xs font-bold text-white">Co</span>, color: "#0066cc" },
  { id: "recargapay", name: "RecargaPay", icon: <span className="text-xs font-bold text-white">Rp</span>, color: "#009688" },
  { id: "mercado-pago", name: "Mercado Pago", icon: <span className="text-xs font-bold text-white">Mp</span>, color: "#00a8e8" },
  { id: "will", name: "Will Bank", icon: <span className="text-xs font-bold text-white">Wi</span>, color: "#ffeb00" },
  { id: "neon", name: "Neon", icon: <span className="text-xs font-bold text-white">Ne</span>, color: "#00ffcc" },
  { id: "next", name: "Next", icon: <span className="text-xs font-bold text-white">Ne</span>, color: "#212121" },
  { id: "pagbank", name: "PagBank", icon: <span className="text-xs font-bold text-white">Pg</span>, color: "#00c300" },
  { id: "meupag", name: "Meu Pag!", icon: <span className="text-xs font-bold text-white">Pg</span>, color: "#ff8200" },
  { id: "banco-pan", name: "Banco Pan", icon: <span className="text-xs font-bold text-white">Pa</span>, color: "#f58220" },
  { id: "iti", name: "iti", icon: <span className="text-xs font-bold text-white">it</span>, color: "#ec008c" },
  { id: "solo", name: "Solo", icon: <span className="text-xs font-bold text-white">So</span>, color: "#6c5ce7" },
  { id: "kriya", name: "Kry", icon: <span className="text-xs font-bold text-white">Kr</span>, color: "#00c853" },

  // Investimentos
  { id: "btg", name: "BTG Pactual", icon: <span className="text-xs font-bold text-white">BTG</span>, color: "#003399" },
  { id: "xp", name: "XP Investimentos", icon: <span className="text-xs font-bold text-white">XP</span>, color: "#303030" },
  { id: "rico", name: "Rico", icon: <span className="text-xs font-bold text-white">Ri</span>, color: "#f2711c" },
  { id: "nuinvest", name: "NuInvest", icon: <span className="text-xs font-bold text-white">NuI</span>, color: "#8a09d2" },
  { id: "clear", name: "Clear", icon: <span className="text-xs font-bold text-white">Cl</span>, color: "#00a89d" },
  { id: "easynvest", name: "Easynvest", icon: <span className="text-xs font-bold text-white">Ea</span>, color: "#2672ba" },
  { id: "safra", name: "Safra", icon: <span className="text-xs font-bold text-white">Sa</span>, color: "#2a2a2a" },
  { id: "voro", name: "Voro", icon: <span className="text-xs font-bold text-white">Vo</span>, color: "#1a237e" },

  // Internacionais e pagamentos
  { id: "nomad", name: "Nomad", icon: <span className="text-xs font-bold text-white">No</span>, color: "#000000" },
  { id: "wise", name: "Wise", icon: <span className="text-xs font-bold text-white">Wi</span>, color: "#90e8e0" },
  { id: "avenue", name: "Avenue", icon: <span className="text-xs font-bold text-white">Av</span>, color: "#1e3a8a" },
  { id: "payoneer", name: "Payoneer", icon: <span className="text-xs font-bold text-white">Py</span>, color: "#ff4000" },
  { id: "paypal", name: "PayPal", icon: <span className="text-xs font-bold text-white">PP</span>, color: "#003087" },

  // Outros
  { id: "mobway", name: "Mobway", icon: <span className="text-xs font-bold text-white">Mw</span>, color: "#e91e63" },
  { id: "bmobil", name: "BMobil", icon: <span className="text-xs font-bold text-white">Bm</span>, color: "#607d8b" },
  { id: "santander-cash", name: "Santander Cash", icon: <span className="text-xs font-bold text-white">Sc</span>, color: "#ec0000" },
];

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<"ACCOUNT" | "CARD" | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<"CHECKING" | "SAVINGS" | "CREDIT_CARD" | "INVESTMENT" | "CASH" | "OTHER">("CHECKING");
  const [initialBalance, setInitialBalance] = useState("");
  const [selectedBank, setSelectedBank] = useState<string>("");
  const [creditLimit, setCreditLimit] = useState("");
  const [dueDay, setDueDay] = useState("15");

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.email) {
            setUserEmail(data.email);
            return;
          }
        }
        signIn();
      } catch (e) {
        console.error("Error getting user:", e);
      }
    }
    getUser();
  }, []);

  const loadAccounts = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/accounts?email=${userEmail}`);
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
      }
    } catch (e) {
      console.error("Error loading accounts:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) loadAccounts();
  }, [userEmail]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !initialBalance || !userEmail) return;

    try {
      const accountType = formType === "CARD" ? "CREDIT_CARD" : type;
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          name,
          type: accountType,
          initialBalance: parseFloat(initialBalance),
          ...(selectedBank ? { bankId: selectedBank, color: BANKS.find(b => b.id === selectedBank)?.color } : {}),
          ...(accountType === "CREDIT_CARD" ? {
            creditLimit: creditLimit ? parseFloat(creditLimit) : undefined,
            dueDay: dueDay ? parseInt(dueDay) : undefined,
          } : {}),
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setFormType(null);
        setName("");
        setInitialBalance("");
        setSelectedBank("");
        setCreditLimit("");
        loadAccounts();
      }
    } catch (e) {
      console.error("Error creating account:", e);
    }
  };

  const handleOpenFinanceSync = async () => {
    if (!userEmail) return;
    setSyncing(true);
    setSyncError("");

    try {
      const res = await fetch("/api/openfinance/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          token: "mock_token_for_demo",
        }),
      });

      if (res.ok) {
        loadAccounts();
      } else {
        const data = await res.json();
        setSyncError(data.details || "Erro na sincronização");
      }
    } catch (e) {
      setSyncError("Erro ao conectar com Open Finance");
    } finally {
      setSyncing(false);
    }
  };

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "CHECKING": return Landmark;
      case "SAVINGS": return Wallet;
      case "CREDIT_CARD": return CreditCard;
      case "INVESTMENT": return TrendingUp;
      default: return Landmark;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "CHECKING": return "Conta Corrente";
      case "SAVINGS": return "Poupança";
      case "CREDIT_CARD": return "Cartão de Crédito";
      case "INVESTMENT": return "Investimento";
      case "CASH": return "Dinheiro";
      default: return type;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-[#efeae0] whitespace-nowrap">Minhas Contas</h1>
        <div className="flex gap-2 flex-wrap justify-end">
          <button
            onClick={handleOpenFinanceSync}
            disabled={syncing || !userEmail}
            className="flex items-center gap-1 sm:gap-2 py-2 px-3 sm:px-4 rounded-xl font-medium text-xs sm:text-sm transition-all active:scale-[0.98] border border-[#cfc6b4] text-[#efeae0] hover:border-[#b08a3e] disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${syncing ? "animate-spin" : ""}`} />
            <span className="hidden xs:inline">Sync Open Finance</span>
          </button>
          <button
            onClick={() => { setFormType("ACCOUNT"); setShowForm(true); }}
            className="flex items-center gap-1 sm:gap-2 py-2 px-3 sm:px-4 rounded-xl font-medium text-xs sm:text-sm transition-all active:scale-[0.98] border border-[#cfc6b4] text-[#efeae0] hover:border-[#b08a3e]"
          >
            <Landmark className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Nova Conta</span>
          </button>
          <button
            onClick={() => { setFormType("CARD"); setShowForm(true); }}
            className="flex items-center gap-1 sm:gap-2 py-2 px-3 sm:px-4 rounded-xl font-medium text-xs sm:text-sm transition-all active:scale-[0.98] text-[#16171b]"
            style={{ background: "#b08a3e" }}
          >
            <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Novo Cartão</span>
          </button>
        </div>
      </div>

      {/* Open Finance Error */}
      {syncError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-400">{syncError}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleCreateAccount} className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-[#efeae0]">{formType === "CARD" ? "Novo Cartão de Crédito" : "Nova Conta"}</h2>

          {/* Bank selector */}
          <div>
            <label className="block text-xs text-[#86837d] mb-2 uppercase tracking-wider">Banco</label>
            <SearchableSelect
              options={BANKS.map((b) => ({ id: b.id, label: b.name, icon: null, color: b.color }))}
              value={selectedBank}
              onChange={(id) => setSelectedBank(id)}
              placeholder="Pesquisar banco..."
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Nome da {formType === "CARD" ? "Cartão" : "Conta"}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={formType === "CARD" ? "Ex: Nubank Platinum" : "Ex: Conta Corrente"}
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                required
              />
            </div>

            {formType !== "CARD" && (
              <div>
                <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                >
                  <option value="CHECKING">Conta Corrente</option>
                  <option value="SAVINGS">Poupança</option>
                  <option value="INVESTMENT">Investimento</option>
                  <option value="CASH">Dinheiro</option>
                  <option value="OTHER">Outro</option>
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">
                {formType === "CARD" ? "Fatura Atual (R$)" : "Saldo Inicial (R$)"}
              </label>
              <input
                type="number"
                step="0.01"
                value={initialBalance}
                onChange={(e) => setInitialBalance(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                required
              />
            </div>

            {formType === "CARD" && (
              <>
                <div>
                  <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Limite Total (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(e.target.value)}
                    placeholder="Ex: 5000,00"
                    className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Dia do Vencimento</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={dueDay}
                    onChange={(e) => setDueDay(e.target.value)}
                    placeholder="Ex: 10"
                    className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setShowForm(false); setFormType(null); }}
              className="py-2 px-4 rounded-lg text-sm text-[#86837d] hover:text-[#efeae0] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-6 rounded-lg font-medium text-sm text-[#16171b]"
              style={{ background: "#b08a3e" }}
            >
              Criar {formType === "CARD" ? "Cartão" : "Conta"}
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12 text-[#86837d]">Carregando contas...</div>
      ) : !userEmail ? (
        <div className="text-center py-12 text-[#86837d]">Faça login para ver suas contas</div>
      ) : accounts.length === 0 ? (
        <div className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-8 text-center">
          <CreditCard className="w-16 h-16 mx-auto text-[#86837d] mb-4" />
          <h3 className="text-lg font-medium text-[#efeae0] mb-1">Nenhuma conta cadastrada</h3>
          <p className="text-[#86837d] text-sm mb-4">Adicione suas contas ou sincronize via Open Finance</p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 rounded-lg font-medium text-sm text-[#16171b]"
            style={{ background: "#b08a3e" }}
          >
            Adicionar Conta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const Icon = getAccountIcon(account.type);
            return (
              <div
                key={account.id}
                className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-5 hover:border-[#b08a3e]/40 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: `${account.color || "#b08a3e"}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: account.color || "#b08a3e" }} />
                  </div>
                  {account.isManual && (
                    <span className="text-xs text-[#86837d] bg-[#16171b] px-2 py-1 rounded">Manual</span>
                  )}
                  {account.lastSyncedAt && (
                    <span className="text-xs text-[#86837d] flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" />
                      {new Date(account.lastSyncedAt).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                </div>

                <h3 className="font-semibold text-[#efeae0] mb-1">{account.name}</h3>
                <p className="text-xs text-[#86837d] mb-3">{getTypeLabel(account.type)}</p>

                {account.type === "CREDIT_CARD" ? (
                  <div className="space-y-2">
                    <div>
                      <span className="text-[10px] text-[#86837d] uppercase tracking-wider block">Fatura Atual</span>
                      <p className="text-2xl font-bold text-[#9e4a3e] num">
                        {formatBRL(Math.abs(parseFloat(account.currentBalance || "0")))}
                      </p>
                    </div>
                    {account.creditLimit && parseFloat(account.creditLimit) > 0 && (
                      <div className="pt-2 border-t border-[#cfc6b4]/20 flex justify-between text-xs text-[#86837d]">
                        <span>Limite: <strong className="text-[#efeae0] num">{formatBRL(parseFloat(account.creditLimit))}</strong></span>
                        {account.dueDay && <span>Venc: dia <strong className="text-[#efeae0]">{account.dueDay}</strong></span>}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-[#efeae0] num">
                    {formatBRL(parseFloat(account.currentBalance))}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
