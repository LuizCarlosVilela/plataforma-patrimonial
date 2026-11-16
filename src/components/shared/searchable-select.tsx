"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  id: string;
  label: string;
  icon?: React.ReactNode;
  color?: string;
}

interface SearchableSelectProps {
  options: Option[];
  value?: string;
  onChange: (id: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "Pesquisar...",
  className,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selected = options.find((o) => o.id === value);
  const filtered = search
    ? options.filter((o) =>
        o.label.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setOpen(!open);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2.5 rounded-xl border text-left transition-all text-sm",
          open
            ? "border-[#b08a3e] bg-[#16171b] ring-1 ring-[#b08a3e]"
            : "border-[#cfc6b4] bg-[#16171b] hover:border-[#b08a3e]/50"
        )}
      >
        {selected ? (
          <>
            {selected.color && (
              <span
                className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                style={{ background: selected.color }}
              >
                {selected.label.slice(0, 2).toUpperCase()}
              </span>
            )}
            {selected.icon}
            <span className="flex-1 text-[#efeae0] truncate">{selected.label}</span>
            <X
              className="w-4 h-4 text-[#86837d] hover:text-[#efeae0] flex-shrink-0 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
            />
          </>
        ) : (
          <>
            <Search className="w-4 h-4 text-[#86837d] flex-shrink-0" />
            <span className="flex-1 text-[#86837d] truncate">{placeholder}</span>
            <ChevronDown className="w-4 h-4 text-[#86837d] flex-shrink-0" />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => { setOpen(false); setSearch(""); }} />
          <div className="absolute z-50 top-full mt-1 w-full bg-[#191a1e] border border-[#cfc6b4] rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
            {/* Search input */}
            <div className="sticky top-0 bg-[#191a1e] border-b border-[#cfc6b4] p-2">
              <div className="flex items-center gap-2 px-2 py-1.5 bg-[#16171b] rounded-lg border border-[#cfc6b4]">
                <Search className="w-4 h-4 text-[#86837d] flex-shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar..."
                  className="flex-1 bg-transparent text-sm text-[#efeae0] outline-none placeholder-[#86837d]"
                  onClick={(e) => e.stopPropagation()}
                />
                {search && (
                  <button onClick={() => setSearch("")} className="text-[#86837d] hover:text-[#efeae0]">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Options */}
            <div className="p-1">
              {filtered.length === 0 ? (
                <p className="px-3 py-2 text-xs text-[#86837d] text-center">Nenhum resultado</p>
              ) : (
                filtered.map((opt) => {
                  const isSelected = opt.id === value;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onChange(opt.id);
                        setOpen(false);
                        setSearch("");
                      }}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left transition-all text-sm",
                        isSelected
                          ? "bg-[rgba(176,138,62,0.15)] text-[#efeae0]"
                          : "text-[#86837d] hover:bg-[#16171b] hover:text-[#efeae0]"
                      )}
                    >
                      {opt.color && (
                        <span
                          className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white"
                          style={{ background: opt.color }}
                        >
                          {opt.label.slice(0, 2).toUpperCase()}
                        </span>
                      )}
                      {opt.icon}
                      <span className="flex-1">{opt.label}</span>
                      {isSelected && (
                        <span className="text-[#b08a3e]">✓</span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
