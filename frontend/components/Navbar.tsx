// "use client" because we use useState (a React hook) and onClick handlers
"use client";

// Import useState from React — lets us store and update values inside this component
import { useState } from "react";

// Top navigation bar
export default function Navbar() {
  // useState returns two things:
  //   1. The current value (activeLink)
  //   2. A function to update it (setActiveLink)
  // The string in useState("platform") is the default value shown on first load.
  const [activeLink, setActiveLink] = useState("platform");

  // Placeholder click handlers for the right-side buttons
  const handleLogin = () => {
    // TODO: navigate to login page
    alert("Login clicked!");
  };

  const handleGetStarted = () => {
    // Sends the user to the /register page we just created
    window.location.href = "/register";
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
          {/* Loop through the array and render each link */}
          {navLinks.map((link) => {
            // Check if THIS link is the currently active one
            const isActive = activeLink === link.id;

            return (
              <li key={link.id}>
                {/* Fixed: Added the opening <a tag here */}
                <a
                  href={`#${link.id}`}
                  // When clicked, mark THIS link as active
                  onClick={() => setActiveLink(link.id)}
                  // Conditional styling:
                  //   - Active link → dark green text + visible underline
                  //   - Inactive link → gray text + transparent (invisible) underline
                  // We always keep border-b-2 on both so the height stays the same
                  // and the layout doesn't shift when active changes.
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
            // active:scale-95 makes the button shrink slightly while clicking
            // -> gives that "pressed" feel users expect
            className="bg-[#0E3D2E] text-white px-5 py-2 rounded-md font-medium hover:bg-[#0A2E22] active:scale-95 transition"
          >
            Get Started
          </button>
        </div>
      </nav>
    </header>
  );
}