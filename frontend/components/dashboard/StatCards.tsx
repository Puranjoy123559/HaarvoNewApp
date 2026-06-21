"use client";

import { Users, Package, ShoppingCart, Wallet } from "lucide-react";
import { DashboardStat } from "@/types/dashboardTypes";

// Map our icon string -> a real icon component
const iconMap = {
  users: Users,
  package: Package,
  cart: ShoppingCart,
  wallet: Wallet,
} as const;

// Map the hint tone -> a colour
const toneClass = {
  positive: "text-[#0E3D2E]",
  neutral: "text-gray-500",
  warning: "text-amber-600",
};

export default function StatCards({ stats }: { stats: DashboardStat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? Users;
        return (
          <div key={stat.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold tracking-wide text-gray-500">{stat.label}</p>
              <Icon size={20} className="text-gray-300" />
            </div>
            <p className="mt-3 text-3xl font-bold text-[#0E3D2E]">{stat.value}</p>
            <p className={`mt-2 text-xs ${toneClass[stat.hintTone]}`}>{stat.hint}</p>
          </div>
        );
      })}
    </div>
  );
}