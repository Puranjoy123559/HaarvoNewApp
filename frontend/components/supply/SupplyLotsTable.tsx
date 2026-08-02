"use client";

import { Eye } from "lucide-react";
import { SupplyLot } from "@/types/supplyHubTypes";

// status -> badge colour
const statusClass = {
  "Trade Ready": "bg-[#0E3D2E] text-white",
  "Aggregating": "bg-gray-100 text-gray-600",
  "Ready for Verification": "bg-red-100 text-red-600",
  "Archived": "bg-gray-100 text-gray-500",
};

interface Props {
  rows: SupplyLot[];
  onView: (lotId: string) => void;
}

export default function SupplyLotsTable({ rows, onView }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-semibold tracking-wide text-gray-500">
            <th className="px-4 py-3">LOT ID</th>
            <th className="px-4 py-3">COMMODITY</th>
            <th className="px-4 py-3">QUANTITY</th>
            <th className="px-4 py-3">COLLECTION POINT</th>
            <th className="px-4 py-3">CONTRIBUTORS</th>
            <th className="px-4 py-3">CREATED DATE</th>
            <th className="px-4 py-3">STATUS</th>
            <th className="px-4 py-3 text-right">ACTIONS</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                No lots found.
              </td>
            </tr>
          )}

          {rows.map((lot) => (
            <tr key={lot.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{lot.lotId}</td>
              <td className="px-4 py-3 text-gray-600">{lot.commodity}</td>
              <td className="px-4 py-3 text-gray-600">{lot.quantity}</td>
              <td className="px-4 py-3 text-gray-600">{lot.collectionPoint}</td>

              {/* Contributors avatars */}
              <td className="px-4 py-3">
                <div className="flex items-center">
                  {lot.contributors.map((initials, i) => (
                    <span
                      key={i}
                      className="-ml-1 flex h-6 w-6 items-center justify-center rounded-full border border-white bg-[#7FD09A] text-[10px] font-semibold text-[#0E3D2E] first:ml-0"
                    >
                      {initials}
                    </span>
                  ))}
                  {lot.extraContributors > 0 && (
                    <span className="-ml-1 flex h-6 items-center justify-center rounded-full border border-white bg-gray-200 px-1.5 text-[10px] font-semibold text-gray-600">
                      +{lot.extraContributors}
                    </span>
                  )}
                </div>
              </td>

              <td className="px-4 py-3 text-gray-600">{lot.createdDate}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wide ${statusClass[lot.status]}`}
                >
                  {lot.status}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onView(lot.lotId)}
                  className="text-gray-400 hover:text-[#0E3D2E]"
                  aria-label="View lot"
                >
                  <Eye size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}