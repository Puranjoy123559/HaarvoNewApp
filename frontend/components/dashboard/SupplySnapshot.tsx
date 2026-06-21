"use client";

import { useToast } from "@/components/ui/Toast";
import { SupplyRow } from "@/types/dashboardTypes";

export default function SupplySnapshot({ rows }: { rows: SupplyRow[] }) {
  const { showToast } = useToast();

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#0E3D2E]">Supply Snapshot</h3>
        <button
          onClick={() => showToast("View All is coming soon — implementation pending.")}
          className="text-sm font-medium text-[#0E3D2E] hover:underline"
        >
          View All →
        </button>
      </div>

      <table className="mt-5 w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="pb-3 font-medium">Commodity</th>
            <th className="pb-3 font-medium">Available Volume</th>
            <th className="pb-3 font-medium">Grade</th>
            <th className="pb-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-t border-gray-100">
              <td className="py-3 font-medium text-gray-800">{row.commodity}</td>
              <td className="py-3 text-gray-700">{row.availableVolume}</td>
              <td className="py-3">
                <span className="rounded-full bg-[#E6F4EA] px-3 py-1 text-xs font-medium text-[#0E3D2E]">
                  {row.grade}
                </span>
              </td>
              <td className="py-3 text-gray-700">• {row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}