import { cn } from "@/lib/utils";
import { TrendingUp, ArrowUpRight, ShieldCheck, CreditCard, Target } from "lucide-react";

interface MobileBottomNavProps {
  activeTab?: "dashboard" | "transactions" | "advisor" | "accounts" | "goals";
}

export function MobileBottomNav({ activeTab = "dashboard" }: MobileBottomNavProps) {
  // This component is intentionally empty - mobile navigation is in sidebar route
  return null;
}
