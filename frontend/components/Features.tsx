import { QrCode, Languages, Wallet, Network } from "lucide-react";

// 4 feature cards in a row
export default function Features() {
  const features = [
    {
      icon: QrCode,
      title: "Lot-Based Traceability",
      desc: "Unique cryptographic identifiers for every grain, linking every batch back to its original farmer cluster.",
    },
    {
      icon: Languages,
      title: "Vernacular Interface",
      desc: "Designed for the field. Our UI achieves 90%+ adoption through visual workflows and local language support.",
    },
    {
      icon: Wallet,
      title: "Integrated Settlement",
      desc: "Instant B2B payments reducing trade finance gaps and providing immediate liquidity to rural cooperatives.",
    },
    {
      icon: Network,
      title: "3PL Synchronization",
      desc: "Direct API hooks into regional logistics providers to automate fleet dispatch and freight tracking.",
    },
  ];

  return (
    <section id="traceability" className="bg-[#F5F4F1] py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* 4 cards: 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition"
              >
                {/* Icon box */}
                <div className="w-12 h-12 bg-green-100 rounded-md flex items-center justify-center mb-4">
                  <Icon className="text-[#0E3D2E]" size={24} />
                </div>
                <h3 className="text-lg font-bold text-[#0E3D2E] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}