// Shapes for the M-Konnect chat screen — like C# model/DTO classes.
// Real values come from the database later; the API stub fills them in for now.

// A small coloured tag on a conversation (e.g. "WHEAT", "Field Lead")
export interface ConversationTag {
  label: string;
  tone: "plain" | "green" | "amber"; // decides the tag colour
}

// One conversation in the left list
export interface Conversation {
  id: number;
  name: string;
  detail: string;        // shown in the chat header: "Hodal Village, Haryana • Farmer"
  time: string;          // "10:45 AM" or "Yesterday"
  preview: string;       // last-message preview line
  isOnline: boolean;
  unreadCount: number;   // 0 = no badge
  tags: ConversationTag[];
}

// One chat bubble in the right thread
export interface ChatMessage {
  id: number;
  direction: "incoming" | "outgoing"; // incoming = farmer (left), outgoing = us (right)
  text: string;
  time: string;
  imageUrl?: string;     // optional shared photo
  isRead?: boolean;      // outgoing only — shows the read ticks
}

// Everything the M-Konnect screen needs in one object
export interface MemberHubData {
  conversations: Conversation[];
  activeConversationId: number; // which conversation's chat is open
  messages: ChatMessage[];      // messages of the active conversation
  dayLabel: string;             // "TODAY"
}