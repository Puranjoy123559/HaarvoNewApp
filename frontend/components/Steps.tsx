import { Smartphone, LayoutGrid, Truck } from "lucide-react";

// "3 Steps to Traceable First-Mile Trade" — the 3-step process visual
export default function Steps() {
  // Each step has a number, an icon, a title and a description
  const steps = [
    {
      number: 1,
      icon: Smartphone,
      title: "Digitize (M-Konnect)",
      desc: "Offline-first mobile entry for FCO managers to log harvest lots and farmer metadata at the source.",
    },
    {
      number: 2,
      icon: LayoutGrid,
      title: "Match (Haarvo Dashboard)",
      desc: "Aggregated lots are broadcasted to our institutional buyer network for instant demand matching.",
    },
    {
      number: 3,
      icon: Truck,
      title: "Execute (Trade-Sync)",
      desc: "Logistics are dispatched, quality is verified via IoT, and settlements are processed automatically.",
    },
  ];

  return (
    <section id="execution" className="bg-[#F5F4F1] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0E3D2E] mb-4">
            3 Steps to Traceable First-Mile Trade
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our vertical integration platform streamlines the journey from dirt
            to dispatch.
          </p>
        </div>

        {/* The 3 steps in a row */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="text-center">
                {/* Icon + number badge */}
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 bg-white rounded-lg shadow-md flex items-center justify-center">
                    <Icon className="text-[#0E3D2E]" size={32} />
                  </div>
                  {/* Number badge in top-right corner */}
                  <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#0E3D2E] text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {step.number}
                  </div>
                </div>

                {/* Title + description */}
                <h3 className="text-xl font-bold text-[#0E3D2E] mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-sm">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}