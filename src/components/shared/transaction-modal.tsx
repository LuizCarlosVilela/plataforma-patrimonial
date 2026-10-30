"use client";

import { useState } from "react";
import { X, Plus, Minus, CreditCard, Landmark, TrendingUp, Wallet, Car, Home, Utensils, HeartPulse, Gamepad2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createTransaction } from "@/server/actions/transactions";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  Utensils,
  Home,
  Car,
  HeartPulse,
  Gamepad2,
  Wallet,
  TrendingUp,
};

const accountIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  CreditCard,
  Landmark,
  TrendingUp,
  Wallet,
};

// Helper to safely render icon
const renderIcon = (iconName: string | null | undefined, icons: Record<string, React.ComponentType<{ className?: string }>>) => {
  if (!iconName || !icons[iconName]) return null;
  return <>{icons[iconName] && <span className="align-middle" />}</>
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  accounts: Array<{ id: string; name: string; type: string; color?: string | null; icon?: string | null }>;
  categories: Array<{ id: string; name: string; icon?: string | null; color?: string | null }>;
}

export function TransactionModal({ isOpen, onClose, userId }: TransactionModalProps) {
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description || !accountId) {
      setError("Preencha todos os campos obrigatórios");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await createTransaction({
        accountId,
        categoryId: categoryId || undefined,
        type,
        amount: parseFloat(amount),
        description,
        date: new Date(date).toISOString(),
        notes: notes || undefined,
      });
      onClose();
      resetForm();
    } catch (err) {
      setError("Erro ao criar transação. Tente novamente.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setAccountId("");
    setCategoryId("");
    setNotes("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-white">Nova {type === "INCOME" ? "Receita" : "Despesa"}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Tipo</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all",
                  type === "EXPENSE"
                    ? "bg-rose-500/20 border border-rose-500/30 text-rose-400"
                    : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                )}
              >
                <Minus className="w-4 h-4" />
                Despesa
              </button>
              <button
                type="button"
                onClick={() => setType("INCOME")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all",
                  type === "INCOME"
                    ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-400"
                    : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700"
                )}
              >
                <Plus className="w-4 h-4" />
                Receita
              </button>
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Valor</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="0,00"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              placeholder="Ex: Supermercado, Salário, Uber..."
              required
            />
          </div>

          {/* Conta */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Conta</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            >
              <option value="">Selecione uma conta</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {renderIcon(acc.icon, accountIcons)} {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Categoria (opcional)</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {renderIcon(cat.icon, categoryIcons)} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-2">Observações (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Detalhes adicionais..."
            />
          </div>

          {error && (
            <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-medium text-sm transition-colors"
          >
            {isLoading ? "Salvando..." : `Salvar ${type === "INCOME" ? "Receita" : "Despesa"}`}
          </button>
        </form>
      </div>
    </div>
  );
}