import { MemberHubData } from "@/types/memberHubTypes";
// import { apiGet } from "./apiClient"; // <-- uncomment when the real API is ready

// PLACEHOLDER DATA (stands in for the database).
// These default conversations/messages let us demo the screen. When the backend
// "/member-hub/conversations" endpoint is ready: uncomment the import above,
// use the real call in getMemberHub(), and delete this object.
const placeholderMemberHub: MemberHubData = {
  activeConversationId: 1, // Ramesh's chat is open by default
  dayLabel: "TODAY",
  conversations: [
    {
      id: 1,
      name: "Ramesh Kumar",
      detail: "Hodal Village, Haryana • Farmer",
      time: "10:45 AM",
      preview: "The quality of the recent harvest...",
      isOnline: true,
      unreadCount: 0,
      tags: [
        { label: "Hodal Village", tone: "plain" },
        { label: "WHEAT", tone: "green" },
      ],
    },
    {
      id: 2,
      name: "Anjali Sharma",
      detail: "Field Lead • Block B",
      time: "09:12 AM",
      preview: "Attached the site report for Block B.",
      isOnline: false,
      unreadCount: 3,
      tags: [
        { label: "Field Lead", tone: "plain" },
        { label: "SOYBEAN", tone: "amber" },
      ],
    },
    {
      id: 3,
      name: "Vikram Singh",
      detail: "Warehouse • Logistics",
      time: "Yesterday",
      preview: "Truck #423 has been dispatched.",
      isOnline: false,
      unreadCount: 0,
      tags: [{ label: "Warehouse", tone: "plain" }],
    },
  ],
  // Messages shown for the active (Ramesh) conversation
  messages: [
    {
      id: 1,
      direction: "incoming",
      text: "Namaste, I wanted to check on the procurement prices for Wheat this week. The harvest looks promising but weather forecasts are concerning.",
      time: "10:42 AM",
    },
    {
      id: 2,
      direction: "outgoing",
      text: "Namaste Ramesh Ji. The current procurement price is ₹2,125 per quintal. We recommend scheduling your delivery by Thursday to avoid the forecasted rain.",
      time: "10:44 AM",
      isRead: true,
    },
    {
      id: 3,
      direction: "incoming",
      text: "Here is a sample of the grain quality from my North field. Does it meet the Grade A requirements?",
      time: "10:45 AM",
      imageUrl: "/sample-grain.jpg", // optional — see Stage 7
    },
  ],
};

export const memberHubApi = {
  getMemberHub: async (): Promise<MemberHubData> => {
    // return apiGet<MemberHubData>("/member-hub/conversations"); // <-- the real call, later
    return Promise.resolve(placeholderMemberHub);
  },
};