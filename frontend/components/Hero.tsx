"use client";

import { useState } from "react";
import PilotWaitlistModal from "@/components/pilot/PilotWaitlistModal";

// Hero = the big top section with the main headline and CTA buttons
export default function Hero() {
  // Controls whether the waitlist modal is shown.
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);

  const handleViewMap = () => {
    // TODO: navigate to ecosystem page
    alert("View Ecosystem Map clicked!");
  };

  return (
    <section className="bg-[#F5F4F1] py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        {/* Main headline */}
        <h1 className="text-5xl md:text-6xl font-bold text-[#0E3D2E] leading-tight mb-6">
          The Traceable Trade Execution Platform for the Agri First-Mile.
        </h1>

        {/* Subtitle */}
        <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-10">
          Synchronizing Farmer Collectives (FCOs) with Institutional Buyers to
          eliminate value leaks and standardize agricultural logistics.
        </p>

        {/* Two action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setIsPilotModalOpen(true)}
            className="bg-[#0E3D2E] text-white px-8 py-3 rounded-md font-semibold hover:bg-[#0A2E22] transition"
          >
            Join the Phase 1 Pilot
          </button>
          <button
            onClick={handleViewMap}
            className=" hidden bg-gray-200 text-gray-800 px-8 py-3 rounded-md font-semibold hover:bg-gray-300 transition"
          >
            View Ecosystem Map
          </button>
        </div>
      </div>

      {/* The shared waitlist modal */}
      <PilotWaitlistModal
        isOpen={isPilotModalOpen}
        onClose={() => setIsPilotModalOpen(false)}
      />
    </section>
  );
}