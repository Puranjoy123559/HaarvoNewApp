"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, PlusSquare, RotateCcw } from "lucide-react";
import { authApi } from "@/lib/api/authApi";
import { supplyHubApi } from "@/lib/api/supplyHubApi";
import { useToast } from "@/components/ui/Toast";
import { UserInfo } from "@/types/api";
import { SupplyLot, SupplyStat } from "@/types/supplyHubTypes";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import SupplyStats from "@/components/supply/SupplyStats";
import SupplyLotsTable from "@/components/supply/SupplyLotsTable";
import Pagination from "@/components/directory/Pagination"; // reusing the same generic pager

const PAGE_SIZE = 8; // lots per page

export default function SupplyHubPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const pending = (label: string) =>
    showToast(`${label} is coming soon — implementation pending.`);

  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Data from the API stub
  const [lots, setLots] = useState<SupplyLot[]>([]);
  const [stats, setStats] = useState<SupplyStat[]>([]);

  // Toolbar state — all handled in the frontend for now
  const [search, setSearch] = useState("");
  const [commodity, setCommodity] = useState("all");
  const [location, setLocation] = useState("all");        // filters by region
  const [collectionPoint, setCollectionPoint] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    authApi
      .me()
      .then(async (info) => {
        setUser(info);
        const data = await supplyHubApi.getSupplyLots();
        setLots(data.lots);
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

  const resetToFirstPage = () => setCurrentPage(1);

  // Reset button — clears everything
  const resetFilters = () => {
    setSearch("");
    setCommodity("all");
    setLocation("all");
    setCollectionPoint("all");
    setStatus("all");
    setCurrentPage(1);
  };

  // Dropdown options built from the loaded data (unique values)
  const commodityOptions = Array.from(new Set(lots.map((l) => l.commodity))).sort();
  const locationOptions = Array.from(new Set(lots.map((l) => l.region))).sort();
  const collectionPointOptions = Array.from(new Set(lots.map((l) => l.collectionPoint))).sort();

  // ---- Filter the lots (plain array methods) ----
  let visible = lots;

  if (search.trim() !== "") {
    const text = search.trim().toLowerCase();
    visible = visible.filter(
      (l) =>
        l.lotId.toLowerCase().includes(text) ||
        l.collectionPoint.toLowerCase().includes(text),
    );
  }
  if (commodity !== "all") visible = visible.filter((l) => l.commodity === commodity);
  if (location !== "all") visible = visible.filter((l) => l.region === location);
  if (collectionPoint !== "all") visible = visible.filter((l) => l.collectionPoint === collectionPoint);
  if (status !== "all") visible = visible.filter((l) => l.status === status);

  // ---- Pagination ----
  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageRows = visible.slice(startIndex, startIndex + PAGE_SIZE);

  const firstShown = visible.length === 0 ? 0 : startIndex + 1;
  const lastShown = startIndex + pageRows.length;

  return (
    <main className="min-h-screen bg-[#F5F4F1]">
      <DashboardNavbar user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Title + Create Supply Lot */}
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#0E3D2E]">Supply Hub Dashboard</h2>
            <p className="mt-1 text-gray-600">
              Manage and organize aggregated supply before it enters the trade workflow.
            </p>
          </div>
          <button
            onClick={() => pending("Create Supply Lot")}
            className="flex items-center gap-2 rounded-md bg-[#0E3D2E] px-4 py-2 text-sm font-medium text-white hover:bg-[#0A2E22] active:scale-95 transition"
          >
            <PlusSquare size={16} /> Create Supply Lot
          </button>
        </div>

        {/* Stat cards */}
        <div className="mt-6">
          <SupplyStats stats={stats} />
        </div>

        {/* Toolbar */}
        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-black/5">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Lot ID or Location..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetToFirstPage(); }}
              className="w-full rounded-md border border-gray-200 py-2 pl-9 pr-3 text-sm focus:border-[#0E3D2E] focus:outline-none"
            />
          </div>

          {/* Commodity */}
          <select
            value={commodity}
            onChange={(e) => { setCommodity(e.target.value); resetToFirstPage(); }}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#0E3D2E] focus:outline-none"
          >
            <option value="all">All Commodities</option>
            {commodityOptions.map((c) => (<option key={c} value={c}>{c}</option>))}
          </select>

          {/* Location (region) */}
          <select
            value={location}
            onChange={(e) => { setLocation(e.target.value); resetToFirstPage(); }}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#0E3D2E] focus:outline-none"
          >
            <option value="all">All Locations</option>
            {locationOptions.map((l) => (<option key={l} value={l}>{l}</option>))}
          </select>

          {/* Collection point */}
          <select
            value={collectionPoint}
            onChange={(e) => { setCollectionPoint(e.target.value); resetToFirstPage(); }}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#0E3D2E] focus:outline-none"
          >
            <option value="all">Collection Point</option>
            {collectionPointOptions.map((cp) => (<option key={cp} value={cp}>{cp}</option>))}
          </select>

          {/* Status */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); resetToFirstPage(); }}
            className="rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-[#0E3D2E] focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="Trade Ready">Trade Ready</option>
            <option value="Aggregating">Aggregating</option>
            <option value="Ready for Verification">Ready for Verification</option>
            <option value="Archived">Archived</option>
          </select>

          {/* Reset */}
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-[#0E3D2E]"
          >
            <RotateCcw size={14} /> Reset
          </button>
        </div>

        {/* Lots table */}
        <div className="mt-6 rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          <SupplyLotsTable rows={pageRows} onView={(lotId) => pending(`View ${lotId}`)} />

          {/* Footer: count + pagination */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-100 px-4 py-4 sm:flex-row">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{firstShown}</span> to{" "}
              <span className="font-semibold text-gray-700">{lastShown}</span> of{" "}
              <span className="font-semibold text-gray-700">{visible.length}</span> lots
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