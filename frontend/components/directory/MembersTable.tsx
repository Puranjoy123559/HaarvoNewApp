"use client";

import { DirectoryMember } from "@/types/memberDirectoryTypes";

// status -> badge colour
const statusClass = {
  Verified: "bg-[#E6F4EA] text-[#0E3D2E]",
  Pending: "bg-amber-100 text-amber-700",
  Inactive: "bg-gray-100 text-gray-500",
};

interface Props {
  rows: DirectoryMember[];
  onViewProfile: (name: string) => void;
}

export default function MembersTable({ rows, onViewProfile }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-left text-xs font-semibold tracking-wide text-gray-500">
            <th className="px-4 py-3">MEMBER ID</th>
            <th className="px-4 py-3">FARMER NAME</th>
            <th className="px-4 py-3">VILLAGE</th>
            <th className="px-4 py-3">PRIMARY COMMODITY</th>
            <th className="px-4 py-3">PHONE NUMBER</th>
            <th className="px-4 py-3">STATUS</th>
            <th className="px-4 py-3">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {/* When nothing matches the search/filters */}
          {rows.length === 0 && (
            <tr>
              <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                No members found.
              </td>
            </tr>
          )}

          {rows.map((m) => (
            <tr key={m.id} className="border-b border-gray-50 hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-500">{m.memberId}</td>
              <td className="px-4 py-3 font-semibold text-gray-800">{m.farmerName}</td>
              <td className="px-4 py-3 text-gray-600">{m.village}</td>
              <td className="px-4 py-3 text-gray-600">{m.primaryCommodity}</td>
              <td className="px-4 py-3 text-[#0E3D2E]">{m.phoneNumber}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusClass[m.status]}`}>
                  {m.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onViewProfile(m.farmerName)}
                  className="font-medium text-[#0E3D2E] hover:underline"
                >
                  View Profile
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}