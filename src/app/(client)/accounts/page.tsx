"use client";

import { useState, useEffect } from "react";
import { Plus, CreditCard, Landmark, TrendingUp, Wallet, RefreshCw, AlertCircle } from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT_CARD" | "INVESTMENT" | "CASH" | "OTHER";
  currentBalance: string;
  currency: string;
  isManual: boolean;
  lastSyncedAt?: string;
  icon?: string;
  color?: string;
}

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState<"CHECKING" | "SAVINGS" | "CREDIT_CARD" | "INVESTMENT" | "CASH" | "OTHER">("CHECKING");
  const [initialBalance, setInitialBalance] = useState("");

  const DEMO_USER_ID = "clx8h6r7v0000w3xy9z2k4m5n";

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      const res = await fetch(`/api/accounts?userId=${DEMO_USER_ID}`);
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

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !initialBalance) return;

    try {
      const res = await fetch("/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          name,
          type,
          initialBalance: parseFloat(initialBalance),
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setName("");
        setInitialBalance("");
        loadAccounts();
      }
    } catch (e) {
      console.error("Error creating account:", e);
    }
  };

  const handleOpenFinanceSync = async () => {
    setSyncing(true);
    setSyncError("");

    try {
      const res = await fetch("/api/openfinance/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
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
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#efeae0]">Minhas Contas</h1>
        <div className="flex gap-3">
          <button
            onClick={handleOpenFinanceSync}
            disabled={syncing}
            className="flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-sm transition-all active:scale-[0.98] border border-[#cfc6b4] text-[#efeae0] hover:border-[#b08a3e] disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? "animate-spin" : ""}`} />
            Sync Open Finance
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-sm transition-all active:scale-[0.98] text-[#16171b]"
            style={{ background: "#b08a3e" }}
          >
            <Plus className="w-4 h-4" />
            Nova Conta
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
          <h2 className="font-semibold text-[#efeae0]">Nova Conta</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Nome da Conta</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Nubank Conta Corrente"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Tipo</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
              >
                <option value="CHECKING">Conta Corrente</option>
                <option value="SAVINGS">Poupança</option>
                <option value="CREDIT_CARD">Cartão de Crédito</option>
                <option value="INVESTMENT">Investimento</option>
                <option value="CASH">Dinheiro</option>
                <option value="OTHER">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Saldo Inicial (R$)</label>
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
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="py-2 px-4 rounded-lg text-sm text-[#86837d] hover:text-[#efeae0] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-6 rounded-lg font-medium text-sm text-[#16171b]"
              style={{ background: "#b08a3e" }}
            >
              Criar Conta
            </button>
          </div>
        </form>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-12 text-[#86837d]">Carregando contas...</div>
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

                <p className="text-2xl font-bold text-[#efeae0]">
                  {formatBRL(parseFloat(account.currentBalance))}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
