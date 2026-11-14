"use client";

import { useState, useEffect } from "react";
import { Plus, ArrowUpRight, ArrowDownRight, Filter, Calendar, Trash2, Pencil } from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface Transaction {
  id: string;
  accountId: string;
  amount: string;
  description: string;
  date: string;
  type: "INCOME" | "EXPENSE";
  account?: { name: string; color: string };
  category?: { name: string; icon: string; color: string };
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [loading, setLoading] = useState(true);

  // Form state
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [accountId, setAccountId] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);

  const DEMO_USER_ID = "clx8h6r7v0000w3xy9z2k4m5n"; // Client user from seed

  useEffect(() => {
    loadTransactions();
    loadAccounts();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await fetch(`/api/transactions?userId=${DEMO_USER_ID}`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (e) {
      console.error("Error loading transactions:", e);
    } finally {
      setLoading(false);
    }
  };

  const loadAccounts = async () => {
    try {
      const res = await fetch(`/api/accounts?userId=${DEMO_USER_ID}`);
      if (res.ok) {
        const data = await res.json();
        setAccounts(data.accounts || []);
        if (data.accounts.length > 0 && !accountId) {
          setAccountId(data.accounts[0].id);
        }
      }
    } catch (e) {
      console.error("Error loading accounts:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !date || !accountId) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: DEMO_USER_ID,
          accountId,
          type,
          amount: parseFloat(amount),
          description,
          date: `${date}T00:00:00Z`,
        }),
      });

      if (res.ok) {
        setShowForm(false);
        setAmount("");
        setDescription("");
        loadTransactions();
      }
    } catch (e) {
      console.error("Error creating transaction:", e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deseja realmente excluir esta transação?")) return;

    try {
      const res = await fetch(`/api/transactions?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        loadTransactions();
      }
    } catch (e) {
      console.error("Error deleting transaction:", e);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "income") return t.type === "INCOME";
    if (filter === "expense") return t.type === "EXPENSE";
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#efeae0]">Transações</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-sm transition-all active:scale-[0.98] text-[#16171b]"
          style={{ background: "#b08a3e" }}
        >
          <Plus className="w-4 h-4" />
          Nova Transação
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-[#efeae0]">Nova Transação</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Type */}
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Tipo</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setType("EXPENSE")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    type === "EXPENSE"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-[#16171b] text-[#86837d] border border-[#cfc6b4]"
                  }`}
                >
                  Despesa
                </button>
                <button
                  type="button"
                  onClick={() => setType("INCOME")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                    type === "INCOME"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-[#16171b] text-[#86837d] border border-[#cfc6b4]"
                  }`}
                >
                  Receita
                </button>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Valor (R$)</label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Descrição</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ex: Supermercado"
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                required
              />
            </div>

            {/* Account */}
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Conta</label>
              <select
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
                className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-lg px-4 py-2 text-[#efeae0] focus:border-[#b08a3e] outline-none"
                required
              >
                <option value="">Selecione uma conta</option>
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name} ({acc.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-xs text-[#86837d] mb-1 uppercase tracking-wider">Data</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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
              Salvar Transação
            </button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-[#86837d]" />
        <div className="flex gap-2">
          {[
            { key: "all", label: "Todas" },
            { key: "income", label: "Receitas" },
            { key: "expense", label: "Despesas" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f.key
                  ? "bg-[#b08a3e]/20 text-[#b08a3e] border border-[#b08a3e]/30"
                  : "text-[#86837d] hover:text-[#efeae0]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      {loading ? (
        <div className="text-center py-12 text-[#86837d]">Carregando...</div>
      ) : filteredTransactions.length === 0 ? (
        <div className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-8 text-center">
          <Calendar className="w-16 h-16 mx-auto text-[#86837d] mb-4" />
          <h3 className="text-lg font-medium text-[#efeae0] mb-1">Nenhuma transação encontrada</h3>
          <p className="text-[#86837d] text-sm">Adicione sua primeira transação para começar a controlar suas finanças</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-4 flex items-center justify-between hover:border-[#b08a3e]/40 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: tx.type === "INCOME" ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)" }}
                >
                  {tx.type === "INCOME" ? (
                    <ArrowUpRight className="w-5 h-5 text-green-500" />
                  ) : (
                    <ArrowDownRight className="w-5 h-5 text-red-500" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-[#efeae0]">{tx.description}</p>
                  <p className="text-xs text-[#86837d]">
                    {tx.account?.name || "Sem conta"} · {new Date(tx.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`font-semibold ${
                    tx.type === "INCOME" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {tx.type === "INCOME" ? "+" : "-"} {formatBRL(parseFloat(tx.amount))}
                </span>
                <button
                  onClick={() => handleDelete(tx.id)}
                  className="p-2 rounded-lg hover:bg-red-500/10 text-[#86837d] hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
