"use client";

import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { TradeRow } from "@/types/dashboardTypes";

export default function OpenTrades({ rows }: { rows: TradeRow[] }) {
  const { showToast } = useToast();

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0E3D2E]">Open Trades</h3>
        <button
          onClick={() => showToast("Execute New Trade is coming soon — implementation pending.")}
          className="flex items-center gap-1 rounded-md bg-[#0E3D2E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A2E22] active:scale-95 transition"
        >
          <Plus size={16} /> Execute New Trade
        </button>
      </div>

      <table className="mt-5 w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="pb-3 font-medium">Trade ID</th>
            <th className="pb-3 font-medium">Buyer</th>
            <th className="pb-3 font-medium">Quantity</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-gray-100">
              <td className="py-3 font-mono text-gray-700">{row.tradeId}</td>
              <td className="py-3 text-gray-800">{row.buyer}</td>
              <td className="py-3 text-gray-700">{row.quantity}</td>
              <td className="py-3">
                <span className="rounded-full bg-[#E6F4EA] px-3 py-1 text-xs font-medium text-[#0E3D2E]">
                  {row.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}