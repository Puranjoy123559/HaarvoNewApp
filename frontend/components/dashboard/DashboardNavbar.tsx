"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Settings, LogOut, ChevronDown } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { UserInfo } from "@/types/api";
import Logo from "@/components/ui/Logo";

interface DashboardNavbarProps {
  user: UserInfo;
  onLogout: () => void;
}

// Shape of one nav link (a link may optionally have child links = a dropdown)
type NavLink = {
  id: string;
  label: string;
  path: string | null; // null = not built yet -> shows a toast
  children?: { id: string; label: string; path: string | null }[];
};

export default function DashboardNavbar({ user, onLogout }: DashboardNavbarProps) {
  const { showToast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);   // profile dropdown
  const [openMenu, setOpenMenu] = useState<string | null>(null); // which nav dropdown is open

  const navLinks: NavLink[] = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    {
      id: "member",
      label: "Member Hub",
      path: null,
      children: [
        { id: "directory", label: "M - Directory", path: null }, // built later
        { id: "konnect", label: "M - Konnect", path: "/member-hub" },
      ],
    },
    { id: "supply", label: "Supply Hub", path: null },
    { id: "trade", label: "Trade Hub", path: null },
    { id: "dispatch", label: "Dispatch Hub", path: null },
    { id: "settlement", label: "Settlement Hub", path: null },
    { id: "tracex", label: "TraceX", path: null },
  ];

  const handleNavClick = (link: { label: string; path: string | null }) => {
    if (link.path) {
      router.push(link.path);
    } else {
      showToast(`${link.label} is coming soon — implementation pending.`);
    }
  };

  const handlePending = (label: string) => {
    showToast(`${label} is coming soon — implementation pending.`);
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full bg-[#023530] text-white">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left: logo + links */}
        <div className="flex items-center gap-10">
          <Logo className="h-9" />

          <ul className="hidden md:flex items-center gap-6 text-sm">
            {navLinks.map((link) => {
              // A parent is "active" if we're on one of its child pages
              const isActive = link.path
                ? link.path === pathname
                : (link.children?.some((c) => c.path === pathname) ?? false);

              // --- Links WITH a dropdown (e.g. Member Hub) ---
              if (link.children) {
                const isOpen = openMenu === link.id;
                return (
                  <li key={link.id} className="relative">
                    <button
                      onClick={() => setOpenMenu(isOpen ? null : link.id)}
                      className={`flex items-center gap-1 pb-1 border-b-2 transition ${
                        isActive
                          ? "border-[#7FD09A] font-semibold"
                          : "border-transparent text-white/80 hover:text-white"
                      }`}
                    >
                      {link.label}
                      <ChevronDown size={14} />
                    </button>

                    {isOpen && (
                      <ul className="absolute left-0 mt-2 w-44 rounded-lg bg-[#023530] py-1 shadow-lg ring-1 ring-white/10">
                        {link.children.map((child) => (
                          <li key={child.id}>
                            <button
                              onClick={() => {
                                handleNavClick(child);
                                setOpenMenu(null);
                              }}
                              className="block w-full px-4 py-2 text-left text-white/80 hover:bg-white/10 hover:text-white"
                            >
                              {child.label}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              }

              // --- Normal links ---
              return (
                <li key={link.id}>
                  <button
                    onClick={() => handleNavClick(link)}
                    className={`pb-1 border-b-2 transition ${
                      isActive
                        ? "border-[#7FD09A] font-semibold"
                        : "border-transparent text-white/80 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              );
            })}
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

          <div className="relative">
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="flex items-center gap-2"
            >
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