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

const renderIcon = (iconName: string | null | undefined, icons: Record<string, React.ComponentType<{ className?: string }>>) => {
  if (!iconName || !icons[iconName]) return null;
  return null;
};

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string;
  accounts: Array<{ id: string; name: string; type: string; color?: string | null; icon?: string | null }>;
  categories: Array<{ id: string; name: string; icon?: string | null; color?: string | null }>;
}

export function TransactionModal({ isOpen, onClose, accounts = [], categories = [] }: TransactionModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-[#191a1e] border border-[#cfc6b4] rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#cfc6b4]">
          <h2 className="text-lg font-semibold text-[#efeae0]">
            Nova {type === "INCOME" ? "Receita" : "Despesa"}
          </h2>
          <button
            onClick={onClose}
            className="text-[#86837d] hover:text-[#efeae0] transition-colors p-1 rounded-lg hover:bg-[#16171b]"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Tipo */}
          <div>
            <label className="block text-xs font-medium text-[#86837d] mb-2">Tipo de lançamento</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setType("EXPENSE")}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all",
                  type === "EXPENSE"
                    ? "bg-[rgba(158,74,62,0.15)] border border-[rgba(158,74,62,0.3)] text-[#9e4a3e]"
                    : "bg-[#16171b] border border-[#cfc6b4] text-[#86837d] hover:text-[#efeae0]"
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
                    ? "bg-[rgba(79,107,82,0.15)] border border-[rgba(79,107,82,0.3)] text-[#4f6b52]"
                    : "bg-[#16171b] border border-[#cfc6b4] text-[#86837d] hover:text-[#efeae0]"
                )}
              >
                <Plus className="w-4 h-4" />
                Receita
              </button>
            </div>
          </div>

          {/* Valor */}
          <div>
            <label className="block text-xs font-medium text-[#86837d] mb-1.5">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-xl px-4 py-2.5 text-[#efeae0] placeholder-[#86837d] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] text-sm transition-colors"
              placeholder="0,00"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-medium text-[#86837d] mb-1.5">Descrição</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-xl px-4 py-2.5 text-[#efeae0] placeholder-[#86837d] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] text-sm transition-colors"
              placeholder="Ex: Aporte Investimentos, Honorários, Supermercado..."
              required
            />
          </div>

          {/* Conta */}
          <div>
            <label className="block text-xs font-medium text-[#86837d] mb-1.5">Conta</label>
            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-xl px-4 py-2.5 text-[#efeae0] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] text-sm transition-colors"
              required
            >
              <option value="" className="bg-[#16171b]">Selecione uma conta</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id} className="bg-[#16171b]">
                  {acc.name} ({acc.type})
                </option>
              ))}
            </select>
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-medium text-[#86837d] mb-1.5">Categoria (opcional)</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-xl px-4 py-2.5 text-[#efeae0] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] text-sm transition-colors"
            >
              <option value="" className="bg-[#16171b]">Selecione uma categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#16171b]">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-xs font-medium text-[#86837d] mb-1.5">Data</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-xl px-4 py-2.5 text-[#efeae0] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] text-sm transition-colors"
              required
            />
          </div>

          {/* Observações */}
          <div>
            <label className="block text-xs font-medium text-[#86837d] mb-1.5">Observações (opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#16171b] border border-[#cfc6b4] rounded-xl px-4 py-2.5 text-[#efeae0] placeholder-[#86837d] focus:border-[#b08a3e] focus:outline-none focus:ring-1 focus:ring-[#b08a3e] text-sm transition-colors resize-none"
              placeholder="Notas adicionais sobre este lançamento..."
            />
          </div>

          {error && (
            <div className="text-sm text-[#9e4a3e] bg-[rgba(158,74,62,0.1)] border border-[rgba(158,74,62,0.2)] rounded-lg p-3">
              {error}
            </div>
          )}

          {/* Botão Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl font-medium text-sm text-[#16171b] transition-all hover:bg-[#b08a3e] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed shadow-gold"
            style={{ background: "#b08a3e" }}
          >
            {isLoading ? "Salvando..." : `Salvar ${type === "INCOME" ? "Receita" : "Despesa"}`}
          </button>
        </form>
      </div>
    </div>
  );
}
