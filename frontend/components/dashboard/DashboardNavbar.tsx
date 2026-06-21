"use client";

import { useState } from "react";
import { Bell, Settings, LogOut, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { UserInfo } from "@/types/api";

// The page passes us the logged-in user and the real logout function.
interface DashboardNavbarProps {
  user: UserInfo;
  onLogout: () => void;
}

export default function DashboardNavbar({ user, onLogout }: DashboardNavbarProps) {
  const { showToast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // profile dropdown open/closed

  // Only "Dashboard" is built. ready:false links just show a toast for now.
  const navLinks = [
    { id: "dashboard",  label: "Dashboard",      ready: true },
    { id: "member",     label: "Member Hub",     ready: false },
    { id: "supply",     label: "Supply Hub",     ready: false },
    { id: "trade",      label: "Trade Hub",      ready: false },
    { id: "dispatch",   label: "Dispatch Hub",   ready: false },
    { id: "settlement", label: "Settlement Hub", ready: false },
    { id: "tracex",     label: "TraceX",         ready: false },
  ];

  const handleNavClick = (link: { label: string; ready: boolean }) => {
    if (!link.ready) {
      showToast(`${link.label} is coming soon — implementation pending.`);
    }
    // later, when ready === true, we'll do router.push(...)
  };

  const handlePending = (label: string) => {
    showToast(`${label} is coming soon — implementation pending.`);
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#0E3D2E] text-white">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: logo + links */}
        <div className="flex items-center gap-10">
          <div className="text-2xl font-bold">Haarvo</div>

          <ul className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => handleNavClick(link)}
                  className={`pb-1 border-b-2 transition ${
                    link.id === "dashboard"
                      ? "border-[#7FD09A] font-semibold"
                      : "border-transparent text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Right: bell + profile */}
        <div className="flex items-center gap-5">
          <button
            onClick={() => handlePending("Notifications")}
            className="text-white/80 hover:text-white transition"
            aria-label="Notifications"
          >
            <Bell size={20} />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex items-center gap-2"
            >
              {/* Avatar = first letter of first name (replace with real photo later) */}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7FD09A] text-[#0E3D2E] font-semibold">
                {user.firstName.charAt(0)}
              </span>
              <ChevronDown size={16} className="text-white/80" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white text-gray-800 shadow-lg ring-1 ring-black/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-[#0E3D2E]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>

                <button
                  onClick={() => handlePending("Settings")}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                >
                  <Settings size={16} /> Settings
                </button>

                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                >
                  <LogOut size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}