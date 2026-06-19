"use client";

import { useState } from "react";
import PilotWaitlistModal from "@/components/pilot/PilotWaitlistModal";
import { Info, Share2, ShieldCheck, Banknote } from "lucide-react";

// The three feature cards shown under the waitlist box.
// Kept as a simple array so they're easy to edit / add to later.
// Each "icon" is a lucide-react icon component.
const FEATURES = [
  {
    icon: Share2,
    title: "Trade Aggregation",
    description:
      "Centralize scattered farmer supply into trade-ready volumes with automated tracking.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Engine",
    description:
      "Automated quality checks and digital documentation for institutional buyers.",
  },
  {
    icon: Banknote,
    title: "Settlement Layer",
    description:
      "Secure, rapid payout structures for smallholder collectives upon successful trade.",
  },
];

export default function CTA() {
  // Controls whether the waitlist modal is shown.
  const [isPilotModalOpen, setIsPilotModalOpen] = useState(false);

  const handleApplyPilot = () => {
    setIsPilotModalOpen(true);
  };

  return (
    <section id="solutions" className="bg-[#F5F4F1] pb-16">
      <div className="max-w-7xl mx-auto">
        {/* ============ TOP DARK GREEN BOX (unchanged) ============ */}
        <div className="bg-[#0E3D2E] rounded-2xl py-12 px-6 text-center text-white">
          {/* Small pill at top with green dot */}
          <span className="inline-flex items-center gap-2 bg-[#0E3D2E] border border-green-700 text-green-300 text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider">
            <span className="w-2 h-2 bg-green-400 rounded-full"></span>
            PHASE 1 WAITLIST
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Join the First-Mile Waitlist.
          </h2>

          <p className="text-gray-300 text-sm max-w-2xl mx-auto mb-8">
            Be among the early farmer collectives onboarding onto Haarvo’s
            structured trade execution network. Built for FPOs ready to move
            from fragmented coordination to structured trade operations.
          </p>

          {/* CTA button */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            <button
              onClick={handleApplyPilot}
              className="bg-[#C5E1A5] text-[#0E3D2E] px-6 py-2.5 rounded-md font-semibold text-sm hover:bg-[#B0D080] transition"
            >
              Join the waitlist
            </button>
          </div>

          {/* Small note with info icon */}
          <p className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Info size={14} />
            EARLY ACCESS WILL BE PRIORITIZED BASED ON SUPPLY READINESS AND
            CLUSTER ALIGNMENT.
          </p>
        </div>

        {/* ============ THREE FEATURE CARDS ============ */}
        {/* grid-cols-3 on desktop, stacks to 1 column on mobile */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          {FEATURES.map((feature) => {
            // Pull the icon component out so we can render it as <Icon />
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="bg-[#0E3D2E] rounded-2xl p-6 text-left"
              >
                {/* Small icon box */}
                <div className="w-10 h-10 bg-green-900/40 rounded-md flex items-center justify-center mb-4">
                  <Icon className="text-green-300" size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            );
          })}
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