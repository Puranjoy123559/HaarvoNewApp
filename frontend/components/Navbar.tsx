// "use client" because we use React hooks (useState, useRouter) and onClick handlers
"use client";

import { useState } from "react";
// useRouter is Next.js's way to change pages from code.
// IMPORTANT: in the App Router it comes from "next/navigation" (not "next/router").
import { useRouter } from "next/navigation";

// Top navigation bar
export default function Navbar() {
  const router = useRouter();

  // Tracks which middle nav link is highlighted.
  const [activeLink, setActiveLink] = useState("platform");

  // Go to the login page (client-side navigation — keeps React alive so the
  // Back button works and all buttons stay clickable afterwards).
  const handleLogin = () => {
    router.push("/login");
  };

  // Go to the register page the same client-side way.
  const handleGetStarted = () => {
    router.push("/register");
  };

  // Storing the nav links as an array keeps the code clean — no copy-paste
  const navLinks = [
    { id: "platform", label: "Platform" },
    { id: "traceability", label: "Traceability" },
    { id: "execution", label: "Execution" },
    { id: "solutions", label: "Solutions" },
  ];

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo on the left */}
        <div className="text-2xl font-bold text-[#0E3D2E]">Haarvo</div>

        {/* Navigation links in the middle */}
        <ul className="hidden items-center gap-8">
          {navLinks.map((link) => {
            const isActive = activeLink === link.id;

            return (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  onClick={() => setActiveLink(link.id)}
                  className={`pb-1 border-b-2 transition-all duration-200 ${
                    isActive
                      ? "text-[#0E3D2E] font-semibold border-[#0E3D2E]"
                      : "text-gray-700 border-transparent hover:text-[#0E3D2E]"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Login + Get Started buttons on the right */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogin}
            className="text-gray-700 hover:text-[#0E3D2E] font-medium transition"
          >
            Login
          </button>
          <button
            onClick={handleGetStarted}
            className="bg-[#0E3D2E] text-white px-5 py-2 rounded-md font-medium hover:bg-[#0A2E22] active:scale-95 transition"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}