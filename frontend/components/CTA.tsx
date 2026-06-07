"use client";

import { Info, Asterisk, ArrowRight } from "lucide-react";

// Props — values that will come from the database/API later
// We give them default values so the UI looks complete during development
type CTAProps = {
  reliabilityValue?: string;
  reliabilityLabel?: string;
};

export default function CTA({
  reliabilityValue = "99.9%",
  reliabilityLabel = "System Reliability",
}: CTAProps) {
  const handleApplyPilot = () => {
    // TODO: open signup modal
    alert("Apply for Phase 1 Pilot clicked!");
  };

  const handleViewStructure = () => {
    // TODO: open pilot structure page
    alert("View Pilot Structure clicked!");
  };

  const handleExploreTopology = () => {
    // TODO: navigate to topology page
    alert("Explore Topology clicked!");
  };

  return (
    <section id="solutions" className="bg-[#F5F4F1] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* ============ TOP DARK GREEN BOX ============ */}
        <div className="bg-[#0E3D2E] rounded-2xl py-12 px-6 text-center text-white">
          {/* Small pill at top with green dot */}
          <span className="inline-flex items-center gap-2 bg-[#0E3D2E] border border-green-700 text-green-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            PHASE 1 DEPLOYMENT
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Secure Your Node.
          </h2>

          <p className="text-gray-300 text-sm max-w-2xl mx-auto mb-8">
            Step into the first-mile future. We are onboarding a limited set of
            FPOs for our Phase 1 execution pilot. Orchestrate supply chains with
            military-grade precision.
          </p>

          {/* Two CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={handleApplyPilot}
              className="bg-[#C5E1A5] text-[#0E3D2E] px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-[#B0D080] transition"
            >
              Apply for Phase 1 Pilot
            </button>
            <button
              onClick={handleViewStructure}
              className="border border-gray-500 text-white px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-white hover:text-[#0E3D2E] transition"
            >
              View Pilot Structure
            </button>
          </div>

          {/* Small note with info icon */}
          <p className="flex items-center justify-center gap-2 text-xs text-gray-400 mb-8">
            <Info size={14} />
            Limited pilot slots. Selection based on supply readiness and cluster fit.
          </p>

          {/* Dashboard image placeholder (replace with real image later) */}
          <div className="bg-black/40 border border-green-900 rounded-lg aspect-[16/5] flex items-center justify-center text-gray-500 max-w-4xl mx-auto">
            <span className="text-sm">[ Dashboard Image Placeholder ]</span>
          </div>
        </div>

        {/* ============ BOTTOM TWO CARDS ============ */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {/* LEFT — white card (takes 2/3 width on desktop) */}
          <div className="md:col-span-2 bg-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              {/* Small green icon box */}
              <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center mb-4">
                <Asterisk className="text-[#0E3D2E]" size={20} />
              </div>
              <h3 className="text-lg font-bold text-[#0E3D2E] mb-2">
                Cluster Orchestration
              </h3>
              <p className="text-gray-600 text-sm">
                Connect your existing operational hubs into a unified digital
                twin environment for real-time visibility and decisioning.
              </p>
            </div>

            {/* Footer link with arrow */}
            <button
              onClick={handleExploreTopology}
              className="flex items-center justify-between text-[#0E3D2E] text-sm font-semibold mt-6 pt-4 border-t border-gray-200"
            >
              <span>Explore Topology</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {/* RIGHT — dark green stat card (1/3 width) */}
          <div className="bg-[#0E6B3E] rounded-2xl p-6 text-center text-white flex flex-col items-center justify-center">
            <p className="text-4xl font-bold mb-2">{reliabilityValue}</p>
            <p className="text-xs font-semibold tracking-wider mb-4">
              {reliabilityLabel}
            </p>
            {/* Small underline accent */}
            <div className="w-24 h-0.5 bg-green-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
}