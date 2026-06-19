import { QrCode, Languages, Wallet, Network } from "lucide-react";

// 4 feature cards in a row
export default function Features() {
  const features = [
    {
      icon: QrCode,
      title: "Lot-Based Traceability",
      desc: "Verifiable lot records connecting every batch to its source and trade journey.",
    },
    {
      icon: Languages,
      title: "Vernacular Interface",
      desc: "Designed for everyday use with simple workflows and local language support.",
    },
    {
      icon: Wallet,
      title: "Integrated Settlement",
      desc: "Integrated settlement workflows connecting buyer payments and farmer payouts.",
    },
    {
      icon: Network,
      title: "3PL Synchronization",
      desc: "Connected logistics workflows synchronizing dispatch, transport, and delivery updates.",
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