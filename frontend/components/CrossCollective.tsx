// "Network Advantage" section — left side explains cross-collective coordination,
// right side is a simple diagram: multiple FCOs -> Haarvo core -> one buyer.
import { Tractor, ChevronRight, CheckCircle2 } from "lucide-react";

// The diagram figures (FCO names, quantities, buyer demand) look like real data,
// so per our rule we accept them as props with placeholder defaults. Later these
// can be fed from the API instead of the defaults below.
type Fco = { name: string; amount: string; unit: string };

type CrossCollectiveProps = {
  fcos?: Fco[];
  buyerName?: string;
  buyerDemand?: string;
};

const DEFAULT_FCOS: Fco[] = [
  { name: "FCO A", amount: "120", unit: "MT Maize" },
  { name: "FCO B", amount: "180", unit: "MT Maize" },
  { name: "FCO C", amount: "200", unit: "MT Maize" },
];

// The three steps shown inside the dark "Trade Layer" core box.
const CORE_STEPS = ["Match Demand", "Coordinate Supply", "Execute Trade"];

// The three pill tags on the left.
const TAGS = [
  "Multi-FCO Aggregation",
  "Cluster-Level Coordination",
  "Institutional Demand Fulfillment",
];

export default function CrossCollective({
  fcos = DEFAULT_FCOS,
  buyerName = "Institutional Buyer",
  buyerDemand = "500 MT Demand",
}: CrossCollectiveProps) {
  return (
    <section className="bg-[#F5F4F1] pt-1 pb-20 px-6">
      {/* Two columns on desktop, stacked on mobile */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* ============ LEFT — text ============ */}
        <div>
          <p className="text-xs font-bold tracking-wider text-gray-500 mb-3">
            NETWORK ADVANTAGE
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E3D2E] mb-4">
            Cross-Collective Coordination
          </h2>
          <p className="text-gray-600 text-base mb-6 max-w-md">
            Aggregate and coordinate supply across multiple farmer collectives
            to fulfill larger buyer demand.
          </p>

          {/* Pill tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="border border-gray-300 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Short divider line */}
          <div className="border-t border-gray-300 w-24 mb-6"></div>

          <p className="text-gray-600 text-base max-w-md">
            When buyer demand exceeds the capacity of a single collective, Haarvo
            enables multiple FCOs to participate in the same trade opportunity
            through a unified execution workflow.
          </p>
        </div>

        {/* ============ RIGHT — diagram card ============ */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          {/* Top labels */}
          <div className="flex justify-between text-[10px] font-semibold tracking-wider text-gray-400 mb-6">
            <span>MULTIPLE COLLECTIVES AGGREGATED SUPPLY</span>
            <span className="text-right">ONE COORDINATED TRADE ONE BUYER</span>
          </div>

          {/* Flow row: FCO cards -> core -> buyer */}
          <div className="flex items-center gap-2">
            {/* FCO cards */}
            <div className="flex flex-col gap-3 flex-1">
              {fcos.map((fco) => (
                <div
                  key={fco.name}
                  className="border border-gray-200 rounded-lg p-3"
                >
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                    <Tractor size={14} />
                    {fco.name}
                  </div>
                  <p className="text-[#0E3D2E] font-bold text-lg">
                    {fco.amount}{" "}
                    <span className="text-xs text-gray-500 font-normal">
                      {fco.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <ChevronRight className="text-gray-300 shrink-0" size={20} />

            {/* Core box */}
            <div className="bg-[#0E3D2E] rounded-xl p-4 text-white text-center flex-1">
              <p className="text-[10px] tracking-wider text-green-300 mb-1">
                PLATFORM CORE
              </p>
              <p className="font-bold text-lg leading-tight mb-3">
                HAARVO
                <br />
                Trade Layer
              </p>
              <div className="space-y-2">
                {CORE_STEPS.map((step) => (
                  <div
                    key={step}
                    className="flex items-center gap-2 bg-[#0B2C20] rounded-md px-3 py-2 text-xs"
                  >
                    <CheckCircle2 size={14} className="text-green-300 shrink-0" />
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight className="text-gray-300 shrink-0" size={20} />

            {/* Buyer card */}
            <div className="border border-gray-200 rounded-lg p-3 flex-1">
              <p className="text-[10px] tracking-wider text-gray-400 mb-1">
                BUYER
              </p>
              <p className="text-[#0E3D2E] font-semibold text-sm mb-3">
                {buyerName}
              </p>
              <div className="bg-green-200 text-[#0E3D2E] font-bold text-center rounded-md py-2 text-sm">
                {buyerDemand}
              </div>
            </div>
          </div>

          {/* Bottom status pill */}
          <div className="flex justify-end mt-6">
            <span className="inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Active Coordination Network
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}