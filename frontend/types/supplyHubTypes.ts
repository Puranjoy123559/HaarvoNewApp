// Shapes for the Supply Hub screen.

export type SupplyStatus =
  | "Trade Ready"
  | "Aggregating"
  | "Ready for Verification"
  | "Archived";

// One row in the supply lots table
export interface SupplyLot {
  id: number;
  lotId: string;              // "LOT-774921"
  commodity: string;
  quantity: string;           // "42.5 MT"
  region: string;             // used only by the "All Locations" filter (not a column)
  collectionPoint: string;
  contributors: string[];     // initials to show as avatars, e.g. ["JE","MI"]
  extraContributors: number;  // the "+8" count
  createdDate: string;        // "Oct 12, 2023"
  status: SupplyStatus;
}

// One summary card at the top
export interface SupplyStat {
  id: string;
  label: string;
  value: string;
  hint: string;
  hintTone: "positive" | "neutral";
  icon: string;
}

// Everything the screen needs
export interface SupplyHubData {
  stats: SupplyStat[];
  lots: SupplyLot[];
}