"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, FileSpreadsheet, UserPlus } from "lucide-react";
import { authApi } from "@/lib/api/authApi";
import { memberDirectoryApi } from "@/lib/api/memberDirectoryApi";
import { useToast } from "@/components/ui/Toast";
import { UserInfo } from "@/types/api";
import { DirectoryMember, DirectoryStat } from "@/types/memberDirectoryTypes";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DirectoryStats from "@/components/directory/DirectoryStats";
import MembersTable from "@/components/directory/MembersTable";
import Pagination from "@/components/directory/Pagination";

const PAGE_SIZE = 15; // rows per page

export default function MemberDirectoryPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const pending = (label: string) =>
    showToast(`${label} is coming soon — implementation pending.`);

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Data from the API stub
  const [members, setMembers] = useState<DirectoryMember[]>([]);
  const [stats, setStats] = useState<DirectoryStat[]>([]);

  // Toolbar state — all handled in the frontend for now
  const [search, setSearch] = useState("");
  const [village, setVillage] = useState("all");
  const [commodity, setCommodity] = useState("all");
  const [status, setStatus] = useState("all");
  const [sortOrder, setSortOrder] = useState("none"); // none | az | za
  const [currentPage, setCurrentPage] = useState(1);

  // On load: confirm login, then fetch the directory data
  useEffect(() => {
    authApi
      .me()
      .then(async (info) => {
        setUser(info);
        const data = await memberDirectoryApi.getMembers();
        setMembers(data.members);
        setStats(data.stats);
      })
      .catch(() => router.replace("/login"))
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } finally {
      router.replace("/login");
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#F5F4F1] text-gray-600">
        Loading...
      </main>
    );
  }
  if (!user) return null;

  // Any time a filter/search changes, jump back to page 1
  const resetToFirstPage = () => setCurrentPage(1);

  // Dropdown options built from the loaded data (unique values)
  const villageOptions = Array.from(new Set(members.map((m) => m.village))).sort();
  const commodityOptions = Array.from(new Set(members.map((m) => m.primaryCommodity))).sort();

  // ---- Step 1: filter + sort the members (plain array methods) ----
  let visible = members;

  if (search.trim() !== "") {
    const text = search.trim().toLowerCase();
    visible = visible.filter(
      (m) =>
        m.farmerName.toLowerCase().includes(text) ||
        m.memberId.toLowerCase().includes(text),
    );
  }
  if (village !== "all") visible = visible.filter((m) => m.village === village);
  if (commodity !== "all") visible = visible.filter((m) => m.primaryCommodity === commodity);
  if (status !== "all") visible = visible.filter((m) => m.status === status);

  if (sortOrder === "az")
    visible = [...visible].sort((a, b) => a.farmerName.localeCompare(b.farmerName));
  if (sortOrder === "za")
    visible = [...visible].sort((a, b) => b.farmerName.localeCompare(a.farmerName));

  // ---- Step 2: pagination ----
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageRows = visible.slice(startIndex, startIndex + PAGE_SIZE);

  // Numbers for the "Showing X to Y of Z entries" line
  const firstShown = visible.length === 0 ? 0 : startIndex + 1;
  const lastShown = startIndex + pageRows.length;

  return (
    <main className="min-h-screen bg-[#F5F4F1]">
      <DashboardNavbar user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title + Add Member */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#0E3D2E]">M-Directory</h2>
            <p className="mt-1 text-gray-600">
              Manage and organize farmer member identities across your collective.
            </p>
          </div>
          <button
            onClick={() => pending("Add Member")}
            className="flex items-center gap-2 rounded-md bg-[#0E3D2E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A2E22] active:scale-95 transition"
          >
            <UserPlus size={16} /> Add Member
          </button>
        </div>

        {/* Stat cards */}
        <div className="mt-6">
          <DirectoryStats stats={stats} />
        </div>

        {/* Toolbar: search + filters + sort + bulk upload */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row">
          <div className="flex flex-1 flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
            {/* Search */}
            <div className="relative min-w-[220px] flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search members by name or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetToFirstPage();
                }}
                className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-[#0E3D2E] focus:outline-none"
              />
            </div>

            {/* Village filter */}
            <select
              value={village}
              onChange={(e) => { setVillage(e.target.value); resetToFirstPage(); }}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#0E3D2E] focus:outline-none"
            >
              <option value="all">All Villages</option>
              {villageOptions.map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>

            {/* Commodity filter */}
            <select
              value={commodity}
              onChange={(e) => { setCommodity(e.target.value); resetToFirstPage(); }}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#0E3D2E] focus:outline-none"
            >
              <option value="all">All Commodities</option>
              {commodityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            {/* Status filter */}
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value); resetToFirstPage(); }}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#0E3D2E] focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
            </select>

            {/* Sort */}
            <select
              value={sortOrder}
              onChange={(e) => { setSortOrder(e.target.value); resetToFirstPage(); }}
              className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#0E3D2E] focus:outline-none"
            >
              <option value="none">Sort</option>
              <option value="az">Name A–Z</option>
              <option value="za">Name Z–A</option>
            </select>
          </div>

          {/* Bulk upload card */}
          <div className="flex items-center justify-between gap-4 rounded-xl bg-[#EFF5F1] p-4 ring-1 ring-black/5 lg:w-72">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={20} className="text-[#0E3D2E]" />
              <div>
                <p className="text-sm font-semibold text-gray-800">Bulk Upload</p>
                <p className="text-xs text-gray-500">Excel or CSV</p>
              </div>
            </div>
            <button
              onClick={() => pending("Bulk Upload / Import File")}
              className="rounded-md bg-[#0E3D2E] px-3 py-2 text-xs font-medium text-white hover:bg-[#0A2E22] transition"
            >
              Import File
            </button>
          </div>
        </div>

        {/* Members table */}
        <div className="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          <MembersTable rows={pageRows} onViewProfile={(name) => pending(`Profile of ${name}`)} />

          {/* Footer: entry count + pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{firstShown}</span> to{" "}
              <span className="font-semibold text-gray-700">{lastShown}</span> of{" "}
              <span className="font-semibold text-gray-700">{visible.length}</span> entries
            </p>
            <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </main>
  );
}