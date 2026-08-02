import { SupplyHubData } from "@/types/supplyHubTypes";
// import { apiGet } from "./apiClient"; // <-- uncomment when the real API is ready

// PLACEHOLDER DATA (stands in for the database).
// When the backend "/supply/lots" endpoint is ready: uncomment the import,
// use the real call in getSupplyLots(), and delete this object.
const placeholderSupplyHub: SupplyHubData = {
  stats: [
    { id: "lots",        label: "ACTIVE LOTS",       value: "248",      hint: "+12% vs last month",         hintTone: "positive", icon: "lots" },
    { id: "quantity",    label: "AVAILABLE QUANTITY", value: "1,820 MT", hint: "Spread across 4 active regions", hintTone: "neutral", icon: "quantity" },
    { id: "commodities", label: "COMMODITIES",        value: "14",       hint: "Coffee, Cocoa, Soy, and more", hintTone: "neutral", icon: "commodities" },
    { id: "ready",       label: "TRADE READY",        value: "186",      hint: "75% verification rate",      hintTone: "neutral", icon: "ready" },
  ],
  lots: [
    { id: 1,  lotId: "LOT-774921", commodity: "Coffee (Arabica)", quantity: "42.5 MT",  region: "Highlands", collectionPoint: "Central Highland Hub",  contributors: ["JE","MI","AS"], extraContributors: 8,  createdDate: "Oct 12, 2023", status: "Trade Ready" },
    { id: 2,  lotId: "LOT-774885", commodity: "Cocoa (Premium)",  quantity: "18.2 MT",  region: "Southern",  collectionPoint: "Southern Valley",       contributors: ["RL"],           extraContributors: 2,  createdDate: "Oct 14, 2023", status: "Aggregating" },
    { id: 3,  lotId: "LOT-774812", commodity: "Soy Beans",        quantity: "124.0 MT", region: "Western",   collectionPoint: "Alpha Grain Silo",      contributors: ["TA"],           extraContributors: 15, createdDate: "Oct 15, 2023", status: "Ready for Verification" },
    { id: 4,  lotId: "LOT-774776", commodity: "Maize",            quantity: "210.5 MT", region: "Western",   collectionPoint: "Western Storage Hub",   contributors: ["BI"],           extraContributors: 32, createdDate: "Oct 08, 2023", status: "Archived" },
    { id: 5,  lotId: "LOT-774720", commodity: "Coffee (Robusta)", quantity: "88.3 MT",  region: "Lakeside",  collectionPoint: "Lakeside Collection",   contributors: ["PT"],           extraContributors: 5,  createdDate: "Oct 16, 2023", status: "Trade Ready" },
    { id: 6,  lotId: "LOT-774698", commodity: "Cocoa (Premium)",  quantity: "33.7 MT",  region: "Southern",  collectionPoint: "Southern Valley",       contributors: ["KM","RA"],      extraContributors: 3,  createdDate: "Oct 09, 2023", status: "Aggregating" },
    { id: 7,  lotId: "LOT-774650", commodity: "Soy Beans",        quantity: "96.4 MT",  region: "Highlands", collectionPoint: "Central Highland Hub",  contributors: ["DV"],           extraContributors: 6,  createdDate: "Oct 11, 2023", status: "Trade Ready" },
    { id: 8,  lotId: "LOT-774602", commodity: "Wheat",            quantity: "150.0 MT", region: "Western",   collectionPoint: "Alpha Grain Silo",      contributors: ["SN","AM"],      extraContributors: 9,  createdDate: "Oct 07, 2023", status: "Ready for Verification" },
    { id: 9,  lotId: "LOT-774555", commodity: "Coffee (Arabica)", quantity: "60.1 MT",  region: "Highlands", collectionPoint: "Highland Ridge Point",  contributors: ["JP"],           extraContributors: 4,  createdDate: "Oct 13, 2023", status: "Trade Ready" },
    { id: 10, lotId: "LOT-774510", commodity: "Maize",            quantity: "178.9 MT", region: "Western",   collectionPoint: "Western Storage Hub",   contributors: ["RB"],           extraContributors: 21, createdDate: "Oct 05, 2023", status: "Archived" },
    { id: 11, lotId: "LOT-774488", commodity: "Sorghum",          quantity: "74.2 MT",  region: "Lakeside",  collectionPoint: "Lakeside Collection",   contributors: ["MG","TK"],      extraContributors: 2,  createdDate: "Oct 16, 2023", status: "Aggregating" },
    { id: 12, lotId: "LOT-774450", commodity: "Cocoa (Premium)",  quantity: "41.6 MT",  region: "Southern",  collectionPoint: "Delta Depot",           contributors: ["AN"],           extraContributors: 7,  createdDate: "Oct 10, 2023", status: "Trade Ready" },
    { id: 13, lotId: "LOT-774399", commodity: "Soy Beans",        quantity: "132.8 MT", region: "Western",   collectionPoint: "Alpha Grain Silo",      contributors: ["HV"],           extraContributors: 18, createdDate: "Oct 06, 2023", status: "Ready for Verification" },
    { id: 14, lotId: "LOT-774350", commodity: "Coffee (Robusta)", quantity: "52.0 MT",  region: "Lakeside",  collectionPoint: "Lakeside Collection",   contributors: ["PL","RS"],      extraContributors: 5,  createdDate: "Oct 15, 2023", status: "Trade Ready" },
    { id: 15, lotId: "LOT-774312", commodity: "Maize",            quantity: "199.3 MT", region: "Highlands", collectionPoint: "Central Highland Hub",  contributors: ["BT"],           extraContributors: 11, createdDate: "Oct 04, 2023", status: "Aggregating" },
    { id: 16, lotId: "LOT-774280", commodity: "Wheat",            quantity: "88.7 MT",  region: "Western",   collectionPoint: "Western Storage Hub",   contributors: ["JD"],           extraContributors: 8,  createdDate: "Oct 12, 2023", status: "Trade Ready" },
    { id: 17, lotId: "LOT-774245", commodity: "Cocoa (Premium)",  quantity: "27.9 MT",  region: "Southern",  collectionPoint: "Southern Valley",       contributors: ["MK"],           extraContributors: 3,  createdDate: "Oct 03, 2023", status: "Archived" },
    { id: 18, lotId: "LOT-774200", commodity: "Coffee (Arabica)", quantity: "71.4 MT",  region: "Highlands", collectionPoint: "Highland Ridge Point",  contributors: ["DI","SV"],      extraContributors: 6,  createdDate: "Oct 14, 2023", status: "Ready for Verification" },
    { id: 19, lotId: "LOT-774166", commodity: "Sorghum",          quantity: "63.5 MT",  region: "Lakeside",  collectionPoint: "Delta Depot",           contributors: ["KV"],           extraContributors: 4,  createdDate: "Oct 11, 2023", status: "Trade Ready" },
    { id: 20, lotId: "LOT-774120", commodity: "Soy Beans",        quantity: "145.2 MT", region: "Western",   collectionPoint: "Alpha Grain Silo",      contributors: ["SZ"],           extraContributors: 14, createdDate: "Oct 02, 2023", status: "Aggregating" },
  ],
};

export const supplyHubApi = {
  getSupplyLots: async (): Promise<SupplyHubData> => {
    // return apiGet<SupplyHubData>("/supply/lots"); // <-- the real call, later
    return Promise.resolve(placeholderSupplyHub);
  },
};