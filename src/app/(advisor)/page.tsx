"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Bot, User, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { formatBRL } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AdvisorPageProps {
  userEmail?: string;
  userName?: string;
}

// Quick suggestions
const SUGGESTIONS = [
  { icon: "chart", text: "Como melhorar meu patrimônio?" },
  { icon: "goal", text: "Estou no caminho certo pro meu objetivo?" },
  { icon: "risk", text: "Meus riscos financeiros estão controlados?" },
];

export default function AdvisorPage({ userEmail, userName }: AdvisorPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Welcome message
    const welcome: Message = {
      id: "welcome",
      role: "assistant",
      content: `Olá${userName ? `, ${userName.split(" ")[0]}` : ""}! 👋\n\nSou o **Advisor**, seu assistente financeiro da W1 Consultoria.\n\nPosso ajudar com:\n• Análise do seu patrimônio e evolução\n• Recomendações baseadas nas suas metas\n• Insights sobre suas movimentações financeiras\n\nSobre o que gostaria de conversar?`,
      timestamp: new Date(),
    };
    setMessages([welcome]);
    setConnected(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = (text || input).trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao comunicar com o Advisor");
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      // Fallback: show local help message
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Desculpe, não consegui conectar ao Advisor no momento. Seu assessor humano pode ajudar com essa dúvida — entre em contato pelo app.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendSuggestion = (text: string) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col h-full min-h-[600px]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#cfc6b4]/20">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #b08a3e, #d4af65)" }}>
          <Sparkles className="w-5 h-5 text-[#16171b]" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-[#efeae0]">Advisor IA</h1>
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
            <p className="text-xs text-[#86837d]">{connected ? "Online" : "Offline"}</p>
          </div>
        </div>
        {!connected && (
          <button
            onClick={() => setConnected(true)}
            className="ml-auto text-xs text-[#b08a3e] hover:underline"
          >
            Reconectar
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 ${
                msg.role === "user"
                  ? "bg-[#b08a3e]/20"
                  : "bg-[#4f6b52]/20"
              }`}
            >
              {msg.role === "user" ? (
                <User className="w-4 h-4 text-[#b08a3e]" />
              ) : (
                <Bot className="w-4 h-4 text-[#4f6b52]" />
              )}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-[#b08a3e] text-[#16171b] rounded-tr-sm"
                  : "bg-[#191a1e] border border-[#cfc6b4]/30 text-[#efeae0] rounded-tl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-[#4f6b52]/20 flex-shrink-0 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#4f6b52]" />
            </div>
            <div className="bg-[#191a1e] border border-[#cfc6b4]/30 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#b08a3e] animate-spin" />
              <span className="text-sm text-[#86837d]">Advisor pensando...</span>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 2 && !isLoading && (
        <div className="mb-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.text}
              onClick={() => sendSuggestion(s.text)}
              className="text-xs px-3 py-1.5 rounded-full border border-[#cfc6b4]/30 text-[#86837d] hover:text-[#efeae0] hover:border-[#b08a3e]/40 transition-all"
            >
              {s.text}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2 items-end">
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre seu patrimônio, metas, investimentos..."
            disabled={isLoading}
            className="w-full bg-[#191a1e] border border-[#cfc6b4] rounded-xl pl-4 pr-4 py-3 text-sm text-[#efeae0] placeholder-[#86837d] focus:border-[#b08a3e] focus:outline-none disabled:opacity-50 transition-colors"
          />
        </div>
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
          style={{ background: "#b08a3e" }}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 text-[#16171b] animate-spin" />
          ) : (
            <Send className="w-5 h-5 text-[#16171b]" />
          )}
        </button>
      </div>
    </div>
  );
}
