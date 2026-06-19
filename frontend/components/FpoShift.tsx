// FPO Capability Shift section — heading, 4 capability cards, divider line, and a chart image placeholder
import { TrendingUp, Archive, QrCode, ShieldCheck } from "lucide-react";

export default function FpoShift() {
  // 4 capability cards — kept as a simple array so it's easy to read and edit later
  const capabilities = [
    {
      icon: TrendingUp,
      title: "Control Pricing, Not Just Accept It",
      desc: "Know your produce value before trade begins and negotiate with data-backed confidence.",
    },
    {
      icon: Archive,
      title: "Convert Supply into Confirmed Trades",
      desc: "Turn aggregated supply into structured lots that are matched and executed with buyers.",
    },
    {
      icon: QrCode,
      title: "Track Every Trade, End-to-End",
      desc: "From intake to delivery to payment — every step is visible and trackable.",
    },
    {
      icon: ShieldCheck,
      title: "Ensure Farmers Get Paid Transparently",
      desc: "Verified weights, clear records, and structured settlements — no ambiguity in payouts.",
    },
  ];

  return (
    <section className="bg-[#F5F4F1] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* TOP — small outlined pill label */}
        <span className="inline-block border border-[#0E3D2E] text-[#0E3D2E] text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-wider">
          FARMER COLLECTIVES CAPABILITY SHIFT
        </span>

        {/* Main heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-[#0E3D2E] leading-tight mb-4">
          From managing trade to controlling outcomes
        </h2>

        {/* Sub heading */}
        <p className="text-gray-600 text-base max-w-3xl mb-12">
          Haarvo doesn&apos;t just digitize workflows — it gives Farmer Collectives control over pricing, execution, and payouts.
        </p>

        {/* 2x2 grid of capability cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                {/* Icon — small, dark, no colored background */}
                <Icon className="text-[#0E3D2E] mb-4" size={22} />

                <h3 className="text-lg font-bold text-[#0E3D2E] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Divider line + center tagline */}
        <div className="border-t border-gray-300 mt-10 pt-6 mb-5">
          <p className="text-center text-sm font-semibold text-[#0E3D2E]">
            {/* For the first time, FPOs don&apos;t just participate in trade — they control it. */}
          </p>
        </div>

        {/* BOTTOM — chart image placeholder (replace with real image later) */}
        {/* <div className="bg-gray-300 rounded-lg aspect-[16/6] flex items-center justify-center text-gray-500">
          <span className="text-sm">[ FPO Chart Image Placeholder ]</span>
        </div> */}
      </div>
    </section>
  );
}