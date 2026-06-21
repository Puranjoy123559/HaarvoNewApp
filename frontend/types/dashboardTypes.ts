// One stat card at the top (e.g. "ACTIVE MEMBERS  1,248")
export interface DashboardStat {
  id: string;
  label: string;                                  // "ACTIVE MEMBERS"
  value: string;                                  // "1,248" (string so we can format freely)
  hint: string;                                   // "+12% this month"
  hintTone: "positive" | "neutral" | "warning";  // decides the hint colour
  icon: string;                                    // which icon to show
}

// One row in the Supply Snapshot table
export interface SupplyRow {
  id: number;
  commodity: string;
  availableVolume: string;
  grade: string;
  status: string;
}

// One row in the Open Trades table
export interface TradeRow {
  id: number;
  tradeId: string;
  buyer: string;
  quantity: string;
  status: string;
}

// One item in the Recent Activity timeline
export interface ActivityItem {
  id: number;
  type: "settlement" | "dispatch" | "trade" | "lot";
  title: string;
  description: string;
  time: string;
}

// The whole dashboard payload — this is what the API will return one day.
export interface DashboardData {
  stats: DashboardStat[];
  supply: SupplyRow[];
  trades: TradeRow[];
  activity: ActivityItem[];
}