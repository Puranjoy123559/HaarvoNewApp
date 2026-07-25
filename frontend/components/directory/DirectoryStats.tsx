"use client";

import { TrendingUp, BadgeCheck, Zap, CalendarDays } from "lucide-react";
import { DirectoryStat } from "@/types/memberDirectoryTypes";

// icon string -> real icon
const iconMap = {
  trend: TrendingUp,
  verified: BadgeCheck,
  active: Zap,
  new: CalendarDays,
} as const;

const toneClass = {
  positive: "text-[#0E3D2E]",
  neutral: "text-gray-500",
};

export default function DirectoryStats({ stats }: { stats: DirectoryStat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = iconMap[stat.icon as keyof typeof iconMap] ?? TrendingUp;
        return (
          <div key={stat.id} className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5">
            <p className="text-xs font-semibold tracking-wide text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-[#0E3D2E]">{stat.value}</p>
            <p className={`mt-1 flex items-center gap-1 text-xs ${toneClass[stat.hintTone]}`}>
              <Icon size={13} /> {stat.hint}
            </p>
          </div>
        );
      })}
    </div>
  );
}