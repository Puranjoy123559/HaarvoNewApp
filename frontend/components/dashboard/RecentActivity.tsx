"use client";

import { CheckCircle, Truck, Handshake, ClipboardCheck } from "lucide-react";
import { ActivityItem } from "@/types/dashboardTypes";

const iconMap = {
  settlement: CheckCircle,
  dispatch: Truck,
  trade: Handshake,
  lot: ClipboardCheck,
} as const;

export default function RecentActivity({ items }: { items: ActivityItem[] }) {
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h3 className="text-lg font-bold text-[#0E3D2E]">Recent Activity</h3>
      <ul className="mt-5 space-y-5">
        {items.map((item) => {
          const Icon = iconMap[item.type] ?? CheckCircle;
          return (
            <li key={item.id} className="flex gap-3">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#0E3D2E] text-white">
                <Icon size={16} />
              </span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="text-sm text-gray-600">{item.description}</p>
                <p className="mt-1 text-xs text-gray-400">{item.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}