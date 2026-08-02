"use client";

import { Layers, Package, Leaf, BadgeCheck } from "lucide-react";
import { SupplyStat } from "@/types/supplyHubTypes";

const iconMap = {
  lots: Layers,
  quantity: Package,
  commodities: Leaf,
  ready: BadgeCheck,
} as const;

const toneClass = {
  positive: "text-[#0E3D2E]",
  neutral: "text-gray-500",
};

export default function SupplyStats({ stats }: { stats: SupplyStat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? Layers;
        return (
          <div key={stat.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between">
              <p className="text-xs font-semibold tracking-wide text-gray-500">{stat.label}</p>
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#E6F4EA] text-[#0E3D2E]">
                <Icon size={16} />
              </span>
            </div>
            <p className="mt-3 text-3xl font-bold text-[#0E3D2E]">{stat.value}</p>
            <p className={`mt-1 text-xs ${toneClass[stat.hintTone]}`}>{stat.hint}</p>
          </div>
        );
      })}
    </div>
  );
}