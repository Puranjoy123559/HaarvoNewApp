"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/api/authApi";
import { UserInfo } from "@/types/api";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: ask the backend who we are. If the cookie is missing/expired,
  // /auth/me returns 401 — bounce to /login.
  useEffect(() => {
    authApi
      .me()
      .then((info) => setUser(info))
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

  if (!user) {
    return null; // we're about to redirect — don't flash anything
  }

  return (
    <main className="min-h-screen bg-[#F5F4F1] px-4">
      <header className="max-w-5xl mx-auto flex justify-between items-center py-6">
        <h1 className="text-2xl font-bold text-[#0E3D2E]">
          Haarvo<span className="text-[#7FD09A]">.</span>
        </h1>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-[#0E3D2E] underline hover:text-[#0A2E22]"
        >
          Sign out
        </button>
      </header>

      <div className="max-w-5xl mx-auto mt-16 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-[#0E3D2E]">
          Welcome to dashboard
        </h2>
        <p className="mt-4 text-lg text-gray-700">
          Hi {user.firstName} {user.lastName} — you&apos;re signed in as{" "}
          <span className="font-medium">{user.email}</span>.
        </p>
        <p className="mt-2 text-sm text-gray-500">
          (Real dashboard content will be built next.)
        </p>
      </div>
    </main>
  );
}