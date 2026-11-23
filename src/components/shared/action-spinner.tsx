"use client";

import { Loader2 } from "lucide-react";

/**
 * ActionSpinner — mini loader for button actions
 *
 * Usage:
 *   <button disabled={saving} onClick={handleSave}>
 *     {saving ? <ActionSpinner label="Salvando..." /> : "Salvar"}
 *   </button>
 */
export function ActionSpinner({
  label = "Carregando",
  size = 14,
}: {
  label?: string;
  size?: number;
}) {
  return (
    <span className="flex items-center gap-2">
      <Loader2 className="w-3 h-3 animate-spin" style={{ width: size, height: size }} />
      {label}
    </span>
  );
}
