"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/authApi";
import { dashboardApi } from "@/lib/api/dashboardApi";
import { UserInfo } from "@/types/api";
import { DashboardData } from "@/types/dashboardTypes";
import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import StatCards from "@/components/dashboard/StatCards";
import SupplySnapshot from "@/components/dashboard/SupplySnapshot";
import OpenTrades from "@/components/dashboard/OpenTrades";
import RecentActivity from "@/components/dashboard/RecentActivity";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On load: 1) confirm who we are (real auth), 2) fetch dashboard numbers
  // (placeholder for now). If the session is gone, /auth/me fails -> go to login.
  useEffect(() => {
    authApi
      .me()
      .then(async (info) => {
        setUser(info);
        const dashboard = await dashboardApi.getDashboard();
        setData(dashboard);
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

  if (!user || !data) {
    return null; // about to redirect — don't flash anything
  }

  return (
    <main className="min-h-screen bg-[#F5F4F1]">
      <DashboardNavbar user={user} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-3xl font-bold text-[#0E3D2E]">Welcome Back</h2>
        <p className="mt-1 text-gray-600">
          Overview of your supply, trades, dispatches, and settlements.
        </p>

        {/* Top stat cards */}
        <div className="mt-8">
          <StatCards stats={data.stats} />
        </div>

        {/* Two-column area: left = supply + trades, right = activity */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SupplySnapshot rows={data.supply} />
            <OpenTrades rows={data.trades} />
          </div>
          <div>
            <RecentActivity items={data.activity} />
          </div>
        </div>
      </div>
    </main>
  );
}