import { DashboardData } from "@/types/dashboardTypes";
// import { apiGet } from "./apiClient"; // <-- uncomment when the real API is ready

// ---------------------------------------------------------------------------
// PLACEHOLDER DATA (stands in for the database)
// When the backend "/dashboard/summary" endpoint is ready:
//   1. uncomment the apiGet import above
//   2. in getDashboard() use the real call (see comment there)
//   3. delete this object
// The UI components won't need ANY changes — the shape is the same.
// ---------------------------------------------------------------------------
const placeholderDashboard: DashboardData = {
  stats: [
    { id: "members",     label: "ACTIVE MEMBERS",      value: "1,248", hint: "+12% this month", hintTone: "positive", icon: "users" },
    { id: "lots",        label: "AVAILABLE LOTS",      value: "342",   hint: "Ready for trade",  hintTone: "neutral",  icon: "package" },
    { id: "requests",    label: "OPEN REQUESTS",       value: "87",    hint: "14 high priority", hintTone: "warning",  icon: "cart" },
    { id: "settlements", label: "PENDING SETTLEMENTS", value: "24",    hint: "3 overdue",        hintTone: "warning",  icon: "wallet" },
  ],
  supply: [
    { id: 1, commodity: "Arabica Coffee", availableVolume: "4,500 MT",  grade: "Grade AA", status: "Active" },
    { id: 2, commodity: "Yellow Maize",   availableVolume: "12,200 MT", grade: "Premium",  status: "Active" },
    { id: 3, commodity: "Cocoa Beans",    availableVolume: "850 MT",    grade: "Grade 1",  status: "In Transit" },
  ],
  trades: [
    { id: 1, tradeId: "TRD-2024-001", buyer: "Global Grains Ltd.",  quantity: "1,200 MT", status: "Negotiating" },
    { id: 2, tradeId: "TRD-2024-004", buyer: "Ceres Harvest Corp",  quantity: "500 MT",   status: "Finalizing" },
  ],
  activity: [
    { id: 1, type: "settlement", title: "Settlement Completed", description: "Trade TRD-2023-892 with AgriGlobal finalized. Funds released to collective.", time: "15 minutes ago" },
    { id: 2, type: "dispatch",   title: "Dispatch Started",     description: "Lot #442 (Maize) picked up from Central Warehouse 3 by Logistics Partner.",   time: "2 hours ago" },
    { id: 3, type: "trade",      title: "Trade Confirmed",      description: "Buyer 'Ceres Harvest' accepted terms for 500MT Arabica Coffee Lot #112.",      time: "5 hours ago" },
    { id: 4, type: "lot",        title: "Lot Created",          description: "New Lot #445 (Soybeans, 2000 MT) aggregated from Northern Cooperatives.",      time: "Yesterday, 4:30 PM" },
  ],
};

export const dashboardApi = {
  // For now this returns the placeholder. It's async (returns a Promise) so it
  // already behaves like a real network call — no rework needed later.
  getDashboard: async (): Promise<DashboardData> => {
    // return apiGet<DashboardData>("/dashboard/summary"); // <-- the real call, later
    return Promise.resolve(placeholderDashboard);
  },
};