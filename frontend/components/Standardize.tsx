// Import icons from the lucide-react library we installed
import {
  XCircle,
  EyeOff,
  ImageOff,
  TrendingDown,
  CheckCircle,
  Zap,
  RefreshCw,
  Building,
} from "lucide-react";

// "Standardize the First-Mile" — comparison between old and new approach
export default function Standardize() {
  // Data for the LEFT card (old/legacy problems)
  const legacyItems = [
    {
      icon: XCircle,
      title: "Manual Ledgers",
      desc: "Paper-based record keeping leads to reconciliation delays and data entry errors.",
    },
    {
      icon: EyeOff,
      title: "Invisible Inventory",
      desc: "Buyers lack visibility into aggregated stock until it reaches the warehouse.",
    },
    {
      icon: ImageOff,
      title: "Fragmented Logistics",
      desc: "Disconnected transport providers result in dead-head miles and high costs.",
    },
    {
      icon: TrendingDown,
      title: "Distress Sales",
      desc: "Lack of matching forces smallholders into unfavorable pricing at farmgate.",
    },
  ];

  // Data for the RIGHT card (Haarvo solutions)
  const haarvoItems = [
    {
      icon: CheckCircle,
      title: "Digital Lots",
      desc: "Create trusted digital records with complete origin and transaction history.",
    },
    {
      icon: Zap,
      title: "Real-time Matching",
      desc: "Match aggregated supply with institutional demand instantly.",
    },
    {
      icon: RefreshCw,
      title: "Verified Load-Sync",
      desc: "Synchronize dispatch, quantity, and quality verification in one workflow”.",
    },
    {
      icon: Building,
      title: "Accelerated Payouts",
      desc: "Enable transparent and settlement-linked trade payments.",
    },
  ];

  return (
    <section id="platform" className="bg-[#F5F4F1] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section title */}
        <h2 className="text-4xl md:text-5xl font-bold text-[#0E3D2E] mb-2">
          The Shift from Fragmentation to Standardization.
        </h2>
        <div className="w-24 h-1 bg-[#0E3D2E] mb-12"></div>

        {/* Two cards side by side (stacks on mobile) */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* LEFT card — Legacy Friction (white with red accent stripe) */}
          <div className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-red-600">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              The Legacy Friction
            </h3>
            <ul className="space-y-6">
              {/* Loop through items and render each one */}
              {legacyItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex gap-4">
                    <Icon
                      className="text-red-600 flex-shrink-0 mt-1"
                      size={22}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-sm">{item.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* RIGHT card — Haarvo Standard (dark green) */}
          <div className="bg-[#0E3D2E] rounded-lg shadow-sm p-8 text-white">
            <h3 className="text-2xl font-bold mb-6">The Haarvo Standard</h3>
            <ul className="space-y-6">
              {haarvoItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <li key={index} className="flex gap-4">
                    <Icon
                      className="text-green-300 flex-shrink-0 mt-1"
                      size={22}
                    />
                    <div>
                      <h4 className="font-semibold">{item.title}</h4>
                      <p className="text-gray-200 text-sm">{item.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}