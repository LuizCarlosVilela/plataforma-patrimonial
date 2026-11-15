"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { Plus, ArrowUpRight, ArrowDownRight, Filter, Calendar, Trash2, Sparkles, X } from "lucide-react";
import { formatBRL } from "@/lib/utils";
import { TransactionModal } from "@/components/shared/transaction-modal";

interface Category {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "income" | "expense">("all");
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Form state (for inline form fallback)
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [accountId, setAccountId] = useState("");
  const [accounts, setAccounts] = useState<any[]>([]);

  // Create category state
  const [showCreateCat, setShowCreateCat] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("#8b5cf6");
  const [newCatIcon, setNewCatIcon] = useState("MoreHorizontal");

  const ICON_OPTIONS = ["Utensils", "Home", "Car", "HeartPulse", "Gamepad2", "Wallet", "TrendingUp", "Briefcase", "ShoppingBag", "GraduationCap", "Coins", "MoreHorizontal"];
  const COLOR_OPTIONS = ["#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#10b981", "#f59e0b", "#6366f1", "#6b7280"];

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

  const loadTransactions = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/transactions?email=${userEmail}`);
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
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/accounts?email=${userEmail}`);
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

  const loadCategories = async () => {
    if (!userEmail) return;
    try {
      const res = await fetch(`/api/categories?email=${userEmail}`);
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (e) {
      console.error("Error loading categories:", e);
    }
  };

  useEffect(() => {
    if (userEmail) {
      loadTransactions();
      loadAccounts();
      loadCategories();
    }
  }, [userEmail]);

  // Inline form submit (legacy fallback)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !date || !accountId) return;

    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
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

  const getCategoryById = (id: string | null | undefined) => {
    if (!id) return null;
    return categories.find(c => c.id === id) || null;
  };

  const handleCreateCategory = async () => {
    if (!newCatName.trim() || !userEmail) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          name: newCatName.trim(),
          icon: newCatIcon,
          color: newCatColor,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(prev => [...prev, data.category]);
        setNewCatName("");
        setShowCreateCat(false);
      }
    } catch (e) {
      console.error("Error creating category:", e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#efeae0]">Transações</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 py-2 px-4 rounded-xl font-medium text-sm transition-all active:scale-[0.98] text-[#16171b]"
            style={{ background: "#b08a3e" }}
          >
            <Plus className="w-4 h-4" />
            Nova Transação
          </button>
        </div>
      </div>

      {/* Categories quick panel */}
      <div className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#b08a3e]" />
            <span className="text-xs font-medium text-[#86837d] uppercase tracking-wider">Categorias</span>
          </div>
          <button
            onClick={() => setShowCreateCat(!showCreateCat)}
            className="text-xs text-[#b08a3e] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3 h-3" />
            Criar Categoria
          </button>
        </div>

        {/* Create category form */}
        {showCreateCat && (
          <div className="mb-3 p-3 bg-[#16171b] rounded-lg border border-[#cfc6b4]/30 space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Nome da categoria"
                className="flex-1 bg-[#191a1e] border border-[#cfc6b4] rounded-lg px-3 py-1.5 text-sm text-[#efeae0] placeholder-[#86837d] focus:border-[#b08a3e] outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleCreateCategory()}
              />
              <select
                value={newCatIcon}
                onChange={(e) => setNewCatIcon(e.target.value)}
                className="bg-[#191a1e] border border-[#cfc6b4] rounded-lg px-2 py-1.5 text-sm text-[#efeae0] focus:border-[#b08a3e] outline-none"
              >
                {ICON_OPTIONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
              <button
                onClick={handleCreateCategory}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-[#16171b]"
                style={{ background: "#b08a3e" }}
              >
                Criar
              </button>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-[#86837d]">Cor:</span>
              {COLOR_OPTIONS.map(color => (
                <button
                  key={color}
                  onClick={() => setNewCatColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${newCatColor === color ? "border-white scale-110" : "border-transparent"}`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Category chips */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-default transition-all hover:scale-105"
              style={{
                background: `${cat.color}20`,
                border: `1px solid ${cat.color}40`,
                color: cat.color,
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: cat.color }} />
              {cat.name}
            </div>
          ))}
          {categories.length === 0 && (
            <span className="text-xs text-[#86837d]">Nenhuma categoria criada ainda</span>
          )}
        </div>
      </div>

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
          {filteredTransactions.map((tx) => {
            const cat = getCategoryById(tx.categoryId);
            return (
              <div
                key={tx.id}
                className="bg-[#191a1e]/70 border border-[#cfc6b4] rounded-xl p-4 flex items-center justify-between hover:border-[#b08a3e]/40 transition-all"
              >
                <div className="flex items-center gap-4">
                  {/* Icon circle */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: tx.type === "INCOME"
                        ? "rgba(34,197,94,0.1)"
                        : "rgba(239,68,68,0.1)",
                    }}
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

                  {/* Category chip */}
                  {cat && (
                    <div
                      className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0"
                      style={{
                        background: `${cat.color}20`,
                        border: `1px solid ${cat.color}40`,
                        color: cat.color,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cat.color }} />
                      {cat.name}
                    </div>
                  )}
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
            );
          })}
        </div>
      )}

      {/* Transaction Modal with Category Support */}
      <TransactionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        accounts={accounts}
        categories={categories}
      />
    </div>
  );
}
