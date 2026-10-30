import { Home, Wallet, Target, ArrowRightLeft, Settings, LogOut } from "lucide-react";
import Link from "next/link";

export function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/client/dashboard", icon: Home },
    { name: "Contas", path: "/client/accounts", icon: Wallet },
    { name: "Metas", path: "/client/goals", icon: Target },
    { name: "Transações", path: "/client/transactions", icon: ArrowRightLeft },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex">
      <div className="p-6">
        <h1 className="text-xl font-bold text-white">S1NC</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 px-4 py-3 text-slate-400 hover:text-red-400 w-full transition">
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
